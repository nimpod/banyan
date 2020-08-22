/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/imdbRatingsExport.csv";

// dimensions
const NUMBER_OF_BINS = 40;
const MAX_X_COORD = 10;
const MAX_Y_COORD = 100;
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 700 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;

class Histogram4 extends Component {

    componentDidMount() {
        // append the svg object to the body of the page
        const svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        const copyOfThis = this;

        d3.csv(histogramDatasetCsv).then(function(data) {
            const x = d3.scaleLinear()
                .domain([0, MAX_X_COORD])
                .range([0, width]);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            const y = d3.scaleLinear()
                .range([height, 0]);

            const yAxis = svg.append("g");

            // initialise with 'NUMBER_OF_BINS'
            copyOfThis.update(NUMBER_OF_BINS, svg, x, y, yAxis, data);

            // Listen to the button -> update if user change it
            d3.select("#nBin").on("input", function() {
                console.log('hi');
                copyOfThis.update(+this.value, svg, x, y, yAxis, data);
            });
        });
    }

    /**
     * A function that builds the graph for a specific value of bin
     * @param {*} nBin 
     * @param {*} svg 
     * @param {*} x
     * @param {*} y
     * @param {*} data
     */
    update(nBin, svg, x, y, yAxis, data) {
        const tooltip = d3.select(".wrapper")
            .append('div')
            .attr("class", "tooltip");

        // set the parameters for the histogram
        const histogram = d3.histogram()
            .value(function(d) { return + d.imdbRating; })
            .domain(x.domain())
            .thresholds(x.ticks(nBin));

        // apply my histogram function to data to get the bins
        const bins = histogram(data);

        y.domain([0, d3.max(bins, function(d) {return d.length; })]);
        yAxis.transition()
            .duration(1000)
            .call(d3.axisLeft(y));

        // join the rect with the bins data
        const u = svg.selectAll("rect")
            .data(bins)
            .on("mouseover", function(d) {
                return tooltip
                    .style("visibility", "visible")
                    .html("<p>Range: <strong>" + d.x0 + "-" + d.x1 + "</strong></p> <p>Occurances <strong>" + d.length + "</strong></p>");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (window.event.pageY - 10) + "px").style("left", (window.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            });

        u.enter()
            .append("rect")
            .attr("class", "bar")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2");

        
        // if less bar in the new histogram, delete the ones not in use anymore
        u.exit().remove();
    }

    render() {
        return (
            <div className="wrapper">
                <h1 className="title">IMDB official ratings</h1>
                <div className="graph"></div>
                <p>
                    <label># bins</label>
                    <input type="number" min="1" max="100" step="10" defaultValue="40" id="nBin" />
                </p>
                <h5 className="description">A histogram displaying the distribution of IMDb ratings from films I have watched.</h5>
            </div>
        )
    }

}

export default Histogram4