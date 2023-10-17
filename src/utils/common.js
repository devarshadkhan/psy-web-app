import { current } from "@reduxjs/toolkit";
import moment from "moment-timezone";

export const nth = function (d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

/**
 *
 * @param {value type string} value
 * @returns  returns Boolean value that weather given string can be parsed as JSON or not
 */

export function isJSONString(value) {
  try {
    // value = value.replace(/([{,]\s*)([A-Za-z0-9_\-]+)\s*:/g, '$1"$2":');
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 *
 * @param {timeStamp Type Number in unixFormat} timestamp
 * @returns Date value in ISo format type string
 */

export function convertUnixToISOString(timestamp) {
  try {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    if (isNaN(date.getTime())) {
      throw new Error("Invalid Unix timestamp");
    }
    const isoString = date.toISOString();
    return isoString.slice(0, 19); // Remove the milliseconds and timezone offset
  } catch (error) {
    return error.message;
  }
}

/**
 *
 * @param {Type String isotimeStamp} isoString
 * @param {format in which we need the output} formatString
 * @example
 *  if given iso string and we need output in 10:30 AM format
 *  in first arguement  = ISOstring time
 *  in second arguement = HH : mm AM/PM
 *  HH : Hours
 *  mm : Minutes
 *  AM/PM : AM or PM
 *  like this other Keys are
 *  DD : Date
 *  MM : Month in Number
 *  MMMM : Month in String
 *  YY : year in Number
 * @returns string in A pertitular Format from given ISO
 */

export const timeValueConvertion = (time, zoneTime) => {
  console.log(time);
  time = time.replace(" ", "T");
  const utcDateTime = new Date(`${time}Z`);
  const targetTimeZone = "Asia/Kolkata";
  

  const convertedTime = utcDateTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: zoneTime,
  });
  return convertedTime;
};

export function convertToAmericanTime(isoString, formatString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO date format");
    }

    const formatMap = {
      MM: date.getUTCMonth() + 1, // Add 1 to get month number from 1-12
      MMMM: new Intl.DateTimeFormat("en-US", { month: "long" }).format(date),
      DD: date.getUTCDate(),
      YY: date.getUTCFullYear().toString().slice(-2),
      YYYY: date.getUTCFullYear(),
      HH: (date.getUTCHours() % 12 || 12).toString().padStart(2, "0"), // Convert to 12-hour format
      mm: date.getUTCMinutes().toString().padStart(2, "0"), // Pad minutes with leading zero if necessary
      "AM/PM": date.getUTCHours() < 12 ? "AM" : "PM",
      "MMMM DD, YYYY": new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date),
    };

    let formattedTime = formatString;
    Object.keys(formatMap).forEach((key) => {
      formattedTime = formattedTime.replace(key, formatMap[key]);
    });
    return formattedTime;
  } catch (error) {
    return error.message;
  }
}

/**
 *
 * @param {Take unix date as an arguement of function} unixdate
 * @returns date in 13 july 2013, 11:00 AM format with the user timeStamp
 */

export function convertUnixToHumanReadable(unixdate) {
  try {
    let timezone = "Asia/Kolkata";
    if (typeof window !== "undefined") {
      timezone = JSON.parse(localStorage.getItem("userInfo")).timezone;
      if (timezone === "Asia/Calcutta") {
        timezone = "Asia/Kolkata";
      }
    }
    const date = new Date(unixdate * 1000);
    const options = { timeZone: timezone };
    const formattedDate = date.toLocaleString("en-US", options);
    const dateObj = new Date(formattedDate);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = dateObj.getFullYear();
    var month = months[dateObj.getMonth()];
    var day = dateObj.getDate();
    var hour = dateObj.getHours();
    var min = dateObj.getMinutes();
    const formattime = timeConvert(
      addLeadingZero(hour) + ":" + addLeadingZero(min)
    );
    var time = month + " " + day + ", " + year + " " + formattime;
    return time;
  } catch (error) {
    return error.message;
  }
}

/**
 *
 * @param {Take unix date as an arguement of function} unixdate
 * @returns date in 11 Jan 2023 format with the user timeStamp
 */

export function convertUnixToHumanReadableDate(unixdate, timezoneroute) {
  try {
    let timezone = "Asia/Kolkata";
    if (timezoneroute) {
      if (timezoneroute === "Asia/Calcutta") {
        timezone = "Asia/Kolkata";
      }
    } else if (typeof window !== "undefined") {
      timezone = JSON.parse(localStorage.getItem("userInfo"))?.timezone;

      if (timezone === "Asia/Calcutta") {
        timezone = "Asia/Kolkata";
      }
    }
    const date = new Date(unixdate * 1000);
    const options = { timeZone: timezone };
    const formattedDate = date.toLocaleString("en-US", options);
    const dateObj = new Date(formattedDate);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = dateObj.getFullYear();
    var month = months[dateObj.getMonth()];
    var day = dateObj.getDate();
    var time = month + " " + day + ", " + year;
    return time;
  } catch (error) {
    return error.message;
  }
}

/**
 *
 * @param {Take unix date as an arguement of function} unixdate
 * @returns date in 11:30 AM format with the user timeStamp
 */

export function convertUnixToHumanReadableTime(unixdate, timezoneroute) {
  try {
    let timezone = "Asia/Kolkata";
    if (timezoneroute) {
      if (timezoneroute === "Asia/Calcutta") {
        timezone = "Asia/Kolkata";
      }
    } else if (typeof window !== "undefined") {
      timezone = JSON.parse(localStorage.getItem("userInfo"))?.timezone;
      if (timezone === "Asia/Calcutta") {
        timezone = "Asia/Kolkata";
      }
    }
    const date = new Date(unixdate * 1000);
    const options = { timeZone: timezone };
    const formattedDate = date.toLocaleString("en-US", options);
    const dateObj = new Date(formattedDate);
    var hour = dateObj.getHours();
    var min = dateObj.getMinutes();
    const formattime = timeConvert(
      addLeadingZero(hour) + ":" + addLeadingZero(min)
    );
    var time = formattime;
    return time;
  } catch (error) {
    return error.message;
  }
}

/**
 *
 * @param {Type Date Object} time
 * it converts given time from 1:8 AM to 01:08 AM
 * @returns ite returns a formatted string like 09:00 AM
 */

export function timeConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

/**
 *
 * @param {take Date object as an arguement} date
 *
 * @returns faomatted date like 12th June 2023
 */

export const getNthDate = (date) => {
  const dateF = date.getDate();
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][date.getMonth()];
  const year = date.getFullYear();
  return dateF + nth(dateF) + " " + month + " " + year;
};

export function convertTolocalTime(isoString, formatString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO date format");
    }

    const formatMap = {
      MM: date.getMonth() + 1, // Add 1 to get month number from 1-12
      MMMM: new Intl.DateTimeFormat("en-US", { month: "long" }).format(date),
      DD: date.getDate(),
      YY: date.getFullYear().toString().slice(-2),
      YYYY: date.getFullYear(),
      HH: (date.getHours() % 12 || 12).toString().padStart(2, "0"), // Convert to 12-hour format
      mm: date.getMinutes().toString().padStart(2, "0"), // Pad minutes with leading zero if necessary
      "AM/PM": date.getHours() < 12 ? "AM" : "PM",
      "MMMM DD, YYYY": new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date),
    };

    let formattedTime = formatString;
    Object.keys(formatMap).forEach((key) => {
      formattedTime = formattedTime.replace(key, formatMap[key]);
    });

    return formattedTime;
  } catch (error) {
    return error.message;
  }
}

export function convertToCurrentTimeZone(isoString) {
  const utcTimestamp = Date.parse(isoString);
  const unixTimestamp = Math.floor(utcTimestamp / 1000); // Convert milliseconds to seconds
  return unixTimestamp;
}

export const convertToUTCCurrentTimeZone = (localIsoTime) => {
  const localTimestamp = Date.parse(localIsoTime);
  const localOffset = new Date(localTimestamp).getTimezoneOffset() * 60 * 1000; // Get local offset in milliseconds
  const utcTimestamp = localTimestamp + localOffset;
  const unixTimestamp = Math.floor(utcTimestamp / 1000); // Convert milliseconds to seconds
  return unixTimestamp;
};

export const getCurrentUnixTimeGMT = () => {
  const currentTime = new Date(); // Current time in local time zone

  // Get the current time in Unix format (seconds) for GMT/UTC
  const unixTimeGMT = Math.floor(currentTime.getTime() / 1000);

  return unixTimeGMT;
};

export const getTimeDifferenceInMinutes = (unixTime, timeZone) => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix format (seconds)
  const timeDifferenceInMinutes = Math.floor((unixTime - currentTime) / 60);

  return timeDifferenceInMinutes >= 10;
};

export const convertToRelativePastDate = (isoString) => {
  const currentDate = new Date();
  const date = new Date(isoString);

  const diffInMilliseconds = currentDate - date;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let result = "";

  if (diffInDays > 0) {
    if (diffInDays === 1) {
      result = "1 day ago";
    } else {
      result = `${diffInDays} days ago`;
    }
  } else if (diffInHours > 0) {
    if (diffInHours === 1) {
      result = "1 hour ago";
    } else {
      result = `${diffInHours} hours ago`;
    }
  } else if (diffInMinutes > 0) {
    if (diffInMinutes === 1) {
      result = "1 minute ago";
    } else {
      result = `${diffInMinutes} minutes ago`;
    }
  } else if (diffInSeconds > 0) {
    if (diffInSeconds === 1) {
      result = "1 second ago";
    } else {
      result = `${diffInSeconds} seconds ago`;
    }
  } else {
    result = "just now";
  }
  return result;
};

//this function will add 0 before every one digit number as Date convertion gives 1:9 Am
//this will convert it to 01:00 Am
export function addLeadingZero(num) {
  if (parseInt(num) < 10) {
    return "0" + num;
  }
  return num;
}

/**
 *
 * @param {function to be called after time interval} fn
 * @param {delay between the function Call} delay
 * @returns callback
 */

export const _debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export function isCurrentTimeInRange(startTimeUnix, endTimeUnix) {
  const nowUnix = moment().unix();
  const startTimeMinusFiveMinutes = moment
    .unix(startTimeUnix)
    .subtract(5, "minutes")
    .unix();
  return true;
  // Return true if the current time is between 5 minutes before the start time and the end time
  // return nowUnix >= startTimeMinusFiveMinutes && nowUnix <= endTimeUnix;
}

export const getChatTime = function (time, timeZone) {
  const date = new Date(time); // Multiply by 1000 to convert seconds to milliseconds
  const options = {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  };
  const formattedTime = date.toLocaleString("en-US", options);
  return formattedTime;
};

export function hasNonEmptyString(obj) {
  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === "string" &&
      obj[key] !== ""
    ) {
      return true;
    }
  }
  return false;
}

export function capitalizeFirstCharacter(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toLocaleUpperCase();
  });
}
