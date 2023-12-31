
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import { date24Format, calculateTimeDifference } from '../../lib/date';
import { Link } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalRule from '../component/HorizontalRule';
import Table from '../component/Table';

class Overview extends Component {
  static propTypes = {
    txs: PropTypes.array.isRequired,
    setData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      cols: [
        {title: 'Height', key: 'blockHeight'},
        {title: 'Transaction Hash', key: 'txId'},
        {title: 'Value', key: 'vout'},
        'age',
        'recipients',
        {title: 'Timestamp', key: 'createdAt'},
      ]
    };
  };

  componentDidMount(){
      this.props.setData();
  }

  render() {
    // Setup the list of transactions with age since created.
    const txs = this.props.txs.map(tx => {
      const createdAt = moment(tx.createdAt).utc();
      const diffSeconds = moment().utc().diff(createdAt, 'seconds');
      let blockValue = 0.0;
      if (tx.vout && tx.vout.length) {
        tx.vout.forEach(vout => blockValue += vout.value);
      }

      return ({
        ...tx,
        age: diffSeconds < 60 ? `${ diffSeconds } seconds` : calculateTimeDifference(createdAt),
        blockHeight: (<Link to={ `/block/${ tx.blockHeight }` }>{ tx.blockHeight }</Link>),
        createdAt: date24Format(tx.createdAt),
        recipients: tx.vout.length,
        txId: (<Link to={ `/tx/${ tx.txId }` }>{ tx.txId }</Link>),
        vout: numeral(blockValue).format('0,0.0000')
      });
    });
    
    let props = this.props;
    return (
      <div>
        <HorizontalRule title="Latest Blocks" />
        <Table
          cols={ this.state.cols }
          data={ txs } />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  setData: data => Actions.setData(dispatch, data)
});

const mapState = state => ({
  txs: state.txs,
  data: state.data
});

export default connect(mapState, mapDispatch)(Overview);
