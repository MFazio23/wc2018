import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import withRoot from "../../WithRoot";

const styles = {

};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.classes = props;
    }

    render() {
        return (
            <h1>Profile</h1>
        );
    }
}

export default withRoot(withStyles(styles)(Profile));