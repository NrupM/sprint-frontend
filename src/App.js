import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
// import $ from "jquery";
import "./App.css";

const domain = (process.env.BACKEND || 'https://whirlwind.herokuapp.com')

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
      search: '',
      duration: ''
    };
  }
  onInputChange(e) {
    this.setState({
      search: e.target.value
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.getDirections();
    } 
  }
  getUserLocation() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
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
        this.setState(newState);
      });
    }
  }
  componentDidMount() {
    this.getUserLocation();
    this.getMuniVehicles();
  }
  getDirections(){
    let originLat = this.state.map.center.lat;
    let originLng = this.state.map.center.lng;
    // let originLat = "37.7627837";
    // let originLng = "-122.4633105";
    let destination = this.state.search;
    let mode = 'transit';
    let newGoogleUrl = domain + "/maps?originLat=" + originLat + "&originLng=" + originLng + "&destination="+ destination +"&mode="+mode;
    
    //// FEETCH GOOGLE API INFO
    fetch(newGoogleUrl)
    .then(res => res.json())
    .then(res => {
      console.log("TARGET ", res)
      let steps = res.routes[0].legs[0].steps;
      console.log(steps)
      steps.forEach(step => {
        if (step.travel_mode === 'TRANSIT' && step.transit_details['line'].agencies[0].name === 'SFMTA'){
          let lineName = step.transit_details['line'].short_name
          let departureStop = step.transit_details.departure_stop.name
          // TODO: Figure out the diretion (inbound or outbound her)
          // var direction = longstart - longend 
          // if negative, then inbound, else if positive, outbound
          console.log("SUCCESS: ", lineName + " @ " + departureStop)
          let busUrl = `http://restbus.info/api/agencies/sf-muni/routes/${lineName}`
          fetch(busUrl)
          .then(res => res.json())
          .then(res => {
              console.log("this is the restBus lineName data", res)
              let stops = res.stops
              console.log("these are the stops for my line", stops)
              console.log("this is the departure stop I need to look for", departureStop)
              stops.forEach(stop => {
                // if google name contains 'station' in the end, only use first word
                // if google name contains 'station', only use first word in restBus
                // check for inbound or outbound when in stations
                if(stop.title.split(' ')[0] === departureStop.split(' ')[0]){
                  console.log(stop.id);
                  let stopId = stop.id;
                  let stopIdUrl = `http://restbus.info/api/agencies/sf-muni/routes/${lineName}/stops/${stopId}/predictions`
                  console.log(stopIdUrl)
                }
                // console.log("RESTBus: ", stop.title)
                // console.log("Google: " , departureStop)
                // if(stop.title === departureStop){
                //   let stopId = stop.title
                //   console.log("successful stopId:", stopId)
                // }
                console.log("error with matching departureStop ")
              })
          })
            // iterate through stops to find a stop title that matches line name
            // stopID = whatever you find in this object right now
            // then go to the end point for that particular stop
            // let stopUrl = http://restbus.info/api/agencies/sf-muni/routes/N/whateves
            // fetch(stopUrl)
            //   dig in there until you find the stop times in seconds
            //   console.log those out 
            //   set state.
            //   celebrate like MAD!!!!!
          // this.setState(duration)
        } else if (step.travel_mode === 'TRANSIT' && step.transit_details['line'].agencies[0].name === 'Bay Area Rapid Transit'){
          alert('We do not support BART currently, please try another destination')
                    // TODO change alert to something nicer 

        }
      })
      // if(steps.travel_mode === )
      // // this.setState(blah blah blah)
    })
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
        <div className="transit-circle"><i className="fa fa-bus fa-fw"></i>
          <div className="transit-circle-text">{this.state.search}
            </div>
        </div>
        
      </div>
    );
  }
}

export default App;