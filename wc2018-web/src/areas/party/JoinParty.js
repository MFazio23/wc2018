import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import axios from 'axios';
import firebase from 'firebase/app';
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import withRoot from "../../WithRoot";

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
            "alreadyInParty": false
        }
    }

    handleChange = name => event => {
        const text = event.target.value.toUpperCase();

        if (text.length === 0 || text.match(this.partyTokenRegex)) {
            this.setState({
                [name]: text,
                "partyNotFound": false,
                "joinGroupSuccess": false
            });
        }
    };

    getParty = () => {
        if (this.state.partyToken.match(/^[A-Z0-9]{6}$/)) {
            axios
                .get(`https://wc2018-2bad0.firebaseio.com/parties/${this.state.partyToken}.json`)
                .then((resp) => {
                    if (resp.data) {
                        this.setState({
                            "selectedParty": resp.data,
                            "alreadyInParty": !!resp.data.users[firebase.auth().currentUser.uid]
                        });

                    } else {
                        this.setState({"partyNotFound": true});
                    }
                })
                .catch((err) => console.error(`Error loading entered party [${this.state.partyToken}].`, err));
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
            axios
                .post(`https://wc2018-api.faziodev.org/party/${partyToken}/user`, currentUser)
                .then((resp) => {
                    if (resp.status === 200) {
                        this.setState({"joinedPartyToken": partyToken});
                        this.handleClose();
                    }
                })
                .catch((err) => console.error(`Error joining party [${partyToken}]`, err));
        }
    };

    handleClose = () => {
        this.props.onClose(this.state.joinedPartyToken);
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
                        <TextField
                            id="partyToken"
                            label="Party Token"
                            className={classes.partyTokenField}
                            onChange={this.handleChange('partyToken')}
                            value={this.state.partyToken}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Button className={classes.searchPartyButton} variant="raised" color="primary" onClick={this.getParty}>Search</Button>
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
                                                 title={this.state.alreadyInParty ? "You are already a member of this party." : ""}>
                                            <div>
                                                <Button className={classes.joinPartyButton} variant="raised" color="primary"
                                                    disabled={this.state.alreadyInParty}
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