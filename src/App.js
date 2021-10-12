import './App.css';
import React from 'react';
import BubbleSelector from './components/BubbleSelector';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      levels: [],
      currentLevel: 0,
    }
  }

  componentDidMount() {
    document.title = "Amoebas 3d"
  }

  submit({ clicked }, levelChange) {
    function newLevel(oldLevel) {
      return levelChange === -1 ? Math.max(oldLevel - 1, 0) : oldLevel + 1
    }

    this.setState((state, props) => {
      if (state.currentLevel === state.levels.length) {
        return {
          levels: [...state.levels, clicked],
          currentLevel: newLevel(state.currentLevel),
        }
      }
      const changed = JSON.stringify(clicked) !== JSON.stringify(state.levels[state.currentLevel]);
      if (!changed) {
        return { currentLevel: newLevel(state.currentLevel), }
      } else {
        return {
          levels: [...state.levels.slice(0, state.currentLevel), clicked],
          currentLevel: newLevel(state.currentLevel),
        }
      }
    }, () => console.log(this.state))
  }

  render() {
    return (
      <div className="App">
        <BubbleSelector
          currentLevel={this.state.currentLevel}
          size={this.state.currentLevel + 1}
          submit={(state, levelChange) => this.submit(state, levelChange)}
          clicked={this.state.levels[this.state.currentLevel]}
        />
      </div>
    );
  }
}

export default App;
