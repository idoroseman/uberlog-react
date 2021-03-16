//------------------------------------------------------------------------------
//                        Utils
//------------------------------------------------------------------------------
var path = require('path')
var fs = require("fs");

export default class Adif {

    objectToAdif(qso){
      var rv = "";
      for (var key in qso){
        if ((key.startsWith("_")) || (key.endsWith("_")) || (qso[key].length == 0))
          continue;
        try {
        if (qso[key] !== null)
          rv+= "<" + key + ":" + qso[key].toString().trim().length + ">" + qso[key].toString().trim()
      } catch (e) { console.log(key, qso[key], e);}
      }
      rv += "<EOR>";
      return rv;
    }

    parseAdifLine(line){
      // Change how to handle the file content
      var qualityRegex = /\<\w*\:\d*(\:[A-Z])?\>(\w|\s|\d|\-|\+)*/g,
          matches,
          tokens = [];

      while (matches = qualityRegex.exec(line)) {
          tokens.push(matches[0]);
        }
      var qso = {}
      tokens.forEach((t)=>{
        var tmp = t.split(/[\<\>\:]+/)
        qso[tmp[1].toUpperCase()] = tmp[tmp.length-1];
      })
      return qso
    }

    parseAdifFile(data, isHeaderLine = true){
      var list = []
      var buffer = ""
      data.split('\n').forEach((line,i)=>{
        if (!isHeaderLine)
        {
          buffer += line;
          if (line.toUpperCase().includes("<EOR>")) {
            var qso = this.parseAdifLine(buffer);
            buffer = '';
            // filter out empty qsos
            if (Object.keys(qso).length === 0 && qso.constructor === Object)
              return;
            list.push(qso)
          }
        }
        if (line.toUpperCase().includes("<EOH>"))
          isHeaderLine = false;
      })
      return list;
    }
  }

