export default function fetchCors(url, options={}){
    options.headers = {
      Origin: 'https://uberlog.idoroseman.com'
    }
    return fetch("https://uberlog-cors.herokuapp.com/"+url, options);
  }