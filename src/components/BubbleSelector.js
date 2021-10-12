import './BubbleSelector.css'
import React from "react";
import Bubble from './Bubble';

class BubbleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: [...Array(props.size).keys()].map((row) => {
                return [...Array(row + 1).keys()].map((col) => {
                    return false;
                })
            })
        }
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
            <div className="box">
                {[...Array(this.props.size).keys()].map((row) => this.render_row(row))}
            </div>
        )
    }
}

export default BubbleSelector