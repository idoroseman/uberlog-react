import React, { Component, useRef} from 'react';
import clsx from 'clsx';
import { compose } from 'recompose';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { FixedSizeList, VariableSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

import { withAuthorization } from '../Session';
import { withStyles } from '@material-ui/styles';
import { fade, makeStyles } from '@material-ui/core/styles';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from '@material-ui/core/IconButton';

import QsoTile from './qso_tile'

var moment = require('moment');

const useStyles = makeStyles((theme) => ({
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

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    background: fade(theme.palette.primary.main, 0.15),
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '48ch',
      '&:focus': {
        width: '48ch',
      },
    },
  },

}));

const useFocus = () => {
  const htmlElRef = useRef(null)
  const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

  return [ htmlElRef, setFocus ] 
}

const LogbookPage = (props) => {

  const classes = useStyles();
  const [inputRef, setInputFocus] = useFocus()

  const [search, setSearch] = React.useState("");

  const filtered_list = props.qsos.filter((item) => {
    var isMatch = false;

    ["CALL", "FREQ", "MODE", "NAME", "QTH", "GRID", "COMMENT", "MY_CITY", "COUNTRY", "QSO_DATE"].forEach((fieldName) => {
      if ((item[fieldName]) && (item[fieldName].toString().toLowerCase().search(search.toLowerCase()) !== -1))
        isMatch = true;
    })
    if (moment.utc(item["timestamp_"]).locale("en-gb").format("L").toLowerCase().search(search.toLowerCase()) !== -1)
      isMatch = true;
    if ((item["country_"]) && (item["country_"].toLowerCase().includes(search.toLowerCase())))
      isMatch = true;
    return isMatch;
  })

  const renderRow = (props) => {
    const { index, style } = props;

    if (props.loading)
      return <Typography component="h2" variant="h6" color="primary" gutterBottom>Loading... </Typography>
    return <div key={index} style={style}>
          <QsoTile key={index} style={style} qso={filtered_list[index]} />
        </div>        
  }


  return (
    <Paper className={clsx(classes.paper, classes.logbook)}>
    
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          ref={inputRef}
          clearable="true"
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 
            'aria-label': 'search' ,
          }}
          value={search}
          onChange={(e)=>{setSearch(e.target.value); setInputFocus()}} 
        />
        <IconButton onClick={() => setSearch('')}> 
                <ClearIcon />
          </IconButton>
      </div>
      { props.qsos.length==0?"No QSOs to show. go make some":""}
      { search && filtered_list.length==0?"No QSOs matching search":""}
      <div style={{ height: '80vh' }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList 
              height={height} 
              width={width} 
              itemSize={ 125 }
              itemCount={filtered_list.length}
              initialScrollOffset={0}
              >
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
)(LogbookPage);
