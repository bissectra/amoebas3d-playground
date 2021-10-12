import './BubbleSelector.css'
import React from "react";
import Bubble from './Bubble';

class BubbleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.clearSelection();
        this.state = {
            clicked: [],
            numParents: [],
        }
    }

    submit = (levelChange) => {
        if (levelChange === +1 && this.hasTriad(this.state.clicked)) { return; }
        this.props.submit(this.state, levelChange)
    }

    size() { return this.props.currentLevel + 1; }

    clearSelection() { this.setState({ clicked: this.getClicked(this.size()) }) }

    componentDidMount() {
        this.clearSelection();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'N' || event.key === 'n') {
                this.submit(+1);
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'P' || event.key === 'p') {
                this.submit(-1);
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.currentLevel !== prevProps.currentLevel) {
            this.clearSelection()
            this.autoSelect(this.props.prevClicked)
            if (this.props.clicked !== undefined)
                this.setState({ clicked: this.props.clicked })
        }
    }

    getClicked(size) {
        return [...Array(size).keys()].map((row) => {
            return [...Array(row + 1).keys()].map((col) => {
                return false;
            });
        })
    }

    computeParents(prevClicked) {
        const size = this.size();
        let numParents = this.getClicked(size);
        for (let rowIndex = 0; rowIndex < numParents.length; ++rowIndex) {
            for (let colIndex = 0; colIndex < numParents[rowIndex].length; ++colIndex) {
                let parentsIndexes = [
                    { row: rowIndex, col: colIndex },
                    { row: rowIndex - 1, col: colIndex },
                    { row: rowIndex - 1, col: colIndex - 1 }
                ].filter(({ row, col }) => {
                    return 0 <= row && row < (size - 1) && 0 <= col && col <= row;
                })
                numParents[rowIndex][colIndex] = parentsIndexes.filter(({ row, col }) => {
                    return prevClicked[row][col] === true;
                }).length
            }
        }
        this.setState({ numParents: numParents });
        return numParents;
    }

    hasTriad(clicked) {
        if (this.hasTriadDown(clicked)) {
            this.props.triadNotification('▼')
            return true;
        }
        if (this.hasTriadUp(clicked)) {
            this.props.triadNotification('▲')
            return true;
        }
        return false;
    }

    hasTriadDown(clicked) {
        const size = clicked.length
        for (let rowIndex = 0; rowIndex < size; ++rowIndex) {
            for (let colIndex = 0; colIndex <= rowIndex; ++colIndex) {
                let triadIndexesDown = [
                    { row: rowIndex, col: colIndex },
                    { row: rowIndex, col: colIndex + 1 },
                    { row: rowIndex + 1, col: colIndex + 1 }
                ].filter(({ row, col }) => {
                    return 0 <= row && row < size && 0 <= col && col <= row;
                });
                const numActives = triadIndexesDown.filter(({ row, col }) => {
                    return clicked[row][col] === true;
                }).length;
                if (numActives === 3) return true;
            }
        }
        return false;
    }

    hasTriadUp(clicked) {
        const size = clicked.length
        for (let rowIndex = 0; rowIndex < size - 1; ++rowIndex) {
            for (let colIndex = 0; colIndex <= rowIndex; ++colIndex) {
                let triadIndexesUp = [
                    { row: rowIndex, col: colIndex },
                    { row: rowIndex + 1, col: colIndex },
                    { row: rowIndex + 1, col: colIndex + 1 }
                ];
                const isTriadActive = triadIndexesUp.every(({ row, col }) => { return clicked[row][col] });
                if (isTriadActive) return true;
            }
        }
        return false;
    }

    autoSelect(prevClicked) {
        let numParents = this.computeParents(prevClicked);
        let bubblesThatHaveTwoOrMoreParents = [];
        for (let row = 0; row < numParents.length; ++row) {
            for (let col = 0; col < numParents[row].length; ++col) {
                if (numParents[row][col] >= 2) {
                    bubblesThatHaveTwoOrMoreParents.push({ row: row, col: col });
                }
            }
        }
        this.setBubbles(bubblesThatHaveTwoOrMoreParents, 'set')
    }

    bubbleClicked = (row, col) => {
        if (this.props.currentLevel !== 0 && this.state.numParents.length > 0) {
            const numParents = this.state.numParents[row][col]
            if (numParents !== 1) {
                return;
            }
        }
        this.toggleBubble(row, col);
    }

    setBubbles(bubbles, mode) {
        this.setState((state, props) => {
            let clicked = [...state.clicked].map((rowValue, rowIndex) => {
                return rowValue.map((colValue, colIndex) => {
                    const inBubbles = bubbles.filter(({ row, col }) => {
                        return row === rowIndex && col === colIndex;
                    }).length > 0;
                    if (!inBubbles) return colValue;
                    if (mode === 'toggle') return !colValue;
                    if (mode === 'set') return true;
                    if (mode === 'reset') return false;
                    return colValue;
                })
            })
            return { clicked: clicked };
        })
    }

    toggleBubble(row, col) {
        this.setBubbles([{ row: row, col: col }], 'toggle')
    }

    render_row(row) {
        return (
            <div key={row} className="row">
                {[...Array(row + 1).keys()].map((col) => {
                    return (
                        <Bubble
                            key={col} clicked={this.state.clicked[row][col]}
                            clickable={this.props.currentLevel === 0 || this.state.numParents.length === 0 || this.state.numParents[row][col] === 1}
                            onClick={() => { this.bubbleClicked(row, col) }}
                        />
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="wrapper">
                <div className="box">
                    <div id="select">
                        {[...Array(this.state.clicked.length).keys()].map((row) => this.render_row(row))}
                    </div>
                </div>
                <div className="controls">
                    <button
                        onClick={() => this.submit(-1)}
                        id="prev"
                    >
                        Prev (P)
                    </button>
                    <button
                        onClick={() => this.submit(+1)}
                        id="next"
                    >
                        Next (N)
                    </button><br />
                    <span>h = {this.props.currentLevel}</span>
                </div>
            </div>
        )
    }
}

export default BubbleSelector