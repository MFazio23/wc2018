import React, { Component } from 'react';
import {Link} from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/database';

export default class ListParties extends Component {
    firebaseParties = {};
    baseFirebasePath = '/parties/';

    constructor(props) {
        super(props);

        this.state = {
            "parties": {},
            "lastPartyTokens": []
        };
    }

    componentDidMount() {
        this.updateBindings();
    }

    componentDidUpdate() {
        console.log("ComponentDidUpdate", this.props.partyTokens);
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
        const firebaseParty = this.firebaseParties[partyToken];
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

        this.firebaseParties[partyToken] = {
            ref,
            callback
        };
    };

    render() {
        return (
            <div>
                <h1>List Parties</h1>
                <h3>{this.props.partyTokens.join(", ")}</h3>
                <pre>{JSON.stringify(this.state.parties, null, 2)}</pre>
                <Link to="/party/create">Create</Link><br/>
                <Link to="/party/join">Join</Link><br/>
            </div>
        );
    }
}