import React, {Component} from "react";
import {withStyles} from '@material-ui/core/styles';
import footballGold from '../../img/football-gold.svg'
import {Link} from "react-router-dom";
import withRoot from "../../WithRoot";
import firebase from "firebase/app";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Login from "../login/Login";
import GA from 'react-ga';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    logo: {
        marginRight: 20,
        width: 48
    },
    toolbar: theme.mixins.toolbar,
});

class TopNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            loginOpen: false
        };
    }

    handleClick = (event, source) => {
        if(source === 'userMenu') this.setState({anchorEl: event.currentTarget});
        if(source === 'login') {
            this.setState({loginOpen: true});
            GA.event({
                category: 'user',
                action: 'logInButtonClicked',
                label: 'topNav'
            });
        }
    };

    handleClose = (closedItem) => {
        if(closedItem === 'profileMenu') this.setState({anchorEl: null});
        if(closedItem === 'login') this.setState({loginOpen: false});
    };

    signOut = () => {
        firebase.auth().signOut();
        this.props.onSignOut();
        this.handleClose("profileMenu");
        GA.event({
            category: 'user',
            action: 'signOut'
        });
    };

    render() {
        const classes = this.props.classes;
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.logo} color="inherit" aria-label="menu" component={Link} to="/">
                            <img src={footballGold} className={classes.logo} alt="Logo"/>
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>WC2018</Typography>
                        {this.props.isSignedIn !== undefined && !this.props.isSignedIn &&
                        <Button color="secondary" onClick={(e) => this.handleClick(e, "login")}>Login</Button>
                        }
                        {this.props.isSignedIn &&
                        <div>
                            <Button color="secondary"
                                    onClick={(e) => this.handleClick(e, "userMenu")}>{firebase.auth().currentUser.displayName}</Button>
                            <Menu
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                open={open}
                                onClose={() => this.handleClose("profileMenu")}>
                                {/*<MenuItem component={Link} to='/profile' onClick={() => this.handleClose("profileMenu")}>Profile</MenuItem>*/}
                                <MenuItem component={Link} to='/overview' onClick={() => this.handleClose("profileMenu")}>Overview</MenuItem>
                                <MenuItem component={Link} to='/rankings' onClick={() => this.handleClose("profileMenu")}>Rankings</MenuItem>
                                <MenuItem component={Link} to='/privacy' onClick={() => this.handleClose("profileMenu")}>Privacy/Terms</MenuItem>
                                <MenuItem onClick={this.signOut}>Sign Out</MenuItem>
                            </Menu>
                        </div>
                        }
                    </Toolbar>
                </AppBar>
                <Login
                    open={this.state.loginOpen && !firebase.auth().currentUser}
                    onClose={() => this.handleClose("login")}
                    isSignedIn={this.props.isSignedIn} />
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(TopNav));