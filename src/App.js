import React, { Component } from 'react'
import { Circle } from 'react-preloaders';

import Data from "./Components/Data"
import Globe from "./Components/Globe"

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {selectedCountry: {country: null, coords: null}};
  }

  updateCountry = (data) => {
      this.setState({selectedCountry: {country: data.country, coords: data.coords}});
  }

  render() {
    return (
      <div className="App">
        <Data selectedCountry={this.state.selectedCountry} updateCountry={this.updateCountry}/>
        <Globe selectedCountry={this.state.selectedCountry} updateCountry={this.updateCountry}/>
        <Circle time={500}/>
      </div>
    );
  }
}

export default App;