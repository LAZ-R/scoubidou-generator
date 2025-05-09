
/* ######################################################################### */
/* --------------------------------- MATHS --------------------------------- */
/* ######################################################################### */

export const getRandomIntegerBetween = (min, max) => {
  return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
}

export const getRoundedPercentage = (part, total) => {
  let num = (part / total) * 100;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const getNumberVariation = (n, percentage = 10) => {
  let variabilityFactor = percentage / 100;
  let factor = (Math.random() * (2 * variabilityFactor)) - variabilityFactor;
  return n + (n * factor);
}

export const roundToDecimals = (num, decimals = 0) => {
  var p = Math.pow(10, decimals);
  var n = (Number(num) * p) * (1 + Number.EPSILON);
  return Math.round(n) / p;
}

/* ######################################################################### */
/* -------------------------------- STRINGS -------------------------------- */
/* ######################################################################### */

export const formatNumberWithSpaces = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/* ######################################################################### */
/* ---------------------------------- DOM ---------------------------------- */
/* ######################################################################### */

export const setHTMLTitle = (pageTitle) => {
  document.getElementById('title').innerHTML = pageTitle;
  document.getElementById('appleTitle').setAttribute('content', pageTitle);
}

export const setFavicon = (iconSrc) => {
  document.getElementById('favicon').setAttribute('href', `${iconSrc}`);
}

/* ######################################################################### */
/* -------------------------------- COLORS --------------------------------- */
/* ######################################################################### */

export const getRandomHexColor = () => {
  // Génère un nombre aléatoire entre 0 et 16777215 (0xFFFFFF en hexadécimal)
  let randomColor = Math.floor(Math.random() * 16777215);
  
  // Convertit le nombre en une chaîne hexadécimale, et y ajoute un #
  return `#${randomColor.toString(16).padStart(6, '0')}`;
}

export const bpmToMillisecondsPerBeat = (bpm) => {
  // Convertir le BPM en millisecondes par battement
  let millisecondsPerBeat = (60 * 1000) / bpm;
  return millisecondsPerBeat;
}


export const convertTimeToMilliseconds = (hours = 0, minutes = 0, seconds = 0, milliseconds = 0) => {
  return (
    (hours * 60 * 60 * 1000) +
    (minutes * 60 * 1000) +
    (seconds * 1000) +
    milliseconds
  );
}

export const convertMillisecondsToTime = (milliseconds) => {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  milliseconds %= (60 * 60 * 1000);

  const minutes = Math.floor(milliseconds / (60 * 1000));
  milliseconds %= (60 * 1000);

  const seconds = Math.floor(milliseconds / 1000);
  milliseconds %= 1000;

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds
  };
}

export const getCompactTimeString = (hours = 0, minutes = 0, seconds = 0, milliseconds = 0) => {
  const hoursStr = `${hours == 0 ? '' : `${hours}h`}`;
  const minutesStr = `${minutes == 0 ? '' : `${minutes}m`}`;
  const secondsStr = `${seconds == 0 ? '' : `${seconds}s`}`;
  const millisecondsStr = `${milliseconds == 0 ? '' : `${milliseconds}ms`}`;
  return `${hoursStr} ${minutesStr} ${secondsStr} ${millisecondsStr}`;
}

export const getFullTimeString = (hours = 0, minutes = 0, seconds = 0, milliseconds = 0) => {
  const hoursStr = `${hours == 0 ? '00' : hours < 10 ? `0${hours}` : hours}h`;
  const minutesStr = `${minutes == 0 ? '00' : minutes < 10 ? `0${minutes}` : minutes}m`;
  const secondsStr = `${seconds == 0 ? '00' : seconds < 10 ? `0${seconds}` : seconds}s`;
  const millisecondsStr = `${milliseconds == 0 ? '000' : milliseconds < 10 ? `00${milliseconds}` : milliseconds < 100 ? `0${milliseconds}` : milliseconds}ms`;
  return `${hoursStr} ${minutesStr} ${secondsStr} ${millisecondsStr}`;
}

export const getFullTimeStringFromMilliseconds = (milliseconds = 0) => {
  let timeObj = convertMillisecondsToTime(milliseconds);
  const hoursStr = `${timeObj.hours == 0 ? '00' : timeObj.hours < 10 ? `0${timeObj.hours}` : timeObj.hours}h`;
  const minutesStr = `${timeObj.minutes == 0 ? '00' : timeObj.minutes < 10 ? `0${timeObj.minutes}` : timeObj.minutes}m`;
  const secondsStr = `${timeObj.seconds == 0 ? '00' : timeObj.seconds < 10 ? `0${timeObj.seconds}` : timeObj.seconds}s`;
  const millisecondsStr = `${
    timeObj.milliseconds == 0 
    ? '000' 
    : timeObj.milliseconds < 10 
      ? `00${roundToDecimals(Number(timeObj.milliseconds), 0)}` 
      : timeObj.milliseconds < 100 
        ? `0${roundToDecimals(Number(timeObj.milliseconds), 0)}` 
        : roundToDecimals(Number(timeObj.milliseconds), 0)}ms`;
  //return `${hoursStr} ${minutesStr} ${secondsStr} ${millisecondsStr}`;
  return `${minutesStr} ${secondsStr} ${millisecondsStr}`;
}

export const getFrenchFormatedDateString = (date, showDayName) => {
  const day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate();
  const month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();
  if (showDayName) {
    let dayName = '';
    const dayNumber = Number(date.getDay());

    switch (dayNumber) {
      case 0: dayName = 'DIM'; break;
      case 1: dayName = 'LUN'; break;
      case 2: dayName = 'MAR'; break;
      case 3: dayName = 'MER'; break;
      case 4: dayName = 'JEU'; break;
      case 5: dayName = 'VEN'; break;
      case 6: dayName = 'SAM'; break;
    
      default: break;
    }
    
    return `${dayName} ${day}/${month}/${year}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

export const getFormatedDateString = (date) => {
  const day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate();
  const month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
}

export const getCurrentEnv = () => {
  const hostname = new URL(window.location.href).hostname;
  if (hostname.includes('localhost') || hostname.includes('127') || hostname.includes('192')) {
    return 'LOCAL'
  } else {
    return 'PROD'
  }
}

export const logAppInfos = (appName, appVersion) => {
  const baseColor = 'color: #FFFFFF;';
  const basicValueStyle = 'color: #5CD2F8;';
  const positiveValueStyle = 'color: #00FF00;';
  const mediumValueStyle = 'color: #FF9900;';
  const negativeValueStyle = 'color: #FF7777;';
  const neutralValueStyle = 'color: #BBBBBB;';


  const unavailable = '%cunavailable';
  const available = '%cavailable';

  const appNameStyle = `
    font-size: 24px;
    font-weight: 500;
    padding: 4px 16px;
    border-radius: 4px;
    background-color: #1A1A1A;
    border: 1px solid #6f6f6f;
  `;

  console.log(`%c${appName}`, appNameStyle);
  console.log(`Version: %c${appVersion}`, `font-size: 16px; ${basicValueStyle}`);
  console.log(`Environment: %c${getCurrentEnv()}`, `font-size: 16px; ${basicValueStyle}`);

  console.groupCollapsed('App status');
    console.log(`Storage: ${available}`, positiveValueStyle);
  console.groupEnd();
}



