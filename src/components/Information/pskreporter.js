import React, { Component } from 'react';
import fetchCors from './fetchcors';
const EventEmitter = require('events');

var moment = require('moment');

class PSKReporter extends EventEmitter{
  constructor(callsign){
    super();
    this.callsign = callsign
    this.interval = 90
    this.countdown= 5
    this.reports= {}
    this.isActive = false
    this.intervalId = setInterval(this.timerTick.bind(this), 1000);
  }

  setActive(active){
    this.isActive = active
    this.emit('status',{"PSKR":active?"idle":"disabled"})
    this.countdown = 5
  }

  timerTick(){
    if (!this.isActive)
      return;
    this.emit('status',{"PSKR":"idle"})
    this.countdown--
    this.emit('tick', this.countdown)
    if (this.countdown==0){
      this.countdown = this.interval
      this.emit('status',{"PSKR":"active"})
      this.fetchData()
    }
  }

  fetchData(){
    console.log('fetch qso reporter', this.callsign);
    fetchCors('https://retrieve.pskreporter.info/query?senderCallsign='+this.callsign)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        const now = moment();
        var x = data.getElementsByTagName("receptionReport");
        for (var i = 0; i < x.length; i++) {
            var timestamp = moment(1000*parseInt(x[i].getAttribute("flowStartSeconds"),10))
            if (-timestamp.diff(now,"hours") > 12)
              continue;
            var receiverCallsign = x[i].getAttribute("receiverCallsign")
            var band = Math.round(x[i].getAttribute("frequency")/1000000)
            const id = receiverCallsign+"-"+band.toString()
            if (!(id in this.reports)) {
              var r = {}
              r.count = 0
              r.callsign = receiverCallsign
              r.band = band
              r.receiverLocator = x[i].getAttribute("receiverLocator")
              r.receiverCountry = x[i].getAttribute("receiverDXCC")
              if (r.receiverCountry != null)
                r.receiverCountry= r.receiverCountry.replace("Asiatic","As.").replace("European","Eu.").replace("Federal Republic of ","F.R.").replace("United States","US").replace(" of America","A").replace("Republic","Rep.").trim()
              this.reports[id] = r
            }
            this.reports[id].lastHeared = timestamp
            this.reports[id].mode = x[i].getAttribute("mode")
            this.reports[id].snr = x[i].getAttribute("sNR")
            this.reports[id].count++
        }
        this.emit('reports',this.reports)
      })
      .catch(err=>{
        console.log("reporter fetch error", err);
        this.emit('status',{"PSKR":"error"})
      })
  }
}


export { PSKReporter }
