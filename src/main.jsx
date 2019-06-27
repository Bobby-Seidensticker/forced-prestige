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
    let dt = now - this.cur;
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
