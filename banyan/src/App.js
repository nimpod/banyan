import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Route, NavLink, Switch } from 'react-router-dom'
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import Home from './Home';
import Navbar from './Navbar';
import Example1 from './Example1';
import Example2 from './Example2';
import Example3 from './Example3';
import Example4 from './Example4';
import Example5 from './Example5';
import BarChart from './BarChart';
import Histogram1 from './Histogram1';
import Histogram2 from './Histogram2';
import Histogram3 from './Histogram3';
import Histogram4 from './Histogram4';
import Histogram5 from './Histogram5';
import HeatMap from './HeatMap';
import Banyan1 from './Banyan1';
import Banyan2 from './Banyan2';
import Banyan3 from './Banyan3';


export default class App extends Component {
  
  toggleNavbar() {
    var navbar = document.getElementsByClassName('navbar')[0];
    if (navbar.classList.contains('open')) {
      navbar.classList.remove('open');
    } else {
      navbar.classList.add('open');
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <button className="toggle-navbar" onClick={this.toggleNavbar} />
            <Navbar />

            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/Example1' component={Example1} />
              <Route path='/Example2' component={Example2} />
              <Route path='/Example3' component={Example3} />
              <Route path='/Example4' component={Example4} />
              <Route path='/Example5' component={Example5} />
              <Route path='/BarChart' component={BarChart} />
              <Route path='/Histogram1' component={Histogram1} />
              <Route path='/Histogram2' component={Histogram2} />
              <Route path='/Histogram3' component={Histogram3} />
              <Route path='/Histogram4' component={Histogram4} />
              <Route path='/Histogram5' component={Histogram5} />
              <Route path='/HeatMap' component={HeatMap} />
              <Route path='/Banyan1' component={Banyan1} />
              <Route path='/Banyan2' component={Banyan2} />
              <Route path='/Banyan3' component={Banyan3} />
            </Switch>
        </div>
      </BrowserRouter>
    );
  }

}