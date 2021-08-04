import React, { Component } from 'react';
import ReactCardFlip from 'react-card-flip';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import './App.css';

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
      backgroundColor: '#348AA7',
      colorArray: ['#DB5A42','#FFD275','#A8DCD9','#E2A3C7','#B5CA8D','#DB6C79','#9BC1BC','#9C95DC'],
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
      el.value = this.state.quote;
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
      <div className="App">
        <div className="container">
          <div className="card-container">
            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
              <div className="card"  style={{...{backgroundColor: this.state.backgroundColor}}} onClick={this.toggleShow}>
                <p className="quoteText" id="quoteText">"{this.state.quote}"</p>
                <small className="hint">Click the card to see who said this !</small>
              </div>
              <div className="card" style={{...{backgroundColor: this.state.backgroundColor}}} onClick={this.toggleShow}>
                <p className="quoteText">{this.state.character}<br></br>{this.state.anime}</p>
              </div>
            </ReactCardFlip>
            <button onClick={this.copyToClipboard} className="copy-button">COPY QUOTE&emsp;<i className="far fa-clipboard"></i></button>
          </div>
          <div className="button-container">
            <IconButton onClick={this.setQuote} ><NavigateNextIcon style={{...{color: this.state.backgroundColor},fontSize:'200%'}}/></IconButton>
          </div>
        </div>
        <div className="footer">
          <p className="footerText">
          <span><a className="fab fa-github" 
          style={{display: "table-cell"}} href="https://github.com/Dami-Lapite/anime-quotes" target="_blank"></a></span>&emsp;
          <span><a className="fas fa-external-link-alt project-icon"
          style={{display: "table-cell"}} href="https://www.damilapite.com/" target="_blank"></a></span>
          &emsp;Designed and Developed by Dami Lapite - 2021</p>
        </div>
      </div>
    );
  }
}

export default App;
