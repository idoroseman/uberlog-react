export default function fetchCors(url, options){
    return fetch("https://uberlog-cors.herokuapp.com/"+url, {
      headers: {
        Origin: 'https://uberlog.idoroseman.com'
      }
    });
  }