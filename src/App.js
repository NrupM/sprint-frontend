import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import $ from "jquery";

import "./App.css";
import SearchForm from "./components/SearchForm";

const domain = (process.env.BACKEND || 'https://whirlwind.herokuapp.com')

// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// then wraps it into `withScriptjs` HOC
// It loads Google Maps JavaScript API v3 for you asynchronously.
// Name the component AsyncGettingStartedExampleGoogleMap
const AsyncGettingStartedExampleGoogleMap = withScriptjs(
  withGoogleMap(
    props => (
      <GoogleMap
        defaultZoom={3}
        center={props.center}
        zoom={props.zoom}
      >
      {
        props.muniVehicles.map((vehicle, index) => { 
          return (
          <Marker
          position={{ lat: vehicle.lat, lng: vehicle.lon }}
          key={vehicle.id} />);
        })
      }
      </GoogleMap>
    )
  )
);


const googleMapURL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCnyu2FJac70-X0EXKaoIxVw5RB4luN0uk';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {
        center: {
          lat: 0,
          lng: 0
         },
        zoom: 5
      },
      muniVehicles: []
    };
  }

  componentDidMount() {
    this.getUserLocation();
    this.getMuniVehicles();
    this.getDirections();
  }

  getUserLocation() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log("getUserLocation called");
        const coords = pos.coords;
        const newState = {
          map: {
            center: {
              lat: coords.latitude,
              lng: coords.longitude
            },
            zoom: 18
          }
        };
        console.log("newState is: ", newState);
        this.setState(newState);
      });
    }
  }

  getDirections(){
    let originLat = "37.7627837";
    let originLng = "-122.4633105";
    let destinationLat = "37.790841";
    let destinationLng = "-122.4034742";
    let mode = 'transit';

    let newUrl = domain + "/maps?originLat=" + originLat + "&originLng=" + originLng + "&destinationLat="+ destinationLat + "&destinationLng="+destinationLng+"&mode="+mode;
    console.log('******', newUrl);

    
    $.ajax({
      url: newUrl,
success: function(data) { console.log(data) },
});

    /*$.ajax({
      url: 
      method: 'GET',
      success: function(res){
        console.log("res for getDirections is: ", res)
      }
    })*/
  }

  getMuniVehicles() {
    fetch("http://107.170.254.162/vehicles")
      .then(res => res.json())
      .then(res => {
        const newState = {
          muniVehicles: res
        };
        this.setState(newState);
      })
      .catch(error =>
        console.log(
          `There has been a problem with your fetch vehicles operation: ${error.message}`
        )
      );
  }

  render() {
    return (
      <div className="App">
       <AsyncGettingStartedExampleGoogleMap
          googleMapURL={googleMapURL}
          className={"map"}
          zoom={this.state.map.zoom}
          center={this.state.map.center}
          containerElement={
            <div style={{ height: '100%', position: 'absolute', width: '100%'}} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
          style={{ width: "100%", height: "100%", position: "absolute" }}
          muniVehicles={this.state.muniVehicles}
          loadingElement={
            <div style={{ height: `100%` }}> loading </div>
          }
        />
        <SearchForm />
      </div>
    );
  }
}

export default App;

// var destinationNation = data.json();
// var travelStepsList = destinationNation.routes[0].legs[0].steps;
// var totalTransit = 0;
// for (x in destinationNation.routes[0].legs[0].steps['duration.text']){
//   sum += destinationNation.routes[0].legs[0].steps['duration.text'][x];
// }
// // travelStepsList.forEach(function (steps) {
// //   steps[i].duration.value;
// //   console.log(steps[i].duration.value)
// // });
