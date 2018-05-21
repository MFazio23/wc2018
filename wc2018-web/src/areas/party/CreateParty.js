import React, { Component } from 'react';
import {Link} from "react-router-dom";

export default class CreateParty extends Component {
    render() {
        return (
            <div>
                <h1>Create Party</h1><br/>
                <Link to="/party">List</Link><br/>
                <Link to="/party/join">Join</Link>
            </div>

        );
    }
}