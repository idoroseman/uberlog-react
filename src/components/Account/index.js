import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import SignOutButton from '../SignOut';

const useStyles = makeStyles((theme) => ({
  input: {
      display: 'none'
  }
}));

const AccountPage = () => {
  const isInvalid = false;
  const eqsl_username = '';
  const eqsl_password = '';
  const qrz_username = '';
  const qrz_password ='';
  const lotw_username = '';
  const lotw_password = '';

  const onSubmit = (event) => {
  };

  const classes = useStyles();

  return  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>

        <PasswordChangeForm />
        <hr/>
        
        <SignOutButton />
        <hr/>
        
        eqsl.cc
        <form onSubmit={onSubmit}>
          <input
            name="eqsl_username"
            value={eqsl_username}
            type="text"
            placeholder="username"
          />
          <input
            name="eqsl_password"
            value={eqsl_password}
            type="password"
            placeholder="Password"
          />
          <button disabled={isInvalid} type="submit">
            Save
          </button>
        </form>
        <Button variant="text" component="span" className={classes.button}>
            Sync
        </Button>
        <hr/>

        qrz.com
        <form onSubmit={onSubmit}>
          <input
            name="qrz_username"
            value={qrz_username}
            type="text"
            placeholder="username"
          />
          <input
            name="qrz_password"
            value={qrz_password}
            type="password"
            placeholder="Password"
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
        <form onSubmit={onSubmit}>
          <input
            name="lotw_username"
            value={lotw_username}
            type="text"
            placeholder="username"
          />
          <input
            name="lotw_password"
            value={lotw_password}
            type="password"
            placeholder="Password"
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
        <form onSubmit={onSubmit}>
          <input
            name="lotw_username"
            value={lotw_username}
            type="text"
            placeholder="username"
          />
          <input
            name="lotw_password"
            value={lotw_password}
            type="password"
            placeholder="Password"
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

export default withAuthorization(condition)(AccountPage);
