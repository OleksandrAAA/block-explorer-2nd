
require('babel-polyfill');
const { rpc } = require('../lib/cron');
const TX = require('../model/tx');
const UTXO = require('../model/utxo');
const STXO = require('../model/stxo');

function hexToString(hexx) {
  var hex = hexx.toString()//force conversion
  var str = ''
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

/**
 * Process the inputs for the tx.
 * @param {Object} rpctx The rpc tx object.
 */
async function vin(rpctx, blockHeight) {
  // Setup the input list for the transaction.
  const txin = [];
  if (rpctx.vin) {
    let stxo = [];
    const txIds = new Set();
    for (const vin of rpctx.vin) {
      let isZcSpend = false
      if (vin.scriptSig){
        isZcSpend = vin.scriptSig.asm === "OP_ZEROCOINSPEND"
      }
      let connectedTx = await TX.findOne({txId: vin.txid})
      if (connectedTx) {
        var from = {
          blockHeight,
          address: connectedTx.vout[vin.vout].address,
          n: vin.vout,
          value: connectedTx.vout[vin.vout].value,
          tokenTicker: connectedTx.vout[vin.vout].tokenTicker,
          tokenValue: connectedTx.vout[vin.vout].tokenValue,
          tokenId: connectedTx.vout[vin.vout].tokenId,
        }
        stxo.push({
          ...from,
          _id: `${ connectedTx.txId }:${ vin.vout }`,
          txId: rpctx.txid
        })

        txin.push({
          coinbase: vin.coinbase,
          sequence: vin.sequence,
          txId: vin.txid,
          vout: vin.vout,
          address: connectedTx.vout[vin.vout].address,
          value: connectedTx.vout[vin.vout].value,
          isZcSpend: isZcSpend,
          tokenTicker: connectedTx.vout[vin.vout].tokenTicker,
          tokenValue: connectedTx.vout[vin.vout].tokenValue,
          tokenId: connectedTx.vout[vin.vout].tokenId,
        })
      } else {
        txin.push({
          coinbase: vin.coinbase,
          sequence: vin.sequence,
          txId: vin.txid,
          vout: vin.vout,
          isZcSpend: isZcSpend,
        });
      }
      txIds.add(`${ vin.txid }:${ vin.vout }`)
    }

    // Insert spent transactions.
    if (stxo.length !== 0) {
      try {
        await STXO.insertMany(stxo);
      }catch (e) {
        console.log(e)
      }
    }
    // Remove spent transactions.
    if (txIds.size) {
      await UTXO.remove({ _id: { $in: Array.from(txIds) } });
    }
  }
  return txin;
}

/**
 * Process the outputs for the tx.
 * @param {Object} rpctx The rpc tx object.
 * @param {Number} blockHeight The block height for the tx.
 */
async function vout(rpctx, blockHeight) {
  // Setup the outputs for the transaction.
  const txout = [];
  if (rpctx.vout) {
    const utxo = [];

    rpctx.vout.forEach((vout) => {
      var address;
      var tokenName = "";
      var tokenURL ="";
      var tokenDecimalPos = "";
      var tokenOutputType = "";
      var tokenDocHash = "";
      var tokenAuthorities = "";
      if (vout.scriptPubKey.type == 'nulldata') {
        address = vout.scriptPubKey.asm;//"OP_RETURN "+hexToString(vout.scriptPubKey.asm.substring(10))
      }else if (vout.scriptPubKey.type == 'zerocoinmint') {
        address = 'ZERO_COIN_MINT'
      } else if (vout.scriptPubKey.type == 'nonstandard') {
        address = 'NON_STANDARD'
      } else {
        address = vout.scriptPubKey.addresses[0]
      }

      if (typeof(vout.token) != "undefined"){
        tokenName = vout.token.name;
        tokenURL = vout.token.URL;
        tokenDecimalPos = vout.token.decimalPos;
        tokenOutputType = vout.token.outputType;
        tokenDocHash = vout.token.documentHash;
        tokenAuthorities = vout.token.authorities;
      }

      const to = {
        blockHeight,
        address: address,
        n: vout.n,
        value: vout.value,
        tokenTicker: typeof(vout.token) == "undefined" ? "" : vout.token.ticker,
        tokenValue: typeof(vout.token) == "undefined" ? "" : vout.token.value,
        tokenId: typeof(vout.token) == "undefined" ? "" : vout.token.groupIdentifier,
        tokenName: tokenName,
        tokenURL:  tokenURL,
        tokenDecimalPos: tokenDecimalPos,
        tokenOutputType: tokenOutputType,
        tokenDocHash: tokenDocHash,
        tokenAuthorities: tokenAuthorities
      };

      txout.push(to);
      utxo.push({
        ...to,
        _id: `${ rpctx.txid }:${ vout.n }`,
        txId: rpctx.txid
      });
    });

    // Insert unspent transactions.
    if (utxo.length) {
      try {
        await UTXO.insertMany(utxo);
      } catch (e) {
        console.log(e)
      }
    }
  }
  return txout;
}

/**
 * Process a proof of stake block.
 * @param {Object} block The block model object.
 * @param {Object} rpctx The rpc object from the node.
 */
async function addPoS(block, rpctx) {
  // We will ignore the empty PoS txs.
  if (typeof rpctx.vin[0] !== "undefined" && typeof rpctx.vin[0].coinbase != "undefined" && rpctx.vin[0].coinbase && rpctx.vout[0].value === 0)
    return;

  const query = {_id: rpctx.txid};
  const tx = await TX.findOne(query);
  if (!tx) {
    const txin = await vin(rpctx, block.height);
    const txout = await vout(rpctx, block.height);


    await TX.create({
      _id: rpctx.txid,
      blockHash: block.hash,
      blockHeight: block.height,
      createdAt: block.createdAt,
      txId: rpctx.txid,
      version: rpctx.version,
      vin: txin,
      vout: txout
    });
  }
}

/**
 * Handle a proof of work block.
 * @param {Object} block The block model object.
 * @param {Object} rpctx The rpc object from the node.
 */
async function addPoW(block, rpctx) {
  const query = {_id: rpctx.txid};
  const tx = await TX.findOne(query);
  if (!tx){
    const txin = await vin(rpctx, block.height);
    const txout = await vout(rpctx, block.height);

    await TX.create({
      _id: rpctx.txid,
      blockHash: block.hash,
      blockHeight: block.height,
      createdAt: block.createdAt,
      txId: rpctx.txid,
      version: rpctx.version,
      vin: txin,
      vout: txout
    });
  }
}

/**
 * Will process the tx from the node and return.
 * @param {String} tx The transaction hash string.
 */
async function getTX(txhash) {
  const hex = await rpc.call('getrawtransaction', [txhash]);
  return await rpc.call('decoderawtransaction', [hex]);
}

async function getTokenTx(txhash) {
  return await rpc.call('gettokentransaction', [txhash]);
}

module.exports = {
  addPoS,
  addPoW,
  getTX,
  vin,
  vout,
  getTokenTx
};
