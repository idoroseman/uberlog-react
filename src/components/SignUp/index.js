import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../constants/routes';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const INITIAL_STATE = {
  fname: '',
  lname: '',
  callsign: '',
  email: '',
  password: '',
  error: null,
};

const SignUpPage = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState(INITIAL_STATE);

  const onChange = event => {
    setState({...state, [event.target.name]: event.target.value });
  };

  const onSubmit = event => {
    const { fname, lname, email, password, callsign } = state;
    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {

        // Create a user in your Firebase realtime database
        return props.firebase
          .user(authUser.user.uid)
          .set({
            fname,
            lname,
            email,
            logbooks: {
              0: {
                callsign: callsign || "N0CALL",
                grid:"",
                title: fname+"'s logbook"
              }
            }
          });
      })
      .then(authUser => {
        setState({ ...INITIAL_STATE });
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        console.log(error)
        setState({ error });
      });

    event.preventDefault();
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="fname"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={props.fname}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={props.lname}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="callsign"
                label="callsign"
                name="callsign"
                autoComplete="callsign"
                value={props.callsign}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={props.email}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={props.password}
                onChange={onChange}
              />
            </Grid>
            {state.error && <p>{state.error.message}</p>}

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href={ROUTES.SIGN_IN} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )}


const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);


export default compose(
  withRouter,
  withFirebase,
)(SignUpPage);;

export { SignUpLink };

