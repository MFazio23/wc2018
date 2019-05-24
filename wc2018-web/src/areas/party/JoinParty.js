import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import firebase from 'firebase/app';
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import withRoot from "../../WithRoot";
import Api from "../../util/API";
import GA from 'react-ga';

const styles = {
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 14
    },
    partyTokenField: {
        marginRight: 10
    },
    searchPartyButton: {
        marginTop: 10
    },
    joinPartyButton: {
        marginTop: 10
    }
};

class JoinParty extends Component {
    partyTokenRegex = /^[A-Z0-9]{1,6}$/;

    constructor(props) {
        super(props);

        this.state = {
            "partyToken": "",
            "partyNotFound": false,
            "joinedPartyToken": "",
            "alreadyInParty": false,
            "maxUsersInParty": false,
            "joinPartyButtonDisabled": true
        }
    }

    handleChange = name => event => {
        const text = event.target.value.toUpperCase();

        if (text.length === 0 || text.match(this.partyTokenRegex)) {
            this.setState({
                [name]: text,
                "partyNotFound": false,
                "joinPartySuccess": false
            });
        }
    };

    getParty = () => {
        if (this.state.partyToken.match(/^[A-Z0-9]{6}$/)) {
            Api
                .getPartyByToken(this.state.partyToken, firebase.auth().currentUser.uid)
                .then((resp) => {
                    this.setState({
                        selectedParty: resp.selectedParty,
                        alreadyInParty: resp.alreadyInParty,
                        maxUsersInParty: resp.selectedParty.users && Object.keys(resp.selectedParty.users).length === 32,
                        joinPartyButtonDisabled: false
                    });
                    GA.event({
                        category: 'party',
                        action: 'search',
                        label: `${this.state.token}|${resp.alreadyInParty}`
                    });
                })
                .catch((err) => {
                    this.setState({"partyNotFound": true});
                    GA.event({
                        category: 'partyError',
                        action: 'search',
                        label: this.state.token
                    });
                });
        }
    };

    joinParty = () => {
        const fbUser = firebase.auth().currentUser;
        if (fbUser && this.state.selectedParty) {
            const partyToken = this.state.selectedParty.token;
            const currentUser = {
                id: fbUser.uid,
                name: fbUser.displayName
            };
            this.setState({joinPartyButtonDisabled: true});
            Api
                .joinParty(partyToken, currentUser)
                .then((resp) => {
                    this.setState({"joinedPartyToken": partyToken});
                    this.handleClose(this.state.selectedParty.name);

                    GA.event({
                        category: 'party',
                        action: 'joined',
                        label: `${this.state.token}`
                    });
                })
                .catch((err) => {
                    this.setState({joinPartyButtonDisabled: false});
                    GA.event({
                        category: 'partyError',
                        action: 'join',
                        label: this.state.token
                    });
                });
        }
    };

    handleClose = (partyName) => {
        this.props.onClose('join', partyName, this.state.joinedPartyToken);
        this.setState({
            "partyToken": "",
            "selectedParty": null,
            "joinedPartyToken": "",
            "alreadyInParty": false
        });
    };

    handleKeyPress = (event) => {
        if ((event.keyCode || event.charCode) === 13) {
            this.getParty();
        }
    };

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;
        return (
            <Dialog onClose={this.handleClose} {...other}>
                <Card className={classes.card}>
                    <CardHeader
                        className={classes.title}
                        title="Join a Party"/>
                    <CardContent>
                        <Typography variant="body2">
                            Ask your friend for their six-character party code to join their party!
                        </Typography>
                        <TextField
                            id="partyToken"
                            label="Party Token"
                            className={classes.partyTokenField}
                            onChange={this.handleChange('partyToken')}
                            value={this.state.partyToken}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Button className={classes.searchPartyButton} variant="contained" color="primary"
                                onClick={this.getParty}>Search</Button>
                        <div>
                            {this.state.partyNotFound ?
                                `No parties found for ${this.state.partyToken}` :

                                this.state.selectedParty ?
                                    <div>
                                        <h2>{this.state.selectedParty.token}</h2>
                                        <h4>{this.state.selectedParty.name}</h4>
                                        <div>Owner: {this.state.selectedParty.owner.name}</div>
                                        <div>Total Users: {Object.keys(this.state.selectedParty.users).length}</div>
                                        <Tooltip placement="top"
                                                 title={this.state.alreadyInParty ? "You are already a member of this party." : (this.state.maxUsersInParty ? "There are already 24 people in this party." : "")}>
                                            <div>
                                                <Button className={classes.joinPartyButton} variant="contained"
                                                        color="primary"
                                                        disabled={this.state.joinPartyButtonDisabled || this.state.alreadyInParty || this.state.maxUsersInParty}
                                                        onClick={this.joinParty}>Join</Button>
                                            </div>
                                        </Tooltip>
                                    </div> : ''
                            }
                        </div>
                    </CardContent>
                </Card>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(JoinParty));