import React, { Component } from 'react';
import {Route, Switch} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Login from "../login/Login";
import Home from "./Home"
import Profile from "../profile/Profile";
import Schedule from "../schedule/Schedule";
import ListParties from "../party/ListParties";
import withRoot from "../../WithRoot";
import Privacy from "../about/Privacy";
import About from "../about/About";

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
                            (<ListParties partyTokens={this.props.partyTokens} />) :
                            (<Home />))} />
                    <Route path='/login' render={() => <Login isSignedIn={this.props.isSignedIn}/>} />
                    <Route path='/party' render={() => <ListParties partyTokens={this.props.partyTokens}/>} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/schedule' component={Schedule} />
                    <Route path='/about' component={About} />
                    <Route path='/privacy' component={Privacy} />
                </Switch>
            </main>
        );
    }
}

export default withRoot(withStyles(styles)(Main));