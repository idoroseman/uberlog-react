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
import Adif from '../Adif';
import { DXCC } from '../Helpers'
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const SettingsPage = ({firebase}) => {
    const classes = useStyles();
    const [selected, setSelected] = React.useState(localStorage.getItem('selectedLogbook'));
    const [logbooks, setLogbooks] = React.useState({});
    const [fields, setFields] = React.useState({title:"", callsign:"", grid:""})

    useEffect(() => {
      return firebase.user().onSnapshot((snapshot) => {
        setLogbooks(snapshot.data().logbooks)
        setFields(snapshot.data().logbooks[selected]);
        })
    }, []);

    const handleTextChange = (event) => {
      setFields({...fields, [event.target.id]: event.target.value})
    }

    const handleSelectChange = (event) => {
        localStorage.setItem('selectedLogbook', event.target.value)
        setSelected(event.target.value);
        setFields(logbooks[event.target.value]);
    };

    const handleSubmit = () => {

    }

    const handleCheckDB = () => {
      console.log("fetching meta data")
      const dxcc = new DXCC();
      firebase.logbook(selected).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          const qso = doc.data()
          // fix missing country_
          if (qso.country_ !== undefined)
            firebase.logbook(selected).doc(doc.id).update({country_:firebase.firestore.FieldValue.delete()})
          if (qso.COUNTRY === undefined)
            firebase.logbook(selected).doc(doc.id).update({COUNTRY:dxcc.countryOf(qso.CALL).name})
          if (qso.DXCC === undefined)
            firebase.logbook(selected).doc(doc.id).update({COUNTRY:dxcc.countryOf(qso.CALL).entity_code})
          if (qso.CQZ === undefined)
            firebase.logbook(selected).doc(doc.id).update({COUNTRY:dxcc.countryOf(qso.CALL).cq_zone})
          if (qso.ITUZ === undefined)
            firebase.logbook(selected).doc(doc.id).update({COUNTRY:dxcc.countryOf(qso.CALL).itu_zone})
          if (qsp.flag_ === undefined) 
            firebase.logbook(selected).doc(doc.id).update({COUNTRY:dxcc.countryOf(qso.CALL).flag})

          // fix bad formated grid
          if (qso.GRID){
            var grid = ""
            for (var i=0; i<qso.GRID.length; i+=4)
              if (i == 0)
                grid += qso.GRID.substr(i,4).toUpperCase()
              else
                grid += qso.GRID.substr(i,4).toLowerCase()
            if (qso.GRID != grid)
            firebase.logbook(selected).doc(doc.id).update({GRID:grid})
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
          const db = firebase.logbook(selected)
          qsos.forEach((qso=>db.add(qso)))
        });
        reader.readAsText(file);
      })
    }

    const lbs = Object.keys(logbooks)
       .map((i)=><MenuItem key={i} value={i}>{logbooks[i].title}</MenuItem>)
 

  return <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Settings: </h1>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Logbook</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selected}
            onChange={handleSelectChange}
          >
            {lbs}
          </Select>
        </FormControl>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField id="title" value={fields.title} label="Log Name" onChange={handleTextChange}/><br/>
        <TextField id="callsign" value={fields.callsign} label="Callsign" onChange={handleTextChange}/><br/>
        <TextField id="grid" value={fields.grid} label="Grid Locatior" onChange={handleTextChange}/><br/>
        </form>
        <Button size="small" onClick={handleSubmit}>Save</Button>
        <Button size="small" onClick={()=>{setFields(logbooks[selected])}}>Reset</Button>
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

        <Button variant="text" component="span" className={classes.button}>
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
  withFirebase,
)(SettingsPage);
