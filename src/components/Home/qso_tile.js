import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/Styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SatelliteIcon from '@material-ui/icons/Satellite';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
		width: 530,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: 340,
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 180,
    maxHeight: "140px"
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

function DateTimeFormat(d,t) {
  return d.slice(0,4) + "-" + d.slice(4,6) + "-" + d.slice(6,8) + "   " + t.slice(0,2) + ":" + t.slice(2,4);
}

export default function QsoTile( props ) {
  const classes = useStyles();
  const theme = useTheme();
  const hasLocation = props.qso.QTH != null || props.qso.GRID != null;
  const locationText = props.qso.QTH==null?props.qso.GRID:props.qso.QTH;
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cover}
        image="http://via.placeholder.com/320x240"
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
        <Grid container justify="space-between">  
            <Typography inline="true" variant="h5" align="left">{props.qso.CALL}</Typography>
            <Typography inline="true" variant="h5" align="right">{DateTimeFormat(props.qso.QSO_DATE, props.qso.TIME_ON)} </Typography>
        </Grid>

          <Typography variant="subtitle1" color="textSecondary">
             {props.qso.country_}
             {props.qso.PROP_MODE=='SAT'?<SatelliteIcon/>:""}{" "}{props.qso.MODE}
          </Typography>

          <Typography variant="body2" component="p">
            {props.qso.NAME != null ? <><PersonIcon/>{props.qso.NAME}</>:""}
            {hasLocation? <><LocationOnIcon/>{locationText}</>:""}
            <FormControlLabel control={<Checkbox name="checkedC" />} label="S" />
            <FormControlLabel control={<Checkbox name="checkedC" />} label="R" />
          </Typography>

        </CardContent>
        {/* <div className={classes.controls}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </div> */}
      </div>

    </Card>
  );
}
