import React, { Component } from 'react';
import styles from '../Styles/search.module.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchTitle from './SearchTitle';
import SearchCharacter from './SearchCharacter';
import '../Styles/App.css'

export default class Search extends Component {
    
    render() {
        return (
            <Router>
            <Route exact path="/search"
            render={props => (
            <div className={styles.searchApp}>
            <div className="container">
                <div className="card-container">
                    <div className={styles.card}>
                    <div ><Link to="/searchTitle" className={styles.searchButton}>Search quotes by anime title&emsp;<i className="fas fa-search"></i></Link></div>
                    <div ><Link to="/searchCharacter" className={styles.searchButton}>Search quotes by anime character&emsp;<i className="fas fa-search"></i></Link></div>
                    </div>
                </div>
            </div>
            </div>
            )}/>
            <Route path="/searchTitle" component={SearchTitle} />
            <Route path="/searchCharacter" component={SearchCharacter} />
            </Router>
        )
    }
}
