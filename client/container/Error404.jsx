
import Component from '../core/Component';
import React from 'react';

export default class Error404 extends Component {
  render() {
    return (
      <div>
        <h1><b>Error 404</b> - Page Not Found</h1>
        <p>The requested page could not be found.</p>
      </div>
    );
  };
}
