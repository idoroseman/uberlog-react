import React, { Component } from 'react';
import clsx from 'clsx';
import { compose } from 'recompose';

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { FixedSizeList } from 'react-window';

import { withAuthorization } from '../Session';
import { useStyles } from '../layout'
import { withStyles } from '@material-ui/styles';

import QsoTile from './qso_tile'

var moment = require('moment');

const LogbookPage = (props) => {

  const renderRow = (props) => {
    const { index, style } = props;
  
    return (
      <ListItem button style={style} key={index}>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItem>
    );
  }

  const { classes } = this.props;
    
  const filtered_list = this.props.qsos.filter((item)=>{
      var isMatch = false;

      ["CALL", "FREQ", "MODE", "NAME", "QTH", "GRID", "COMMENT", "MY_CITY"].forEach((fieldName)=>{
        if ((item[fieldName]) && (item[fieldName].toString().toLowerCase().search(this.props.filterText.toLowerCase()) !== -1))
          isMatch= true;        
      })
      if (moment.utc(item["timestamp_"]).locale("en-gb").format("L").toLowerCase().search(this.props.filterText.toLowerCase()) !== -1)
        isMatch= true;
      if ((item["country_"]) && (item["country_"].toLowerCase().includes(this.props.filterText.toLowerCase())))
        isMatch= true;
      return isMatch;
    })

  var qso_list = []
  filtered_list.forEach((qso) => {
    const ukey = qso.QSO_DATE+"-"+qso.TIME_ON+"-"+qso.CALL;
    qso_list.push(<QsoTile key={ukey} qso={qso}/>)
  });
  if (qso_list.length==0)
    qso_list.push(<Typography variant="body2" component="p">
    No QSOs to show
  </Typography>)

  return (
        <Paper className={clsx(classes.paper,classes.logbook)}>
        {this.props.loading ? <div>Loading ...</div> : <>{qso_list}</>}

        <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
          {renderRow}
        </FixedSizeList>
        </Paper>

    );
  
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withStyles(useStyles),
)(LogbookPage);
