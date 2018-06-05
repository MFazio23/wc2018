import React, {Component} from 'react';
import api from '../../util/API';
import red from '@material-ui/core/colors/red';
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import "flag-icon-css/css/flag-icon.min.css"
import teams from "../../util/Teams";
import withRoot from "../../WithRoot";
import Grid from "@material-ui/core/Grid/Grid";

const styles = theme => ({
    dialogCard: {
        width: '100%',
        //TODO: Make this only for larger screens.
        minWidth: 400,
        [theme.breakpoints.down('xs')]: {
            minWidth: 300
        }
    },
    removeUserButton: {
        color: 'white',
        textAlign: 'left',
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700]
        }
    },
    closeWindow: {
        textAlign: 'right'
    },
    dialog: {
        width: '100%'
    },
    stats: {
        flexGrow: 1,
        textAlign: 'center',
        minWidth: 200,
        [theme.breakpoints.down('xs')]: {
            minWidth: 125,
            fontSize: 12
        }
    },
    teamFlag: {
        margin: 0
    },
    singleStat: {
        width: '1.5em',
        display: 'inline-block',
        position: 'relative'
    },
    teamList: {
        //minWidth: 400
    },
    notYetDrafted: {
        marginBottom: 10
    }
});

class PartyUserSummary extends Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.state = {removeButtonDisabled: false};
    }

    removeUserFromParty = () => {
        this.setState({removeButtonDisabled: true});
        api.removeUserFromParty(this.props.partyToken, this.props.partyUser.id).then((result) => {
            this.props.onClose(this.props.partyUser.name);
        }).catch(() => {
            this.setState({removeButtonDisabled: false})
            //TODO: WHat happens if this fails?
        });
    };

    handleClose = () => {
        this.props.onClose();
    };

    getFlag = (teamId) => {
        const team = teams[teamId];

        if (team) {
            return (<span key={teamId} title={team.name}
                          className={`user-flag flag-icon flag-icon-${team.isoCode.toLowerCase()}`}/>);
        }

        return '';
    };

    render() {
        if (!this.props.partyUser) return <div/>;
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} className={this.classes.dialog}>
                <div className={this.classes.dialog}>
                    <Card className={this.classes.dialogCard}>
                        <CardHeader
                            className={this.classes.title}
                            title={this.props.partyUser.name}/>
                        <CardContent>
                            {this.props.partyUser.teams ?
                                <List className={this.classes.teamList}>
                                    {this.props.partyUser.teams.sort((a, b) => b.stats.p - a.stats.p).map((team) =>
                                        <ListItem key={team.id}>
                                            <ListItemIcon className={this.classes.teamFlag}>
                                                {this.getFlag(team.id)}
                                            </ListItemIcon>
                                            <ListItemText primary={team.name} secondary={`${team.stats.p} points`}/>
                                            <ListItemSecondaryAction className={this.classes.stats}>
                                                <Grid container>
                                                    <Grid item xs={3}
                                                          className={`user-flag flag-icon`}>{`${team.stats.w}W`}</Grid>
                                                    <Grid item xs={3}
                                                          className={`user-flag flag-icon`}>{`${team.stats.d}D`}</Grid>
                                                    <Grid item xs={3}
                                                          className={`user-flag flag-icon`}>{`${team.stats.g}G`}</Grid>
                                                    <Grid item xs={3}
                                                          className={`user-flag flag-icon`}>{`${team.stats.cs}CS`}</Grid>
                                                </Grid>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )}
                                </List> :
                                <Typography className={this.classes.notYetDrafted}>This party has not drafted yet.</Typography>
                            }

                            <Grid container>
                                <Grid item xs={6}>
                                    {this.props.currentUserIsPartyOwner && !this.props.isPartyOwner &&
                                    <Button className={this.classes.removeUserButton} variant="raised" color="inherit"
                                            disabled={this.state.removeButtonDisabled}
                                            onClick={this.removeUserFromParty}>Remove from Party</Button>}
                                </Grid>
                                <Grid item xs={6} className={this.classes.closeWindow}>
                                    <Button className={this.classes.closeWindow} variant="raised" color="inherit"
                                            onClick={this.handleClose}>OK</Button>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                </div>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(PartyUserSummary));