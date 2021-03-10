import React, { Component } from 'react';
import clsx from 'clsx';
import { compose } from 'recompose';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

import { withAuthorization } from '../Session';
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import QsoTile from './qso_tile'

var moment = require('moment');

const useStyles = makeStyles({
  root: {
    height: "100%",
    overflowX: "hidden",
  },
  
  List: {
    border: "1px solid #d9dddd"
  },
  logbook:{
    backgroundColor: 'white',

  },
});

const LogbookPage = (props) => {

  const classes = useStyles();

  const filtered_list = props.qsos.filter((item) => {
    var isMatch = false;

    ["CALL", "FREQ", "MODE", "NAME", "QTH", "GRID", "COMMENT", "MY_CITY"].forEach((fieldName) => {
      if ((item[fieldName]) && (item[fieldName].toString().toLowerCase().search(props.filterText.toLowerCase()) !== -1))
        isMatch = true;
    })
    if (moment.utc(item["timestamp_"]).locale("en-gb").format("L").toLowerCase().search(props.filterText.toLowerCase()) !== -1)
      isMatch = true;
    if ((item["country_"]) && (item["country_"].toLowerCase().includes(props.filterText.toLowerCase())))
      isMatch = true;
    return isMatch;
  })

  const renderRow = (props) => {
    const { index, style } = props;

    return props.loading
      ? <Typography component="h2" variant="h6" color="primary" gutterBottom>Loading... </Typography>
      : <div key={index} style={style}>
          <QsoTile key={index} style={style} qso={filtered_list[index]} />
        </div>
  }

  return (

    <Paper className={clsx(classes.paper, classes.logbook)}>
      <div style={{ height: '80vh' }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList height={height} width={width} itemSize={125} itemCount={filtered_list.length} >
              {renderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </Paper>
  );

}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withStyles(useStyles),
)(LogbookPage);
