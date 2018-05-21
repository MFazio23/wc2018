import React, { Component } from 'react';
import {Link} from "react-router-dom";

export default class JoinParty extends Component {
    render() {
        return (
            <div>
                <h1>Join Party</h1>
                <Link to="/party">List</Link>
                <Link to="/party/create">Create</Link>
            </div>

        );
    }
}