import React, { Component } from 'react';
import styles from '../Styles/searchbar.module.css';

class SearchBar extends Component {
    sendSearchTerm = (event) => {
        this.props.parentCallback(event.target.value);
    }
    render() {
        return (
            <div className={styles.searchBarContainer}>
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    name="search"
                    className={styles.searchBar}
                    placeholder={this.props.placeholder}
                    autoComplete="off"
                    onChange={(e) => this.sendSearchTerm(e)}
                />
            </div>
        )
    }
}

export default SearchBar;