import React, { useEffect } from 'react';
import { HashRouter as Router , Redirect, Route, useLocation} from 'react-router-dom';
import { compose } from 'recompose';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import clsx from 'clsx';
import { mainListItems, secondaryListItems } from './menuListItems';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from "@material-ui/icons/Clear";
import SyncIcon from '@material-ui/icons/Sync';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import ListIcon from '@material-ui/icons/List';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import LogbookPage from '../Logbook';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import AddPage from '../Add';
import MapPage from '../Map';
import SettingsPage from "../Settings";
import EditPage from "../Edit";
import StatsPage from "../Stats";
import PSKReporterPage from "../PSKReporter"

import * as ROUTES from '../constants/routes';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthentication } from '../Session';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import {useStyles} from '../layout'

import moment from 'moment'
import 'moment/locale/en-gb';
import { QRZ_COM_lookup, QRZ_COM_logbook, eqsl, LoTW, Clublog } from '../Information';
import { DXCC, Adif } from '../Helpers'
import {fetchCors} from '../Information'

import isElectron from 'is-electron';
import { MergeType } from '@material-ui/icons';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

//------------------------------------------------------------------------------

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        ido roseman
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

//------------------------------------------------------------------------------
const NoMatch = () => {
  const location = useLocation();
  console.log(location.pathname);
  return ( <>           
  <Typography variant="h4">404</Typography>
  <Typography variant="subtitle1">
   Page not found!
  </Typography>
  <pre>{location.pathname}</pre>
   </>)
}

//------------------------------------------------------------------------------

const MyAppBar = (props) => {
  const classes = useStyles();
  const [currentDateTime, setCurrentDateTime] = React.useState("")
  

  useEffect(() => {
    const interval = setInterval(() => {
      const locale = moment().locale("en-GB");
      setCurrentDateTime(locale.utc().format("l LT"))
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <AppBar position="absolute" className={clsx(classes.appBar, props.open && classes.appBarShift)}>
  <Toolbar className={classes.toolbar}>
    <IconButton
      edge="start"
      color="inherit"
      aria-label="open drawer"
      onClick={props.onDrawerOpen}
      className={clsx(classes.menuButton, props.open && classes.menuButtonHidden)}
    >
      <MenuIcon />
    </IconButton>
    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
      {props.callsign?props.callsign.toUpperCase():"UberLog"} - {props.grid?props.grid:""} {currentDateTime}
    </Typography>

    <IconButton color="inherit">
    <Badge badgeContent={props.qsos_num} max={999} color="primary" className={classes.margin}>
      <Tooltip title="QSO Count" placement="bottom">
        <ListIcon />
      </Tooltip>
    </Badge>
    <Badge variant={props.qslServiceCount?"dot":"standard"} color="secondary" className={classes.margin} onClick={props.onSync}>
      <Tooltip title="Sync" placement="bottom">
        <SyncIcon />
      </Tooltip>
    </Badge>
    { isElectron() ?
      <Badge color="secondary" variant="standard" className={classes.margin}>
        <HtmlTooltip
            title={
              <React.Fragment>
                Connections<br/><em>wsjt-x</em>
              </React.Fragment>
            }
          >
          <SettingsEthernetIcon />
        </HtmlTooltip>
      </Badge> : "" }
    { isElectron() ?
      <Badge color="secondary" variant={props.isOnTop?"dot":"standard"} className={classes.margin} onClick={props.onStayOnTop}>
        <HtmlTooltip
          title={
            <React.Fragment>
              Stay On Top
            </React.Fragment>
          }
        >
        <VerticalAlignTopIcon />
      </HtmlTooltip>
    </Badge> : ""
    }
    </IconButton>
  </Toolbar>
</AppBar>
}

//------------------------------------------------------------------------------

const MyDrawer = (props) => {
  const classes = useStyles();
 return  <Drawer
  variant="permanent"
  classes={{
    paper: clsx(classes.drawerPaper, !props.open && classes.drawerPaperClose),
  }}
  open={props.open}
>
  <div className={classes.toolbarIcon}>
    <IconButton onClick={props.onDrawerClose}>
      <ChevronLeftIcon />
    </IconButton>
  </div>
  <Divider />
  <List>{mainListItems}</List>
  <Divider />
  <List>{secondaryListItems}</List>
</Drawer>
}

//------------------------------------------------------------------------------

function App ({firebase}) {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [authUser, setAuthUser]= React.useState(null);
  const [user, setUser] = React.useState(null);
  const [secrets, setSecrets] = React.useState({})
  const [logbookIndex, setLogbookIndex] = React.useState(localStorage.getItem('selectedLogbook') || 0)
  const [logbook, setLogbook] = React.useState({
    loading: true,
    qsos: [],
  })
  const [isOnTop, setIsOnTop] = React.useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  // update user auth status
  useEffect(() => {
    return firebase.auth.onAuthStateChanged( user => { setAuthUser(user); } );
  })

  // update user details
  useEffect(() => {
    if (authUser)
      return firebase.user().onSnapshot(querySnapshot => { setUser(querySnapshot.data()) })
    else
      return null      
    }, [authUser])

  // get current secrets
  useEffect(()=>{
    return user ? firebase.user().collection("secrets").onSnapshot(snapshot => { 
      let temp = {}
      snapshot.forEach((doc)=>{ temp[doc.id] = doc.data() })
      setSecrets(temp)
    }) : null;
  }, [user]) // run only if user changed

  // get current logbook
  useEffect(()=>{
    setLogbook({loading:true, qsos:[]})
    return user ? firebase.logbook(logbookIndex).onSnapshot(snapshot => {
      console.log("logbook snapshot")
      setLogbook({
        qsos: snapshot.docs.map((doc)=>Object.assign(doc.data(), {id_: doc.id})).sort(comapare),
        loading: false,
      });
    }) : null;
  }, [user, logbookIndex]) // run only if user changed

  const comapare = (a,b) => {
    if (a.QSO_DATE+a.TIME_ON > b.QSO_DATE+b.TIME_ON) return -1;
    if (b.QSO_DATE+b.TIME_ON > a.QSO_DATE+b.TIME_ON) return 1;
    return 0;
  }

  //-----------------------------------------------------------------------------
  //                                    I P C
  //-----------------------------------------------------------------------------
  const handleStayOnTop = (event) =>{
    window.ipcRenderer.send('always-on-top', !isOnTop)
    localStorage.setItem('stayOnTop', !isOnTop)
    setIsOnTop(!isOnTop)
  }

  //-----------------------------------------------------------------------------
  //                                    Q S L
  //-----------------------------------------------------------------------------

  const [qslServiceCount, setQslServiceCount] = React.useState(0);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));

  }

  const mergeQsl = (index, qsl, filter="QSL") => {
    if (!index)
      return
    let was_changed = {}
    for (var field in qsl)
    {
      var f = field.replaceAll("SENT","RCVD")
      // only update fields relevant to QSLs
      if ((field.includes(filter) || field.startsWith("APP_")) && (logbook.qsos[index][f] != qsl[field])) {
        was_changed[f] = qsl[field]
      }
    }
    if (Object.keys(was_changed).length==0)
      return 0
    console.log(logbook.qsos[index].id_, logbook.qsos[index].CALL, filter, was_changed)
    firebase.logbook(logbookIndex).doc(logbook.qsos[index].id_).update(was_changed)
    return 1
  }

  const mergeQslList = (qsls, filter) => {
    let j = logbook.qsos.length - 1;
    let timestamp_a = moment.utc(logbook.qsos[j]["QSO_DATE"] + " " + logbook.qsos[j]["TIME_ON"], "YYYYMMDD HHmm");
    let mismatchs = []
    let ok_count = 0;
    let err_count = 0;

    for (var i in qsls){ 
      const qso = qsls[i]
      const timestamp_b = moment.utc(qso["QSO_DATE"] + " " + qso["TIME_ON"], "YYYYMMDD HHmm");
      while((j>0) && (moment.duration(timestamp_b.diff(timestamp_a)).asMinutes() > 0)){
        j--;
        timestamp_a = moment.utc(logbook.qsos[j]["QSO_DATE"] + " " + logbook.qsos[j]["TIME_ON"], "YYYYMMDD HHmm");
      }
      if ((qso.CALL==logbook.qsos[j].CALL) && (qso.QSO_DATE==logbook.qsos[j].QSO_DATE))
        ok_count += mergeQsl(j, qso, filter)
      else
        mismatchs.push(qso)
    }
    console.log(mismatchs.length, "mismatches")
    for (let i in mismatchs){
      for (let j in logbook.qsos)
        if ((mismatchs[i].CALL==logbook.qsos[j].CALL) && (mismatchs[i].QSO_DATE==logbook.qsos[j].QSO_DATE)) {
          const timestamp_a = moment.utc(logbook.qsos[j]["QSO_DATE"] + " " + logbook.qsos[j]["TIME_ON"], "YYYYMMDD HHmm");
          const timestamp_b = moment.utc(mismatchs[i]["QSO_DATE"] + " " + mismatchs[i]["TIME_ON"], "YYYYMMDD HHmm");
          var diff = Math.abs(moment.duration(timestamp_b.diff(timestamp_a)).asMinutes());
          if ((diff<=15) || (Math.abs(diff-120)<=15) || (Math.abs(diff-180)<=15)) {
            ok_count += mergeQsl(j, mismatchs[i], filter)
            break;  
          }
        }
      err_count++;
      // console.log("No match", mismatchs[i])
      }

    console.log("count", qsls.length, "new", ok_count, "bad", err_count)
  }

  const findQsosId = (qsls) => {
    let j = logbook.qsos.length - 1;
    let timestamp_a = moment.utc(logbook.qsos[j]["QSO_DATE"] + " " + logbook.qsos[j]["TIME_ON"], "YYYYMMDD HHmm");
    let mismatchs = []
    let ok_count = 0;
    let err_count = 0;

    // quick match
    for (var i in qsls){ 
      const timestamp_b = moment.utc(qsls[i]["QSO_DATE"] + " " + qsls[i]["TIME_ON"], "YYYYMMDD HHmm");
      while((j>0) && (moment.duration(timestamp_b.diff(timestamp_a)).asMinutes() > 0)){
        j--;
        timestamp_a = moment.utc(logbook.qsos[j]["QSO_DATE"] + " " + logbook.qsos[j]["TIME_ON"], "YYYYMMDD HHmm");
      }
      if ((qsls[i].CALL==logbook.qsos[j].CALL) && (qsls[i].QSO_DATE==logbook.qsos[j].QSO_DATE)){
        qsls[i].j_ = j
      }
        
    }

    // slow match for the rest
    for (let i in qsls){
      if (qsls[i].id_)
        continue;
      for (let j in logbook.qsos)
        if ((qsls[i].CALL==logbook.qsos[j].CALL) && (qsls[i].QSO_DATE==logbook.qsos[j].QSO_DATE)) {
          const timestamp_a = moment.utc(logbook.qsos[j]["QSO_DATE"] + " " + logbook.qsos[j]["TIME_ON"], "YYYYMMDD HHmm");
          const timestamp_b = moment.utc(qsls[i]["QSO_DATE"] + " " + qsls[i]["TIME_ON"], "YYYYMMDD HHmm");
          var diff = Math.abs(moment.duration(timestamp_b.diff(timestamp_a)).asMinutes());
          if ((diff<=15) || (Math.abs(diff-120)<=15) || (Math.abs(diff-180)<=15)) {
            qsls[i].j_ = j
            break;  
          }
        }
      err_count++;
      }

      return qsls
  }

  const handleQslSync =  (event) => {
    let count = 0;
    console.log("shift", event.shiftKey)
    const adif = new Adif()
    
    // eQSL 
    const eqsl_service = new eqsl(secrets['eqsl.cc']);
    count++
    setQslServiceCount(count)
    eqsl_service.fetchQsls().then(async(text)=>{
      const qsls = adif.parseAdifFile(text)
      findQsosId(qsls)
      qsls.forEach((q)=>{mergeQsl(q.j_, q)})
      // check for eqsl images
      for (let i in qsls) {
        const qsl = qsls[i]
        if ((!!qsl.j_) && (qsl.QSL_SENT_VIA=="E") && (logbook.qsos[qsl.j_].eqslcc_image_url_===undefined)) {
          try {
            const storageName = authUser.uid + "/" + logbook.qsos[qsl.j_].id_ + ".jpg"
            const url = await eqsl_service.fetchImageAlt(qsl)
            const res = await fetchCors(url)
            const blob = await res.blob()
            //uploading blob to firebase storage
            const snapshot = await firebase.storageRef().child(storageName).put(blob)
            const downloadURL = await snapshot.ref.getDownloadURL()
            // this.eqsl.archive(qso);
            console.log("got image for", qsl.QSO_DATE+"-"+qsl.TIME_ON+"-"+qsl.CALL)
            firebase.logbook(logbookIndex).doc(logbook.qsos[qsl.j_].id_).update({eqslcc_image_url_ : downloadURL})
            await sleep(10500) // eqsl Throttle request to every 10 seconds
          }    
          catch (err){
            console.log(err)
            await sleep(10500) // eqsl Throttle request to every 10 seconds
          }
        }
      }
      count--
      setQslServiceCount(count)
    })

    // LoTW
    const lotw_service = new LoTW(secrets["lotw"]);
    count++
    setQslServiceCount(count)
    lotw_service.fetchQsls().then((text)=>{
      console.log(text)
      const qsls = adif.parseAdifFile(text)
      mergeQslList(qsls)
      count--
      setQslServiceCount(count)
    })
    
    // qrz.com
    const qrzcom_service = new QRZ_COM_logbook(secrets['qrz.com'])
    count++
    setQslServiceCount(count)
    qrzcom_service.fetchQsls().then((text)=>{
      const qsls = adif.parseAdifFile(text, false)
      mergeQslList(qsls, "QRZLOG")
      count--
      setQslServiceCount(count)
    })
    
    // clublog
    const clublog_service = new Clublog(secrets['clublog'], currentCallsign)
    count++
    setQslServiceCount(count)
    clublog_service.fetchQsls().then((qsls)=>{
      mergeQslList(qsls.sort(comapare))
      count--
      setQslServiceCount(count)
    })

  }

  //-----------------------------------------------------------------------------
  
  const handleSendQsl = (id) => {
        console.log(id)
        let output = {}
        firebase.logbook(logbookIndex).doc(id).get().then(async(snapshot)=>{
          const qso = snapshot.data()
          console.log(qso)
          if (qso["MODE"].startsWith("PSK")) {
            qso["SUBMODE"] = qso["MODE"];
            qso["MODE"] = "PSK"
          }
          qso['QSLMSG'] = user.qslmsg;
          if (qso.STATION_CALLSIGN)
            qso["STATION_CALLSIGN"] = currentCallsign
          const adif = new Adif()
          const text = adif.objectToAdif(qso)
          // eQSL 
          try { 
            const eqsl_service = new eqsl(secrets['eqsl.cc']);
            const result = await eqsl_service.sendEQsl(text)
            console.log("eqsl.cc sent"); 
            output.QSL_SENT = "Y" 
          }
          catch(err) {
            console.log("eqsl.cc", err)
          }
          // LoTW
          // const lotw_service = new LoTW(secrets["lotw"]);
          // lotw_service.sendEQsl(text).then(()=>{ output.QSL_SENT = "Y" })
          // qrz.com
          try{
            const qrzcom_service = new QRZ_COM_logbook(secrets['qrz.com'])
            const result = await qrzcom_service.sendEQsl(text)
            console.log("qrz.com sent"); 
            output.QSL_SENT = "Y" 
          }
          catch(err){
            console.log("qrz.com", err)
          }
          // clublog
          try{
            const clublog_service = new Clublog(secrets['clublog'], currentCallsign)
            const result = await clublog_service.sendEQsl(text)
            console.log("clublog sent"); 
            output.QSL_SENT = "Y" 
          }
          catch(err){
            console.log("clublog", err)
          }
          // update logbook
          console.log(output)
          if (Object.keys(output).length>0)
             firebase.logbook(logbookIndex).doc(id).update(output)
        })
      }

  //-----------------------------------------------------------------------------
  //                               Connections
  //-----------------------------------------------------------------------------
  const dxcc = new DXCC();

  const handleWsjtxQso = (event, qso)=>{
    const info = dxcc.countryOf(qso.CALL.toUpperCase())
    console.log(info)
    if(info){
      qso.COUNTRY = info.name 
      qso.DXCC = info.entity_code 
      qso.CQZ = info.cq_zone
      qso.ITUZ = info.itu_zone
      qso.flag_ = info.flag
      }
    console.log(qso)
    firebase.logbook(logbookIndex).add(qso)
      .then(()=>{
        console.log("submited")
      })
      .catch((err)=>{console.log(err)})
  }

  const handleWsjtxHeartbear = (event) => {
    console.log("ping")
  }

  useEffect(()=>{
    if (window.ipcRenderer){
      window.ipcRenderer.on('qso', handleWsjtxQso)
      return ()=>{window.ipcRenderer.removeEventListener('qso', handleWsjtxQso)}
    }
  }, [])
  
  useEffect(()=>{
    if (window.ipcRenderer){
      window.ipcRenderer.on('heartbeat', handleWsjtxHeartbear)
      return ()=>{window.ipcRenderer.removeEventListener('heartbeat', handleWsjtxHeartbear)}
    }
  }, [])


  //-----------------------------------------------------------------------------
  //                                render
  //-----------------------------------------------------------------------------

  const currentCallsign = user ? user.logbooks[logbookIndex].callsign : ""
  const currentGrid = user ? user.logbooks[logbookIndex].grid : ""
  const qrzcom_lookup = new QRZ_COM_lookup(secrets["qrz.com"])
  return  <Router>
    <div className={classes.root}>
      <CssBaseline />

      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <>
            <MyAppBar open={drawerOpen} 
              onDrawerClose={handleDrawerClose} 
              onDrawerOpen={handleDrawerOpen}
              callsign = {currentCallsign}
              grid = {currentGrid}
              qsos_num = { logbook.qsos.length }
              isOnTop = {isOnTop}
              onStayOnTop = {handleStayOnTop}
              onSync={handleQslSync}
              qslServiceCount={qslServiceCount}
              />
            <MyDrawer open={drawerOpen} onDrawerClose={handleDrawerClose} />
            </> : <MyAppBar open={false} />
        }
      </AuthUserContext.Consumer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
            <Route exact path={ROUTES.HOME} render={(props) => {
              return !!user?<Redirect to={ROUTES.LOGBOOK}/>: <LandingPage {...props} />
            }} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>

            <Route path={ROUTES.LOGBOOK} render={(props)=>(
              <LogbookPage {...props} 
                qsos={logbook.qsos}
                loading={logbook.loading}
                onSendQsl={handleSendQsl}
                />)}
            />
            <Route path={ROUTES.ADD} render={(props)=>(
              <AddPage {...props} 
                qsos = { logbook.qsos }
                logbookIndex = {logbookIndex}
                lookupService = {qrzcom_lookup}
              />)}
            />
            <Route path={ROUTES.EDIT+"/:id" } component={EditPage} />
            <Route path={ROUTES.REPORTER}>
              <PSKReporterPage callsign={currentCallsign} />
            </Route>
            <Route path={ROUTES.MAP}>
              <MapPage qsos = { logbook.qsos }/>
            </Route>
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.SETTINGS} render={(props)=>(
              <SettingsPage {...props} 
                  logbooksMetadata = {user ? user.logbooks : [] }
                  logbookIndex = {logbookIndex}
                  qsos = { logbook.qsos }
                  lookupService = {qrzcom_lookup}

                  onIndexChange = {(value)=>{
                    localStorage.setItem('selectedLogbook', value)
                    setLogbookIndex(value);
                  }}
              />)}
            />
            <Route path={ROUTES.STATS} render={(props)=>(
              <StatsPage {...props} 
                qsos={logbook.qsos}
                loading={logbook.loading}
                />)}
            />
{
//            <Route component={NoMatch} /> 
}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  </Router>
}

export default compose(
  withAuthentication,
  withFirebase,
)(App);