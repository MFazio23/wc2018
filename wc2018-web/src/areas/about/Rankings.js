import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import withRoot from "../../WithRoot";
import API from "../../util/API"
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

const styles = theme => ({
    desktopOnly: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    table: {

    },
    headerRow: {
        color: 'white',
        backgroundColor: theme.palette.secondary.main
    }
});

class Rankings extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.state = {
            rankings: {}
        };
    }

    componentDidMount = () => {
        API.getRankings().then((res) => {
            this.setState({
                rankings: res
            });
        })
    };

    compileRankings = () => {
        let rankings = this.state.rankings;
        if(this.props.stats) {
            Object.keys(this.props.stats).forEach((key) => {
                let ranking = rankings[key];
                let stats = this.props.stats[key];
                rankings[key] = Object.assign({}, ranking, stats);
            });
        }
        return rankings;
    };

    render() {
        const rankings = this.compileRankings();

        return (
            <Paper>
                <Table className={this.classes.table}>
                    <TableHead>
                        <TableRow className={this.classes.headerRow}>
                            <TableCell>Team Name</TableCell>
                            <TableCell>FIFA</TableCell>
                            <TableCell>ELO</TableCell>
                            <TableCell className={this.classes.desktopOnly}>W</TableCell>
                            <TableCell className={this.classes.desktopOnly}>D</TableCell>
                            <TableCell className={this.classes.desktopOnly}>G</TableCell>
                            <TableCell className={this.classes.desktopOnly}>CS</TableCell>
                            <TableCell className={this.classes.desktopOnly}><b>P</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(rankings).map(key => {
                            const ranking = rankings[key];
                            return (
                                <TableRow key={key}>
                                    <TableCell component="th" scope="row">
                                        {ranking.name || key}
                                    </TableCell>
                                    <TableCell numeric>{ranking.fifa}</TableCell>
                                    <TableCell numeric>{ranking.elo}</TableCell>
                                    <TableCell className={this.classes.desktopOnly} numeric>{ranking.w}</TableCell>
                                    <TableCell className={this.classes.desktopOnly} numeric>{ranking.d}</TableCell>
                                    <TableCell className={this.classes.desktopOnly} numeric>{ranking.g}</TableCell>
                                    <TableCell className={this.classes.desktopOnly} numeric>{ranking.cs}</TableCell>
                                    <TableCell className={this.classes.desktopOnly} numeric><b>{ranking.p}</b></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Rankings));