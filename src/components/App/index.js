import React, { useEffect } from 'react';
import { BrowserRouter as Router , Redirect, Route, } from 'react-router-dom';
import { compose } from 'recompose';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import clsx from 'clsx';
import { mainListItems, secondaryListItems } from '../layout/menuListItems';
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
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from "@material-ui/icons/Clear";


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

import * as ROUTES from '../constants/routes';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthentication } from '../Session';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import {useStyles} from '../layout'

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

const MyAppBar = (props) => {
  const classes = useStyles();
  
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
      UberLog {props.callsign?" - "+props.callsign.toUpperCase():""}
    </Typography>
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        clearable="true"
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 
          'aria-label': 'search' ,
        }}
        value={props.search}
        onChange={props.onSearchChanged} 
      />
      <IconButton onClick={props.onClearSearch}> 
              <ClearIcon />
        </IconButton>
    </div>
    <IconButton color="inherit">
      <Badge badgeContent={4} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  </Toolbar>
</AppBar>
}

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

function App ({firebase}) {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [authUser, setAuthUser]= React.useState(null);
  const [user, setUser] = React.useState(null);
  const [logbookIndex, setLogbookIndex] = React.useState(localStorage.getItem('selectedLogbook') || 0)
  const [logbook, setLogbook] = React.useState({
    loading: true,
    qsos: [],
  })

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  // update user status
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

  // get current logbook
  useEffect(()=>{
    setLogbook({loading:true, qsos:[]})
    return user ? firebase.logbook(logbookIndex).onSnapshot(snapshot => {
      console.log("snapshot")
      setLogbook({
        qsos: snapshot.docs.map((doc)=>doc.data()).sort(comapare),
        loading: false,
      });
    }) : null;
  }, [user, logbookIndex]) // run only if user changed

  const comapare = (a,b) => {
    if (a.QSO_DATE+a.TIME_ON > b.QSO_DATE+b.TIME_ON) return -1;
    if (b.QSO_DATE+b.TIME_ON > a.QSO_DATE+b.TIME_ON) return 1;
    return 0;
  }

  const currentCallsign = user ? user.logbooks[logbookIndex].callsign : ""

  return  <Router>
    <div className={classes.root}>
      <CssBaseline />

      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <>
            <MyAppBar open={drawerOpen} 
              onDrawerClose={handleDrawerClose} 
              onDrawerOpen={handleDrawerOpen}
              search={search}
              onSearchChanged={(e)=>{setSearch(e.target.value)}}
              onClearSearch={() => setSearch('')}
              callsign = {currentCallsign}
              />
            <MyDrawer open={drawerOpen} onDrawerClose={handleDrawerClose} />
            </> : <MyAppBar open={false} />
        }
      </AuthUserContext.Consumer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
            <Route exact path={ROUTES.HOME} render={(props) => {
              {//<Navigation {...props} filterText={search} />
            }
              return !!user?<Redirect to={ROUTES.LOGBOOK}/>: <LandingPage {...props} />
            }} />
            <Route path={ROUTES.LOGBOOK} render={(props)=>(
              <LogbookPage {...props} 
                filterText={search} 
                qsos={logbook.qsos}
                loading={logbook.loading}
                />)}
            />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.ADD} render={(props)=>(
              <AddPage {...props} 
                qsos = { logbook.qsos }
                logbookIndex = {logbookIndex}
              />)}
            />
            <Route path={ROUTES.MAP}>
              <MapPage qsos = { logbook.qsos }/>
            </Route>
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.SETTINGS} render={(props)=>(
              <SettingsPage {...props} 
                  logbooks = {user ? user.logbooks : [] }
                  logbookIndex = {logbookIndex}
                  onIndexChange = {(value)=>{
                    localStorage.setItem('selectedLogbook', value)
                    setLogbookIndex(value);
                  }}
              />)}
            />
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