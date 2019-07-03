import React from 'react';
import {View} from './view';
import {Model} from './model';
import {Controller} from './controller';


let STEP_SIZE = 5;


export var MainPage = class extends React.Component {
  constructor(props) {
    super(props);
    this.model = new Model();
    this.controller = new Controller(this.model);
    this.t = 0;

    this.state = this.getState();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  getState() {
    return {
      t: this.t
    };
  }

  tick(now) {
    // [now] is the time since the first call to RAF
    let dt = Math.min(now - this.t, 1000);
    this.t = now;

    let dtRemaining = dt;
    while (dtRemaining > STEP_SIZE) {
      this.model.updateModel(STEP_SIZE);
      dtRemaining -= STEP_SIZE;
    }
    this.model.updateModel(dtRemaining);

    this.setState(this.getState());

    window.requestAnimationFrame(this.tick.bind(this));
  }
  
  render() {
    return (
      <div>
        <View model={this.model} controller={this.controller} t={this.state.t} />
      </div>
    );
  }
}
