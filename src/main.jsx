import React from 'react';
import {View} from './view';
import {Model} from './model';


let STEP_SIZE = 5;


export var MainPage = class extends React.Component {
  constructor(props) {
    super(props);
    this.model = new Model();
    this.t = 0;

    this.state = this.getState();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  getState() {
    let result = {
      t: this.t
    };
    // console.log(`get state, result: ${result.cur}`);
    return result;
  }

  tick(now) {
    // Cap the step so the browser doesn't freeze when you return after being
    // blurred for a while.
    let dt = Math.min(now - this.t, 1000);
    this.t = now;
    let tTemp = dt;

    while (tTemp > STEP_SIZE) {
      this.model.updateModel(STEP_SIZE);
      tTemp -= STEP_SIZE;
    }
    this.model.updateModel(tTemp);

    this.setState(this.getState());

    window.requestAnimationFrame(this.tick.bind(this));
  }
  
  render() {
    return (
      <div>
        <View model={this.model} />
      </div>
    );
  }
}
