/**
 * Example 2 - Drawing a column chart
 */


import React, { Component } from 'react'
import * as d3 from "d3";


// array of numbers we want to visualise
var nums = [27, 13, 29, 5, 11, 2, 42, 4, 69, 17];

class Example2 extends Component {

    componentDidMount() {
        // the svg container which will contain the 'visualisation'
        var canvas = d3.select('.wrapper')
            .append('svg')
            .style('padding-top', "10px")
            .attr('width', 500)
            .attr('height', 500);
        
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
        return d;
    }

    render() {
        return(
            <div className="wrapper">

            </div>
        )
    }
}

export default Example2