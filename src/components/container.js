import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class Container extends Component {
	render() {
		if (!this.props.loaded) {
			return <div>Loading...</div>;
		}
		return <div>Map will go here</div>;
	}
}

export default GoogleApiComponent({
	apiKey: AIzaSyCnyu2FJac70 - X0EXKaoIxVw5RB4luN0uk
})(MapContainer);
