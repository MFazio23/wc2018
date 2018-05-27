import React, { Component } from 'react';
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import PartyUserSummary from "./PartyUserSummary";
import withRoot from "../../WithRoot";
/*import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings"*/

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
                    /*action={<IconButton><SettingsIcon /></IconButton>}*//>
                <CardContent>
                    <List>
                        {Object.keys(this.props.party.users).map((userId) => <PartyUserSummary key={userId} partyToken={this.props.party.token} partyUser={this.props.party.users[userId]} />)}
                    </List>
                </CardContent>
            </Card>
        );
    }
}

export default withRoot(withStyles(styles)(PartyCard));