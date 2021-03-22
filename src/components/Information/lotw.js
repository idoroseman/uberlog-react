import fetchCors from './fetchcors';
const EventEmitter = require('events');

class LoTW extends EventEmitter {

  constructor(credentials){
    super();
    this.username = credentials.username;
    this.password = credentials.password;
    console.log("welcome to lotw", credentials.username);
  }


  fetchQsls(){
    console.log("requesting lotw");
    this.emit('status', {"LoTW":"active"})
    var url = "https://lotw.arrl.org/lotwuser/lotwreport.adi?login="+this.username+"&password="+this.password+"&qso_query=1"
    return new Promise((resolve, reject) => {
      fetchCors(url, {credentials: 'same-origin'})
        .then((response)=>{return response.text();})
        .then((text)=>{
          console.log("fetched lotw");
          this.emit('status', {"LoTW":"idle"})
          resolve(text);
        })
        .catch((err)=>{
          this.emit('status', {"LoTW":"error"})
          console.log("something went wrong",err);
        })
    })
  }
}

export { LoTW }
