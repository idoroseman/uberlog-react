import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from '../../utils/compose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../constants/routes';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';

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
          <Grid container justifyContent="flex-end">
            <Grid item>
              Already have an account? <Link to={ROUTES.SIGN_IN} variant="body2">
                 Sign in
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

