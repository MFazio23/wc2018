import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import withRoot from "../../WithRoot";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = {
    info: {
        whiteSpace: 'pre-wrap'
    }
};

class Privacy extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;
    }

    render() {
        return (
            <Card>
                <CardHeader title="WC2018 Privacy Policy and Terms of Service"/>
                <CardContent>
                    <Typography color="primary" variant="headline">Privacy</Typography>
                    <pre className={this.classes.info}>
                        Normally, this would some huge blob of legalese that nobody would read.<br />
                        <br />
                        Instead, as I'm a developer, this is going to be basic.<br />
                        <br />
                        The only personal info I get from the site your email address and name (when you log in with a third-party service.)<br />
                        Your email address allows me to connect accounts across Google, Facebook, and Twitter into a single account.<br />
                        Your name allows me to display it for the site/app and any groups.<br />
                        <br />
                        I am using Google Analytics to get metrics on the site.  If this makes you uncomfortable, feel free to block it.<br />
                        I'm just looking for numbers and to see if anyone cares about this thing.<br/>
                        <br />
                        Past that, I don't get any personal info nor do I want it.<br />
                    </pre>
                    <br />
                    <Typography color="primary" variant="headline">Terms of Service</Typography>
                    <pre className={this.classes.info}>
                        WC2018 is just for fun, <i>should</i> be free, and has no attached warranty.<br />
                        <br />
                        Again, this is in no way officially associated with FIFA or the 2018 FIFA World Cup Russia™.<br />
                        <br />
                        Soccer ball icon made by <a href="http://www.freepik.com/">Freepik</a> from <a href="http://www.flaticon.com/">www.flaticon.com</a>
                    </pre>
                </CardContent>
            </Card>
        );
    }
}

export default withRoot(withStyles(styles)(Privacy));