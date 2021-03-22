import fetchCors from './fetchcors';
const EventEmitter = require('events');

class QRZ_COM_logbook extends EventEmitter {

  constructor(credentials){
    super();
    this.key = credentials.key;
    console.log("welcome to qrz.com logbook");
  }

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  postData(data){
    var url = "https://logbook.qrz.com/api"
    data['KEY'] = this.key

    const searchParams = Object.keys(data).sort().map((key)=>{
      return encodeURIComponent(key)+'='+encodeURIComponent(data[key])
    }).join('&')

    var options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            //'Content-Type': 'application/json',
           'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: searchParams, // body data type must match "Content-Type" header
    }
    return fetchCors(url+"?"+searchParams)
  }

  fetchQsls(){
    console.log("requesting qrzcom");
    this.emit('status', {"qrz.com":"active"})
    var data = {
      "ACTION": "FETCH",
      "OPTION": "ALL"
    }

    return new Promise((resolve, reject) => {
        this.postData(data)
        .then((response)=>{return response.text();})
        .then((text)=>{
          console.log("fetched qrzcom");
          this.emit('status', {"qrz.com":"idle"})
          text = text.split('\n').map((line)=>this.htmlDecode(line))
          resolve(text.join('\n'));
        })
        .catch((err)=>{
          this.emit('status', {"qrz.com":"error"})
          console.log("something went wrong",err);
        })
    })
  }

  sendQsl(adif){
    return new Promise((resolve, reject) => {
      console.log("sending to qrzcom...");
      this.emit('status', {"qrz.com":"active"})
      var data = {
        "ACTION": "INSERT",
        "ADIF": adif
      }
      this.postData(data)
        .then((response)=>{return response.text();})
        .then((text)=>{
          console.log(text);
          if (text.includes("RESULT=OK")) {
            this.emit('status', {"qrz.com":"idle"})
            resolve()
          }
          else {
            var rv = /REASON\=.*\&/g.exec(text);
            console.log(rv[0]);
            this.emit('status', {"qrz.com":"error"})
            reject()
          }
        })
    })
  }
}

export {QRZ_COM_logbook}
