/**
 * 
 */


import React, { Component } from 'react'
import * as d3 from "d3";
import d3Tip from 'd3-tip';

// dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// initialise x and y axis's
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var xAxis = d3.axisBottom().ticks(20).scale(x);
var yAxis = d3.axisLeft().scale(y);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class BarChart extends Component {

    componentDidMount() {
        /*
        var tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {  console.log(d); return `<p>$${(d.value)} Billions</p><p>${d.date} - ${months[0]}</p>`; });
        */
       var tooltip = d3.select("body")
            .append('div')
            .attr("class", "tooltip");

        var area = d3.area()
            .x(this.getDate)
            .y0(height) 
            .y1(this.getValue);

        var svg = d3.select(".graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var copyOfThis = this;

        this.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(err, json) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                let dataList = json.data;

                dataList = dataList.map(function(data) {
                  const ret = {};
                  ret.date = copyOfThis.parseDate(data[0]);                  
                  ret.dateStr = data[0];
                  ret.value = +data[1];
                  return ret;
                });
                console.log(dataList);

                x.domain(d3.extent(dataList, function(d) { return d.date; }));
                y.domain([0, d3.max(dataList, function(d) { return d.value; })]);
    
                var area = d3.area()
                    .x(copyOfThis.getDate)
                    .y0(height)
                    .y1(copyOfThis.getValue);
    
                svg.append("path")
                    .datum(dataList)
                    .attr("class", "area")
                    .attr("d", area);
    
                svg.selectAll(".bar")
                    .data(dataList)
                    .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) { return x(d.date); })
                        .attr("width", "4px")
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d) { return height - y(d.value); })
                        .style("fill", "#69b3a2")
                        .on("mouseover", function(d) {
                            var date = new Date(d.date);
                            var year = date.getFullYear();
                            var month = date.getMonth();
                            var gdp = d.value;
                            return tooltip
                                .style("visibility", "visible")
                                .html("<p><strong>$" + gdp + " Billion</strong></p> <p>" + year + ' - ' + months[month] + "</p>");
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
                    .call(xAxis);
    
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(json.name);

                d3.select('.description').text(json.description);
            }
        });
    }

    getValue(d) {
        return y(d.value);
    }

    getDate(d) {
        return x(d.date);
    }

    parseDate(date) {
        return Date.parse(date);
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
                <h1 className="title">Gross Domestic Product</h1>
                <div className="graph"></div>
                <h5 className="description"></h5>
                <h6>
                    <a href="https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-bar-chart">
                        https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-bar-chart
                    </a>
                </h6>
            </div>
        )
    }
}

export default BarChart