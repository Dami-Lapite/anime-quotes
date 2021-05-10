import React, { Component } from 'react';
import { flipInX, pulse } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import './App.css';

const styles = {
    pulse: {
      animation: 'x 5s',
      animationName: Radium.keyframes(pulse, 'pulse')
    },
    flipInX: {
      animation: 'x 5s',
      animationName: Radium.keyframes(flipInX, 'flipInX')
    }
  }

class App extends Component { 

  constructor(props) {
    super(props);
    this.state  = {
      quote: "",
      character: "",
      anime: "",
      hasQuote: false,
      showQuoteText: true,
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

  setQuote = (quoteData) => {
    this.setState({quote: quoteData.quote, character: quoteData.character, anime: quoteData.anime, hasQuote: true});
  }

  toggleShow = ()=>{
    let current = this.state.showQuoteText;
    this.setState({showQuoteText: !current});
  }

  componentDidMount(){
    this.getQuote()
    .then(data =>{
      this.setState({quote: data.quote, character: data.character, anime: data.anime, hasQuote: true});
    });
  }
  render (){
    return (
      <StyleRoot>
        <div className="App">
          <div className="container">
            <div className="card" style={styles.pulse} onClick={this.toggleShow}>
              {this.state.showQuoteText ? 
              <p className="quoteText">"{this.state.quote}"</p>: 
              <p className="quoteText">{this.state.character}<br></br>{this.state.anime}</p>}
              <p>Click the card to see where this quote is from</p>
            </div>
          </div>
        </div>
      </StyleRoot>
    );
  }
}

export default App;
