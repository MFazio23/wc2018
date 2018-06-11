import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import api from '../../util/API';
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import withRoot from "../../WithRoot";
import GA from 'react-ga';

const styles = theme => ({
    partyNameField: {
        marginRight: 10,
        width: '100%'
    },
    draftPartyButton: {
        marginTop: 10
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        minWidth: 200,
        marginTop: 10
    },
    description: {
        lineHeight: '2em',
        [theme.breakpoints.down('sm')]: {
            fontSize: 12
        }
    },
    selects: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent: 'space-around'
        }
    }
});

const rankingTypeInfo = {
    Default: {
        text: '',
        link: '',
        showLink: false
    },
    FIFA: {
        text: 'Use the current ',
        linkText: 'FIFA Rankings',
        link: 'https://www.fifa.com/fifa-world-ranking/ranking-table/men/index.html',
        showLink: true
    },
    ELO: {
        text: 'Use the current ',
        linkText: 'ELO Rankings',
        link: 'https://www.eloratings.net/',
        showLink: true
    },
    Random: {
        text: 'Randomly distribute all teams',
        linkText: '',
        link: '',
        showLink: false
    }
};

class DraftPartyDialog extends Component {
    constructor(props) {
        super(props);

        this.classes = this.props.classes;

        this.state = {
            rankingType: '',
            teamsPerUser: '',
            draftButtonDisabled: true,
            rankingTypeHelperInfo: ""
        }
    }

    handleDraftParty = () => {
        if(this.props.party && this.props.party.token) {
            this.setState({draftButtonDisabled: true});
            const token = this.props.party.token;
            const name = this.props.party.name;
            api.draftParty(token, this.state.rankingType, this.state.teamsPerUser)
                .then((resp) => {
                    if (resp.status === 200) {
                        this.props.onDisplaySnackbar(`Party '${name}' has distributed teams successfully!`);
                        this.handleClose();

                        GA.event({
                            category: 'party',
                            action: 'distribute',
                            label: `${token}|${this.state.rankingType}|${this.state.teamsPerUser}`
                        });
                    }
                })
                .catch((err) => {
                    console.error(`Error distributing teams for party [${name}]`, err);

                    GA.event({
                        category: 'partyError',
                        action: 'distribute'
                    });
                })
                .finally(() => this.setState({draftButtonDisabled: false}));
        }
    };

    handleRankingTypeChange = event => {
        const rankingType = event.target.value;
        this.setState({
            rankingType: rankingType,
            draftButtonDisabled: !rankingType || !this.state.teamsPerUser,
            rankingTypeHelperInfo: rankingTypeInfo[rankingType ? rankingType : 'Default']
        });
    };

    handleTeamsPerUserChange = event => {
        const teamsPerUser = event.target.value;
        this.setState({
            teamsPerUser: teamsPerUser,
            draftButtonDisabled: !this.state.rankingType || !teamsPerUser
        });
    };

    getTeamsPerUserOptions = () => {
        let teams = [];
        const maxPerUser = Math.floor(32 / Object.keys(this.props.party.users).length);

        for (let t = 1; t <= maxPerUser; t++) {
            teams.push(t);
        }

        return teams;
    };

    handleClose = () => {
        this.props.onClose();
    };

    render() {
        if (Object.keys(this.props.party.users).length <= 1) return '';
        return (
            <Dialog onClose={this.handleClose} open={this.props.open}>
                <Card className={this.classes.card}>
                    <DialogTitle>Distribute Teams for Party <i>{this.props.party.name}</i></DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">
                            Distribute the teams for your party!
                        </Typography>
                        <Typography variant="body1" className={this.classes.description}>
                            Teams will be randomly distributed based on the selected method.<br/>
                            The rankings are split into groups based on the number of users in a party.<br/>
                            Each user then gets one team from that group.<br/>
                            Ex: A party with six users gives each user one of the teams ranked between 1 and 6.<br/>
                            This continues until each user has the specified number of teams.<br/>
                        </Typography>
                        <div className={this.classes.selects}>
                            <FormControl className={this.classes.formControl}>
                                <InputLabel htmlFor="ranking-type">Distribution Type</InputLabel>
                                <Select
                                    autoWidth
                                    value={this.state.rankingType}
                                    onChange={this.handleRankingTypeChange}
                                    inputProps={{
                                        name: 'rankingType',
                                        id: 'ranking-type'
                                    }}>
                                    <MenuItem value="FIFA">FIFA Rankings</MenuItem>
                                    <MenuItem value="ELO">ELO Rankings</MenuItem>
                                    <MenuItem value="Random">Random</MenuItem>
                                </Select>
                                <FormHelperText>
                                    {this.state.rankingTypeHelperInfo.text}
                                    {this.state.rankingTypeHelperInfo.showLink &&
                                    <a href={this.state.rankingTypeHelperInfo.link}
                                       target="_blank">{this.state.rankingTypeHelperInfo.linkText}</a>}
                                </FormHelperText>
                            </FormControl>
                            <FormControl className={this.classes.formControl}>
                                <InputLabel htmlFor="teams-per-user">Teams per User</InputLabel>
                                <Select
                                    autoWidth
                                    value={this.state.teamsPerUser}
                                    onChange={this.handleTeamsPerUserChange}
                                    inputProps={{
                                        name: 'teamsPerUser',
                                        id: 'teams-per-user'
                                    }}>
                                    {this.getTeamsPerUserOptions().map(t =>
                                        <MenuItem key={t}
                                                  value={t}>{t} {t > 1 ? 'teams' : 'team'}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </div>
                        <DialogActions>
                            <Button className={this.classes.draftPartyButton} color="primary"
                                    onClick={this.handleDraftParty}
                                    disabled={this.state.draftButtonDisabled}>Distribute Teams</Button>
                        </DialogActions>
                    </DialogContent>
                </Card>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(DraftPartyDialog));