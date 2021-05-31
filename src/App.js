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
          <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
          <div className="card"  style={{...{backgroundColor: this.state.backgroundColor}}} onClick={this.toggleShow}>
            <p className="quoteText">"{this.state.quote}"</p>
            <small className="hint">Click the card to see who said this !</small>
          </div>
          <div className="card" style={{...{backgroundColor: this.state.backgroundColor}}} onClick={this.toggleShow}>
            <p className="quoteText">{this.state.character}<br></br>{this.state.anime}</p>
          </div>
          </ReactCardFlip>
          <div>
            <IconButton onClick={this.setQuote} ><NavigateNextIcon style={{...{color: this.state.backgroundColor},fontSize:'200%'}}/></IconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
