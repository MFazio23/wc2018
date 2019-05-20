import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import withRoot from "../../WithRoot";
import GA from 'react-ga';

const styles = {
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
    confirmation: {
        padding: 10
    }
};

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: (result) => {
            GA.event({
                category: 'user',
                action: 'signIn'
            });
        },
    },
};

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const {classes} = this.props;
        return (
            <Dialog onClose={this.handleClose} open={this.props.open}>
                <DialogTitle>WWC2019 Account</DialogTitle>
                <div>
                    {this.props.isSignedIn !== undefined && !this.props.isSignedIn &&
                    <div>
                        <StyledFirebaseAuth uiConfig={uiConfig}
                                            firebaseAuth={firebase.auth()}/>
                    </div>
                    }
                    {this.props.isSignedIn &&
                    <div className={classes.confirmation}>
                        <h2>Welcome {firebase.auth().currentUser.displayName}.</h2>
                        <h4>You are now signed In!</h4>
                    </div>
                    }
                </div>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(Login));