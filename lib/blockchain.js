
const params = {
  LAST_POW_BLOCK: 1000,
  DGW_START_HEIGHT:550000, //Zerocoin start height, starts together with DGW
};

const avgBlockTime = 60; // 1 minutes (60 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 960

const blocksPerWeek = blocksPerDay * 7; // 6720

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 29220

const blocksPerYear = blocksPerDay * 365.25; // 350640

const mncoins = 20000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};

const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let ret = 0.0;

  let mNodeCoins = nMasternodeCount * mncoins;

  // if (Params().NetworkID() == CBaseChainParams::TESTNET) {
  //   if (nHeight < 200)
  //     return 0;
  // }

  if (nHeight >= 0 && nHeight <= params.LAST_POW_BLOCK) {
    ret = 0;
  } else if (nHeight > params.LAST_POW_BLOCK) {
    if (mNodeCoins === 0) {
      ret = 0;
    } else if (nHeight < params.DGW_START_HEIGHT) {
      ret = blockValue * .50;
    } else if (nHeight >= params.DGW_START_HEIGHT) {
      ret = blockValue * .50;
    }
  }

  return ret;
};

const getSubsidy = (nHeight = 1) => {
  let nSubsidy = 64 * 100000000;

  if (nHeight === 0)
    return 47786667 * 100000000;

  return nSubsidy;
};

const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * subsidy) / mncoins) * 100.0;
};

const isAddress = (s) => {
  return typeof(s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof(s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof(s) === 'string' && s.length === 64;
};

const isTokenTransaction = (rpctx) => {
  var is_token_tranaction = false;
  for (const vin of rpctx.vin) {
    if (vin.token !== undefined){
      is_token_tranaction = true;
    }
  }

  for (const vout of rpctx.vout){
    if (vout.token !== undefined){
      is_token_tranaction = true;
    }
  }
  return is_token_tranaction;
};

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getSubsidy,
  getROI,
  isAddress,
  isBlock,
  isTokenTransaction,
  isPoS,
  isTX
};
