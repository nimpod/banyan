/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/stepsDoubleHist.csv";

// dimensions
const NUMBER_OF_BINS = 20;
const MAX_X_COORD = 55000;
const MAX_Y_COORD = 200;
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 720 - margin.left - margin.right;
const height = 660 - margin.top - margin.bottom;

class Histogram3 extends Component {

    componentDidMount() {
        const histogramNathanColour = getComputedStyle(document.body).getPropertyValue('--histogram-steps-nathan');
        const histogramSlanceColour = getComputedStyle(document.body).getPropertyValue('--histogram-steps-slance');

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

        d3.csv(histogramDatasetCsv).then(function(data) {
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
                .value(function(d) { return + d.steps; })
                .domain(x.domain())
                .thresholds(x.ticks(NUMBER_OF_BINS));

            // And apply twice this function to data to get the bins.
            console.log(data);
            const bins1 = histogram(data.filter( d => d.person === "nathan" ));
            const bins2 = histogram(data.filter( d => d.person === "slance" ));
        
            // append the bars for series 1
            svg.selectAll("bar")
                .data(bins1)
                .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", 1)
                    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                    .attr("height", function(d) { return height - y(d.length); })
                    .style("fill", histogramNathanColour)
                    .on("mouseover", function(d) {
                        return tooltip
                            .style("visibility", "visible")
                            .html("<p><strong>" + d[0].person + "</strong></p>" + "<p>Range: <strong>" + d.x0 + "-" + d.x1 + " steps</strong></p> <p>Times achieved: <strong>" + d.length + "</strong></p>");
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (window.event.pageY - 10) + "px").style("left", (window.event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    });

            // append the bars for series 2
            svg.selectAll("bar")
                .data(bins2)
                .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", 1)
                    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                    .attr("height", function(d) { return height - y(d.length); })
                    .style("fill", histogramSlanceColour)
                    .on("mouseover", function(d) {
                        return tooltip
                            .style("visibility", "visible")
                            .html("<p><strong>" + d[0].person + "</strong></p>" + "<p>Range: <strong>" + d.x0 + "-" + d.x1 + " steps</strong></p> <p>Times achieved: <strong>" + d.length + "</strong></p>");
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (window.event.pageY - 10) + "px").style("left", (window.event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    });

            // Handmade legend
            svg.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", histogramNathanColour);
            svg.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", histogramSlanceColour);
            svg.append("text").attr("x", 320).attr("y", 30).text("Nathan").style("font-size", "15px").attr("fill", histogramNathanColour).attr("alignment-baseline","middle");
            svg.append("text").attr("x", 320).attr("y", 60).text("Slance").style("font-size", "15px").attr("fill", histogramSlanceColour).attr("alignment-baseline","middle");

        });
    }

    render() {
        return (
            <div className="wrapper">
                <h1 className="title">Steps</h1>
                <div className="graph"></div>
                <h5 className="description">A histogram displaying the difference in distribution of steps between two people.</h5>
            </div>
        )
    }

}

export default Histogram3