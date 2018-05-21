import React, {Component} from "react";
import {AppBar, Button, IconButton, Toolbar, Typography} from "material-ui";
import {withStyles} from '@material-ui/core/styles';
import footballGold from '../../img/football-gold.svg'
import {Link} from "react-router-dom";
import withRoot from "../../WithRoot";
import firebase from "firebase/app";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
    state = {
        anchorEl: null
    };

    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    signOut = () => {
        firebase.auth().signOut();
        this.handleClose();
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
                        <Button color="secondary" component={Link} to="/login">Login</Button>
                        }
                        {this.props.isSignedIn &&
                        <div>
                            <Button color="secondary"
                                    onClick={this.handleMenu}>{firebase.auth().currentUser.displayName}</Button>
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
                                onClose={this.handleClose}>
                                <MenuItem component={Link} to='/profile' onClick={this.handleClose}>Profile</MenuItem>
                                <MenuItem onClick={this.signOut}>Sign Out</MenuItem>
                            </Menu>
                        </div>
                        }
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(TopNav));