import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import api from '../../util/API';
import firebase from 'firebase/app';
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withRoot from "../../WithRoot";
import GA from 'react-ga';

const styles = {
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 14
    },
    partyNameField: {
        marginRight: 10,
        width: '100%'
    },
    createPartyButton: {
        marginTop: 10
    }
};

class CreateParty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "partyName": "",
            "createdPartyToken": "",
            "createButtonDisabled": false
        }
    }

    handleChange = name => event => {
        const text = event.target.value;

        this.setState({
            [name]: text
        });
    };

    createParty = () => {
        const fbUser = firebase.auth().currentUser;
        if (fbUser && this.state.partyName) {
            this.setState({createButtonDisabled: true});
            const partyInfo = {
                "name": this.state.partyName,
                "owner": {
                    id: fbUser.uid,
                    name: fbUser.displayName
                }
            };
            api.createParty(partyInfo)
                .then((party) => {
                    this.setState({"createdPartyToken": party.token, "createButtonDisabled": false});
                    this.handleClose();

                    GA.event({
                        category: 'party',
                        action: 'created',
                        label: party.token
                    });
                })
                .catch((err) => {
                    //TODO: Add a notification to the user if the create request fails.

                    GA.event({
                        category: 'partyError',
                        action: 'create'
                    });
                });
        }
    };

    handleClose = () => {
        this.props.onClose('create', this.state.partyName, this.state.createdPartyToken);
        this.setState({"partyName": "", "createdPartyToken": ""});
    };

    handleKeyPress = (event) => {
        if ((event.keyCode || event.charCode) === 13) {
            this.createParty();
        }
    };

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;
        return (
            <Dialog onClose={this.handleClose} {...other}>
                <Card className={classes.card}>
                    <CardHeader
                        className={classes.title}
                        title="Create a Party"/>
                    <CardContent>
                        <Typography variant="body2">
                            Create a new party here!<br/>
                            Invite your friends with the six character code that is generated after creation.
                        </Typography>
                        <TextField
                            id="partyName"
                            label="Name"
                            className={classes.partyNameField}
                            onChange={this.handleChange('partyName')}
                            value={this.state.partyName}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Button className={classes.createPartyButton} variant="contained" color="primary"
                                onClick={this.createParty} disabled={this.state.createButtonDisabled}>Create</Button>
                    </CardContent>
                </Card>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(CreateParty));