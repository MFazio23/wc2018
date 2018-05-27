import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import "flag-icon-css/css/flag-icon.min.css"
import teams from "../../util/Teams";
import withRoot from "../../WithRoot";

const styles = {
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

    }
};

class PartyUserSummary extends Component {
    constructor(props) {
        super(props);
        this.classes = props;
    }

    partyUserClicked() {

    }

    getFlag = (teamId) => {
        const team = teams[teamId];

        if(team) {
            return (<span key={teamId} title={team.name} className={`user-flag flag-icon flag-icon-${team.isoCode.toLowerCase()}`}/>);
        }

        return '';
    };

    render() {
        return (
            <div>
                <ListItem button>
                    <ListItemText primary={this.props.partyUser ? this.props.partyUser.name : ''}/>
                    {this.props.partyUser && this.props.partyUser.teams ? (<ListItemSecondaryAction>
                            <div className={this.classes.flags}>
                                {Object.keys(this.props.partyUser.teams).map((teamId) => this.getFlag(teamId))}
                            </div>
                        </ListItemSecondaryAction>) :
                        ''}
                </ListItem>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(PartyUserSummary));