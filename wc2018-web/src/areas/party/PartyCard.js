import React, {Component} from 'react';
import firebase from 'firebase/app';
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SettingsIcon from "@material-ui/icons/Settings";
import PartyUserSummary from "./PartyUserSummary";
import withRoot from "../../WithRoot";
import api from "../../util/API"
import DraftPartyDialog from "./DraftPartyDialog";
import GA from 'react-ga';

const styles = {
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 14
    }
};

class PartyCard extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.state = {
            menuAnchor: null,
            settingsMenuOpen: false,
            draftDialogOpen: false,
            users: []
        };
    }

    loadListOfUsers = () => {
        return Object.values(this.props.party.users).map((user) => {
            let userScore = 0;
            if(!user.teams) return user;
            const newTeams = Object.keys(user.teams).map((teamId) => {
                const team = {"id": teamId, "name": user.teams[teamId], stats: this.props.stats[teamId]};
                if(team.stats) userScore += team.stats.p;
                return team;
            });
            return {
                id: user.id,
                name: user.name,
                teams: newTeams,
                userScore: userScore
            };
        }).sort((a, b) => b.userScore - a.userScore);
    };

    handleMenuClick = (e) => {
        this.setState({menuAnchor: e.currentTarget, settingsMenuOpen: true});
    };

    handleMenuClose = () => {
        this.setState({settingsMenuOpen: false});
    };

    handleDeleteParty = () => {
        if(this.props.party && this.props.party.token) {
            const token = this.props.party.token;
            const name = this.props.party.name;
            api
                .deleteParty(token)
                .then((resp) => {
                    this.props.onStopTrackingParty(token);
                    this.props.onDisplaySnackbar(`Party '${name}' deleted.`);
                    this.handleMenuClose();
                    GA.event({
                        category: 'party',
                        action: 'deleted',
                        label: this.state.token
                    });
                })
                .catch((err) => {
                    console.error(`Error deleting party [${name}]`, err);

                    GA.event({
                        category: 'partyError',
                        action: 'delete',
                        label: this.state.token
                    });
                });
        }
    };

    handleLeaveParty = () => {
        api.removeUserFromParty(this.props.party.token, firebase.auth().currentUser.uid).then((resp) => {
            this.props.onDisplaySnackbar(`You have been removed from the party "${this.props.party.name}".`);
            this.props.onStopTrackingParty(this.props.party.token);
            GA.event({
                category: 'party',
                action: 'left',
                label: this.state.token
            });
        }).catch((err) => {
            this.props.onDisplaySnackbar('There was an issue removing you from the party. Please try again.');
            GA.event({
                category: 'partyError',
                action: 'leave',
                label: this.state.token
            });
        });
        this.setState({settingsMenuOpen: false});
    };

    handleDraftParty = () => {
        this.setState({draftDialogOpen: true, settingsMenuOpen: false});
    };

    handleDraftPartyDialogClose = () => {
        this.setState({draftDialogOpen: false});
    };

    render() {
        if(!this.props.party) return '';
        const users = this.loadListOfUsers();
        const isPartyOwner = this.props.party.owner.id === firebase.auth().currentUser.uid;
        return (
            <div>
                <Card className={this.classes.card}>
                    <CardHeader
                        className={this.classes.title}
                        title={this.props.party ? this.props.party.name : "N/A"}
                        subheader={`${this.props.party.token} - Owner: ${this.props.party.owner.name}`}
                        action={<IconButton onClick={this.handleMenuClick}><SettingsIcon/></IconButton>}/>
                    <CardContent>
                        <List>
                            {users.map((user) => <PartyUserSummary
                                key={user.id}
                                onUpdateScore={this.handleUpdateScore}
                                partyToken={this.props.party.token}
                                partyUser={user}
                                isPartyOwner={this.props.party.owner.id === user.id}
                                onDisplaySnackbar={this.props.onDisplaySnackbar}
                                currentUserIsPartyOwner={isPartyOwner}/>)}
                        </List>
                    </CardContent>
                </Card>
                <Menu
                    anchorEl={this.state.menuAnchor}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    open={this.state.settingsMenuOpen}
                    onClose={this.handleMenuClose}>
                    {isPartyOwner && users.length > 1 && <MenuItem onClick={this.handleDraftParty}>Distribute Teams</MenuItem>}
                    {!isPartyOwner && <MenuItem onClick={this.handleLeaveParty}>Leave Party</MenuItem>}
                    {isPartyOwner && <MenuItem onClick={this.handleDeleteParty}>Delete Party</MenuItem>}
                </Menu>
                <DraftPartyDialog
                    party={this.props.party}
                    open={this.state.draftDialogOpen}
                    onDisplaySnackbar={this.props.onDisplaySnackbar}
                    onClose={this.handleDraftPartyDialogClose}/>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(PartyCard));