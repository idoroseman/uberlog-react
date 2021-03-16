import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Unsubscribe } from '@material-ui/icons';
import { DXCC, Adif} from '../Helpers'

var fs = require("fs");

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const SettingsPage = (props) => {
    const classes = useStyles();
    const [fields, setFields] = React.useState({})
    const [fileDownloadUrl, setFileDownloadUrl] = React.useState("")
    const downloadRef = React.createRef();

    useEffect(()=>{
      setFields(props.logbooksMetadata[props.logbookIndex])
    }, [props.logbooksMetadata, props.logbookIndex])

    const handleTextChange = (event) => {
      setFields({...fields, [event.target.id]: event.target.value})
    }

    const handleSelectChange = (event) => {
        props.onIndexChange(event.target.value)
        if (event.target.value in props.logbooks)
          setFields(props.logbooks[event.target.value]);
        else
          setFields({title:"New logbook", callsign:"N0CALL", grid:""})
    };

    const handleSubmit = () => {
      const tmp = props.logbooks
      tmp[props.logbookIndex]=fields
      props.firebase.user().update({logbooks:tmp})
    }

    const handleCheckDB = () => {
      console.log("fetching meta data")
      const dxcc = new DXCC();
      props.firebase.logbook(props.logbookIndex).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          const qso = doc.data()
          // fix missing calculated fields
          if (qso.COUNTRY === undefined)
            props.firebase.logbook(props.logbookIndex).doc(doc.id).update({COUNTRY:dxcc.countryOf(qso.CALL).name})
          if (qso.DXCC === undefined)
            props.firebase.logbook(props.logbookIndex).doc(doc.id).update({DXCC:dxcc.countryOf(qso.CALL).entity_code})
          if (qso.CQZ === undefined)
            props.firebase.logbook(props.logbookIndex).doc(doc.id).update({CQZ:dxcc.countryOf(qso.CALL).cq_zone})
          if (qso.ITUZ === undefined)
            props.firebase.logbook(props.logbookIndex).doc(doc.id).update({ITUZ:dxcc.countryOf(qso.CALL).itu_zone})
          if (qso.flag_ === undefined) 
            props.firebase.logbook(props.logbookIndex).doc(doc.id).update({flag_:dxcc.countryOf(qso.CALL).flag})

          // fix bad formated grid
          if (qso.GRID){
            var grid = ""
            for (var i=0; i<qso.GRID.length; i+=4)
              if (i == 0)
                grid += qso.GRID.substr(i,4).toUpperCase()
              else
                grid += qso.GRID.substr(i,4).toLowerCase()
            if (qso.GRID != grid)
              props.firebase.logbook(props.logbookIndex).doc(doc.id).update({GRID:grid})
            }
        })
      })
      
    }

    const handleImportAdif = (e) => {
      
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      filesArr.forEach((file)=>{
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
          const qsos = Adif.parseAdifFile(event.target.result);
          const db = props.firebase.logbook(props.logbookIndex)
          qsos.forEach((qso=>db.add(qso)))
        });
        reader.readAsText(file);
      })
      
    }

    const handleExportAdif = (event) => {
      event.preventDefault();
      console.log("prepare")
      // create data
      let output;
      const adif = new Adif();
      output += "UBerLog\n"
      output += "<EOH>\n"
      props.qsos.map((item)=>{
        output += adif.objectToAdif(item)+"\n"
      });

      // save data
      const blob = new Blob([output]);                   
      const fileDownloadUrl = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = fileDownloadUrl;
      link.download = props.logbooksMetadata[props.logbookIndex].callsign+".adif"
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link = null;
    }

    const lbs = Object.keys(props.logbooksMetadata)
       .map((i)=><MenuItem key={i} value={i}>{props.logbooksMetadata[i].title}</MenuItem>)
 

  return <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Settings: </h1>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Logbook</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.logbookIndex}
            onChange={handleSelectChange}
          >
            {lbs}
            <MenuItem key="add new" value={lbs.length}><i>Add new logbook</i></MenuItem>
          </Select>
        </FormControl>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField id="title" value={fields ? fields.title : "new logbook"} label="Log Name" onChange={handleTextChange}/><br/>
        <TextField id="callsign" value={fields ? fields.callsign : "N0CALL"} label="Callsign" onChange={handleTextChange}/><br/>
        <TextField id="grid" value={fields ? fields.grid : ""} label="Grid Locatior" onChange={handleTextChange}/><br/>
        </form>
        <Button size="small" onClick={handleSubmit}>Save</Button>
        <Button size="small" onClick={()=>{setFields(props.logbooks[props.logbookIndex])}}>Reset</Button>
        <hr/>

        Database
        <Button variant="text" component="span" className={classes.button} onClick={handleCheckDB}>
            Check 
        </Button>
        <hr/>

        import
        <input
          accept=".adi,.adif"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleImportAdif}
        />
        <label htmlFor="raised-button-file">
          <Button variant="text" component="span" className={classes.button}>
            ADIF
          </Button>
        </label> 
        <hr/>

        export
        <Button variant="text" component="span" className={classes.button} onClick={handleExportAdif}>
            ADIF
        </Button>
        <Button variant="text" component="span" className={classes.button}>
          PDF
        </Button>
        <hr/>
      </div>
    )}
  </AuthUserContext.Consumer>
}


const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase)
  (SettingsPage);
