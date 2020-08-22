/**
 * Example 4 - drawing column chart, using scaleLinear on the colours of each rectangle (red=low, green=high)
 * https://www.youtube.com/watch?v=iMYkVLWc3y0&list=PL6il2r9i3BqH9PmbOf5wA5E1wOG3FT22p&index=5
 */


import React, { Component } from 'react'
import * as d3 from "d3";
import { BrowserRouter, HashRouter, Route, NavLink, Switch, withRouter } from 'react-router-dom'


// array of numbers we want to visualise
var nums = [27, 13, 29, 5, 11, 2, 42, 4, 69];

// dimensions of svg container
var svgContainerWidth = 500;
var svgContainerHeight = 500;

var rectWidthScale = d3.scaleLinear()
    .domain([0, Math.max(...nums)])
    .range([0, svgContainerWidth]);

var rectColourScale = d3.scaleLinear()
    .domain([0, Math.max(...nums)])
    .range(['red', 'green']);

class Example5 extends Component {

    componentDidMount() {
        console.log('example 5');

        // creating the x axis on its own
        var xAxis = d3.axisBottom()
            .ticks(5)
            .scale(rectWidthScale);

        // the svg container which will contain the 'visualisation'
        var canvas = d3.select('.wrapper')
            .append('svg')
            .attr('width', svgContainerWidth)
            .attr('height', svgContainerHeight)
            .append('g')
            .attr('transform', 'translate(20, 10)')
            .call(xAxis);
        
        // collection of bars, each index from the array visualised as a rect
        var bars = canvas.selectAll('rect')
            .data(nums)
            .enter()
            .append('rect')
            .attr('transform', 'translate(-10, 30)')
            .attr('width', this.setRectWidth)
            .attr('height', 30)
            .attr('x', 10)
            .attr('y', this.setRectYcoord)
            .attr('fill', this.setRectColour);
    }

    setRectColour(d) {
        return rectColourScale(d);
    }

    setRectYcoord(d, i) {
        return i*50;
    }

    setRectWidth(d) {
        return rectWidthScale(d);
    }

    render() {
        return(
            <div className="wrapper">
            
            </div>
        )
    }
}

export default withRouter(Example5)