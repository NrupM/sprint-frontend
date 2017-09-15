import React, { Component } from 'react';

class SearchForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ''
		};
	}
	onInputChange(e) {
		console.log(e.target.value)
		this.setState({
			search: e.target.value
		});
	}
	handleKeyPress = (e) => {
		if(e.key === 'Enter'){
			let search = this.state.search;

			console.log(search)
			console.log("this state is searchinnnng: ", this.state.search)
		}
	}
	render() {
		return (
			<div className="search-form">
				<input
					onChange={e => this.onInputChange(e)}
					placeholder="Where to ?"
					type="text"
					onKeyPress={this.handleKeyPress}
					value={this.state.search}
				/>
			</div>
		);
	}
}

export default SearchForm;
