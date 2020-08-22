/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/banyan.csv";

const dacFreq = 1200;

// dimensions
const NUMBER_OF_BINS = 50;
const MAX_X_COORD = 6000;
const MAX_Y_COORD = 7;
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 1500 - margin.left - margin.right;
const height = 640 - margin.top - margin.bottom;

class Banyan1 extends Component {

    componentDidMount() {
        const fontColour = getComputedStyle(document.body).getPropertyValue('--font');
        const histogramBandsColour = getComputedStyle(document.body).getPropertyValue('--histogram-bands');
        const histogramRxTunesColour = getComputedStyle(document.body).getPropertyValue('--histogram-rxTunes');
        const histogramRxPreSelectorColour = getComputedStyle(document.body).getPropertyValue('--histogram-rxPreSelector');
        const histogramAntennaBandsColour = getComputedStyle(document.body).getPropertyValue('--histogram-antennaBands');
        const histogramPaBandsColour = getComputedStyle(document.body).getPropertyValue('--histogram-paBands');
        const histogramTxTunesColour = getComputedStyle(document.body).getPropertyValue('--histogram-txTunes');

        // append the svg object to the body of the page
        const svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var copyOfThis = this;

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
                .value(function(d) { return + d.value; })
                .domain(x.domain())
                .thresholds(x.ticks(NUMBER_OF_BINS));

            // text label for the x axis
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height - 6)
                .style("fill", "rgb(245, 245, 245)")
                .text("Bandwidth (MHz)");
            
            // text label for the y axis
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 6)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .style("fill", "rgb(245, 245, 245)")
                .text("Power (dBm)");

            // And apply twice this function to data to get the bins.
            console.log(data);

            copyOfThis.drawRects("bands", "rect1", histogram, data, svg, x, y, histogramBandsColour)
            copyOfThis.drawRects("rxTunes", "rect2", histogram, data, svg, x, y, histogramRxTunesColour);
            copyOfThis.drawRects("rxPreSelectors", "rect3", histogram, data, svg, x, y, histogramRxPreSelectorColour);
            copyOfThis.drawRects("antennaBands", "rect4", histogram, data, svg, x, y, histogramAntennaBandsColour);
            copyOfThis.drawRects("paBands", "rect5", histogram, data, svg, x, y, histogramPaBandsColour);
            copyOfThis.drawRects("txTunes", "rect6", histogram, data, svg, x, y, histogramTxTunesColour);

            // Handmade legend
            svg.append("circle").attr("cx", width-100).attr("cy",25).attr("r", 6).style("fill", histogramBandsColour);
            svg.append("circle").attr("cx", width-100).attr("cy",55).attr("r", 6).style("fill", histogramRxTunesColour);
            svg.append("circle").attr("cx", width-100).attr("cy",85).attr("r", 6).style("fill", histogramRxPreSelectorColour);
            svg.append("circle").attr("cx", width-100).attr("cy",115).attr("r", 6).style("fill", histogramAntennaBandsColour);
            svg.append("circle").attr("cx", width-100).attr("cy",145).attr("r", 6).style("fill", histogramPaBandsColour);
            svg.append("circle").attr("cx", width-100).attr("cy",175).attr("r", 6).style("fill", histogramTxTunesColour);

            svg.append("text").attr("x", width-80).attr("y", 30).text("Bands").style("font-size", "15px").attr("fill", histogramBandsColour).attr("alignment-baseline","middle");
            svg.append("text").attr("x", width-80).attr("y", 60).text("Rx Tunes").style("font-size", "15px").attr("fill", histogramRxTunesColour).attr("alignment-baseline","middle");
            svg.append("text").attr("x", width-80).attr("y", 90).text("Rx Pre Selectors").style("font-size", "15px").attr("fill", histogramRxPreSelectorColour).attr("alignment-baseline","middle");
            svg.append("text").attr("x", width-80).attr("y", 120).text("Antenna Bands").style("font-size", "15px").attr("fill", histogramAntennaBandsColour).attr("alignment-baseline","middle");
            svg.append("text").attr("x", width-80).attr("y", 150).text("PA Bands").style("font-size", "15px").attr("fill", histogramPaBandsColour).attr("alignment-baseline","middle");
            svg.append("text").attr("x", width-80).attr("y", 180).text("Tx Tunes").style("font-size", "15px").attr("fill", histogramTxTunesColour).attr("alignment-baseline","middle");

        });
    }

    drawRects(measurement, name, histogram, data, svg, x, y, rectColour) {
        const histogramOfMeasurement = histogram(data.filter( d => d.type === measurement ));

        const tooltip = d3.select(".wrapper")
            .append('div')
            .attr("class", "tooltip");

        svg.selectAll(name)
            .data(histogramOfMeasurement)
            .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 1)
                .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + y(d.length) + ")"})
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", rectColour)
                .on("mouseover", function(d) {
                    return tooltip
                        .style("visibility", "visible")
                        .html("<p><strong>" + d[0].type + "</strong></p>" + "<p>Range: <strong>" + d.x0 + "-" + d.x1 + "</strong></p> <p>Occurances: <strong>" + d.length + "</strong></p>");
                })
                .on("mousemove", function() {
                    return tooltip.style("top", (window.event.pageY - 10) + "px").style("left", (window.event.pageX + 10) + "px");
                })
                .on("mouseout", function() {
                    return tooltip.style("visibility", "hidden");
                });

    }

    render() {
        return (
            <div className="wrapper">
                <h1 className="title">Banyan 1</h1>
                <div className="graph"></div>
                <h5 className="description">Banyan - an engineering tool to generate a mission data fill for a Corvus platform.</h5>
            </div>
        )
    }

}

export default Banyan1