import React, {Component} from 'react';
import './App.css';
import TopNav from "./areas/main/TopNav";
import Main from "./areas/main/Main";
import firebase from 'firebase/app';
import api from './util/API';
import {Config} from "./util/Config";
import GA from 'react-ga';

const firebaseConfig = {
    apiKey: "AIzaSyBRM6r7nG4QWwiiJxBbpH_ohdgl8JfvJ58",
    authDomain: "wc2018-2bad0.firebaseapp.com",
    databaseURL: "https://wc2018-2bad0.firebaseio.com",
    projectId: "wc2018-2bad0",
    storageBucket: "wc2018-2bad0.appspot.com",
    messagingSenderId: "715133063662"
};

firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "isSignedIn": undefined,
            "partyTokens": [],
            "stats": {},
            "partyTokensAreLoading": false
        };
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isSignedIn: !!user});

            if (user) {
                GA.set({userId: user.uid});
                this.setState({partyTokensAreLoading: true});
                api.updateAuthToken().then(() => {
                    this.loadPartyTokensForUser();
                }).catch(() => {
                    //TODO: What happens if this fails?
                });
            }
        });

        firebase.database().ref(`${Config.firebaseEnv}/stats`).on('value', (snap) => {
            this.setState({"stats": this.processStats(snap.val())});
        });
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    loadPartyTokensForUser = () => {
        if (firebase.auth().currentUser) {
            const userId = firebase.auth().currentUser.uid;
            api
                .loadPartyTokensForUser(userId)
                .then((tokens) => {
                    this.setState({"partyTokens": tokens, "partyTokensAreLoading": false})
                })
                .catch((err) => {
                    console.error("Error loading party tokens", err);
                    this.setState({partyTokensAreLoading: false});
                });
        }
    };

    onSignOut = () => {
        this.setState({"partyTokens": []});
    };

    processStats = (stats) => {
        const newStats = {};

        Object.keys(stats).forEach(teamId => {
            const team = stats[teamId];
            newStats[teamId] = Object.assign(team, {p: team.g + team.d + team.cs * 2 + team.w * 3});
        });

        return newStats;
    };

    render() {
        return (
            <div>
                <TopNav isSignedIn={this.state.isSignedIn} onSignOut={this.onSignOut}/>
                <Main isSignedIn={this.state.isSignedIn} partyTokens={this.state.partyTokens} stats={this.state.stats}
                      partyTokensAreLoading={this.state.partyTokensAreLoading}/>
            </div>
        );
    }
}

export default App;
