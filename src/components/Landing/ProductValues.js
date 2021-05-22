import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core//Typography';

import searchIcon from './search-black-18dp.svg'
import noteIcon from './note_add-24px.svg'
import photoIcon from './insert_photo-24px.svg'
import devicesIcon from './devices-black-18dp.svg'

import productCurvyLines from './productCurvyLines.png'

const styles = (theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#5d99c6',
  },
  container: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(30),
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  image: {
    height: 55,
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
  },
});

function ProductValues(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src={productCurvyLines}
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src={noteIcon}
                alt="suitcase"
              />
              <Typography variant="h6" className={classes.title}>
                Easy to add a QSO
              </Typography>
              <Typography variant="h5">
                {' writing down your QSO should be fun.'}
                {' you can write details freely and uberlog will figure out'}
                {' it\'s a callsign, date or signal report'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src={photoIcon}
                alt="graph"
              />
              <Typography variant="h6" className={classes.title}>
                View your QSLs
              </Typography>
              <Typography variant="h5">
                {' remember the fun of flipping through a deck of QSL card?'}
                {' with uberlog you can browse and enjoy these pictures from far away'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src={searchIcon}
                alt="clock"
              />
              <Typography variant="h6" className={classes.title}>
                Easy Search
              </Typography>
              <Typography variant="h5">
                {' just type in what ever you need on the search bar '}
                {' and uberlog will find what you need'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src={devicesIcon}
                alt="devices"
              />
              <Typography variant="h6" className={classes.title}>
                Runs Everywhere
              </Typography>
              <Typography variant="h5">
                {' using your mac, pc, favorite browser or mobile phone?'}
                {' uberlog got you covered'}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

ProductValues.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);
