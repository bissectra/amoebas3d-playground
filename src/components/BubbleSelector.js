import './BubbleSelector.css'
import React from "react";
import Bubble from './Bubble';

class BubbleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.clearSelection(props.size);
        this.state = {
            clicked: [],
        }
    }

    submit = (levelChange) => {
        this.props.submit(this.state, levelChange)
    }

    componentDidMount() {
        this.clearSelection();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'N' || event.key === 'n') {
                this.submit(+1);
            } else if (event.key === 'ArrowUp' || event.key === 'P' || event.key === 'p') {
                this.submit(-1);
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.size !== prevProps.size) {
            this.clearSelection(this.props.size)
            if (this.props.clicked !== undefined)
                this.setState({ clicked: this.props.clicked })
        }
    }

    clearSelection(size) {
        this.setState({
            clicked: [...Array(size).keys()].map((row) => {
                return [...Array(row + 1).keys()].map((col) => {
                    return false;
                })
            })
        })
    }

    bubbleClicked(row, col) {
        this.setState({
            clicked: this.state.clicked.map((rowArray, rowIndex) => {
                return row === rowIndex ? rowArray.map((isClicked, colIndex) => {
                    return col === colIndex ? !isClicked : isClicked
                }) : rowArray
            })
        })
    }

    render_row(row) {
        return (
            <div key={row} className="row">
                {[...Array(row + 1).keys()].map((col) => {
                    return (
                        <Bubble
                            key={col} clicked={this.state.clicked[row][col]}
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