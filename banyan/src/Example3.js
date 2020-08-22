/**
 * Example 3 - drawing column chart, using scaleLinear on the width of each rectangle to make each bar scale nicely
 */


import React, { Component } from 'react'
import * as d3 from "d3";


// array of numbers we want to visualise
var nums = [27, 13, 29, 5, 11, 2, 42, 4, 69, 17];

// dimensions of svg container
var svgContainerWidth = 500;
var svgContainerHeight = 500;
var rectWidthScale = d3.scaleLinear()
    .domain([0, Math.max(...nums)])
    .range([0, svgContainerWidth]);

class Example3 extends Component {

    componentDidMount() {
        // the svg container which will contain the 'visualisation'
        var canvas = d3.select('.wrapper')
            .append('svg')
            .style('padding-top', "10px")
            .attr('width', svgContainerWidth)
            .attr('height', svgContainerHeight);
        
        // collection of bars, each index from the array visualised as a rect
        var bars = canvas.selectAll('rect')
            .data(nums)
            .enter()
            .append('rect')
            .attr('width', this.setRectWidth )
            .attr('height', 30)
            .attr('x', 10)
            .attr('y', this.setRectYcoord )
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

export default Example3