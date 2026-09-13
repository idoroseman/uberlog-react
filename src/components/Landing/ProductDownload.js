import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material//Button';
import Typography from '@mui/material/Typography';
import productCurvyLines from './productCurvyLines.png';
import WindowsIcon from './WindowsIcon.svg';
import AppleIcon from './AppleIcon.svg';
import LinuxIcon from './LinuxIcon.svg';
import IOSIcon from './IOSIcon.svg';
import AndroidIcon from './AndroidIcon.svg';
import GithubIcon from './githubIcon.svg'


const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#fff5f8',
    overflow: 'hidden',
  },
  container: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  title: {
    marginBottom: theme.spacing(14),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
    opacity: 0.7,
  },
  button: {
    marginTop: theme.spacing(8),
  },
});

function ProductDownload(props) {
  const { classes } = props;
  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src={productCurvyLines}
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Typography variant="h4" marked="center" className={classes.title} component="h2">
          Download
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={2}>
              <div className={classes.item}>
                <div className={classes.number}>Windows</div>
                <img src={WindowsIcon} alt="windows" className={classes.image} />
                <Button
                    color="secondary"
                    size="large"
                    variant="contained"
                    className={classes.button}
                    component="a"
                    href={"https://firebasestorage.googleapis.com/v0/b/uberlog-1555107254876.appspot.com/o/public/UberLog-win32-x64.zip?alt=media"}
                    >
                    Download
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className={classes.item}>
                <div className={classes.number}>MacOS</div>
                <img src={AppleIcon} alt="macOS" className={classes.image} />
                <Button
                    color="secondary"
                    size="large"
                    variant="contained"
                    className={classes.button}
                    component="a"
                    href="https://firebasestorage.googleapis.com/v0/b/uberlog-1555107254876.appspot.com/o/public/UberLog-darwin-arm64.zip?alt=media"
                    >
                    Download (Apple Silicon)
                </Button>
                <Button
                    color="secondary"
                    size="small"
                    variant="text"
                    className={classes.button}
                    component="a"
                    href="https://firebasestorage.googleapis.com/v0/b/uberlog-1555107254876.appspot.com/o/public/UberLog-darwin-x64.zip?alt=media"
                    >
                    Download (Intel)
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className={classes.item}>
                <div className={classes.number}>Linux</div>
                <img src={LinuxIcon} alt="Linux" className={classes.image} />
                <Typography variant="h5" align="center">
                  Pending
                </Typography>
                let me know if you want it
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className={classes.item}>
                <div className={classes.number}>iOS</div>
                <img src={IOSIcon} alt="iOS" className={classes.image} />
                <Typography variant="h5" align="center">
                  Pending
                </Typography>
                i'm an iphone user, but getting uberlog into the App Store is expensive, will do so only if there is intrest
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className={classes.item}>
                <div className={classes.number}>Android</div>
                <img src={AndroidIcon} alt="Android" className={classes.image} />
                <Typography variant="h5" align="center">
                  Coming Soon
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className={classes.item}>
                <div className={classes.number}>Source</div>
                <img src={GithubIcon} alt="Android" className={classes.image} />
                <a href="https://github.com/idoroseman/uberlog-react">github</a>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </section>
  );
}

ProductDownload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductDownload);