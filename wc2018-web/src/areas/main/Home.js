import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import withRoot from "../../WithRoot";
import firebase from "firebase/app";
import Login from "../login/Login";

const styles = {
    card: {},
    loginButtonDiv: {
        textAlign: 'center'
    },
    title: {
        fontSize: 48
    },
    finePrint: {}
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.state = {
            loginOpen: false
        };
    }

    handleLoginButtonClicked = () => {
        this.setState({loginOpen: true});
    };

    handleLoginDialogClosed = () => {
        this.setState({loginOpen: false});
    };

    render() {
        return (
            <div>
                <Card className={this.classes.card}>
                    <CardHeader
                        className={this.classes.title}
                        title="Welcome to WC2018!"
                        /*action={<IconButton><SettingsIcon /></IconButton>}*//>
                    <CardContent>
                        {!firebase.auth().currentUser &&
                        <div className={this.classes.loginButtonDiv}>
                            <Button size="large" color="primary" variant="raised"
                                    onClick={this.handleLoginButtonClicked}>Login</Button>
                        </div>
                        }
                        <p>
                            WC2018 is a fantasy game for the 2018 FIFA World Cup Russia™.<br/>
                            Join one or more groups, get your teams, and compete against your friends!<br/>
                            You can create and join groups of anywhere from 2-32 people.<br/>
                            Log in above to get started!<br/>
                            <br />
                        </p>
                        <Typography variant="subheading">
                            Steps to join a party:
                        </Typography>
                        <ol>
                            <li>Log In above</li>
                            <li>Get your six-character party token from your friend</li>
                            <li>Click the "JOIN PARTY" button</li>
                            <li>Search for your friend's party</li>
                            <li>Click "JOIN"!</li>
                        </ol>
                        <Typography variant="subheading">
                            Steps to create your own party:
                        </Typography>
                        <ol>
                            <li>Log In above</li>
                            <li>Click the "CREATE PARTY" button</li>
                            <li>Give your party a name</li>
                            <li>Click "CREATE"</li>
                            <li>Send your party's six-character code to your friends!</li>
                        </ol>
                        <Typography className={this.classes.finePrint} color="textSecondary">
                            WC2018 is in no way officially associated with FIFA or the 2018 FIFA World Cup Russia™.
                        </Typography>
                    </CardContent>
                </Card>
                <Login
                    open={this.state.loginOpen && !firebase.auth().currentUser}
                    onClose={this.handleLoginDialogClosed}
                    isSignedIn={this.props.isSignedIn}/>
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(Home));