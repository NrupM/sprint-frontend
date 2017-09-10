import React, { Component } from 'react';
import './App.css';
import Map from 'google-maps-react';
import SearchForm from './components/SearchForm';

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
			}
		};
	}

	componentDidMount() {
		this.getUserLocation();
	}

	getUserLocation() {
		//set state lat lng

		if (navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(pos => {
				console.log('getUserLocation called');
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
				console.log(newState);
				this.setState(newState);
			});
		}
	}

	render() {
		return (
			<div className="App">
				<Map
					google={window.google}
					className={'map'}
					zoom={this.state.map.zoom}
					center={this.state.map.center}
					style={{ width: '100%', height: '100%', position: 'absolute' }}
				/>
				<SearchForm />
			</div>
		);
	}
}

export default App;
