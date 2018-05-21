import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

const styles = {
    card: {
        minWidth: 275,
        maxWidth: 400,
        margin: '30px auto 0'

    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};

class Login extends Component {
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false,
        },
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        title="WC2018 Account"
                    />
                    <CardContent>
                        {this.props.isSignedIn !== undefined && !this.props.isSignedIn &&
                        <div>
                            <StyledFirebaseAuth uiConfig={this.uiConfig}
                                                firebaseAuth={firebase.auth()}/>
                        </div>
                        }
                        {this.props.isSignedIn &&
                        <div>
                            Hello {firebase.auth().currentUser.displayName}. You are now signed In!
                            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
                        </div>
                        }
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(Login);