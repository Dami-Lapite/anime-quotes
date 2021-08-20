import React, { Component } from 'react';
import styles from '../Styles/search.module.css';
import SearchBar from '../Components/SearchBar';
import {ImageList,ImageListItem} from '@material-ui/core';
import Scrollbars from 'react-custom-scrollbars';
import searchFunction from '../Functions/searchFunction';
import ReactCardFlip from 'react-card-flip';
import '../Styles/App.css'

export default class Search extends Component {

    constructor(props){
        super(props);
        this.state  = {
            animeList: [],
            searchTerm: "",
            hasAnimeList: false,
            hasSearchQuotes: false,
            selectedTitle: "",
            quotes: [],
            isFlipped: [false,false,false,false,false,false,false,false,false,false],
            colorArray: ['#cdb4db','#83c5be','#ff87ab','#e6b48a','#99c1de','#d0b4cd','#e8a598','#ccd5ae'],
        }
    }

    selectTitle = (anime)=>{
        this.setState({selectedTitle: anime});
    }

    isSelected = (anime)=>{
        return(this.state.selectedTitle === anime);
    }

    hasSelection = ()=>{
        return(this.state.selectedTitle !== "");
    }

    searchCallBackFunction = (childData) =>{
        this.setState({ searchTerm: childData });
    }

    prepUrl = (title)=>{
        let url = title.replace(/\s+/g, '+').toLowerCase();
        return url;
    }

    searchQuotes = ()=>{
        let url  = this.prepUrl(this.state.selectedTitle);
        this.getQuotes(url)
        .then(data =>{
        this.setState({quotes: data, hasSearchQuotes: true});
        })
    }

    toggleShow = (index) =>{
        let tempArr = this.state.isFlipped;
        let temp = !this.state.isFlipped[index];
        tempArr[index] = temp;
        this.setState({isFlipped: tempArr});
    }

    resetSearch = ()=>{
        this.setState({hasSearchQuotes: false, selectedTitle: "", quotes: [], searchTerm: "",isFlipped: [false,false,false,false,false,false,false,false,false,false]})
    }

    async getQuotes(url){
        let newUrl = 'https://animechan.vercel.app/api/quotes/anime?title=' + url;
        let response = await fetch(newUrl);
        if (response.status === 200) {
            let data = await response.json();
            return data;
            }else{
            return "Error";
        }
    }

    async getAnimeList(){
        let response = await fetch('https://animechan.vercel.app/api/available/anime');
        if (response.status === 200) {
            let data = await response.json();
            return data;
            }else{
            return "Error";
        }
    }

    componentDidMount(){
        this.getAnimeList()
        .then(data =>{
        this.setState({animeList: data, hasAnimeList: true});
        });
    }
    
    render() {
        return (
            <div className="container">
                <div className="card-container">
                    <div className={styles.card}>
                        {this.state.hasSearchQuotes ?
                        (<div>
                            {this.state.quotes.map((quote,i) => (<div key={i} >
                                <ReactCardFlip isFlipped={this.state.isFlipped[i]} flipDirection="vertical">
                                    <div className={styles.quoteCard}  style={{...{backgroundColor: this.state.colorArray[i%8], margin:"0em auto 0.5em auto"}}} onClick={() => this.toggleShow(i)}>
                                        <p className="quoteText">"{quote.quote}"</p>
                                        <small className="hint">Click the card to see who said this !</small>
                                    </div>
                                    <div className={styles.quoteCard} style={{...{backgroundColor: this.state.colorArray[i%8], margin:"0em auto 0.5em auto"}}} onClick={() => this.toggleShow(i)}>
                                        <p className="quoteText">{quote.character}<br></br>{quote.anime}</p>
                                    </div>
                                </ReactCardFlip>
                            </div>))}
                            <button className={styles.searchButton} onClick={this.resetSearch}>Back to Search</button>
                        </div>):(<div>
                            {this.state.hasAnimeList ?
                            (<div >
                                <ImageList cols={1}>
                                <SearchBar parentCallback={this.searchCallBackFunction} placeholder="Search by anime title or Scroll through list"/>
                                <Scrollbars autoHide style={{ width: "45em", height: "25em", margin:"0.5em auto 1.9em auto"}}>
                                    {this.state.animeList.map((anime, i) => (<div key={i}>
                                    {searchFunction(this.state.searchTerm, anime) ? (<div>
                                    {this.isSelected(anime) ?(
                                        <ImageListItem cols={1} className={styles.selectedRow}>
                                        <p onClick={() => this.selectTitle(anime)}>{anime}</p>                               
                                        </ImageListItem>
                                    ):(<ImageListItem cols={1} onClick={() => this.selectTitle(anime)} className={styles.gridRow}>
                                        <p>{anime}</p>                               
                                    </ImageListItem>)}
                                    </div>) : null}
                                    </div>))}
                                    <ImageListItem cols={1} className={styles.gridRow}>
                                        <p>&emsp;</p>                               
                                    </ImageListItem>
                                </Scrollbars>
                                </ImageList>
                                {this.hasSelection() ? 
                                <button onClick={this.searchQuotes} className={styles.searchButton}>GET QUOTES FROM :&emsp; {this.state.selectedTitle}</button>
                                :
                                <button className={styles.searchButton}>SELECT ANIME TITLE</button>}
                            </div>)
                            : null}
                        </div>)}
                    </div>
                </div>
            </div>
        )
    }
}
