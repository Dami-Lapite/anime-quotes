import React, { Component } from 'react';
import ReactCardFlip from 'react-card-flip';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Search from './Pages/Search';
import SearchTitle from './Pages/SearchTitle';
import SearchCharacter from './Pages/SearchCharacter';
import './Styles/App.css';

class App extends Component { 

  constructor(props) {
    super(props);
    this.state  = {
      quote: "",
      character: "",
      anime: "",
      hasQuote: false,
      isFlipped: false,
      colorIndex: 0,
      backgroundColor: '#b8bedd',
      colorArray: ['#cdb4db','#83c5be','#ff87ab','#e6b48a','#99c1de','#d0b4cd','#e8a598','#ccd5ae','#b8bedd'],
    }
  }

  async getQuote(){
    let response = await fetch('https://animechan.vercel.app/api/random');
    if (response.status === 200) {
      let data = await response.json();
      return data;
    }else{
      return "Error";
    }
  }

  getColor = () =>{
    return this.state.colorArray[this.state.colorIndex];
  }

  setQuote = () =>{
    let color = this.getColor();
    let index = 0;
    if (this.state.colorIndex < 7){
      index = this.state.colorIndex + 1;
    }
    this.getQuote()
    .then(data =>{
      this.setState({quote: data.quote, character: data.character, anime: data.anime, hasQuote: true, backgroundColor: color, colorIndex: index, isFlipped: false});
    });
  }

  copyToClipboard = ()=>{
    if (this.state.hasQuote) {
      const el = document.createElement('textarea');
      el.value = this.state.quote +" - "+ this.state.character +" , "+ this.state.anime;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert("Quote is copied to clipboard")
    }else{
      alert("No quote to copy :(")
    }
  }

  toggleShow = ()=>{
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  componentDidMount(){
    this.getQuote()
    .then(data =>{
      this.setState({quote: data.quote, character: data.character, anime: data.anime, hasQuote: true});
    });
  }
  render (){
    return (
      <Router>
      <Route exact path="/"
      render={props => (
      <div className="App">
        <div className="container">
          <div className="card-container">
            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal" >
              <div className="card"  style={{...{ boxShadow:"0.3em 0.3em 0 0"+this.state.backgroundColor+", 0.3em 0.3em 0 0.1em #444444"}}} onClick={this.toggleShow}>
                <p className="quoteText" id="quoteText">"{this.state.quote}"</p>
                <small className="hint">Click me to see who said this !</small>
                <i className="far fa-copy copy-icon" onClick={this.copyToClipboard}><span>copy quote</span></i>
              </div>
              <div className="card" style={{...{ boxShadow:"0 0 0.5em"+this.state.backgroundColor}}} onClick={this.toggleShow}>
                <p className="quoteText">{this.state.character}<br></br>{this.state.anime}</p>
              </div>
            </ReactCardFlip>
            <div className="search-button-container"><Link to="/search" className="search-button">Search quotes by anime title / character&emsp;<i className="fas fa-search"></i></Link></div>
          </div>
          <i className="fas fa-arrow-right next-icon" onClick={this.setQuote} style={{...{color: this.state.backgroundColor}}} ></i>
        </div>
        <div className="footer">
          <p className="footerText">
          <span><a className="fab fa-github icon" 
          style={{display: "table-cell"}} href="https://github.com/Dami-Lapite/anime-quotes" target="_blank"></a></span>&emsp;
          <span><a className="fas fa-external-link-alt icon"
          style={{display: "table-cell"}} href="https://www.damilapite.com/" target="_blank"></a></span>
          &emsp;Designed & Developed by Dami Lapite - 2021</p>
        </div>
      </div>
      )}/>
      <Route path="/search" component={Search} />
      <Route path="/searchTitle" component={SearchTitle} />
      <Route path="/searchCharacter" component={SearchCharacter} />
      </Router>
    );
  }
}

export default App;
