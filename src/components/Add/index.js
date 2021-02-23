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
  
const AddPage = ( {firebase} ) => {
    const empty = { CALL:"", RST_SENT:"", RST_RCVD:"", NAME:"", QTH:"", GRID:"", COMMENT:"", QSO_DATE:"", TIME_ON:""};
    const classes = useStyles();
    const [text, setText] = React.useState('');
    const [state, setState] = React.useState(empty)

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
    
          setState(s);

          // change of callsign
          if(s.CALL != state.callsign)
          {
            // this.hamqth.lookup(s.CALL.trim())
            // .then((info)=>{this.qrz = info; this.forceUpdate();})
            // .catch((err)=>{
            //     console.log("hamqth:"+err); 
            //     if (err.split(":",2)[0] == this.callsign)
            //       this.qrz={}
            //     })
            // this.callsign = s.CALL.trim();
            // this.props.onNewCallsign(this.callsign);
          }
        })

        // enter accept
        if (event.target.value.endsWith('\n\n\n')){
        //   var success = this.props.onSubmit(s);
        //   console.log("submit success is", success);
        //   if (success){
        //     this.setState({text:""});
        //   }
        }
    }
    
    const handleSubmit = () => {
      console.log("submit")
      var qso = state;
      if (qso.QSO_DATE=="")
        qso.QSO_DATE = moment().utc().format("YYYYMMDD");
      if (qso.TIME_ON=="")
        qso.TIME_ON = moment().utc().format("HHmm");
      console.log(qso)
      firebase.logbook(0).add(qso)
      .then(()=>{console.log("ok")})
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

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            {state.CALL=="" ? "Callsign" : state.CALL }
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Country ... {
            //state.callsign ? dxcc.countryOf(state.callsign):"..."
            }
          </Typography>
          <Typography variant="body2" component="p">
            Report His {state.RST_SENT==""?"...":state.RST_SENT} Mine {state.RST_RCVD==""?"...":state.RST_RCVD}
          </Typography>
          <Typography variant="body2" component="p">
            QTH {state.QTH ? state.QTH : "..."} 
            {
            //(qrz.qth?<span style={{"color":"Gray"}}>{qrz.qth}</span>:"...") 
            }
            {state.grid ? "  Grid "+state.grid: ""}
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

            <Typography color="textSecondary">
                Last seen 13/01/21 15:47<br/>
                on 2400MHz SSB more...
            </Typography>
        </CardContent>

        <CardActions>
            <Button size="small" onClick={handleSubmit}>Add</Button>
            <Button size="small" onClick={() => { setState(empty); setText('')}}>Cancel</Button>
        </CardActions>
      </Card>
    );
  }

export default withFirebase(AddPage);