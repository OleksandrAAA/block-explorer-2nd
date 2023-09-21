
import Component from '../../core/Component';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';
import CountUp from '../CountUp';

export default class CardStatus extends Component {
  static defaultProps = {
    avgBlockTime: 90,
    avgMNTime: 24,
    blocks: 0,
    peers: 0,
    status: 'Offline',
    supply: 0,
    diff: 0,
    marketcap:0,
  };

  static propTypes = {
    avgBlockTime: PropTypes.number.isRequired,
    avgMNTime: PropTypes.number.isRequired,
    blocks: PropTypes.number.isRequired,
    peers: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    supply: PropTypes.number.isRequired,
    diff: PropTypes.number.isRequired,
    marketcap: PropTypes.number.isRequired
  };

  render() {
    const isOn = this.props.status === 'Online';

    return (
      <div className="animated fadeInUp">
      <Card title="Status" className="card--status" >
        <div className="card__row">
          <span className="card__label">Block Height:</span>
          <span className="card__result">
            <Link to={ `/block/${ this.props.blocks }` }>
              <b>
                <CountUp
                  decimals={ 0 }
                  duration={ 1 }
                  end={ this.props.blocks }
                  start={ 0 } />
              </b>
            </Link>
          </span>
        </div>
        <div className="card__row">
          <span className="card__label">Coin Supply <span class="small fw-normal">(CHESS)</span>:</span>
          <span className="card__result">
              <b>
                <CountUp
                  decimals={ 0 }
                  duration={ 1 }
                  separator=","
                  end={ this.props.supply }
                  start={ 0 } />
              </b>
          </span>
        </div>
        <div className="card__row">
          <span className="card__label">Market Cap:</span>
          <span className="card__result">
            <b> ${this.formatNumberWithAbbreviation(this.props.marketcap)} </b>
          </span>
        </div>
        <div className="card__row">
          <span className="card__label">Known Peers:</span>
          <span className="card__result">
            <Link to="/peer">{ this.props.peers }</Link>
          </span>
        </div>
        <div className="card__row">
          <span className="card__label">Difficulty:</span>
          <span className="card__result">
            <CountUp
                decimals={ 4 }
                duration={ 1 }
                end={ this.props.diff }
                start={ 0 } />
          </span>
        </div>
      </Card>
      </div>
    );
  };
}
