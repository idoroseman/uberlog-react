import isElectron from 'is-electron';

export default function fetchCors(url, options={}){
    options.headers = {
      'Origin': 'https://uberlog.idoroseman.com',
      'Content-Type': 'application/json'
    }
    if (isElectron())
      return fetch(url, options); 
    else
      return fetch("https://uberlog-cors.herokuapp.com/"+url, options);
  }