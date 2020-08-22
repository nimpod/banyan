/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";

// dimensions
const NUMBER_OF_BINS = 100;
const MAX_X_COORD = 6000;
const MAX_Y_COORD = 7;
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 1100 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;

class CustomCheckbox extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('mousedown', function(event) {
            if (event.detail > 1) {
                event.preventDefault();
            }
        }, false);
    }

    toggleCheckedAttribute = () => {
        // change the 'checked' attribute
        var myCustomCheckbox = document.getElementById(this.props.title);
        myCustomCheckbox.checked = !myCustomCheckbox.checked;

        // show or hide the relevant bars
        var bars = document.getElementsByClassName('bar ' + this.props.title);

        if (myCustomCheckbox.checked) {            
            for (let i = 0; i < bars.length; i++) {
                bars[i].style.display = "block";
            }
        } else {
            for (let i = 0; i < bars.length; i++) {
                bars[i].style.display = "none";
            }
        }
    }

    highlightBars = () => {
        // find the relevant bars
        var bars = document.getElementsByClassName('bar ' + this.props.title);

        for (let i = 0; i < bars.length; i++) {
            bars[i].style.fill = this.props.color;
        }
    }

    removeHightlight = () => {
        // find the relevant bars
        var bars = document.getElementsByClassName('bar ' + this.props.title);

        for (let i = 0; i < bars.length; i++) {
            bars[i].style.fill = "rgba(255,255,255,0.1)";
        }
    }

    render() {
        return (
            <label className="checkbox-container" htmlFor={this.props.title}>
                <input className="checkbox-input" type="checkbox" defaultChecked={this.props.isChecked} id={this.props.title}  onClick={this.toggleCheckedAttribute}/>

                <div className="checkbox-box" style={{'backgroundColor': this.props.color}} onClick={this.toggleCheckedAttribute} />

                <span className="checkbox-text" style={{'color': this.props.color}} onClick={this.toggleCheckedAttribute}>
                    {this.props.description}
                </span>

                <div className="help-tip" onMouseOver={this.highlightBars} onMouseLeave={this.removeHightlight} />
            </label>
        )
    }

}

export default CustomCheckbox