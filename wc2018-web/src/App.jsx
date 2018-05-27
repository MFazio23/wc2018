import React, {Component} from 'react';
import './App.css';
import TopNav from "./areas/main/TopNav";
import Main from "./areas/main/Main";
import firebase from 'firebase/app';
import axios from 'axios';
import Button from "@material-ui/core/Button";

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
            "stats": {}
        };
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isSignedIn: !!user});

            if(user) this.loadPartyTokensForUser();
        });

        firebase.database().ref(`/stats`).on('value', (snap) => {
            this.setState({"stats": snap.val()});
        });
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    loadPartyTokensForUser = () => {
        if(firebase.auth().currentUser) {
            const userId = firebase.auth().currentUser.uid;
            console.log("UID", userId);
            axios
                .get(`http://fazbook:8080/party/tokens?userId=${userId}`)
                .then((resp) => {
                    this.setState({"partyTokens": resp.data})
                })
                .catch((err) => console.error("Error loading user parties.", err));
        }
    };

    onSignOut = () => {
        this.setState({"partyTokens": []});
    };

    render() {
        return (
            <div>
                <TopNav isSignedIn={this.state.isSignedIn} onSignOut={this.onSignOut}/>
                <Main isSignedIn={this.state.isSignedIn} partyTokens={this.state.partyTokens} stats={this.state.stats} />
                <Button onClick={this.loadPartyTokensForUser}>Load Tokens</Button>
            </div>
        );
    }
}

// hey i'm gonna save here
// i'm still here
export default App;
