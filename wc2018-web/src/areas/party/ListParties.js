import React, { Component } from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import firebase from 'firebase/app';
import 'firebase/database';
import update from 'immutability-helper';
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import PartyCard from "./PartyCard";
import CreateParty from "./CreateParty";
import JoinParty from "./JoinParty";
import withRoot from "../../WithRoot";

const styles = {
    partyButton: {
        marginRight: 10
    }
};

class ListParties extends Component {
    baseFirebasePath = '/parties/';

    constructor(props) {
        super(props);

        this.state = {
            "parties": {},
            "firebaseParties": {},
            "lastPartyTokens": [],
            "joinOpen": false,
            "createOpen": false
        };
    }

    componentDidMount() {
        this.updateBindings();
    }

    componentDidUpdate() {
        if(this.state.lastPartyTokens !== this.props.partyTokens) {
            this.updateBindings();
        }
    }

    updateBindings = () => {
        this.state.lastPartyTokens.forEach(pt => this.unbindParty(pt));
        this.props.partyTokens.forEach(pt => this.bindParty(pt));
        this.setState({"lastPartyTokens": this.props.partyTokens});
    };

    unbindParty = (partyToken) => {
        const firebaseParty = this.state.firebaseParties[partyToken];
        if(firebaseParty) {
            const ref = firebaseParty.ref;
            ref.off('value', firebaseParty.callback);
        }
    };

    bindParty = (partyToken) => {
        const ref = firebase.database().ref(`${this.baseFirebasePath}${partyToken}`);
        const callback = ref.on('value', (snap) => {
            let newParties = this.state.parties;
            newParties[partyToken] = snap.val();
            this.setState({"parties": newParties});
        });
        this.setState({
            firebaseParties: update(this.state.firebaseParties, {
                ref: {$set: ref},
                callback: {$set: callback}
            })
        });
    };

    partyButtonClicked = (buttonProp) => {
        this.setState({[buttonProp]: true});
    };

    handleClose = (partyToken) => {
        this.setState({"joinOpen": false, "createOpen": false});
        if(partyToken) this.bindParty(partyToken);
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Card>
                    <CardHeader
                        /*className={this.classes.title}*/
                        title="New Party"
                        subheader="Join an existing party or create a new one" />
                    <CardContent>
                        <Button className={classes.partyButton} size="large" variant="raised" color="primary" onClick={() => this.partyButtonClicked('joinOpen')}>Join Party</Button>
                        <Button className={classes.partyButton} size="large" variant="raised" color="primary" onClick={() => this.partyButtonClicked('createOpen')}>Create Party</Button>
                    </CardContent>
                </Card>
                <div>{Object.keys(this.state.parties).map((partyToken) => <PartyCard key={partyToken} party={this.state.parties[partyToken]} />)}</div>
                <JoinParty open={this.state.joinOpen} onClose={this.handleClose} />
                <CreateParty open={this.state.createOpen} onClose={this.handleClose} />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(ListParties));