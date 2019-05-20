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
import GA from 'react-ga';

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

class Overview extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.state = {
            loginOpen: false
        };
    }

    handleLoginButtonClicked = () => {
        GA.event({
            category: 'user',
            action: 'logInButtonClicked',
            label: 'overviewPage'
        });
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
                        title="Welcome to WWC2019!"
                        /*action={<IconButton><SettingsIcon /></IconButton>}*//>
                    <CardContent>
                        {!firebase.auth().currentUser &&
                            <div className={this.classes.loginButtonDiv}>
                                <Button size="large" color="primary" variant="contained"
                                        onClick={this.handleLoginButtonClicked}>Login</Button>
                            </div>
                        }
                        <p>
                            WWC2019 is a fantasy game for the FIFA Women's World Cup France 2019™.<br/>
                            Join one or more groups, get your teams, and compete against your friends!<br/>
                            You can create and join groups of anywhere from 2-24 people.<br/>
                            Log in above to get started!<br/>
                            <br />
                        </p>
                        <Typography variant="subtitle1" color="primary">
                            Joining a Party
                        </Typography>
                        <ol>
                            <li>Log In above</li>
                            <li>Get your six-character party token from your friend</li>
                            <li>Click the "JOIN PARTY" button</li>
                            <li>Search for your friend's party</li>
                            <li>Click "JOIN"!</li>
                        </ol>
                        <Typography variant="subtitle1" color="primary">
                            Creating a Party
                        </Typography>
                        <ol>
                            <li>Log In above</li>
                            <li>Click the "CREATE PARTY" button</li>
                            <li>Give your party a name</li>
                            <li>Click "CREATE"</li>
                            <li>Send your party's six-character code to your friends!</li>
                        </ol>
                        <Typography variant="subtitle1" color="primary">
                            Scoring
                        </Typography>
                        <div>
                            Players are awarded points for their teams' performance in the World Cup.<br />
                            <ul>
                                <li>Each win: 3 points</li>
                                <li>Each clean sheet (shutout): 2 points</li>
                                <li>Each draw (tie): 1 point</li>
                                <li>Each goal scored: 1 point</li>
                            </ul>
                        </div>
                        <Typography variant="subtitle1" color="primary">
                            Team Distribution
                        </Typography>
                        <p>
                            Teams are distributed in parties randomly, based on criteria set by the party owner.
                            Owners choose from three ranking systems (FIFA Rankings, FiveThirtyEight's SPI Rankings, and a random ranking) as well as how many teams each player is assigned.
                        </p>
                        <Typography className={this.classes.finePrint} color="textSecondary">
                            WWC2019 is in no way officially associated with FIFA or the FIFA Women's World Cup France 2019™.
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

export default withRoot(withStyles(styles)(Overview));