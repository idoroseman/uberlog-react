import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import {useStyles} from '../layout'

const LandingPage = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return <Grid item xs={12} md={8} lg={9}>
    <Paper className={fixedHeightPaper}>
      <h1>Landing</h1>
    </Paper>
  </Grid>
}
export default LandingPage;
