import React from 'react';


export var View = class extends React.Component {
  constructor(props) {
    super(props);
    this.c = React.createRef();
  }

  componentDidMount() {
    this.updateView()
  }

  componentDidUpdate() {
    this.updateView()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  updateView() {
    // console.log(`hello from update view, model: ${this.props.model}`);
  }

  render() {
    return <canvas ref={this.c}></canvas>;
  }
};
