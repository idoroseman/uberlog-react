import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip';

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
    <ListItem button component={RouterLink} to={ROUTES.LOGBOOK}>
      <ListItemIcon>
        <Tooltip title="Logbook" placement="right-start">
          <ListIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Logbook" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.ADD}>
      <ListItemIcon>
        <Tooltip title="Add" placement="right-start">
          <AddIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Add" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.STATS}>
      <ListItemIcon>
        <Tooltip title="Statistics" placement="right-start">
          <DashboardIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.REPORTER}>
      <ListItemIcon>
        <Tooltip title="Reporter" placement="right-start">
          <WavesIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Reporter" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.MAP}>
      <ListItemIcon>
        <Tooltip title="Map" placement="right-start">
          <MapIcon />
        </Tooltip>
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
        <Tooltip title="Settings" placement="right-start">
          <SettingsIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
    <ListItem button component={RouterLink} to={ROUTES.ACCOUNT}>
      <ListItemIcon>
        <Tooltip title="Account" placement="right-start">
          <PersonIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Account" />
    </ListItem>
  </div>
);
