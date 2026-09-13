import React, { useEffect, useState } from "react";
import { compose } from '../../utils/compose';
import { useParams } from "react-router-dom";
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

const EditPage = (props) =>{
    const classes = useStyles();
    let { id } = useParams();
    const logbookIndex = localStorage.getItem('selectedLogbook') || 0;
    const [qso, setQso] = React.useState({});
    const [editField, setEditField] = React.useState("");
    const [editKey, setEditKey] = React.useState("");
    const [editVal, setEditVal] = React.useState("");

    const has_printed_qsl = (qso.APP_UBERLOG_RECV_PRINTED=="Y")// || (props.qso.QSL_RCVD_VIA=="B") || (props.qso.QSL_RCVD_VIA=="D")

    useEffect(() => {
        return props.firebase.logbook(logbookIndex).doc(id).onSnapshot((snapshot=>{
            console.log("snap")
            setQso(snapshot.data());
        }))
    }, [])

    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    const handleUpload = () => {}

    const handleUpdateField = (event) => { 
      var obj = {};
      obj[editKey] = editVal;
      props.firebase.logbook(logbookIndex).doc(id).update(obj);
      setEditField("")
     }
    
    const handleDeleteField = (key) => { console.log(key) }
    
    const rows = Object.keys(qso).sort().map((x)=>{return {key:x, value:qso[x]}})

    return (
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Field</TableCell>
              <TableCell align="left">Value</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <>
              <TableRow key={row.key}>
                <TableCell component="th" scope="row">
                  {row.key == editField ? <TextField id="key_input" label="key" value={editKey} onChange={(e)=>{setEditKey(e.target.value)}} />:row.key}
                </TableCell>
                <TableCell align="left">
                {row.key == editField ? <TextField id="value_input" label="value" value={editVal} onChange={(e)=>{setEditVal(e.target.value)}} />:row.value}
                </TableCell>
                <TableCell align="right">
                    {row.key == editField ? <CheckIcon onClick={handleUpdateField} /> :""}
                    {row.key == editField ? <CancelIcon onClick={()=>{setEditField("")}}/> :""}
                    {row.key == editField ? "":<EditIcon onClick={()=>{
                      setEditField(row.key)
                      setEditKey(row.key)
                      setEditVal(row.value)
                      }} />}
                    <DeleteIcon id={row.key} onClick={()=>{handleDeleteField(row.key)}}/>
                </TableCell>
              </TableRow>
              { row.key.endsWith("_image_url_") ? <TableRow><TableCell></TableCell><TableCell><img style={{width:"100%"}} src={row.value}/></TableCell><TableCell></TableCell></TableRow> :"" }
              </>
            ))}
          </TableBody>
        </Table>
        {has_printed_qsl ? "": <Button size="small" onClick={()=>{props.onRecvPrintedQsl(props.qso.id_)}}>Add Recieved Printed QSL</Button>}
        <div>
            <input type="file" onChange={handleChange} accept="/image/*" />
            <button onClick={handleUpload}>Upload to Firebase</button>
            {percent} "% done"
        </div>
      </TableContainer>
    )
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase)
  (EditPage);