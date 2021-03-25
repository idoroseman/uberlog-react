import fetchCors from './fetchcors';
const EventEmitter = require('events');

class Clublog extends EventEmitter {

  constructor(credentials, callsign){
    super();
    this.username = credentials.username || "";
    this.password = credentials.password || "";
    this.callsign = callsign;
    this.apikey = "c935ef1340b5027f63c066268267bd36a98320b3"
    console.log("welcome to clublog", this.username);
  }

  fetchQsls(){
    console.log("fetching clublog")
    const url = "https://clublog.org/getmatches.php?api="+this.apikey+"&email="+this.username+"&password="+this.password+"&callsign="+this.callsign
    return new Promise((resolve, reject) => {
      this.emit('status', {"clublog":"active"})
      fetchCors(url, {credentials: 'same-origin'})
        .then((response)=>{return response.text();})
        .then((text)=>{
            const qsos = JSON.parse(text).map((item)=>{return {
              CALL:item[0], 
              DXCC:item[1], 
              QSO_DATE:item[2].split(" ")[0].replaceAll("-",""), 
              TIME_ON:item[2].split(' ')[1].substring(0,5).replaceAll(":",""), 
              BAND:item[3], 
              MODE:item[4],
              APP_CLUBLOG_STATUS:"C"
            }})
            resolve(qsos)
          })
        .catch((err)=> {
          console.log("clublog",err)
            this.emit('status', {"clublog":"error"})
            reject()
          })
        })
  }

  sendEQsl(adif){
    var url = "https://secure.clublog.org/realtime.php"
    const data = {
      email: this.username,
      password: this.password,
      callsign: this.callsign,
      adif: adif,
      api: this.apikey
    }

    return new Promise((resolve, reject) => {
      console.log("sending to qrzcom...");
      this.emit('status', {"clublog":"active"})
      fetchCors(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      .then((response)=>{
        if (response.status == 200) {
          this.emit('status', {"clublog":"idle"})
          resolve()
        } else {
          this.emit('status', {"clublog":"error"})
          reject()
        }
      })
    })

  }
}

export {Clublog}