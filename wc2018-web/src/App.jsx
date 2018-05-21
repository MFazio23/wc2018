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
            "partyTokens": []
        };
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isSignedIn: !!user});

            if(user) this.loadPartyTokensForUser();
        });
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    loadPartyTokensForUser = () => {
        axios
            .get('http://fazbook:8080/party/tokens?userId=47A1C6464WuRF9AUNoxV51JsoWaB2')
            .then((resp) => {
                console.log("LPTFU", resp);
                this.setState({"partyTokens": resp.data})
            })
            .catch((err) => console.error("Error loading user parties.", err));
    };

    render() {
        return (
            <div>
                <TopNav isSignedIn={this.state.isSignedIn}/>
                <Main isSignedIn={this.state.isSignedIn} partyTokens={this.state.partyTokens} />
                <Button onClick={this.loadPartyTokensForUser}>Load Tokens</Button>
            </div>
        );
    }
}

// hey i'm gonna save here
// i'm still here
export default App;
