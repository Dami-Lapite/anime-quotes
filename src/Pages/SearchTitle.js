import React, { Component } from 'react';
import styles from '../Styles/search.module.css';
import SearchBar from '../Components/SearchBar';
import {ImageList,ImageListItem} from '@material-ui/core';
import Scrollbars from 'react-custom-scrollbars';
import searchFunction from '../Functions/searchFunction';
import ReactCardFlip from 'react-card-flip';
import '../Styles/App.css'

export default class SearchTitle extends Component {

    constructor(props){
        super(props);
        this.state  = {
            error: false,
            animeList: [],
            searchTerm: "",
            hasAnimeList: false,
            hasSearchQuotes: false,
            selectedTitle: "",
            quotes: [],
            isFlipped: [false,false,false,false,false,false,false,false,false,false],
            colorArray: ['#cdb4db','#83c5be','#ff87ab','#e6b48a','#99c1de','#d0b4cd','#e8a598','#ccd5ae','#b8bedd'],
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
            if (data === "Error"){
                this.setState({error: true})
            }else{
                this.setState({quotes: data, hasSearchQuotes: true});
            }
        })
    }

    toggleShow = (index) =>{
        let tempArr = this.state.isFlipped;
        let temp = !this.state.isFlipped[index];
        tempArr[index] = temp;
        this.setState({isFlipped: tempArr});
    }

    copyToClipboard = (index)=>{
        if (this.state.quotes.length > 0) {
            const el = document.createElement('textarea');
            el.value = this.state.quotes[index].quote +" - "+ this.state.quotes[index].character +" , "+ this.state.quotes[index].anime;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert("Quote is copied to clipboard")
            }else{
            alert("No quote to copy :(")
        }
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
            <div className={styles.searchApp}>
            <div className="container">
                <div className="card-container">
                    <div className={styles.card}>
                        {this.state.hasSearchQuotes ?
                        (<div>
                            {this.state.quotes.map((quote,i) => (<div key={i} >
                                <ReactCardFlip isFlipped={this.state.isFlipped[i]} flipDirection="vertical">
                                    <div className={styles.quoteCard}  style={{...{ margin:"0em auto 1em auto"
                                        , boxShadow:"0.3em 0.3em 0 0"+this.state.colorArray[i%9]+", 0.3em 0.3em 0 0.1em #444444"}}} onClick={() => this.toggleShow(i)}>
                                        <p className="quoteText">"{quote.quote}"</p>
                                        <small className="hint">Click me to see who said this !</small>
                                        <i className="far fa-copy copy-icon" onClick={()=> this.copyToClipboard(i)}></i>
                                    </div>
                                    <div className={styles.quoteCard} style={{...{ margin:"0em auto 1em auto"
                                        , boxShadow:"0 0 0.5em"+this.state.colorArray[i%8]}}} onClick={() => this.toggleShow(i)}>
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
                                <button onClick={this.searchQuotes} className={styles.searchButton}>Get quotes from :&emsp; {this.state.selectedTitle}</button>
                                :
                                <button className={styles.searchButton}>Select Anime Title</button>}
                            </div>)
                            : null}
                        </div>)}
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
