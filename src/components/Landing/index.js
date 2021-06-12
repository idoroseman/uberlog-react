import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import {useStyles} from '../layout'

import ProductHero from './ProductHero';
import ProductValues from './ProductValues';
import ProductDownload from './ProductDownload';
import ProductSmokingHero from './ProductSmokingHero';

const LandingPage = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const myRef = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView({behavior: "smooth"});
  return(
    <React.Fragment>
      <ProductHero onDownloadClick={executeScroll} />
      <ProductValues />
      <div ref={myRef}></div> 
      <ProductDownload />
      <ProductSmokingHero />
    </React.Fragment>
  )
}
export default LandingPage;
