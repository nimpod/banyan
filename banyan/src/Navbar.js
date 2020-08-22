import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Route, NavLink, Switch, withRouter } from 'react-router-dom'


class Navbar extends Component {

    /**
     * content rendered to page
     */
    render() {
        return (
            <header className="navbar">
                <ul>
                    <NavLink to='/Example1'><li>Example 1</li></NavLink>
                    <NavLink to='/Example2'><li>Example 2</li></NavLink>
                    <NavLink to='/Example3'><li>Example 3</li></NavLink>
                    <NavLink to='/Example4'><li>Example 4</li></NavLink>
                    <NavLink to='/Example5'><li>Example 5</li></NavLink>
                    <NavLink to='/BarChart'><li>Bar Chart</li></NavLink>
                    <NavLink to='/HeatMap'><li>HeatMap</li></NavLink>
                    <NavLink to='/Histogram1'><li>Histogram 1</li></NavLink>                    
                    <NavLink to='/Histogram2'><li>Histogram 2</li></NavLink>
                    <NavLink to='/Histogram3'><li>Histogram 3</li></NavLink>
                    <NavLink to='/Histogram4'><li>Histogram 4</li></NavLink>
                    <NavLink to='/Histogram5'><li>Histogram 5</li></NavLink>
                    <NavLink to='/Banyan1'><li>Banyan 1</li></NavLink>
                    <NavLink to='/Banyan2'><li>Banyan 2</li></NavLink>
                    <NavLink to='/Banyan3'><li>Banyan 3</li></NavLink>
                </ul>
          </header>
        )
    }

}

export default withRouter(Navbar)
