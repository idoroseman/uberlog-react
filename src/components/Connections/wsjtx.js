const dgram =require('dgram');
const EventEmitter = require('events');
var moment = require('moment');
var JulianDate = require('julian-date');

// https://sourceforge.net/p/wsjt/wsjt/HEAD/tree/branches/wsjtx/NetworkMessage.hpp#l229


class buffer{
  constructor(buffer){
    this.buffer = buffer;
    this.index = 0;
  }
  getNumber(len){
    var value = 0;
    for ( var i = 0; i < len; i++) {
        value = (value * 256) + this.buffer[this.index+i];
    }
    this.index += len;
    return value;
  }
  getUInt64(){
    return this.getNumber(8);
  }
  getUInt32(){
    return this.getNumber(4);
  }
  getUInt8(){
    return this.getNumber(1);
  }
  getBool(){
    return this.buffer[this.index++] != 0;
  }
  getDateTime(){
/*
*           QDate      qint64    Julian day number
*           QTime      quint32   Milli-seconds since midnight
*           timespec   quint8    0=local, 1=UTC, 2=Offset from UTC
*                                                 (seconds)
*                                3=time zone
*           offset     qint32    only present if timespec=2
*           timezone   several-fields only present if timespec=3
*/
    var qdate = this.getUInt64();
    var qtime = this.getUInt32();
    var timespec = this.getUInt8();
    if (timespec == 2) // offset from UTC (Sec)
      this.getUInt32();
    var dt = new JulianDate().julian(qdate);
    // this is so dump, but havnt found a better way
    var th = Math.floor(qtime / (60*60*1000));
    var tm = Math.floor((qtime-(th*60*60*1000)) / (60*1000))
    var sh = ""+th;
    while (sh.length < 2)
      sh = "0"+sh;
    var sm = ""+tm;
    while (sm.length < 2)
      sm = "0"+sm;
    return [dt.getDate().toISOString().split('T')[0].replace("-","").replace("-",""), sh+sm]
  }
  getUTF8(){
    var count = this.getUInt32();
    var s ='';
    for (var i=0; (i<count) && (this.index<this.buffer.length); i++)
      s += String.fromCharCode(this.buffer[this.index++]);
    return s;
  }
}

class wsjtx extends EventEmitter{
  constructor(){
    super();
    console.log("wsjt-x listener")
    this.PORT = 2237;
    this.HOST = '127.0.0.1';
    this.status = {}
    this.server = dgram.createSocket('udp4');
    this.server.on('error', (err)=>{
      console.log("Socket error: " + err);
    })
    this.server.on('listening', ()=> {
        var address = this.server.address();
        console.log('WSJT-X UDP Server listening on ' + address.address + ":" + address.port);
    });
    this.server.on('message', this.handleMessage.bind(this));
    this.server.bind(this.PORT, this.HOST);
  }

  findMatching(qso){
    var date = ""
    var band = ""
    var mode = "ft8"
    this.all_log.forEach((line)=>{
      if (line.match(/^(\d{4})-(\d{2})-(\d{2})/)){
        let items = line.split(" ")
        date =  items[0]
        band = items[3]
        mode = items[6]
      }
      if ((line.includes(qso["CALL"])) && (line.includes(this.mycall))){
        if (line.includes("Transmitting"))
          console.log(date, band, mode, line.substring(line.indexOf(":")))
          else
          console.log(date, band, mode, line.substring(line.indexOf("~")))

      }
    })
  }

  handleMessage(message, remote){
    var buff = new buffer(message);
    var magicnumber = buff.getUInt32();
    var schema = buff.getUInt32();
    var messagetype = buff.getUInt32();
    var id = buff.getUTF8();
    if (magicnumber != 0xADBCCBDA)
      return;
//    console.log(magicnumber, schema, messagetype, id);
    switch (messagetype)
    {
        case 0: // heartbeat
            var MaxSchema = buff.getUInt32();
            var version = buff.getUTF8();
            var revision = buff.getUTF8();
//            console.log("heartbeat", version, revision);
            this.emit('status',{"WSJT-X":"idle"})
            break;
        case 1: // status
            var status = {}
            status.freq = buff.getUInt64();
            status.mode = buff.getUTF8();
            status.DXCall = buff.getUTF8();
            status.report = buff.getUTF8();
            status.txmode = buff.getUTF8();
            status.txEnabled = buff.getBool();
            status.transmiting = buff.getBool();
            status.decoding = buff.getBool();
            status.RXDFreq = buff.getUInt32();
            status.TXDFreq = buff.getUInt32();
            status.DECall = buff.getUTF8();
            status.DEGrid = buff.getUTF8();
            status.DXGrid = buff.getUTF8();
            status.TXWatchdog = buff.getBool();
            status.submode = buff.getBool();
            status.fastmode = buff.getBool();
//            for (var field in status)
//              if (status[field] != this.status[field])
//                console.log("wsjt status",field,"changed from",this.status[field],"to",status[field]);
            this.status = status
            break;
        case 2: // decoded
            var isNew = buff.getBool();
            var time = buff.getUInt32();
            var snr = buff.getUInt32();
            var dtime = buff.getUInt64();
            var deltafreq = buff.getUInt32();
            var qsomode = buff.getUTF8();
            var message = buff.getUTF8();
            var lowConf = buff.getBool();
//            console.log(isNew, time, snr, dtime, deltafreq, qsomode, message, lowConf);
            break;
        case 5: // QSO Logged
//            console.log(message);
//            for (var i in message)
//              console.log(message[i]);
            var qso = {}
            var whenFinished = buff.getDateTime();
            qso["QSO_DATE"] = whenFinished[0];
            qso["TIME_ON"] = whenFinished[1];
            qso["CALL"] = buff.getUTF8();
            qso["QTH"] = buff.getUTF8();
            qso["FREQ"] = (buff.getUInt64()/1000000).toFixed(3);;
            qso["MODE"] = buff.getUTF8();
            qso["RST_SENT"] = buff.getUTF8();
            qso["RST_RCVD"] = buff.getUTF8();
            var txpwr = buff.getUTF8();
            qso["COMMENT"] = buff.getUTF8();
            var dxname = buff.getUTF8();
            var whenStarted = buff.getDateTime();
            console.log("QSO: ", qso.CALL, " ", qso.RST_SENT,  " ",qso.RST_RCVD, " ", qso.QTH, " ", whenFinished);
            this.emit('qso', qso);
            this.emit('status',{"WSJT-X":"active"})
            break;

        default:
           console.log(remote.address + ':' + remote.port +' - ' + message);
          break;
    }
  }
}

module.exports = wsjtx
