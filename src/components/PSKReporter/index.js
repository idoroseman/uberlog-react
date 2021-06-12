import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import { PSKReporter } from '../Information';

var moment = require('moment');

const useStyles = makeStyles(theme => ({
}))

const PSKReporterPage = ( props ) => {
    useEffect(()=>{
        pskreporter.setActive(!!props.callsign)
        return (()=>{pskreporter.setActive(false)})
    }, [])
    const [countdown, setCountdown] =  React.useState(0)
    const [reports, setReports] = React.useState([])
    const now = moment();
    const pskreporter = new PSKReporter(props.callsign);
    pskreporter.on('tick', (counter) => { setCountdown(counter) })
    // pskreporter.on('status', (obj) => { this.setState({pluginStat: Object.assign({}, this.state.pluginStat, obj)}) })
    pskreporter.on('reports', (list) => { setReports(list) })

    const sortedReports = reports == undefined? [] : Object.keys(reports).sort((a,b)=>{return reports[b].lastHeared - reports[a].lastHeared})
    var tab = sortedReports.slice(-10).map((key, index) => {
      const item = reports[key]
      const d = -item.lastHeared.diff(now, 'minutes');
      return <tr key={key}><td>{item.callsign}</td>
              <td>{item.receiverCountry}</td>
              <td>{item.band}</td>
              <td>{item.snr}</td>
              <td>{d>60? Math.round(d/60).toString()+"h" : d.toString()+"m"}</td>
            </tr>
    })
    return (
        <div id="pskreporter">
            { countdown > 0 ? "update in " + countdown +" seconds":"fetching update..."}
            <table>
            <tbody>
            <tr key="header">
                <td>callsign</td>
                <td>country</td>
                <td>band</td>
                <td>signal</td>
                <td>ago</td>
            </tr>
            {tab}
            </tbody>
            </table>
        </div>
    )
}

const condition = authUser => !!authUser;

export default compose(
    withAuthorization(condition),
    withStyles(useStyles),
  )(PSKReporterPage);
    