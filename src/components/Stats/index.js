import React, { Component } from 'react';
import clsx from 'clsx';
import { compose } from 'recompose';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Doughnut, Bar, HorizontalBar } from "react-chartjs-2";

import BannerImg from './banner.png';

import { makeStyles } from '@material-ui/core/styles';
import { withAuthorization } from '../Session';

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
    }
}))

//------------------------------------------------------------------------------

const DashCard = (props) => {
  const classes = useStyles();  

  return <Card className={classes.root}>
  <CardActionArea>
      <CardMedia
      component="img"
      alt=""
      height="40"
      image={BannerImg}
      title=""
      />
      <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
          {props.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
          {props.children}
      </Typography>
    </CardContent>
  </CardActionArea>
  </Card>
}

//------------------------------------------------------------------------------

const DashCardTable = (props) => {
  return <DashCard title={props.title}>
    <table>
      <tbody>
      { Object.keys(props.data).sort(function(a,b){return props.data[b]-props.data[a]}).map(key=><tr><td>{key}</td><td>{props.data[key]}</td></tr>)}
      </tbody>
    </table>
  </DashCard>
}

//------------------------------------------------------------------------------

const DashCardDoughnut = (props) => {
  const sortedKeys = Object.keys(props.data).sort(function(a,b){return props.data[b]-props.data[a]})
  const data = {
    labels: sortedKeys.slice(0,6),
    datasets: [
      {
        label: props.label,
        data: sortedKeys.map(key=>props.data[key]),
        borderWidth: 1,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  }

  const options = {
    legend: {
      display: true,
      position: 'right',
      onClick: null
    }
  }

  return <DashCard title={props.title}>
      <Doughnut data={data} options={options}/>
  </DashCard>
}

//------------------------------------------------------------------------------

const DashCardBar = (props) => {
  const sortedKeys = Object.keys(props.data).sort(function(a,b){return props.data[b]-props.data[a]})
  const data = {
    labels: sortedKeys.slice(0,10),
    datasets: [
      {
        label: props.label,
        data: sortedKeys.map(key=>props.data[key]),
        borderWidth: 1,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
      },
    ],
  }
  const options = {
    legend: {
      display: false,
      position: 'right',
      onClick: null
    }
  }

  return <DashCard title={props.title}>
      <HorizontalBar data={data} options={options}/>
  </DashCard>
}

//------------------------------------------------------------------------------

const DashCardHistory = (props) => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  const e = new Date();
  e.setMonth(e.getMonth() + 1);
  const data = {
    labels: [...Array(12).keys()].map((i)=>{d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0,7)}),
    datasets: [
      {
        label: props.label,
        data: [...Array(12).keys()].map((i)=>{e.setMonth(e.getMonth() - 1); return props.data[e.toISOString().replace("-","").slice(0,6)] || 0}),
        borderWidth: 1,
      },
    ],
  }
  
  const options = {
    legend: {
      display: false,
      position: 'right',
      onClick: null
    }
  }

  return <DashCard title={props.title}>
      <Bar data={data} options={options}/>
  </DashCard>
}

//------------------------------------------------------------------------------

const StatsPage = (props) => {

    const classes = useStyles();  
    
    let counter = {};
    props.qsos.map((qso)=>{
      for (var field in qso)
        {
          if (!(field in counter))
            counter[field] = {}
          var val = qso[field]
          if (field=='FREQ')
            val = Math.floor(val)
          if (field=="QSO_DATE")
            val = val.slice(0,6)
          if (!(val in counter[field]))
            counter[field][val] = 1;
          else
            counter[field][val]++;
        }
    });
    console.log(counter);

    const sum = (obj) => {
      if (!obj)
        return 0;
      return Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);
    }

    // band mode COUNTRY
    return (
        <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <DashCardTable title="General"
              data = {{"QSOs":props.qsos.length,
                       "Unique Callsigns": props.loading ? 0 : Object.keys(counter["CALL"]).length,
                       "Countries": props.loading ? 0 : Object.keys(counter["COUNTRY"]).length}}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashCardTable title="QSLs"
              data = {{ "eQSL.cc": props.loading?0:sum(counter["QSL_RCVD_VIA"]),
                        "qrz.com": (props.loading || (!counter["APP_QRZLOG_STATUS"])) ? 0: counter["APP_QRZLOG_STATUS"]["C"],
                        "LoTW": props.loading?0:sum(counter["APP_LOTW_MODEGROUP"]),
                        "clublog": 0,
                        "bureau": ""
                      }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <DashCardHistory title="Activity"
                  data = { props.loading?"":counter["QSO_DATE"]}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item  xs={12} sm={12} md={4}>
            <DashCardDoughnut title="Bands"
              data = { props.loading?"":counter["FREQ"]}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <DashCardDoughnut title="Modes"
              data = { props.loading?"":counter["MODE"] }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <DashCardBar title="Countries"
              data = { props.loading?"":counter["COUNTRY"]}
            />
          </Grid>
        </Grid>
      </div>
    
    );
  
  }
  
  const condition = authUser => !!authUser;
  
  export default compose(
    withAuthorization(condition),
  )(StatsPage);
  