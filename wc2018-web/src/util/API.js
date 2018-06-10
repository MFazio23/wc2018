import axios from 'axios';
import firebase from 'firebase/app';

const api = axios.create({
    //baseURL: 'http://localhost:8080/'
    baseURL: 'https://wc2018-api.faziodev.org/'
});

export default {
    updateAuthToken: () => {
        return new Promise((res, rej) => {
            if (firebase.auth().currentUser) {
                firebase.auth().currentUser.getIdToken().then((idToken) => {
                    if (idToken) {
                        api.defaults.headers = {'Authorization': `Bearer ${idToken}`};
                        res();
                    } else {
                        rej();
                    }
                }).catch((err) => {
                    console.error(`Error loading current user's ID token`, err);
                    rej(err);
                })
            }
        });
    },
    loadPartyTokensForUser: (userId) => {
        return new Promise((res, rej) => {
            if (!api) {
                rej();
            }
            else {
                api
                    .get(`/party/tokens?userId=${userId || firebase.auth().currentUser.uid}`)
                    .then((resp) => {
                        res(resp.data);
                    })
                    .catch((err) => {
                        console.error("Error loading user parties.", err);
                        rej(err);
                    });
            }
        });
    },
    createParty: (partyInfo) => {
        return new Promise((res, rej) => {
            api
                .post(`party`, partyInfo)
                .then((resp) => {
                    if (resp.status === 200 && resp.data) {
                        res(resp.data);
                    } else {
                        rej();
                    }
                })
                .catch((err) => {
                    console.error(`Error creating party.`, err);
                    rej();
                });
        });
    },
    removeUserFromParty: (partyToken, userId) => {
        return new Promise((res, rej) => {
            api.delete(`party/${partyToken}/user?userId=${userId}`).then((resp) => {
                console.log("Deleted user:", resp);
                res();
            }).catch((err) => {
                console.error(`Error deleting user [${userId}] from party [${partyToken}]`);
                rej(err);
            });

        });
    },
    draftParty: (partyToken, rankingType, teamsPerUser) => {
        return new Promise((res, rej) => {
            api.post(`party/${partyToken}/teams?rankingType=${rankingType}&teamsPerUser=${teamsPerUser}`).then((resp) => {
                res(resp);
            }).catch((err) => {
                console.error(`Error drafting teams for party [${partyToken}]`);
                rej(err);
            });

        });
    }
}