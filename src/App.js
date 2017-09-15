import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import $ from "jquery";

import "./App.css";

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
          lat: 37.7627837,
          lng: -122.4633105
         },
        zoom: 15
      },
      muniVehicles: [],
      search: ''
    };
  }
  onInputChange(e) {
    this.setState({
      search: e.target.value
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      let search = this.state.search;
      console.log(search)
      console.log("this state is searchinnnng: ", this.state.search)
      this.getDirections();
    } 
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
  componentWillMount(){
    console.log(this.state.map.center.lat)
  }
  componentDidMount() {
    this.getUserLocation();

    this.getMuniVehicles();
    console.log("componentDidMount state", this.state.map.center.lat)
  }
  getDirections(){
    console.log(this.state.map.center.lat)
    let originLat = this.state.map.center.lat;
    let originLng = this.state.map.center.lng;
    // let originLat = "37.7627837";
    // let originLng = "-122.4633105";
    let destination = this.state.search;
    let mode = 'transit';

    let newUrl = domain + "/maps?originLat=" + originLat + "&originLng=" + originLng + "&destination="+ destination +"&mode="+mode;
    console.log('******', newUrl);

    
    $.ajax({
      url: newUrl,
      success: function(data) { console.log(data) },
    });
    fetch(newUrl)
    .then(res => res.json())
    .then(res => {
      console.log("TARGET ", res.routes[0].legs[0].steps[0])
      let steps = res.routes[0].legs[0].steps;
      steps.forEach( step => {
        console.log(step.travel_mode)
        if(step.travel_mode === 'TRANSIT'){
          let duration = step.duration.text
          console.log("SUCCESS: ", duration)
        }
      })
      // if(steps.travel_mode === )
      // // this.setState(blah blah blah)
    })
    .then(res => console.log("fetching res like whoah", res.routes))
    // put your woah res into your state, then call this.state.woah down in render
    .catch(error => console.log("fetching routes error ", error.message))
  
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
        <div className="search-form">
          <input
            onChange={e => this.onInputChange(e)}
            placeholder="Where to ?"
            type="text"
            onKeyPress={this.handleKeyPress}
            value={this.state.search}
          />
        </div>
        <div className="transit-circle">
          <div className="transit-duration">blah blah blah
            </div>

        </div>
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
