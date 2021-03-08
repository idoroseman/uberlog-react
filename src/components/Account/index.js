import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import SignOutButton from '../SignOut';

const useStyles = makeStyles((theme) => ({
  input: {
      display: 'none'
  }
}));

const AccountPage = ({firebase}) => {
  const isInvalid = false;

  const qrz_username = '';
  const qrz_password ='';
  const lotw_username = '';
  const lotw_password = '';

  const [secrets, setSecrets] = React.useState({});

  useEffect(() => {
    return firebase.user().collection("secrets").onSnapshot(snapshot => { 
      var s = {}
      snapshot.docs.forEach((doc)=>{s[doc.id] = doc.data()})
      setSecrets(s)
    })
  }, []);

  const handleTextChange = (e) => {
    const t = e.target.name.split("_")
    let s = Object.assign({},secrets);
    s[t[0]][t[1]] = e.target.value;
    setSecrets(s)
  }

  const handleSave = (event) => {
    firebase.user().collection("secrets").doc(event.target.name).set(secrets[event.target.name])
  };

  const handleEqslSync = () => {
    console.log("click")
    // const eqsl = new Eqsl(secrets["eqsl.cc"].username, secrets["eqsl.cc"].password)
    // eqsl.fetchQsls().then(text=>console.log(text)).catch(err=>console.log(err))
  }

  const classes = useStyles();
  console.log(secrets)
  return  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        
        <SignOutButton />
        <hr/>

        change password
        <PasswordChangeForm />
        <hr/>

        eqsl.cc
        <br/>
          <input
            name="eqsl.cc_username"
            value={'eqsl.cc' in secrets ? secrets['eqsl.cc'].username || '':''}
            type="text"
            placeholder="username"
            onChange={handleTextChange}
          />
          <input
            name="eqsl.cc_password"
            value={'eqsl.cc' in secrets ? secrets['eqsl.cc'].password || '':''}
            type="password"
            placeholder="Password"
            onChange={handleTextChange}
          />
          <button name="eqsl.cc" disabled={isInvalid} onClick={handleSave}>
            Save
          </button>
          <br/>
        <Button variant="text" component="span" className={classes.button} onClick={handleEqslSync}>
            Sync
        </Button>
        <hr/>

        qrz.com
        <form onSubmit={handleSave}>
          <input
            name="qrz_username"
            value={qrz_username}
            type="text"
            placeholder="username"
            readOnly
          />
          <input
            name="qrz_password"
            value={qrz_password}
            type="password"
            placeholder="Password"
            readOnly
          />
          <button disabled={isInvalid} type="submit">
            Save
          </button>
        </form>
        <Button variant="text" component="span" className={classes.button}>
            Sync
        </Button>
        <hr/>

        LoTW
        <form onSubmit={handleSave}>
          <input
            name="lotw_username"
            value={lotw_username}
            type="text"
            placeholder="username"
            readOnly
          />
          <input
            name="lotw_password"
            value={lotw_password}
            type="password"
            placeholder="Password"
            readOnly
          />
          <button disabled={isInvalid} type="submit">
            Save
          </button>
        </form>
        <Button variant="text" component="span" className={classes.button}>
            Sync
        </Button>
        <hr/>

        ClubLog
        <form onSubmit={handleSave}>
          <input
            name="lotw_username"
            value={lotw_username}
            type="text"
            placeholder="username"
            readOnly
          />
          <input
            name="lotw_password"
            value={lotw_password}
            type="password"
            placeholder="Password"
            readOnly
          />
          <button disabled={isInvalid} type="submit">
            Save
          </button>
        </form>
        <Button variant="text" component="span" className={classes.button}>
            Sync
        </Button>
      </div>
    )}
  </AuthUserContext.Consumer>
}


const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AccountPage);