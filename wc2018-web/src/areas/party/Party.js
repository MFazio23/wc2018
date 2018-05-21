import React, { Component } from 'react';
import {Route, Switch} from "react-router-dom";
import ListParties from "./ListParties";
import CreateParty from "./CreateParty";
import JoinParty from "./JoinParty";

export default class Party extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/(party)*' render={() => <ListParties partyTokens={this.props.partyTokens}/>}  />
                    <Route path='/party/create' component={CreateParty} />
                    <Route path='/party/join' component={JoinParty} />
                </Switch>
            </div>
        );
    }
}