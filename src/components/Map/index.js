import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withStyles } from '@material-ui/styles';
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import {gridSquareToLatLon} from './HamGridSquare'

const useStyles = makeStyles(theme => ({
}))

const MapPage = ( props ) => {

    const toLatLon = (coor) => { return {lat:coor[0], lng:coor[1] }}

    const markers = props.qsos.map((item)=>{
        if (item.GRID){
            try {
                let color = "red";
                if (item["MODE"] == "SSB")
                color = "green";
                if ((item["MODE"] == "FT8") || (item["MODE"] == "JT65"))
                color = "blue"
                if ((item["MODE"] == "PSK") || (item["MODE"] == "RTTY"))
                    color = "purple";
                return <Marker
                    title={item.CALL}
                    key={item.QSO_DATE+item.TIME_ON+item.CALL}
                    name={item.Call}
                    position={toLatLon(gridSquareToLatLon(item.GRID))} 
                    icon={{ url:"http://maps.google.com/mapfiles/ms/icons/"+color+".png" }}
                />
            }
            catch(err){
                console.log(item.CALL, item.GRID, err)
            }

        }
    })
    return (<>
        <p> 
        <img src="http://maps.google.com/mapfiles/ms/icons/green.png" height="16"/> Voice
        <img src="http://maps.google.com/mapfiles/ms/icons/blue.png" height="16"/> WSJT
        <img src="http://maps.google.com/mapfiles/ms/icons/purple.png" height="16"/> Digital
        <img src="http://maps.google.com/mapfiles/ms/icons/red.png" height="16"/> Other
        </p>
        <Map google={props.google} 
             zoom={4}
             initialCenter={{ lat: 32.397, lng: 34.644 }}
             >
        { markers }
        </Map>
        </>
    )
}

const condition = authUser => !!authUser;

export default compose(
    withAuthorization(condition),
    withStyles(useStyles),
    GoogleApiWrapper({ apiKey: "", }),
  )(MapPage);
    