/**
 * 
 */


import React, { Component } from 'react'
import * as d3 from "d3";
import d3Tip from 'd3-tip';
import * as d3Scale from 'd3-scale';
import { variance } from 'd3';

// dimensions
const margin = { top: 30, right: 90, bottom: 100, left: 90 };
const width = 1100 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

// initialise x and y axis's
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([0, height]);
var xAxis = d3.axisBottom().ticks(20).scale(x);
var yAxis = d3.axisLeft().scale(y).tickFormat((d) => {return months[d-1]});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = ['#5E4FA2', '#41799C', '#62A08D', '#9CB598','#C8CEAD', '#E6E6BA', '#E8D499','#E2B07F', '#E67F5F', '#C55562', '#A53A66'];

class BarChart extends Component {

    componentDidMount() {
        var tooltip = d3.select("body")
            .append('div')
            .attr("class", "tooltip");

        // prepare to place the heat map on screen
        const svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var copyOfThis = this;

        this.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(err, json) {
            let dataList = json.monthlyVariance;
            
            x.domain([d3.min(dataList, copyOfThis.getYear), d3.max(dataList, copyOfThis.getYear)]);
            y.domain([d3.min(dataList, copyOfThis.getMonth) - 0.5, d3.max(dataList, copyOfThis.getMonth) + 0.5]);

            var colorScale = d3Scale
                .scaleQuantile()
                .domain(
                    [json.baseTemperature + d3.min(dataList, function (d) { return d.variance; }),
                    json.baseTemperature + d3.max(dataList, function (d) { return d.variance; })]
                )
                .range(colors);
            
            // iterate over each 'bit' of data i.e. each hoverable rectangle
            svg.selectAll(".rect")
                .data(dataList)
                .enter()
                    .append("rect")
                    .attr("class", "rect")
                    .attr("width", 4)
                    .attr("height", 35)
                    .attr("x", function(d) { return x(d.year); })
                    .attr("y", function(d) { return y(d.month) - 18; })
                    .attr("fill", function(d) { return colorScale(Math.round((d.variance + json.baseTemperature)*1000)/1000); })
                    .on("mouseover", function(d) {
                        var year = d.year;
                        var date = months[d.month-1];
                        var avgTemp = Math.round((d.variance + json.baseTemperature)*1000/1000);
                        var variance = d.variance;
                        return tooltip
                            .style("visibility", "visible")
                            .html("<p><strong>" + year + " - " + date + "</strong></p> <p><strong>" + avgTemp + "ºC</strong></p><p><strong>" + variance + "</strong></p>");
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (window.event.pageY - 10) + "px").style("left", (window.event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("y", 35)
                .attr("x", width/4)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .style("font-size", "2.1em")
                .text("Years");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -80)
                .attr("x", -height/2)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .style("font-size", "2.1em")
                .text("Months");
            
            // the legend at bottom right
            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; });

            legend.enter()
                .append("g")
                .attr("class", "legend");
            
            legend.append("rect")
                .attr("x", function(d, i) { return (33/2) - 20 + 40 * i; })
                .attr("y", 32)
                .attr("width", 40)
                .attr("height", 15)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return (Math.round(d*10)/10).toFixed(1); })
                .attr("x", function(d, i) { return  (width/2) - 20 + 40 * i; })
                .attr("y", height + 62)
                .attr("fill", "#cdcdcd");
        });
    }

    getYear(d) {
        return d.year;
    }

    getMonth(d) {
        return d.month;
    }

    getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status === 200) {
            callback(null, xhr.response);
          } else {
            callback(status, xhr.response);
          }
        };
        xhr.send();
    };

    render() {
        return(
            <div className="wrapper">
                <h1 className="title">Monthly Global Land-Surface Temperature</h1>
                <h3>1753 - 2015</h3>
                <p>Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.
                Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07</p>
                <div className="graph"></div>
                <h6>
                    <a href="https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-heat-map">
                        https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-heat-map
                    </a>
                </h6>
            </div>
        )
    }
}

export default BarChart