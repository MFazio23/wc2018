import React, { Component } from 'react';
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import SettingsIcon from "@material-ui/icons/Settings"
import PartyUserSummary from "./PartyUserSummary";
import firebase from 'firebase/app';

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
    }
    render() {
        return (
            <Card className={this.classes.card}>
                <CardHeader
                    className={this.classes.title}
                    title={this.props.party ? this.props.party.name : "N/A"}
                    subheader={`${this.props.party.token} - Owner: ${this.props.party.owner.name}`}
                    action={this.props.party.owner.id === firebase.auth().currentUser.uid ? (<IconButton><SettingsIcon /></IconButton>) : ''}/>
                <CardContent>
                    <List>
                        {Object.keys(this.props.party.users).map((userId) => <PartyUserSummary key={userId} partyToken={this.props.party.token} partyUser={this.props.party.users[userId]} />)}
                    </List>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(PartyCard);