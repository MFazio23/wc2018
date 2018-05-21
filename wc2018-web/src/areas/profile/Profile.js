import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {

};

class Profile extends Component {
    render() {
        const { classes } = this.props;
        return (
            <h1>Profile</h1>
        );
    }
}

export default withStyles(styles)(Profile);