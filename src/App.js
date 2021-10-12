import './App.css';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  noBubblesSelected() {
    toast("No bubbles selected!", { toastId: 0, });
  }

  prohibitedTriad(t) {
    toast("Level has a " + t, { toastId: t, });
  }

  getNumClicked() {
    const levels = this.state.levels;
    const numClicked = levels.slice(0, this.state.currentLevel).map((levelValue, levelRow) => {
      return levelValue.map((rowValue, rowIndex) => {
        return rowValue.filter((colValue) => colValue === true).length
      }).reduce((a, b) => a + b, 0);
    }).reduce((a, b) => a + b, 0);
    return numClicked;
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
    }, () => {
      toast.dismiss();
    })
  }

  render() {
    return (
      <div className="App">
        <BubbleSelector
          currentLevel={this.state.currentLevel}
          submit={(state, levelChange) => this.submit(state, levelChange)}
          clicked={this.state.levels[this.state.currentLevel]}
          prevClicked={this.state.levels[this.state.currentLevel - 1]}
          triadNotification={this.prohibitedTriad}
          clickedTotal={this.getNumClicked()}
          noBubblesSelected={this.noBubblesSelected}
        />
        <ToastContainer />
      </div>
    );
  }
}

export default App;
