
require('babel-polyfill');
const config = require('../config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const locker = require('../lib/locker');
const moment = require('moment');
// Models.
const Coin = require('../model/coin');

/**
 * Get the coin related information including things
 * like price coinmarketcap.com data.
 */
async function syncCoin() {
  const date = moment().utc().startOf('minute').toDate();
  const url = "https://api.coingecko.com/api/v3/coins/chesscoin-0-32?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false";
  const info = await rpc.call('getinfo');
  //const nethashps = await rpc.call('getnetworkhashps');

  let market = await fetch(url);
  if (market && market.market_data) {    
    market = market['market_data'];
  }

  const coin = new Coin({
    cap: 0,
    createdAt: date,
    blocks: info.blocks,
    btc: market.current_price.btc,
    diff: info['difficulty']['proof-of-stake'],
    mnsOff: 0,
    mnsOn: 0,
    //netHash: nethashps? nethashps : 0,
    netHash: info['networkhashps'],
    peers: info.connections,
    status: 'Online',
    supply: market.total_supply,
    usd: market.current_price.usd
  });

  await coin.save();
}

/**
 * Handle locking.
 */
async function update() {
  const type = 'coin';
  let code = 0;

  try {
    locker.lock(type);
    await syncCoin();
  } catch(err) {
    console.log(err);
    code = 1;
  } finally {
    try {
      locker.unlock(type);
    } catch(err) {
      console.log(err);
      code = 1;
    }
    exit(code);
  }
}

update();
