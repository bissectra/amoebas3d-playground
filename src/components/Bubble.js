import './Bubble.css'
import './anchor.css'
import React from "react";

class Bubble extends React.Component {
    render() {
        const className = "bubble" +
            ((this.props.clicked ? " " : " not-") + "clicked") +
            ((this.props.clickable ? " " : " not-") + "clickable")
            ;
        return (
            <div className={className} onClick={this.props.onClick}>
                <div className="anchor-wrapper"><div className="gg-anchor"></div></div>
            </div>
        )
    }
}

export default Bubble