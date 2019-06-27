import React from 'react';
import {View} from './view';
import {Model} from './model';


let STEP_SIZE = 16;


export var MainPage = class extends React.Component {
  constructor(props) {
    super(props);
    this.model = new Model();
    this.cur = Date.now();

    this.state = this.getState();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  getState() {
    let result = {
      cur: this.cur
    };
    // console.log(`get state, result: ${result.cur}`);
    return result;
  }

  tick(now) {
    // Cap the step so the browser doesn't freeze when you return after being
    // blurred for a while.
    let dt = Math.min(now - this.cur, 1000);
    this.cur = now;
    let t = dt;

    while (t > STEP_SIZE) {
      this.model.updateModel(STEP_SIZE);
      t -= STEP_SIZE;
    }
    this.model.updateModel(t);

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
