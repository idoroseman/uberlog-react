import React, { Component } from 'react';
import clsx from 'clsx';
import { compose } from 'recompose';

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import { withAuthorization } from '../Session';
import { useStyles } from '../layout'
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/styles';

import QsoTile from './qso_tile'

var moment = require('moment');

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      qsos: [],
    };
  }

  comapare(a,b){
    if (a.QSO_DATE+a.TIME_ON > b.QSO_DATE+b.TIME_ON) return -1;
    if (b.QSO_DATE+b.TIME_ON > a.QSO_DATE+b.TIME_ON) return 1;
    return 0;
  }

  componentDidMount() {
    this.setState({ loading: true });
    const uid = this.props.firebase.auth.currentUser.uid;
    const index = localStorage.getItem('selectedLogbook') || 0
    this.unsubscribe = this.props.firebase.logbook(index).onSnapshot(snapshot => {
      this.setState({
        qsos: snapshot.docs.map((doc)=>doc.data()).sort(this.comapare),
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubsribe)
      this.unsubscribe();
  }

  render() {
    const { qsos, loading } = this.state;
    const { classes } = this.props;
    
    const filtered_list = this.state.qsos.filter((item)=>{
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
        {/* <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Logbook1
        </Typography> */}
        <List>
        {loading ? <div>Loading ...</div> : <>{qso_list}</>}
        </List>
        </Paper>

    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withStyles(useStyles),
)(HomePage);
