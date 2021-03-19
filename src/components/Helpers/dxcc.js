import Firebase from '../Firebase';

const pub_url = "http://www.arrl.org/country-lists-prefixes";
const url = "https://www.arrl.org/files/file/DXCC/2020%20Current_Deleted.txt";


class DXCC {
  constructor(){
    let doc = localStorage.getItem('dxcclist') 
    if (doc === null) {
      this.downloadFromServer();
      doc = localStorage.getItem('dxcclist') 
    }
    this.parseDxccCsv(doc);

    // Object.keys(this.list).forEach((key)=>{console.log(key, this.list[key])})
  }


  async downloadFromServer(){
    const firebase = new Firebase()
    const url = await firebase.storageRef().child('public/dxcclist.csv').getDownloadURL()
    const response = await fetch(url);
    const doc = await response.text();
    localStorage.setItem('dxcclist', doc);
  }

  parseDxccCsv(doc) {
    if (doc == null){
      return
    }
    console.log("parsing dxcc");
    this.list = {};
    doc.split('\n').forEach((line)=>{
      const tokens = line.split(', ')
      this.list[tokens[0]] = {
        name:tokens[1],
        continent:tokens[2],
        cq_zone:tokens[3],
        itu_zone:tokens[4],
        entity_code:tokens[5],
        flag:tokens[6]
      }
    })

  }

  countryOf(callsign)
  {
    if ((this.list===null) || (this.list===undefined))
      return null
    if (!(callsign))
      return null

    while (callsign != "")
    {
      if (callsign in this.list)
        return this.list[callsign];
      callsign = callsign.slice(0, -1);
    }

    return null;
  }
}

export default DXCC