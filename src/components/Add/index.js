import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { withFirebase } from '../Firebase';
import { DXCC } from '../Helpers'
import Flag from 'react-world-flags'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

var moment = require('moment');

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 275,
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '30ch',
      },
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    
  }));

const dxcc = new DXCC();

const AddPage = ( {firebase} ) => {
    const empty = { CALL:"", RST_SENT:"", RST_RCVD:"", NAME:"", QTH:"", GRID:"", COMMENT:"", QSO_DATE:"", TIME_ON:""};
    const classes = useStyles();
    const [text, setText] = React.useState('');
    const [state, setState] = React.useState(empty)
    const [lastSeen, setLastSeen] = React.useState({})
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [freqSelected, setFreq] = React.useState(localStorage.getItem("inputFreq") || "14");
    const [modeSelected, setMode] = React.useState(localStorage.getItem('inputMode') || 'SSB');
    const [satSelected, setSat] =React.useState(localStorage.getItem("inputSat") || "");
    const city = null
    const specialCallsign = null
    const operator_name = null

    const handleKeyPress = (event) => {
        if ((event.metaKey) && (event.keyCode == 8)){
            setState(empty);
            //this.handleInput(event);
          }
          else if (event.keyCode == 9) {
            // var size = Object.keys(this.qrz).length;
            // if (size > 0) {
            //   var pos = event.target.selectionEnd;
            //   if (this.state.text[pos-1] == " ")
            //     pos--;
            //   if (this.state.text[pos-2] == "\n") {
            //     event.preventDefault();
            //     if (this.state.text[pos-1] == "n")
            //        this.setState({text:this.state.text.substr(0,pos)+" "+this.qrz.name});
            //     else if (this.state.text[pos-1] == "q")
            //       this.setState({text:this.state.text.substr(0,pos)+" "+this.qrz.qth});
            //     else if (this.state.text[pos-1] == "g")
            //       this.setState({text:this.state.text.substr(0,pos)+" "+this.qrz.grid});
            //   }
            // }
            console.log("Tab", event.target.selectionStart, event.target.selectionEnd);
          }   
        }

    const handleChange = (event) => {
        setText(event.target.value);

        var s = empty;
        event.target.value.split('\n').forEach((line,i)=>{
          if ((isCallsign(line)) && !(s.CALL))
            s.CALL = line.toUpperCase().trim();
          else if (isSignalReport(line)) {
            if (!s.RST_SENT)
              s.RST_SENT=line;
            else if (!s.RST_RCVD)
              s.RST_RCVD=line;
            else
              console.log("unprocessed signal report", line);
            }
          else if (isGrid(line))
            s.GRID = line.substr(0,2).toUpperCase() + line.substr(2).toLowerCase();
          else if (isDate(line) || isTime(line)) {
              line.split(" ").map((token)=>{
              if (isDate(token))
                s.QSO_DATE = extractDate(token);
              if (isTime(token))
                s.TIME_ON = extractTime(token);
              });
            }
          else if (isFreq(line))
            s.freq = line;
          else if ((line.toLowerCase().startsWith("h")) && (isSignalReport(line.substr(1))))
            s.RST_SENT = line.substr(1).trim();
          else if ((line.toLowerCase().startsWith("m")) && (isSignalReport(line.substr(1))))
            s.RST_RCVD = line.substr(1).trim();
          else if (line.toLowerCase().startsWith("n ")) // explisit name
            s.NAME = line.substr(1);
          else if (line.toLowerCase().startsWith("q ")) // explisit qth
            s.QTH = line.substr(1);
          else if (line.toLowerCase().startsWith("g ")) // explisit qth
            s.GRID = line.substr(1).trim().substr(0,2).toUpperCase() + line.substr(1).trim().substr(2).toLowerCase();
          else if (line != "")
            s.COMMENT += line
          })

        // change of callsign
        if(s.CALL != state.callsign)
        {
            // dxcc info
            const info = dxcc.countryOf(s.CALL)
            s.COUNTRY = info.name || ""
            s.DXCC = info.entity_code
            s.CQZ = info.cq_zone
            s.ITUZ = info.itu_zone
            s.flag_ = info.flag
            // check qrz
          // this.hamqth.lookup(s.CALL.trim())
          // .then((info)=>{this.qrz = info; this.forceUpdate();})
          // .catch((err)=>{
          //     console.log("hamqth:"+err); 
          //     if (err.split(":",2)[0] == this.callsign)
          //       this.qrz={}
          //     })
          // this.callsign = s.CALL.trim();
          // this.props.onNewCallsign(this.callsign);
           // check previous log
           const l  = localStorage.getItem('selectedLogbook') || 0;
           firebase.logbook(l).where("CALL", "==", s.CALL ).get()
           .then((querySnapshot) => {
               let seen = { QSO_DATE:"00000000", TIME_ON:"0000"}
               querySnapshot.forEach((doc) => {
                   const q = doc.data()
                   if (q.QSO_DATE+q.TIME_ON > seen.QSO_DATE+seen.TIME_ON)
                     seen = doc.data();
               });
               setLastSeen(seen);
           })
        }

        setState(s);

        // enter accept
        if (event.target.value.endsWith('\n\n\n')){
          handleSubmit()
          setState(empty)
          setText("")
        //   var success = this.props.onSubmit(s);
        //   console.log("submit success is", success);
        //   if (success){
        //     this.setState({text:""});
        //   }
        }
    }
    
    const handleSubmit = () => {
      var qso = state;
      // add time and date
      if (qso.QSO_DATE=="")
        qso.QSO_DATE = moment().utc().format("YYYYMMDD");
      if (qso.TIME_ON=="")
        qso.TIME_ON = moment().utc().format("HHmm");
      // add freq / mode/ sat
      if (!qso.FREQ)
        qso.FREQ = freqSelected;
      var m = (modeSelected+"|").split("|",2)
      if (!qso.MODE) {
        qso.MODE = m[0];
        if (m[1]!='')
          qso.SUBMODE = m[1];
      }
      if (satSelected)
        {
          var FreqLUT = { "V":144, "U":440, "S":2400, "X":10000 }
          var s = satSelected.split("|",2)
          qso["PROP_MODE"] = "SAT"
          qso["SAT_NAME"] = s[0]
          qso["FREQ"] = FreqLUT[s[1][0]]
          qso["FREQ_RX"] = FreqLUT[s[1][1]]
        }
      // location / op / special call sign
      if (city)
        qso["MY_CITY"] = city;
      if (specialCallsign)
        qso["STATION_CALLSIGN"] = specialCallsign
      if (operator_name)
        qso["MY_NAME"] = operator_name

      // submit
      const l  = localStorage.getItem('selectedLogbook') || 0;
      console.log(qso)
      firebase.logbook(l).add(qso)
      .then(()=>{
        console.log("submited")
        setSnackOpen(true);
        setState(empty); 
        setText('');
      })
      .catch((err)=>{console.log(err)})

    }

    const isCallsign = (text) => {
        var callsignRe = /([a-zA-Z0-9]{1,2}\/)?[a-zA-Z0-9]{1,2}\d{1,4}[a-zA-Z]{1,4}(\/[a-zA-Z0-9]{1,2})?/g
        return (callsignRe.exec(text) !== null)
    }

    const isSignalReport = (text) => {
        var pattern1 = /^\s*[1-5][1-9][1-9]?(\+\d0)?$/g
        var pattern2 = /^\s*[\-\+]\d{1,2}$/g
        return ((pattern1.exec(text) !== null) || (pattern2.exec(text) !== null))
    }

    const isGrid= (text) => {
        return /^[a-zA-Z]{2}\d{2}([a-zA-Z]{2})?$/g.exec(text) !== null;
    }

    const isDate = (text) => {
        return /\d{1,2}\/\d{1,2}\/\d{2,4}/g.exec(text) !== null;
    }

    const isTime= (text) => {
        return /\d{1,2}\:\d\d/g.exec(text) !== null;
    }

    const isFreq = (text)=>{
        return /\d{1,2}\.\d{2,3}/g.exec(text) !== null;
    }

    const extractDate = (text)=>{
        var d = moment(text, ["DD/MM/YYYY", "DD/MM/YY"]);
        return d.format("YYYYMMDD")
    }

    const extractTime = (text) => {
        var d = moment(text, ['h:m a', 'H:m']);
        return d.format("HHmm")
    }

    const handleFreqChanged = (event) => {
      localStorage.setItem("inputFreq", event.target.value) 
      setFreq(event.target.value)
    }

    const handleModeChanged = (event) => {
      localStorage.setItem("inputMode", event.target.value) 
      setMode(event.target.value)
    }

    const handleSatChanged = (event) => {
      localStorage.setItem("inputSat", event.target.value) 
      setSat(event.target.value)
    }

    const  DateTimeFormat = (d,t) => {
      return d.slice(0,4) + "-" + d.slice(4,6) + "-" + d.slice(6,8) + "   " + t.slice(0,2) + ":" + t.slice(2,4);
    }

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <select name="band" id="band" value={freqSelected} onChange={handleFreqChanged} disabled={satSelected!=""}>
            <option value="1.8"     key="1.8">1.8 MHz / 160m</option>
            <option value="3.5"     key="3.5">3.5 MHz / 80m</option>
            <option value="7"       key="7">7 MHz / 40m</option>
            <option value="10"      key="10">10 MHz / 30m</option>
            <option value="14"      key="14">14 MHz / 20m</option>
            <option value="18"      key="18">18 MHz / 17m</option>
            <option value="21"      key="21">21 MHz / 15m</option>
            <option value="25"      key="25">25 MHz / 12m</option>
            <option value="28"      key="28">28 MHz / 10m</option>
            <option value="50"      key="50">50 MHz / 6m</option>
            <option value="144"     key="144">144 MHz / 2m</option>
            <option value="220"     key="220">220 MHz / 1.25m</option>
            <option value="432"     key="432">432 MHz / 70cm</option>
            <option value="902"     key="902">902 MHz / 35cm</option>
            <option value="1300"    key="1300">1.3 GHz / 23cm</option>
            <option value="2300"    key="2300">2.3 GHz / 13cm</option>
            <option value="3300"    key="3300">3.3 GHz / 9cm</option>
            <option value="5660"    key="5660">5.66 GHz / 6cm</option>
            <option value="10000"   key="10000">10 GHz / 3cm</option>
            <option value="24000"   key="24000">24 GHz / 1.25cm</option>
            <option value="47000"   key="47000">47 GHz / 6mm</option>
            <option value="75000"   key="75000">75 GHz / 4mm</option>
            <option value="120000"  key="120000">120 GHz / 2.5mm</option>
            <option value="142000"  key="142000">142 GHz / 2mm</option>
            <option value="241000"  key="241000">241 GHz / 1mm</option>
          </select>
          <select name="mode" id="mode" value={modeSelected} onChange={handleModeChanged}>
            <option value="SSB">SSB</option>
            <option value="SSB|USB">USB</option>
            <option value="SSB|LSB">LSB</option>
            <option value="CW">CW</option>
            <option value="RTTY">RTTY</option>
            <option value="AMTOR">AMTOR</option>
            <option value="PKT">PKT</option>
            <option value="AM">AM</option>
            <option value="FM">FM</option>
            <option value="SSTV">SSTV</option>
            <option value="ATV">ATV</option>
            <option value="PACTOR">PACTOR</option>
            <option value="CLOVER">CLOVER</option>
            <option value="PSK|PSK31">PSK31</option>
            <option value="PSK|PSK63">PSK63</option>
            <option value="JT65">JT65</option>
            <option value="JT9">JT9</option>
            <option value="FT8">FT8</option>
            <option value="MFSK|JS8">JS8Call</option>
            <option value="DIGITALVOICE|FreeDV">FreeDV</option>
          </select>
          <select name="Satellite" id="Satellite" value={satSelected} onChange={handleSatChanged}>
            <option value="">Satellite</option>
            <option value="QO-100|SX">QO-100</option>
            <option value="ARISS|UV">ARISS</option>
            <option value="SO-50|VU">SO-50</option>
            <option value="A0-91|UV">AO-91</option>
            <option value="AO-92|UV">AO-92</option>
          </select>
          <br/>
          <br/>
          <Typography variant="h5" component="h2">
            {state.CALL=="" ? "Callsign" : state.CALL }
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {state.flag_?<Flag code={state.flag_} height="16"/>:<span>&#x1f3f3;</span>}
            {" "}{ state.COUNTRY || "..." }
          </Typography>
          <Typography variant="body2" component="p">
            Report His {state.RST_SENT==""?"...":state.RST_SENT} Mine {state.RST_RCVD==""?"...":state.RST_RCVD}
          </Typography>
          <Typography variant="body2" component="p">
            Name {state.NAME?state.NAME:"..."}
          </Typography>
          <Typography variant="body2" component="p">
            QTH {state.QTH ? state.QTH : "..."} 
            {
            //(qrz.qth?<span style={{"color":"Gray"}}>{qrz.qth}</span>:"...") 
            }
            {state.GRID ? "  Grid "+state.GRID: ""}
            {
            //(qrz.grid?<span> Grid <span style={{color:"Gray"}}>{qrz.grid}</span></span>:"")}<br/>
            }
          </Typography>
          <Typography variant="body2" component="p">
            {state.QSO_DATE ? "Date "+state.QSO_DATE:""}
            {state.TIME_ON ? " Time "+state.TIME_ON:""}
            {state.FREQ ? " Freq "+state.FREQ:""}
            &nbsp;
          </Typography>

          <FormControl variant="filled">
          <TextField
            id="filled-multiline-static"
            multiline
            rows={7}
            variant="filled"
            value={text} 
            onKeyDown={handleKeyPress}
            onChange={handleChange} 
            />
        </FormControl>
            { lastSeen.CALL ?
            <Typography color="textSecondary">
                Last seen {DateTimeFormat(lastSeen.QSO_DATE, lastSeen.TIME_ON)}<br/>
                on {lastSeen.FREQ} {lastSeen.MODE} more...
            </Typography>:""}
        </CardContent>

        <CardActions>
            <Button size="small" onClick={handleSubmit}>Add</Button>
            <Button size="small" onClick={() => { setState(empty); setText('')}}>Clear</Button>
        </CardActions>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={snackOpen} autoHideDuration={6000} onClose={()=>setSnackOpen(false)}>
          <Alert onClose={()=>setSnackOpen(false)} severity="success">
            QSO was saved
          </Alert>
        </Snackbar>
      </Card>
    );
  }

export default withFirebase(AddPage);