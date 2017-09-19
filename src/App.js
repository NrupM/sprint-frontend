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
      transitArrivalTime: null,
      drivingArrivalTime: null,
      fastest: null,
    };
  }
  onInputChange(e) {
    this.setState({
      search: e.target.value
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.getTransitDirections();
      // this.getDrivingDirections()
      // this.findFastestRoute();
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
  getTransitDirections(){
    let originLat = this.state.map.center.lat;
    let originLng = this.state.map.center.lng;
    let destination = this.state.search;
    let mode = 'transit';
    let newGoogleUrl = domain + "/maps?originLat=" + originLat + "&originLng=" + originLng + "&destination="+ destination +"&mode="+mode;
    console.log(newGoogleUrl)
    //// FEETCH GOOGLE TRANSIT API INFO
    fetch(newGoogleUrl)
    .then(res => res.json())
    .then(res => {
      console.log("TARGET ", res)
      let transitArrivalTime = res.routes[0].legs[0].arrival_time.text
      console.log("transitArrivalTime before setState", transitArrivalTime)
      const newState = {
        transitArrivalTime: transitArrivalTime
      };
      this.setState(newState)
      this.getDrivingDirections()
      console.log('transitArrivalTime has updated state to', this.state.transitArrivalTime)
    })
    // put your woah res into your state, then call this.state.woah down in render
    .catch(error => console.log("fetching routes error ", error.message))
  }
  getDrivingDirections() {
    let originLat = this.state.map.center.lat;
    let originLng = this.state.map.center.lng;
    let destination = this.state.search;
    let newGoogleUrl = domain + "/maps?originLat=" + originLat + "&originLng=" + originLng + "&destination=" + destination;
    console.log(newGoogleUrl)
    //// FEETCH GOOGLE DRIVING API INFO
    fetch(newGoogleUrl)
      .then(res => res.json())
      .then(res => {
        console.log("TARGET ", res)
        let drivingDurationSeconds = res.routes[0].legs[0].duration.value;
        let drivingDurationMiliseconds = drivingDurationSeconds * 1000
        let drivingDateTime = new Date((Date.now() + drivingDurationMiliseconds))
        console.log("driving duration miliseconds: ", drivingDurationMiliseconds)
        console.log("driving date time: ", drivingDateTime)
        let drivingArrivalString = drivingDateTime.toLocaleTimeString()
        let drivingInMinutes = drivingArrivalString.split('').slice(0,-6).join('')
        console.log("driving in Minutes: ", drivingInMinutes);
        let drivingAmPm = drivingArrivalString.split('').slice(-2).join('')
        let drivingArrivalTime =  `${drivingInMinutes}${drivingAmPm}`

        console.log("driving arrival time: ", drivingArrivalTime)
        const newState = {
          drivingArrivalTime: drivingArrivalTime
        };
        this.setState(newState)
        this.findFastestRoute();

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
  findFastestRoute(){
    if(this.state.drivingArrivalTime < this.state.transitArrivalTime){
       this.setState({fastest: "DRIVING"})
    } else if (this.state.drivingArrivalTime > this.state.transitArrivalTime){
      this.setState({ fastest: "TRANSIT" })
    } else {
      console.log("neither time is faster")
    } 
    console.log(this.state.fastest)
  }
  render() {
    let recommendation = null;
    const localFastest = this.state.fastest
    if(localFastest === "DRIVING"){
      recommendation = (
        <div className="driving-circle-fastest"><img src="driving-copy.png" alt="car icon"/>
          <div className="arrival-time">{this.state.drivingArrivalTime}</div>
        </div >)
    } else {
      recommendation =(
        <div className="driving-circle"><img src="driving.png" alt="car icon" />
          <div className="arrival-time">{this.state.drivingArrivalTime}</div>
        </div >)
    }
    let transitRecommendation = null;
    const localTransitFastest = this.state.fastest
    if (localTransitFastest === "TRANSIT") {
      transitRecommendation = (
        <div className="transit-circle-fastest"><img src="transportation-copy.png" alt="bus icon" />
          <div className="arrival-time">{this.state.transitArrivalTime}</div>
        </div >)
    } else {
      transitRecommendation = (
        <div className="transit-circle"><img src="transportation.png" alt="bus icon" />
          <div className="arrival-time">{this.state.transitArrivalTime}</div>
        </div>)
    }
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
        <div className="circles-container">
          <div>{recommendation}</div>
          <div>{transitRecommendation}</div>

        </div>
      </div>
    );
  }
}

export default App;