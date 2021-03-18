import Firenase from '../Firebase';

class lookup_QRZ_COM {
    
    constructor(credentials) {
        this.baseUrl = "https://xmldata.qrz.com"
        this.key = undefined 
        console.log("credentials",credentials)
        if (!credentials)
          return
        const url = this.baseUrl+"/xml/current/?username="+credentials.username+";password="+credentials.password+";agent=uberlog0.3"
        const self=this
        fetch(url).then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => { self.key = data.getElementsByTagName("Key")[0].innerHTML } )
            .catch((err)=>{console.log(err)})
    }

    xml2json(xml) {
        try {
          var obj = {};
          if (xml.children.length > 0) {
            for (var i = 0; i < xml.children.length; i++) {
              var item = xml.children.item(i);
              var nodeName = item.nodeName;
      
              if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = this.xml2json(item);
              } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                  var old = obj[nodeName];
      
                  obj[nodeName] = [];
                  obj[nodeName].push(old);
                }
                obj[nodeName].push(this.xml2json(item));
              }
            }
          } else {
            obj = xml.textContent;
          }
          return obj;
        } catch (e) {
            console.log(e.message);
        }
    }

    lookup(callsign){
        const url = this.baseUrl + "/xml/current/?s="+this.key+";callsign="+callsign
        return new Promise((resolve, reject) => {
            fetch(url).then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                const obj = this.xml2json(data)
                if (obj.QRZDatabase.Callsign)
                    resolve(obj.QRZDatabase.Callsign);
                else
                    resolve({})
            })
            .catch((err)=>{
                console.log(err)
                reject()
            })
        })
    }

}

class qsl_QRZ_COM {
    constructor(key){
        this.key = key;
    }

    getImage(callsign){
        const data = {
            tquery: callsign,
            mode: "callsign"
        }
        fetch("https://www.qrz.com/lookup",{
            method: 'POST', 
            body: JSON.stringify(data) 
        })
    }
}

export {lookup_QRZ_COM, qsl_QRZ_COM}