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

const styles = {
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 14
    },
    partyNameField: {
        marginRight: 10
    },
    createPartyButton: {
        marginTop: 10
    }
};

class CreateParty extends Component {
    constructor(props) {
        super(props);

        this.state = {"partyName": "", "createdPartyToken": ""}
    }

    handleChange = name => event => {
        const text = event.target.value;

        this.setState({
            [name]: text
        });
    };

    createParty = () => {
        const fbUser = firebase.auth().currentUser;
        if(fbUser && this.state.partyName) {
            const partyInfo = {
                "name": this.state.partyName,
                "owner": {
                    id: fbUser.uid,
                    name: fbUser.displayName
                }
            };
            axios
                .post(`http://fazbook:8080/party/`, partyInfo)
                .then((resp) => {
                    if(resp.status === 200 && resp.data){
                        this.setState({"createdPartyToken": resp.data.token});
                        this.handleClose();
                    }
                })
                .catch((err) => console.error(`Error creating party.`, err));
        }
    };

    handleClose = () => {
        this.props.onClose(this.state.createdPartyToken);
        this.setState({"partyName": "", "createdPartyToken": ""});
    };

    handleKeyPress = (event) => {
        if((event.keyCode || event.charCode) === 13) {
            this.createParty();
        }
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
            <Dialog onClose={this.handleClose} {...other}>
                <Card className={classes.card}>
                    <CardHeader
                        className={classes.title}
                        title="Create a Party"/>
                    <CardContent>
                        <TextField
                            id="partyName"
                            label="Name"
                            className={classes.partyNameField}
                            onChange={this.handleChange('partyName')}
                            value={this.state.partyName}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Button variant="raised" color="primary" onClick={this.createParty}>Create</Button>                        
                    </CardContent>
                </Card>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateParty);