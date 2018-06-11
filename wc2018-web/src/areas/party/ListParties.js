import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import firebase from 'firebase/app';
import 'firebase/database';
import update from 'immutability-helper';
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import CircularProgress from '@material-ui/core/CircularProgress';
import PartyCard from "./PartyCard";
import CreateParty from "./CreateParty";
import JoinParty from "./JoinParty";
import withRoot from "../../WithRoot";
import {Config} from "../../util/Config";

const styles = theme => ({
    partyButtons: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            justifyContent: 'space-around'
        }
    },
    partyButton: {
        marginRight: 10
    },
    loadingSpinner: {
        paddingTop: 50,
        textAlign: 'center'
    }
});

class ListParties extends Component {
    baseFirebasePath = `${Config.firebaseEnv}/parties`;

    constructor(props) {
        super(props);

        this.state = {
            "parties": {},
            "firebaseParties": {},
            "lastPartyTokens": [],
            "joinOpen": false,
            "createOpen": false
        };
    }

    componentDidMount() {
        this.updateBindings();
    }

    componentDidUpdate() {
        if (this.state.lastPartyTokens !== this.props.partyTokens) {
            this.updateBindings();
        }
    }

    updateBindings = () => {
        this.state.lastPartyTokens.forEach(pt => this.unbindParty(pt));
        this.props.partyTokens.forEach(pt => this.bindParty(pt));
        this.setState({"lastPartyTokens": this.props.partyTokens});
    };

    unbindParty = (partyToken) => {
        const firebaseParty = this.state.firebaseParties[partyToken];
        if (firebaseParty) {
            const ref = firebaseParty.ref;
            ref.off('value', firebaseParty.callback);
        }
    };

    bindParty = (partyToken) => {
        const ref = firebase.database().ref(`${this.baseFirebasePath}/${partyToken}`);
        const callback = ref.on('value', (snap) => {
            //TODO: Change this to use `update` method
            let newParties = this.state.parties;
            newParties[partyToken] = snap.val();
            this.setState({"parties": newParties});
        });
        this.setState({
            firebaseParties: update(this.state.firebaseParties, {
                ref: {$set: ref},
                callback: {$set: callback}
            })
        });
    };

    partyButtonClicked = (buttonProp) => {
        this.setState({[buttonProp]: true});
    };

    handleClose = (source, partyName, partyToken) => {
        this.setState({"joinOpen": false, "createOpen": false});
        if (partyToken) {
            this.bindParty(partyToken);
            if (source) {
                this.props.onDisplaySnackbar(
                    source === 'join' ?
                        `Party '${partyName}' joined.` :
                        `Party created.  Use token ${partyToken} to invite your friends!`,
                    source === 'create' ? partyToken : null);
            }
        }
    };

    handleStopTrackingParty = (partyToken) => {
        console.log("Unbinding party ", partyToken);
        this.unbindParty(partyToken);
    };

    render() {
        const {classes} = this.props;
        const parties = Object
            .keys(this.state.parties)
            .map(partyToken => this.state.parties[partyToken])
            .filter(party => party && !!party.users[firebase.auth().currentUser.uid]);
        return (
            <div>
                <Card>
                    <CardHeader
                        title="New Party"
                        subheader="Join an existing party or create a new one"/>
                    <CardContent className={classes.partyButtons}>
                        <Button className={classes.partyButton} size="large" variant="raised" color="primary"
                                onClick={() => this.partyButtonClicked('joinOpen')}>Join Party</Button>
                        <Button className={classes.partyButton} size="large" variant="raised" color="primary"
                                onClick={() => this.partyButtonClicked('createOpen')}>Create Party</Button>
                    </CardContent>
                </Card>
                <div>
                    {(!parties || parties.length <= 0) && <div className={classes.loadingSpinner}>
                        <CircularProgress className={classes.progress} size={100} />
                    </div>}
                    {parties.map((party) => <PartyCard key={party.token}
                                                       party={party}
                                                       stats={this.props.stats}
                                                       onDisplaySnackbar={this.props.onDisplaySnackbar}
                                                       onStopTrackingParty={this.handleStopTrackingParty}/>)}</div>
                <JoinParty open={this.state.joinOpen} onClose={this.handleClose}/>
                <CreateParty open={this.state.createOpen} onClose={this.handleClose}/>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(ListParties));