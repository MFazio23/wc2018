import React, { Component } from 'react';
import {Route, Switch} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import Login from "../login/Login";
import Overview from "./Overview"
import Profile from "../profile/Profile";
import Schedule from "../schedule/Schedule";
import ListParties from "../party/ListParties";
import withRoot from "../../WithRoot";
import Privacy from "../about/Privacy";
import {CopyToClipboard} from "react-copy-to-clipboard";

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    main: {
        margin: '0 auto',
        maxWidth: '960px'
    }
});

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbarOpen: false,
            snackbarText: ''
        };
    }

    handleSnackbarClose = () => {
        this.setState({
            snackbarOpen: false,
            snackbarText: ''
        });
    };

    handleDisplaySnackbar = (text, itemToCopy) => {
        this.setState({
            snackbarOpen: true,
            snackbarText: text,
            snackbarItemToCopy: itemToCopy
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <Switch>
                    <Route exact path='/' render={() => (
                        this.props.isSignedIn ?
                            (<ListParties partyTokens={this.props.partyTokens} onDisplaySnackbar={this.handleDisplaySnackbar} stats={this.props.stats}/>) :
                            (<Overview isSignedIn={this.props.isSignedIn}/>))} />
                    <Route path='/login' render={() => <Login isSignedIn={this.props.isSignedIn}/>} />
                    <Route path='/overview' render={() => <Overview isSignedIn={this.props.isSignedIn}/>} />
                    <Route path='/party' render={() => <ListParties partyTokens={this.props.partyTokens} onDisplaySnackbar={this.handleDisplaySnackbar} stats={this.props.stats}/>} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/schedule' component={Schedule} />
                    <Route path='/privacy' component={Privacy} />
                </Switch>
                <div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        open={this.state.snackbarOpen}
                        autoHideDuration={5000}
                        onClose={this.handleSnackbarClose}
                        message={<span>{this.state.snackbarText}</span>}
                        action={
                            <div key="action">
                                {this.state.snackbarItemToCopy &&
                                <CopyToClipboard text={this.state.snackbarItemToCopy}>
                                    <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
                                        COPY TOKEN
                                    </Button>
                                </CopyToClipboard>
                                }
                                <IconButton
                                    key="close"
                                    aria-label="Close"
                                    color="secondary"
                                    className={classes.close}
                                    onClick={this.handleSnackbarClose}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        }
                    />
                </div>
            </main>
        );
    }
}

export default withRoot(withStyles(styles)(Main));