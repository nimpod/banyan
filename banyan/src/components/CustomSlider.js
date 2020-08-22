
import React, { Component } from 'react'
import * as d3 from "d3";

class CustomSlider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentStart: this.props.start,
            currentEnd: this.props.end
        }
    }

    componentDidMount() {

    }

    clickedSliderHandle = (e) => {
        let target = e.target;
        let test = "what the fuck";
                
        if (e.target.classList[0] === "slider-touchArea" || e.target.classList[0] === "slider-tooltip") {
            target = e.target.parentElement;
        }

        if (target.classList[1] === "slider-handle-lower") {
            this.state.currentStart += 1;
        } else if (target.classList[1] === "slider-handle-upper") {
            this.state.currentEnd += 1;
        }
    }

    render() {
        return(
            <div className="slider-container">
                <label>
                    {this.props.title}
                    <span>
                        {this.props.start}
                        {this.props.end}
                    </span>
                </label>
                <div className="slider">
                    <div className="slider-base">
                        <div className="slider-innerRange-wrapper">
                            <div className="slider-innerRange-actual"></div>
                        </div>
                        <div className="slider-origin">
                            <div className="slider-handle slider-handle-lower" onMouseDown={this.clickedSliderHandle} aria-valuemin={this.props.min} aria-valuemax={this.props.currentEnd} aria-valuenow={this.props.currentStart} aria-valuetext="" data-handle="0" tabIndex="0" role="slider" aria-orientation="horizontal">
                                <div className="slider-touchArea"></div>
                                <div className="slider-tooltip">${this.props.currentStart}</div>
                            </div>
                        </div>
                        <div className="slider-origin">
                            <div className="slider-handle slider-handle-upper" onMouseDown={this.clickedSliderHandle} aria-valuemin={this.props.currentStart} aria-valuemax={this.props.max} aria-valuenow={this.props.currentEnd} aria-valuetext="" data-handle="0" tabIndex="0" role="slider" aria-orientation="horizontal">
                                <div className="slider-touchArea"></div>
                                <div className="slider-tooltip">${this.props.currentEnd}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default CustomSlider