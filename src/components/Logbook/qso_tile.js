import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/Styles';
import { useHistory } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';

import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SatelliteIcon from '@material-ui/icons/Satellite';
import EditIcon from '@material-ui/icons/Edit';
import MicIcon from '@material-ui/icons/Mic';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';

import BackgroundImg from './bg_320x240.jpg';

import Flag from 'react-world-flags'

var moment = require('moment');

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
		width: 530,
    maxHeight: "120px"

  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: 360,
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 180,
    maxHeight: "120px"
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

function humanFreq(freq)
{
  let f = Math.floor(freq)
  if (f>1000)
    return (f/1000).toFixed(2).replace(/\.?0*$/,'')+"G";
  return f+"M"
}

export default function QsoTile( props ) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  // var datetime = moment().utc(props.qso.QSO_DATE + " " + props.qso.TIME_ON , "YYYYMMDD HHmm").locale("en-gb")
  const hasLocation = props.qso.QTH || props.qso.GRID ;
  const locationText = props.qso.QTH==null || props.qso.QTH=="" ?props.qso.GRID:props.qso.QTH;

  const has_eqsl_qsl = (props.qso.QSL_RCVD=="Y") && (props.qso.QSL_RCVD_VIA=="E")
  const has_lotw_qsl = props.qso.APP_LOTW_MODEGROUP !== undefined
  const has_qrzcom_qsl = props.qso.APP_QRZLOG_STATUS == "C"
  const has_clublog_qsl = props.qso.APP_CLUBLOG_STATUS == "C"
  const has_qsl_rcvd = has_eqsl_qsl || has_lotw_qsl || has_qrzcom_qsl
  const has_qsl_sent = props.qso.QSL_SENT=="Y"

  const bull = <span className={classes.bullet}>•</span>;
  const tooltip = <React.Fragment>
    { has_eqsl_qsl?"eqsl ":"" } 
    { has_lotw_qsl?"LoTW ":"" } 
    { has_qrzcom_qsl?"qrz ":"" } 
    { has_clublog_qsl?"clublog ":"" }
  </React.Fragment>

  let image_url = BackgroundImg;
  if (props.qso.eqslcc_image_url_)
    image_url=props.qso.eqslcc_image_url_;
  else if (props.qso.qrzcom_image_url_)
    image_url=props.qso.qrzcom_image_url_;

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cover}
        image={image_url}
        title="qsl card"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Grid container justify="space-between">  
              <Typography inline="true" variant="h5" align="left">{props.qso.CALL}</Typography>
              <Typography inline="true" variant="h5" align="right">{DateTimeFormat(props.qso.QSO_DATE, props.qso.TIME_ON)} </Typography>
          </Grid>

          <Grid container justify="space-between">            
            <Typography variant="subtitle1" color="textSecondary">
             {props.qso.flag_?<Flag code={props.qso.flag_} height="16"/>:<span>&#x1f3f3;</span>}{" "}{props.qso.COUNTRY}
            {hasLocation? <><LocationOnIcon/>{locationText}</>:""}
            </Typography>
            <Typography variant="body2" component="p">
                {((props.qso.NAME != null) && (props.qso.NAME != "")) ? <><PersonIcon/>{props.qso.NAME}</>:""}
            </Typography>
          </Grid>
          <Grid container justify="space-between">            
            <Typography variant="body2" component="p">
              {props.qso.PROP_MODE=='SAT'?<SatelliteIcon/>:""}{" "}
              {props.qso.MODE}{" "}{humanFreq(props.qso.FREQ)}{props.qso.FREQ_RX?"/"+humanFreq(props.qso.FREQ_RX):""}
              {props.qso.MY_NAME ? <><MicIcon/>{props.qso.MY_NAME}</>:"" }
              {props.qso.MY_CITY ? <><RoomOutlinedIcon/>{props.qso.MY_CITY}</>:"" }
            </Typography>
          
            <Typography variant="body2" component="p">
              {has_qsl_sent ? "": <Button size="small" onClick={()=>{props.onSendQsl(props.qso.id_)}}>Send</Button>}
              <FormControlLabel control={<Checkbox name="checkedC" checked={has_qsl_sent} />} label="S" />
              <Tooltip title={tooltip} placement="top">
                <FormControlLabel control={<Checkbox name="checkedC" checked={has_qsl_rcvd} />} label="R" />
              </Tooltip>
              <EditIcon onClick={()=>{history.push("/qso/"+props.qso.id_);}}/>
            </Typography>
          </Grid>

        </CardContent>

      </div>

    </Card>
  );
}
