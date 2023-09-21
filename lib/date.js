
/**
 * Date
 *
 * Simple wrapper methods around moment.js.
 */
const moment = require('moment');

/**
 * Return the date as a string in provided format.
 * @param {Date} date The date object to format.
 * @param {String} fmt The moment.js format string.
 */
const dateFormat = (date, fmt = 'YYYY-MM-DD hh:mm:ss') => {
  if (!date) {
    date = new Date();
  }

  return `${ moment(date).utc().format(fmt) } UTC`;
};

const date24Format = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    date = new Date();
  }

  return `${ moment(date).utc().format(fmt) } UTC`;
};

const timeStamp24Format = (timestamp, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return `${ moment(new Date(timestamp * 1000)).utc().format(fmt) } UTC`;
};

const calculateTimeDifference = (givenUtcTime) => {
  const currentTime = new Date();
  const timeDifference = currentTime - givenUtcTime;

  const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
  const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds

  if (hours > 0) {
    if (hours > 1) { 
      if (minutes == 0)
        return `${hours} hours`;

      if (minutes == 1)
        return `${hours} hours ${minutes} minute`;

      return `${hours} hours ${minutes} minutes`;
    }
    else {
      if (minutes == 0)
        return `${hours} hour`;

      if (minutes == 1)
        return `${hours} hour ${minutes} minute`;

      return `${hours} hour ${minutes} minutes`;
    }
  }

  if (minutes == 1)
    return `${minutes} minute`; 

  return `${minutes} minutes`;  
};

module.exports = {
  dateFormat,
  date24Format,
  timeStamp24Format,
  calculateTimeDifference
};
