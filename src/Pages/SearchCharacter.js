import React, { Component } from 'react';
import styles from '../Styles/search.module.css';
import SearchBar from '../Components/SearchBar';
import ReactCardFlip from 'react-card-flip';
import '../Styles/App.css'

export default class SearchCharacter extends Component {

    constructor(props){
        super(props);
        this.state  = {
            searchTerm: "",
            quotes: [],
            error: false,
            hasQuotes: false,
            isFlipped: [false,false,false,false,false,false,false,false,false,false],
            colorArray: ['#cdb4db','#83c5be','#ff87ab','#e6b48a','#99c1de','#d0b4cd','#e8a598','#ccd5ae','#b8bedd'],
        }
    }

    toggleShow = (index) =>{
        let tempArr = this.state.isFlipped;
        let temp = !this.state.isFlipped[index];
        tempArr[index] = temp;
        this.setState({isFlipped: tempArr});
    }

    prepURL = ()=>{
        let character = this.state.searchTerm;
        let url = character.replace(/\s+/g, '+').toLowerCase();
        return url;
    }

    async getQuotes(url){
        let newUrl = 'https://animechan.vercel.app/api/quotes/character?name=' + url;
        let response = await fetch(newUrl);
        if (response.status === 200) {
            let data = await response.json();
            return data;
            }else{
            return "Error";
        }
    }

    resetSearch = ()=>{
        this.setState({hasQuotes: false, error: false, quotes: [], searchTerm: "",isFlipped: [false,false,false,false,false,false,false,false,false,false]});
    }

    handleSearch = ()=>{
        if (this.state.searchTerm !== ""){
            let url = this.prepURL();
            this.getQuotes(url)
            .then(data =>{
                if (data === "Error"){
                    this.setState({error: true})
                }else{
                    this.setState({quotes: data, hasQuotes: true});
                }
            })
        }
    }

    searchCallBackFunction = (childData) =>{
        this.setState({ searchTerm: childData });
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
    
    render() {
        return (
            <div className={styles.searchApp}>
            <div className="container">
                <div className="card-container">
                    <div className={styles.card}>
                        {this.state.hasQuotes ?
                        (<div>
                            {this.state.quotes.map((quote,i) => (<div key={i} >
                                <ReactCardFlip isFlipped={this.state.isFlipped[i]} flipDirection="vertical">
                                    <div className={styles.quoteCard}  style={{...{ margin:"0em auto 1em auto"
                                        , boxShadow:"0.3em 0.3em 0 0"+this.state.colorArray[i%9]+", 0.3em 0.3em 0 0.1em #444444"}}} onClick={() => this.toggleShow(i)}>
                                        <p className="quoteText">"{quote.quote}"</p>
                                        <small className="hint">Click me!</small>
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
                            <SearchBar parentCallback={this.searchCallBackFunction} placeholder="Enter character's name"/>
                            <button onClick={this.handleSearch} className={styles.searchButton}>Search</button>
                            <div>{this.state.error ? <div>
                                <p className="error">Oops, we don't have that character !<br/>Check your spelling or try another character</p>
                            </div>:null}</div>
                        </div>)}
                    </div>
                </div>
            </div>
            
            </div>
        )
    }
}
