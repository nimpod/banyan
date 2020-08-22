/**
 * 
 */


import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import * as d3 from "d3";
import histogramDatasetCsv from "./histogramDatasets/banyan.csv";
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
const histogramBandsColour = getComputedStyle(document.body).getPropertyValue('--histogram-bands');
const histogramRxTunesColour = getComputedStyle(document.body).getPropertyValue('--histogram-rxTunes');
const histogramRxPreSelectorsColour = getComputedStyle(document.body).getPropertyValue('--histogram-rxPreSelectors');
const histogramAntennaBandsColour = getComputedStyle(document.body).getPropertyValue('--histogram-antennaBands');
const histogramPaBandsColour = getComputedStyle(document.body).getPropertyValue('--histogram-paBands');
const histogramTxTunesColour = getComputedStyle(document.body).getPropertyValue('--histogram-txTunes');

class Banyan1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sliderHandleLeft: null,
            sliderHandleLeftOffset: null,
            sliderHandleRight: null,
            sliderHandleRightOffset: null,
            sliderRange: null,
            sliderRangeRight: null,
            maxRight: null,
            dragging: false
        }
    }

    componentDidMount() {
        // append the svg object to the body of the page
        const svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var copyOfThis = this;

        d3.csv(histogramDatasetCsv).then(function(data) {
            console.log(data);

            // initialise x-axis, and draw it
            const x = d3.scaleLinear()
                .domain([0, MAX_X_COORD])
                .range([0, width]);
            
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // initialise y-axis, and draw it
            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, MAX_Y_COORD]);

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

            // draw the rectangles for each measurement
            copyOfThis.drawRects("bands", "rect1", histogram, data, svg, x, y, histogramBandsColour)
            copyOfThis.drawRects("rxTunes", "rect2", histogram, data, svg, x, y, histogramRxTunesColour);
            copyOfThis.drawRects("rxPreSelectors", "rect3", histogram, data, svg, x, y, histogramRxPreSelectorsColour);
            copyOfThis.drawRects("antennaBands", "rect4", histogram, data, svg, x, y, histogramAntennaBandsColour);
            copyOfThis.drawRects("paBands", "rect5", histogram, data, svg, x, y, histogramPaBandsColour);
            copyOfThis.drawRects("txTunes", "rect6", histogram, data, svg, x, y, histogramTxTunesColour);
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
                .attr('class', "bar " + measurement)
                .attr("x", 1)
                .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + y(d.length) + ")"})
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "rgba(255,255,255,0.1)")
                .style("stroke", rectColour)
                .style("display", "block")
                .attr('stroke-dasharray', '10,5')
                .attr('stroke-linecap', 'butt')
                .attr('stroke-width', '1')
                .on("mouseover", function(d) {
                    return tooltip
                        .style("visibility", "visible")
                        .html("<p><strong>" + d[0].type + "</strong></p>" + "<p>Range: <strong>" + d.x0 + "-" + d.x1 + "MHz</strong></p> <p>Power: <strong>" + d.length + "dBm</strong></p>");
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
                <h1 className="title">Banyan 2</h1>
                <div className="graph"></div>
                <div className="controls">
                    <div className="control control-txTunes">
                        <CustomCheckbox title="txTunes" description="Tx Tunes (DAC Frequency)" isChecked="false" color={histogramTxTunesColour} />
                    </div>
                    <div className="control control-bands">
                        <CustomCheckbox title="bands" description="Bands" isChecked="true" color={histogramBandsColour} />
                    </div>
                    <div className="control control-rxTunes">
                        <CustomCheckbox title="rxTunes" description="Rx Tunes" isChecked="true" color={histogramRxTunesColour} />
                    </div>
                    <div className="control control-rxPreSelectors">
                        <CustomCheckbox title="rxPreSelectors" description="Rx Pre Selectors" isChecked="true" color={histogramRxPreSelectorsColour} />
                    </div>
                    <div className="control control-antennaBands">
                        <CustomCheckbox title="antennaBands" description="Antenna Bands" isChecked="true" color={histogramAntennaBandsColour} />
                    </div>
                    <div className="control control-paBands">
                        <CustomCheckbox title="paBands" description="PA Bands" isChecked="true" color={histogramPaBandsColour} />
                    </div>
                    {/*}
                    <div className="control control-txTunes">
                        <CustomCheckbox title="Tx Tunes (DAC Frequency)" isChecked="true" />
                        <CustomSliderRange min="0" max="6000" start="480" end="1680" />
                    </div>
                    <div className="control control-bands">
                        <CustomCheckbox title="Band Frequency" isChecked="true" />
                        <CustomSliderRange range="160" min="0" max="6000" lowerQuartile="0" upperQuartile="160" />
                    </div>
                    <div className="control control-rxTunes">
                        <CustomCheckbox title="Rx Tunes" isChecked="true" />
                        <CustomSliderRange range="160" min="0" max="6000" lowerQuartile="1000" upperQuartile="1160" />
                    </div>
                    */}
                </div>
                <h5 className="description">Banyan - an engineering tool to generate a mission data fill for a Corvus platform.</h5>
            </div>
        )
    }

}

export default Banyan1