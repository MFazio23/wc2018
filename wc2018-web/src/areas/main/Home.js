import React, { Component } from 'react';
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import withRoot from "../../WithRoot";

const styles = {
    card: {},
    title: {
        fontSize: 48
    }
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;
    }
    render() {
        return (
            <Card className={this.classes.card}>
                <CardHeader
                    className={this.classes.title}
                    title="Welcome to WC2018!"
                    /*action={<IconButton><SettingsIcon /></IconButton>}*//>
                <CardContent>
                    <p>
                        WC2018 is a fantasy game for the 2018 FIFA World Cup Russia™.<br />
                        Join one or more groups, get your teams, and compete against your friends!<br />
                        You can create and join groups of anywhere from 2-32 people.<br />
                        Log in above to get started!<br />
                    </p>
                    <Typography className={this.classes.finePrint} color="textSecondary">
                        WC2018 is in no way officially associated with FIFA or the 2018 FIFA World Cup Russia™.
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withRoot(withStyles(styles)(Home));