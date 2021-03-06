import React from 'react';
import { BrowserRouter as Router , Route, } from 'react-router-dom';

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
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Navigation from '../Navigation';
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
      UberLog
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

function App () {
  const classes = useStyles();
  const [open, setOpen] = React.useState( true);
  const [search, setSearch] = React.useState("");
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return  <Router>
    <div className={classes.root}>
      <CssBaseline />

      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <>
            <MyAppBar open={open} 
              onDrawerClose={handleDrawerClose} 
              onDrawerOpen={handleDrawerOpen}
              search={search}
              onSearchChanged={(e)=>{setSearch(e.target.value)}}
              onClearSearch={() => setSearch('')}
              />
            <MyDrawer open={open} onDrawerClose={handleDrawerClose} />
            </> : <MyAppBar open={false} />
        }
      </AuthUserContext.Consumer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
            <Route exact path={ROUTES.HOME} render={(props) => (
              <Navigation {...props} filterText={search} />
            )} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.ADD} component={AddPage} />
            <Route path={ROUTES.MAP} component={MapPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.SETTINGS} component={SettingsPage} />
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  </Router>
}

export default withAuthentication(App);
