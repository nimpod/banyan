/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/banyan.csv";

import csv_antennaBands from "./histogramDatasets/banyan/antennaBands.csv";
import csv_bands from "./histogramDatasets/banyan/bands.csv";
import csv_paBands from "./histogramDatasets/banyan/paBands.csv";
import csv_rxPreSelectors from "./histogramDatasets/banyan/rxPreSelectors.csv";
import csv_rxTunes from "./histogramDatasets/banyan/rxTunes.csv";
import csv_txTunes from "./histogramDatasets/banyan/txTunes.csv";

import CustomSlider from './components/CustomSlider.js';
import CustomCheckbox from './components/CustomCheckbox.js';


// dimensions
const NUMBER_OF_BINS = 20;
const MAX_X_COORD = 6000;
const MAX_Y_COORD = 7;
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 1200 - margin.left - margin.right;
const height = 540 - margin.top - margin.bottom;


// get colour variables from index.css
const fontColour = getComputedStyle(document.body).getPropertyValue('--font');
const colour_bands = getComputedStyle(document.body).getPropertyValue('--histogram-bands');
const colour_rxTunes = getComputedStyle(document.body).getPropertyValue('--histogram-rxTunes');
const colour_rxPreSelectors = getComputedStyle(document.body).getPropertyValue('--histogram-rxPreSelectors');
const colour_antennaBands = getComputedStyle(document.body).getPropertyValue('--histogram-antennaBands');
const colour_paBands = getComputedStyle(document.body).getPropertyValue('--histogram-paBands');
const colour_txTunes = getComputedStyle(document.body).getPropertyValue('--histogram-txTunes');

var DatasetMetainfo = {
    "bands": [
        { name : "bands" },
        { rectName : "rect1" },
        { csvFile : csv_bands },
        { colour : colour_bands }
    ],
    "rxTunes": [
        { name : "rxTunes" },
        { rectName : "rect2" },
        { csvFile : csv_rxTunes },
        { colour : colour_rxTunes }
    ],
    "rxPreSelectors": [
        { name : "rxPreSelectors" },
        { rectName : "rect3" },
        { csvFile : csv_rxPreSelectors },
        { colour : colour_rxPreSelectors }
    ],
    "antennaBands": [
        { name : "antennaBands" },
        { rectName : "rect4" },
        { csvFile : csv_antennaBands },
        { colour : colour_antennaBands }
    ],
    "paBands": [
        { name : "paBands" },
        { rectName : "rect5" },
        { csvFile : csv_paBands },
        { colour : colour_paBands }
    ],
    "txTunes": [
        { name : "txTunes" },
        { rectName : "rect6" },
        { csvFile : csv_txTunes },
        { colour : colour_txTunes }
    ]
};

class Banyan1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasFirstHistogramBeenDrawn: false
        }
    }

    componentDidMount() {
        // append the svg object to the body of the page
        var svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var copyOfThis = this;

        for (let d in DatasetMetainfo) {
            this.drawDataset(svg, DatasetMetainfo[d], copyOfThis);
        }
    }

    drawDataset(svg, dataset, copyOfThis) {
        let name = dataset[0].name;
        let rectName = dataset[1].rectName;
        let csvFile = dataset[2].csvFile;
        let colour = dataset[3].colour;
        console.log(name, rectName, csvFile, colour);

        d3.csv(csvFile).then(function(bins) {
            console.log(bins);

            // Coerce types.
            bins.forEach(function(bin) {
                bin.bandwidth = +bin.bandwidth;
                bin.power = +bin.power;
            });
            
            // Normalize each bin to so that height = quantity/width; see http://en.wikipedia.org/wiki/Histogram#Examples
            for (var i=1, n=bins.length, bin; i < n; i++) {
                bin = bins[i];
                bin.offset = bins[i-1].bandwidth;
                bin.width = bin.bandwidth - bin.offset;
                bin.height = bin.power;
                // bin.height = bin.power / bin.width;
            }

            // Drop the first bin, since it's incorporated into the next.
            bins.shift();

            var x = d3.scaleLinear()
                .domain([0, 6000])
                .range([0, width]);

            var y = d3.scaleLinear()
                .domain([0, 7])
                .range([height, 0]);
            
            // only draw the x-axis and y-axis once, at the begining when it doesn't exist
            if (!copyOfThis.state.hasFirstHistogramBeenDrawn) {
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                svg.append("g")
                    .call(d3.axisLeft(y));

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

                copyOfThis.setState({hasFirstHistogramBeenDrawn: true});
            }

            const tooltip = d3.select(".wrapper")
                .append('div')
                .attr("class", "tooltip");

            // Add the bins.
            svg.selectAll(".bin")
            .data(bins)
            .enter()
                .append("rect")
                .attr('class', "bar " + name)
                .attr("x", function(d) { return x(d.offset); })
                .attr("width", function(d) { return x(d.width) - 1; })
                .attr("y", function(d) { return y(d.height); })
                .attr("height", function(d) { return height - y(d.height); })
                .style("fill", "rgba(255,255,255,0.1)")
                .style("stroke", colour)
                .style("display", "block")
                .attr('stroke-dasharray', '10,5')
                .attr('stroke-linecap', 'butt')
                .attr('stroke-width', '1')
                .on("mouseover", function(d) {
                    console.log(d);
                    return tooltip
                        .style("visibility", "visible")
                        .html("<p>Bandwidth: <strong>" + d.bandwidth + " MHz</strong></p> <p>Power: <strong>" + d.power + " dBm</strong></p>");
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
                <h1 className="title">Banyan 2</h1>
                <div className="graph"></div>
                <div className="controls">
                    <div className="control control-txTunes">
                        <CustomCheckbox title="txTunes" description="Tx Tunes (DAC Frequency)" isChecked="false" color={colour_txTunes} />
                        <CustomSlider title="txTunes" min="10" max="2000" start="360" end="1500" />
                    </div>
                    <div className="control control-bands">
                        <CustomCheckbox title="bands" description="Bands" isChecked="true" color={colour_bands} />
                    </div>
                    <div className="control control-rxTunes">
                        <CustomCheckbox title="rxTunes" description="Rx Tunes" isChecked="true" color={colour_rxTunes} />
                    </div>
                    <div className="control control-rxPreSelectors">
                        <CustomCheckbox title="rxPreSelectors" description="Rx Pre Selectors" isChecked="true" color={colour_rxPreSelectors} />
                    </div>
                    <div className="control control-antennaBands">
                        <CustomCheckbox title="antennaBands" description="Antenna Bands" isChecked="true" color={colour_antennaBands} />
                    </div>
                    <div className="control control-paBands">
                        <CustomCheckbox title="paBands" description="PA Bands" isChecked="true" color={colour_paBands} />
                    </div>
                </div>
                <h5 className="description"></h5>
            </div>
        )
    }

}

export default Banyan1