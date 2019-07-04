import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import {AboutPage} from './about';
import {HelpPage} from './help';
import {MainPage} from './main';

var Router = BrowserRouter;

var NotFound = class extends React.Component {
  render() {
    return (
      <div className='error'>
        <h2 className='title'>404</h2>
        <img src='http://i0.kym-cdn.com/photos/images/facebook/000/993/875/084.png' />
      </div>
    );
  }
}

export const MainRouter = () => (
  <Router>
    <Switch>
      <Route exact path='/' component={MainPage} />
      <Route exact path='/about' component={AboutPage} />
      <Route exact path='/help' component={HelpPage} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);
