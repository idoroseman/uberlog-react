const EventEmitter = require('events');

class eqsl extends EventEmitter {

  constructor(username, password, callsign){
    super();
    this.username = username;
    this.password = password;
    this.callsign = callsign;
    console.log("welcome to clublog", username);
  }

  fetchQsls(){
  }

  sendEQsl(adif){
    var url = "https://secure.clublog.org/realtime.php"
    data = {
      email: this.username,
      password: this.password,
      callsign: this.callsign,
      adif: adif,
      api: "c935ef1340b5027f63c066268267bd36a98320b3"
    }

    return new Promise((resolve, reject) => {
      console.log("sending to qrzcom...");
      this.emit('status', {"clublog":"active"})
      fetch(url, {
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
