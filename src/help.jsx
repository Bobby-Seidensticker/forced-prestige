import React from 'react';


export var HelpPage = class extends React.Component {
  render() {
    return (
      <div>
        Click the origin and then one or more tiles that aren't the origin, then either:
        <ul>
          <li>Click the last node in your path again to gather that tile's resource</li>
          <li>Click the origin again to just go there and back</li>
        </ul>
        <a href='/'>Back</a>
      </div>
    );
  }
}
