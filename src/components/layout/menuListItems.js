import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import MapIcon from '@material-ui/icons/Map';
import WavesIcon from '@material-ui/icons/Waves';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';

import * as ROUTES from '../constants/routes';
import { Link as RouterLink } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListItem button component={RouterLink} to={ROUTES.HOME}>
      <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText primary="Logbook" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.ADD}>
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Add" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.STATS}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.REPORTER}>
      <ListItemIcon>
        <WavesIcon />
      </ListItemIcon>
      <ListItemText primary="Reporter" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.MAP}>
      <ListItemIcon>
        <MapIcon />
      </ListItemIcon>
      <ListItemText primary="Map" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    {
       // <ListSubheader inset>Saved reports</ListSubheader>
    }
    <ListItem button component={RouterLink} to={ROUTES.SETTINGS}>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.ACCOUNT}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Account" />
    </ListItem>
  </div>
);
