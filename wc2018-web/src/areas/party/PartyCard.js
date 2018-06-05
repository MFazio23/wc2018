import React, {Component} from 'react';
import axios from 'axios';
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
        this.classes = props;

        this.state = {
            menuAnchor: null,
            settingsMenuOpen: false,
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

    handleDeleteGroup = () => {
        if(this.props.party && this.props.party.token) {
            const token = this.props.party.token;
            const name = this.props.party.name;
            axios
                .delete(`https://wc2018-api.faziodev.org/party/${token}`)
                .then((resp) => {
                    if (resp.status === 200) {
                        this.props.onStopTrackingParty(token);
                        this.props.onDisplaySnackbar(`Party '${name}' deleted.`);
                        this.handleMenuClose();
                    }
                })
                .catch((err) => console.error(`Error deleting party [${name}]`, err));
        }
    };

    handleUpdateScore = () => {

    };

    render() {
        if(!this.props.party) return '';
        const users = this.loadListOfUsers();
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
                                currentUserIsPartyOwner={this.props.party.owner.id === firebase.auth().currentUser.uid}/>)}
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
                    <MenuItem onClick={this.handleDeleteGroup}>Delete Group</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(PartyCard));