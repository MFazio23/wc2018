import React, { Component } from 'react';
import {Route, Switch} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Party from "../party/Party";
import Login from "../login/Login";
import Home from "./Home"
import Profile from "../profile/Profile";
import Schedule from "../schedule/Schedule";

const styles = {
    main: {
        margin: '0 auto',
        maxWidth: '960px'
    }
};

class Main extends Component {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <Switch>
                    <Route exact path='/' render={() => (
                        this.props.isSignedIn ?
                            (<Party partyTokens={this.props.partyTokens} />) :
                            (<Home />))} />
                    <Route path='/login' render={() => <Login isSignedIn={this.props.isSignedIn}/>} />
                    <Route path='/party' render={() => <Party partyTokens={this.props.partyTokens}/>} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/schedule' component={Schedule} />
                </Switch>
            </main>
        );
    }
}

export default withStyles(styles)(Main);