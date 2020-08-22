/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/income.csv";

// dimensions
const NUMBER_OF_BINS = 40;
const MAX_X_COORD = 10;
const MAX_Y_COORD = 100;
const margin = {top: 10, right: 20, bottom: 20, left: 60}
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

class Histogram5 extends Component {

    componentDidMount() {
        var svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(histogramDatasetCsv).then(function(bins) {
            // Coerce types.
            bins.forEach(function(bin) {
                bin.income = +bin.income;
                bin.people = +bin.people;
            });
            
            // Normalize each bin to so that height = quantity/width; see http://en.wikipedia.org/wiki/Histogram#Examples
            for (var i=1, n=bins.length, bin; i < n; i++) {
                bin = bins[i];
                bin.offset = bins[i - 1].income;
                bin.width = bin.income - bin.offset;
                bin.height = bin.people;
            }

            // Drop the first bin, since it's incorporated into the next.
            bins.shift();
            
            // initialise x-axis, and draw it
            var x = d3.scaleLinear()
                .domain([0, 1800])
                .range([0, width]);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // initialise y-axis, and draw it
            var y = d3.scaleLinear()
                .domain([0, 450000])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // text label for the x axis
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height - 6)
                .style("fill", "rgb(245, 245, 245)")
                .text("Income (£)");
            
            // text label for the y axis
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 6)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .style("fill", "rgb(245, 245, 245)")
                .text("People");

            const tooltip = d3.select(".wrapper")
                .append('div')
                .attr("class", "tooltip");

            // Add the bins.
            svg.selectAll(".bin")
                .data(bins)
                .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .style("fill", "#69b3a2")
                    .attr("x", function(d) { return x(d.offset); })
                    .attr("width", function(d) { return x(d.width) - 1; })
                    .attr("y", function(d) { return y(d.height); })
                    .attr("height", function(d) { return height - y(d.height); })
                    .on("mouseover", function(d) {
                        console.log(d);
                        return tooltip
                            .style("visibility", "visible")
                            .html("<p>Range: <strong>£" + d.income + "</strong></p> <p>Number of people: <strong>" + d.people + "</strong></p>");
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
                <h1 className="title">Histogram 5 - Irregular histogram </h1>
                <div className="graph"></div>
                <h5 className="description">Irregular histogram.</h5>
            </div>
        )
    }

}

export default Histogram5