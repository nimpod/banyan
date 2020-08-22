
/**
 * Example 1 - Drawing SVG shapes, appending them to the DOM
 */


import React, { Component } from 'react'
import * as d3 from "d3";


class Example1 extends Component {

    componentDidMount() {
        var canvas = d3.select('.wrapper')
            .append('svg')
            .attr('width', 500)
            .attr('height', 500);

        var circle = canvas.append('circle')
            .attr('cx', 250)
            .attr('cy', 250)
            .attr('r', 50)
            .attr('fill', 'red');

        var rect = canvas.append('rect')
            .attr('x', 10)
            .attr('y', 10)
            .attr('width', 100)
            .attr('height', 50);

        var line = canvas.append('line')
            .attr('x1', 0)
            .attr('y1', 100)
            .attr('x2', 400)
            .attr('y2', 400)
            .attr('stroke', 'green')
            .attr('stroke-width', 10);
    }

    render() {
        return(
            <div className="wrapper">

            </div>
        )
    }
}

export default Example1