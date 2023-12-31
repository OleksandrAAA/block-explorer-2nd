
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../component/Icon';

import CardMarket from '../component/Card/CardMarket';
import CardNetworkSummary from '../component/Card/CardNetworkSummary';
import CardStatus from '../component/Card/CardStatus';
import WatchList from '../component/WatchList';

class CoinSummary extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    searches: PropTypes.array.isRequired,
    // State
    coins: PropTypes.array.isRequired,
    txs: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  };

  render() {
    const coin = this.props.coins && this.props.coins.length
      ? this.props.coins[0]
      : { diff: 0, netHash: 0 };

    const height = this.props.txs.length
      ? this.props.txs[0].blockHeight
      : coin.blocks;

    const watchlist = height >= 182700
      ? this.props.searches
      : this.props.searches.slice(0, 7);
    let props = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-12 col-lg-9">
            <div className="row">
              <div className="col-md-12 col-lg-6">
                <CardStatus
                  avgBlockTime={ coin.avgBlockTime?coin.avgBlockTime:0 }
                  avgMNTime={ coin.avgMNTime?coin.avgMNTime:0 }
                  blocks={ height }
                  peers={ coin.peers }
                  status={ coin.status }
                  supply={ coin.supply } 
                  marketcap={ coin.supply * coin.usd }
                  diff={ coin.diff } />
              </div>
              <div className="col-md-12 col-lg-6">
                <CardMarket
                  btc={ coin.btc }
                  usd={ coin.usd }
                  xAxis={ this.props.coins.map(c => c.createdAt) }
                  yAxis={ this.props.coins.map(c => c.usd ? c.usd : 0.0) } />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-3">
            <WatchList
              items={ watchlist }
              onSearch={ this.props.onSearch }
              onRemove={ this.props.onRemove } />
          </div>
        </div>
      </div>
    );
  };
}

const mapState = state => ({
  coins: state.coins,
  txs: state.txs,
  data: state.data
});

export default connect(mapState)(CoinSummary);
