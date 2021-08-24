import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavbar />
                <div class="homeContainer">
                    <h2>Employee Salary Management</h2>
                </div>
            </div>
        );
    }
}

export default Home;