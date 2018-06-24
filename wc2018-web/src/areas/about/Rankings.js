import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import update from 'immutability-helper';
import withRoot from "../../WithRoot";
import API from "../../util/API"
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

const styles = {};

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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team Name</TableCell>
                            <TableCell>FIFA</TableCell>
                            <TableCell>ELO</TableCell>
                            <TableCell>W</TableCell>
                            <TableCell>D</TableCell>
                            <TableCell>G</TableCell>
                            <TableCell>CS</TableCell>
                            <TableCell><b>P</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(rankings).map(key => {
                            const ranking = rankings[key];
                            return (
                                <TableRow key={key}>
                                    <TableCell component="th" scope="row">
                                        {ranking.name}
                                    </TableCell>
                                    <TableCell numeric>{ranking.fifa}</TableCell>
                                    <TableCell numeric>{ranking.elo}</TableCell>
                                    <TableCell numeric>{ranking.w}</TableCell>
                                    <TableCell numeric>{ranking.d}</TableCell>
                                    <TableCell numeric>{ranking.g}</TableCell>
                                    <TableCell numeric>{ranking.cs}</TableCell>
                                    <TableCell numeric><b>{ranking.p}</b></TableCell>
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