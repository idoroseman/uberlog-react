import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';
import WavesIcon from '@mui/icons-material/Waves';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

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
