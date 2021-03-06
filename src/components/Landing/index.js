import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import {useStyles} from '../layout'

import ProductHero from './ProductHero';
import ProductValues from './ProductValues';

const LandingPage = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return(
    <React.Fragment>
      <ProductHero />
      <ProductValues />
    </React.Fragment>
  )
}
export default LandingPage;
