import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from '../Session';
import LandingPage from '../Landing';
import HomePage from '../Home';

const Navigation = (props) => {
  return <div>
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <HomePage {...props} /> : <LandingPage {...props} />
    }
  </AuthUserContext.Consumer>
</div>
}


export default Navigation;
