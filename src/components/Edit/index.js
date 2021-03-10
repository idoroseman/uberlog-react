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

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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

    useEffect(() => {
        return props.firebase.logbook(logbookIndex).doc(id).onSnapshot((snapshot=>{
            setQso(snapshot.data());
        }))
    })

    const rows = Object.keys(qso).map((x)=>{return {key:x, value:qso[x]}})

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
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.key}
                </TableCell>
                <TableCell align="left">{row.value}</TableCell>
                <TableCell align="right"><EditIcon/><DeleteIcon/></TableCell>
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