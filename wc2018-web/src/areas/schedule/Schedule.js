import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

export default class Schedule extends Component {
    firebaseRef = null;
    firebaseCallback = null;

    constructor(props) {
        super(props);

        this.state = {"schedule": {}};
    }

    componentDidMount() {
        this.firebaseRef = firebase.database().ref('/schedule');
        this.firebaseCallback = this.firebaseRef.on('value', (snap) => this.setState({"schedule": snap.val()}));
    }

    componentWillUnmount() {
        this.firebaseRef.off('value', this.firebaseCallback);
    }

    render() {
        return (
            <div>
                <h1>Schedule</h1>
                <pre>
                {JSON.stringify(this.state.schedule, null, 2)}
                </pre>
            </div>
        );
    }
}