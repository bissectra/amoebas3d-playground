import './App.css';
import React from 'react';
import BubbleSelector from './components/BubbleSelector';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      levels: [...Array(15).keys()],
    }
  }

  componentDidMount() {
    document.title = "Amoebas 3d"
  }

  render() {
    return (
      <div className="App">
        <BubbleSelector
          size={this.state.levels.length + 1}
        />
      </div>
    );
  }
}

export default App;
