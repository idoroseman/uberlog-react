import React, { useEffect } from "react";
import { compose } from 'recompose';
import { useParams } from "react-router-dom";
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';

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
    
    useEffect(() => {
        return props.firebase.logbook(logbookIndex).doc(id).onSnapshot((snapshot=>{
            console.log("snap")
            setQso(snapshot.data());
        }))
    }, [])

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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase)
  (EditPage);