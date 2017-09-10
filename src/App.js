import React, { Component } from 'react';
import './App.css';
import Map from 'google-maps-react';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Map
					google={window.google}
					className={'map'}
					zoom={4}
					style={{ width: '100%', height: '100%', position: 'absolute' }}
				/>
			</div>
		);
	}
}

export default App;
