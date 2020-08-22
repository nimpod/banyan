/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/steps.csv";

// dimensions
const NUMBER_OF_BINS = 20;
const MAX_X_COORD = 55000;
const MAX_Y_COORD = 200;
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 720 - margin.left - margin.right;
const height = 660 - margin.top - margin.bottom;

class Histogram1 extends Component {

    componentDidMount() {
        const histogramBarBgColour = getComputedStyle(document.body).getPropertyValue('--histogram-bar-bg');
        const histogramBarBgColourHover = getComputedStyle(document.body).getPropertyValue('--histogram-bar-bg-hover');

        const tooltip = d3.select("body")
            .append('div')
            .attr("class", "tooltip");

        // append the svg object to the body of the page
        const svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleLinear().domain([0, NUMBER_OF_BINS]).range([0, width]);

        d3.csv(histogramDatasetCsv).then(function(data) {       // only works if you use the .then() function, something to do with promises...
            // initialise x axis, and append to svg
            const x = d3.scaleLinear()
                .domain([0, MAX_X_COORD])
                .range([0, width]);

            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, MAX_Y_COORD]);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            // set the parameters for the histogram
            const histogram = d3.histogram()
                .value(function(d) {return d.steps})
                .domain(x.domain())
                .thresholds(x.ticks(NUMBER_OF_BINS));

            // apply the above function to get the bins
            const bins = histogram(data);

            // append the bar rectangles to the svg element
            svg.selectAll(".bar")
                .data(bins)
                .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", 1)
                    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1; })
                    .attr("height", function(d) { return height - y(d.length); })
                    .style("fill", histogramBarBgColour)
                    .on("mouseover", function(d) {
                        return tooltip
                            .style("visibility", "visible")
                            .html("<p>Range: <strong>" + d.x0 + "-" + d.x1 + "</strong></p> <p>Times achieved: <strong>" + d.length + "</strong></p>");
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (window.event.pageY - 10) + "px").style("left", (window.event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    });
        });
    }

    render() {
        return (
            <div className="wrapper">
                <h1 className="title">Step count</h1>
                <div className="graph"></div>
                <h5 className="description">A histogram displaying the distribution of the number of steps achieved per day. Measured using a Fitbit smartwatch. 1074 measurements taken every day from 21/06/2017 - 29/05/2020.</h5>
            </div>
        )
    }

}

export default Histogram1