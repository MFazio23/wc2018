import React, {Component} from 'react';
import firebase from "firebase/app";
import {withStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import "flag-icon-css/css/flag-icon.min.css"
import teams from "../../util/Teams";
import withRoot from "../../WithRoot";
import PartyUserDialog from "./PartyUserDialog";

const styles = theme => ({
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 14
    },
    points: {
        fontSize: 10
    },
    flags: {
        [theme.breakpoints.down('xs')]: {
            width: 200,
            textAlign: 'right'
        }
    },
    isCurrentUser: {
        color: 'primary'
    }
});

class PartyUserSummary extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.state = {
            summaryOpen: false
        };
    }

    partyUserClicked = () => {
        this.setState({summaryOpen: true});
    };

    getFlag = (teamId) => {
        const team = teams[teamId];

        if (team) {
            return (<span key={teamId} title={team.name}
                          className={`user-flag flag-icon flag-icon-${team.isoCode.toLowerCase()}`}/>);
        }

        return '';
    };

    handleClose = (deletedUserName) => {
        if(deletedUserName) this.props.onDisplaySnackbar(`${deletedUserName} has been removed from the party.`);
        else this.setState({summaryOpen: false});
    };

    render() {
        if (!this.props.partyUser) return <div/>;
        const isCurrentUser = this.props.partyUser.id === firebase.auth().currentUser.uid;
        return (
            <div>
                <ListItem button onClick={this.partyUserClicked}>
                    <ListItemText disableTypography
                                  primary={<Typography color={isCurrentUser ? 'primary' : 'inherit'}
                                                       variant={isCurrentUser ? 'body2' : 'body1'}>
                                      {this.props.partyUser.name}</Typography>}
                                  secondary={`${this.props.partyUser.userScore || 0} points`}/>
                    {this.props.partyUser.teams ? (<ListItemSecondaryAction>
                            <div id={`teams-${this.classes.flags}`} className={this.classes.flags}>
                                {this.props.partyUser.teams.sort((a, b) => b.stats.p - a.stats.p).map((team) => this.getFlag(team.id))}
                            </div>
                        </ListItemSecondaryAction>) :
                        ''}
                </ListItem>
                <PartyUserDialog partyUser={this.props.partyUser}
                                 isPartyOwner={this.props.isPartyOwner}
                                 partyToken={this.props.partyToken}
                                 currentUserIsPartyOwner={this.props.currentUserIsPartyOwner}
                                 open={this.state.summaryOpen}
                                 onClose={this.handleClose}/>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(PartyUserSummary));