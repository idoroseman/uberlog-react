import Firebase from '../Firebase';

const pub_url = "http://www.arrl.org/country-lists-prefixes";
const url = "https://www.arrl.org/files/file/DXCC/2020%20Current_Deleted.txt";


String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

String.prototype.IncrementAt=function(index) {
    if (index == -1)
      index = this.length - 1;
    var replacement = String.fromCharCode(this[index].charCodeAt() + 1)
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

class DXCC {
  constructor(){
    let doc = localStorage.getItem('dxcclist') 
    if (doc === null) {
      this.downloadFromServer();
      doc = localStorage.getItem('dxcclist') 
    }
    this.parseFileText(doc);

    // Object.keys(this.list).forEach((key)=>{console.log(key, this.list[key])})
  }


  async downloadFromServer(){
    const firebase = new Firebase()
    const url = await firebase.storageRef().child('public/dxcclist.txt').getDownloadURL()
    const response = await fetch(url);
    const doc = await response.text();
    localStorage.setItem('dxcclist', doc);
  }

  differAtIndex(a, b){
    var shorterLength = Math.min(a.length, b.length);

    for (var i = 0; i < shorterLength; i++)
    {
        if (a[i] !== b[i]) return i;
    }

    if (a.length !== b.length) return shorterLength;

    return -1;
  }

  parseFileText(doc) {
    console.log("reading dxcc");
    this.list = {};
    var lines = doc.split('\n');
    var index = 0;

    //skip header
    while ((lines[index]===undefined) || (!lines[index].includes("_"))) {
      index++;
    }


    while (!lines[index++].toLowerCase().includes("notes:")) {
      var line = lines[index];
      if ((line===undefined) || (line.trim() == ""))
          continue;
      // const items = line.split(/\s+/);
      // console.log(items)
      var prefix = line.substr(4, 20).replace("*", "").replace("#", "").trim();
      const name = line.substr(24, 35).replace("Asiatic","As.").replace("European","Eu.").replace("Federal Republic of ","F.R.").replace("United States of America","USA").replace("Republic","Rep.").trim();
      const continent = line.substr(59, 2);
      const itu = line.substr(65, 2);
      const cq = line.substr(71, 2);
      const code = line.substr(77, 2);
      const record = {name:name, continent:continent, itu:itu ,cq:cq, code:code }
      if (prefix.endsWith(")"))
          prefix = prefix.substr(0, prefix.indexOf('('));
      var prefixes = prefix.split(',');
      prefixes.forEach((p, index)=>{
        var count = p.split('-').length - 1;
        if (count == 2) {
          var fromto = p.split('-');
          var from1 = fromto[0];
          var to1 = fromto[1].substr(0,from1.length);
          var from2 = fromto[1].substr(from1.length);
          var to2=fromto[2].replace('0',':');
          to1 = to1.IncrementAt(-1);
          to2 = to2.IncrementAt(-1);
          for (var p1 = from1; p1!=to1; p1=p1.IncrementAt(-1))
            for (var p2 = from2; p2!=to2; p2=p2.IncrementAt(-1))
                this.list[p1+p2.replace(":","0")] = record;
              
        }
        else if (count == 1) {

          var suffix = "";
          var fromto = p.split('-');
          if (fromto[0].length > fromto[1].length)
            fromto[1] = fromto[0].substr(0,fromto[0].length - fromto[1].length) + fromto[1];
          if (fromto[1].length > fromto[0].length){
                  suffix = fromto[1].substr(fromto[0].length);
                  fromto[1] = fromto[1].substr(0, fromto[0].length);
          }
          var loc = this.differAtIndex(fromto[0],fromto[1]);
          fromto[1] = fromto[1].IncrementAt(loc);
          for (var p1 = fromto[0]; p1 != fromto[1]; p1=p1.IncrementAt(loc))
            if (!(p1+suffix in this.list)){
              this.list[p1+suffix] = record;
            }

        }
        else if (!isNaN(p) && (p!="")){
          //  PJ5,6           Saba & St. Eustatius  
          //  9M2,4           West Malaysia
          const base = prefixes[index-1]
          this.list[base.substr(0, base.length-p.length)+p] = record
        }
        else if (p) {
          if (!(p in this.list))
            this.list[p] = record;
        }

      })
    }
    this.list["R"] = "Russia"; // hack: this is missing from file
    this.list["1B"] = "N. Cyprus";
    this.list["1S"] = "Spratly Is";
    this.list["2E"] = "England (Novices)";
    this.list["2I"] = "Northern Ireland (Novices)";
    this.list["2J"] = "Jersey (Novices)";
    this.list["2M"] = "Scotland (Novices)";
    this.list["2U"] = "Guernsey & Dependencies (Novices)";
    this.list["2W"] = "Wales (Novices)";
    console.log("done reading dxcc");
  }

  countryOf(callsign)
  {
    if (this.list===null)
      return "";
    if (!(callsign))
      return ""

    while (callsign != "")
    {
      if (callsign in this.list)
        return this.list[callsign];
      callsign = callsign.slice(0, -1);
    }

    return "";
  }
}

export default DXCC