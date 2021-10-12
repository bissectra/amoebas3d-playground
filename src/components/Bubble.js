import './Bubble.css'
import React from "react";

class Bubble extends React.Component {
    render() {
        const className = "bubble" + (this.props.clicked ? " clicked" : "");
        return <div className={className} onClick={this.props.onClick}></div>
    }
}

export default Bubble