import fetchCors from './fetchcors';

const EventEmitter = require('events');
var fs = require('fs');
var path = require('path')
var url = require('url');
var http = require('http');

class eqsl extends EventEmitter {

  constructor(credentials){
    super();
    if (!credentials) {
      console.log("missing credentials")
      return
    }
      
    this.username = credentials.username;
    this.password = credentials.password;
    console.log("welcome to eqsl", credentials.username);
  }

  textToFile(text,filename){
    fs.writeFile('eqsl.html', text,  (err) => {
      if (err)
        return console.log(err);
      console.log('Wrote file');
    });
  }

  

  fetchQsls(){
    console.log("requesting eqsl");
    this.emit('status', {"eQSL":"active"})
    var url = "http://www.eqsl.cc/qslcard/DownloadInBox.cfm?UserName="+this.username+"&Password="+this.password+"&RcvdSince=19700201"
    return new Promise((resolve, reject) => {
      fetchCors(url, {credentials: 'same-origin'})
        .then((response)=>{return response.text();})
        .then((text)=>{
          console.log("fetching eqsl");
          var filename = null;
          var rv = /[A-Z0-9]*\.adi/g.exec(text);
          if (rv !== null){
            filename = rv[0];
            fetchCors("https://www.eqsl.cc/QSLCard/downloadedfiles/"+filename)
            .then((response)=>{return response.text()})
            .then((text)=>{
              this.emit('status', {"eQSL":"idle"})
              resolve(text);
            })
          }
          else {
            this.emit('status', {"eQSL":"error"})
            reject("no file to download found")
          }
        })
        .catch((err)=>{
          this.emit('status', {"eQSL":"error"})
          console.log("something went wrong")
          console.log(err);
        })
      });
  }

download (file_url, full_file_name, cb){
  var options = {
      host: url.parse(file_url).host,
      port: 80,
      path: url.parse(file_url).pathname
  };

  var file = fs.createWriteStream(full_file_name);

  http.get(options, function(res) {
      res.on('data', function(data) {
              file.write(data);
          }).on('end', function() {
              file.end();
              // console.log(full_file_name + ' downloaded  ' );
              cb();
          });
      });
};


fetchImage(qso, downloaddir, filename){
   var furl = "http://www.eqsl.cc/qslcard/GeteQSL.cfm"
             + "?Username="+this.username
             + "&Password="+this.password
             + "&CallsignFrom=" + qso["CALL"]
             + "&QSOBand=" + qso["BAND"]
             + "&QSOMode=" + (qso["SUBMODE"] || qso["MODE"])
             + "&QSOYear=" + qso["QSO_DATE"].substr(0,4)
             + "&QSOMonth=" + qso["QSO_DATE"].substr(4,2)
             + "&QSODay=" + qso["QSO_DATE"].substr(6,2)
             + "&QSOHour=" + qso["TIME_ON"].substr(0,2)
             + "&QSOMinute=" + qso["TIME_ON"].substr(2,4);
   return new Promise((resolve, reject) => {
     fetch(furl, {credentials: 'same-origin'})
       .then((response)=>{return response.text();})
       .then((text)=>{
         var rv = /\<img\ src\=\".*\"\ alt\=/g.exec(text);
         if (rv !== null){
           this.download("http://www.eqsl.cc"+rv[0].split("\"")[1], path.join(downloaddir,filename), ()=>{
             resolve();
           });
         }
         else {
           reject("no qsl image found for "+qso["QSO_DATE"]+"-"+qso["TIME_ON"]+"-"+qso["CALL"])
         }
       });
     });
  }

  fetchImageAlt( qso){
     var furl = "http://www.eqsl.cc/qslcard/GeteQSL.cfm"
               + "?Username="+this.username
               + "&Password="+this.password
               + "&CallsignFrom=" + qso["CALL"]
               + "&QSOBand=" + qso["BAND"]
               + "&QSOMode=" + qso["MODE"] // (qso["SUBMODE"] || qso["MODE"])
               + "&QSOYear=" + qso["QSO_DATE"].substr(0,4)
               + "&QSOMonth=" + qso["QSO_DATE"].substr(4,2)
               + "&QSODay=" + qso["QSO_DATE"].substr(6,2)
               + "&QSOHour=" + qso["TIME_ON"].substr(0,2)
               + "&QSOMinute=" + qso["TIME_ON"].substr(2,4);
     return new Promise((resolve, reject) => {
       this.emit('status', {"eQSL":"active"})
       fetchCors(furl, {credentials: 'same-origin'})
         .then((response)=>{return response.text();})
         .then((text)=>{
           var rv = /\<img\ src\=\".*\"\ alt\=/g.exec(text);
           if (rv !== null){
             var file_url = "http://www.eqsl.cc"+rv[0].split("\"")[1]
             this.emit('status', {"eQSL":"idle"})
             resolve(file_url)
           }
           else {
            //  console.log(qso);
            //  console.log(text);
             this.emit('status', {"eQSL":"error"})
             reject(text.trim().replace("<!--","")+qso["QSO_DATE"]+"-"+qso["TIME_ON"]+"-"+qso["CALL"])
           }
         });
       });
    }

  archive(qso){
    console.log("archiving", qso["CALL"], "-", qso["QSO_DATE"]);
    var furl = "https://www.eqsl.cc/QSLCard/DisplayeQSL.cfm"
             + "?Callsign=" + qso["CALL"]
             + "&VisitorCallsign=" + "4X6UB"
             + "&QSODate=" + qso["QSO_DATE"].substr(0,4) + "-" + qso["QSO_DATE"].substr(4,2) + "-"
                           + qso["QSO_DATE"].substr(6,2) + "%20" + qso["TIME_ON"].substr(0,2) + ":"
                           + qso["TIME_ON"].substr(2,4) + ":00.0"
             + "&Band=" + qso["BAND"]
             + "&Mode=" + (qso["SUBMODE"] || qso["MODE"])
     this.emit('status', {"eQSL":"active"})
     fetch(furl, {credentials: 'same-origin'})
         .then((response)=>{return response.text();})
         .then((text)=>{ console.log("eqsl archive", text) })
         .catch((err)=>{ console.log("eqsl archive error", err) })
    // tbd
  }

  sendEQsl(adif){
    var furl = "http://www.eqsl.cc/qslcard/importADIF.cfm?ADIFData="
    var hdr = "Test";
    hdr += "<ADIF_VER:4>1.00"
    hdr += "<EQSL_USER:"+this.username.length.toString()+">"+this.username
    hdr += "<EQSL_PSWD:"+this.password.length.toString()+">"+this.password
    hdr += "<EOH>"
    return new Promise((resolve, reject) => {
      console.log("sending...");
      this.emit('status', {"eQSL":"active"})
      fetchCors(furl+escape(hdr+adif), {credentials: 'same-origin'})
        .then((response)=>{return response.text();})
        .then((text)=>{
          console.log(text);
          if (text.includes("Result: 1 out of 1 records added")) {
            this.emit('status', {"eQSL":"idle"})
            resolve()
          }
          else {
            var rv = /Warning.*\<BR\>/g.exec(text);
            console.log(rv[0]);
            this.emit('status', {"eQSL":"error"})
            reject()
          }
        })
    })
  }
}

export {eqsl}
