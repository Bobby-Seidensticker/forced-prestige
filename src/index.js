var React = require('react');
var ReactDOM = require('react-dom');
var router = require('./router');


function initIndex() {
  document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(React.createElement(router.MainRouter, {}), document.getElementById('main'));
  });
}

module.exports = {
  initIndex : initIndex
};
