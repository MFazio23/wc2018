import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import withRoot from "../../WithRoot";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

const styles = {

};

class About extends Component {
    constructor(props) {
        super(props);
        this.classes = props;
    }

    render() {
        return (
            <Card>
                <CardHeader
                    title="About WC2018"/>
                <CardContent>
                    <pre>

                    </pre>
                </CardContent>
            </Card>
        );
    }
}

export default withRoot(withStyles(styles)(About));