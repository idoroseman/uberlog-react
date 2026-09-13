import isElectron from 'is-electron';

export default function fetchCors(url, options={}){
    options.headers = {
      'Origin': 'https://uberlog.idoroseman.com',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
    if (isElectron())
      return fetch(url, options); 
    else
      return fetch("https://uberlog-cors-970e79a47f28.herokuapp.com/"+url, options);
  }

  // todo: replace dedicated server with a firebase funcion