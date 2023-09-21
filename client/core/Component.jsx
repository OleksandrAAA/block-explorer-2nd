
import React from 'react';

import ErrorBlock from '../component/ErrorBlock';
import Loading from '../component/Loading';

export default class Component extends React.Component {
  /**
   * Format network hash power a second into:
   *  - TH
   *  - GH
   *  - MH
   *  - kH
   */
  formatNetHash = (hash) => {
    const labels = ['H', 'kH', 'MH', 'GH', 'TH'];
    let idx = 0;
    while (hash > 1000) {
      hash = hash / 1000;
      idx++;
    }

    return { hash, label: labels[idx] };
  };

  formatNumberWithAbbreviation = (number) => {
    if (isNaN(number)) return '0';
  
    if (number >= 1e9) {
      return (number / 1e9).toFixed(2) + ' B';
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(2) + ' M';
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(2) + ' K';
    } else {
      return number.toFixed(2);
    }
  };

  /**
   * Generate a random string.
   */
  randomString = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  /**
   * Render the provided error for the component.
   */
  renderError = (err) => (<ErrorBlock error={ err } />);

  /**
   * Render the loading indicator.
   */
  renderLoading = () => (<Loading />);
}
