import React, { Component } from 'react';

class SearchForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ''
		};
	}
	onInputChange(e) {
		this.setState({
			search: e.target.value
		});
	}
	onFormSubmit(e) {
		console.log('form submit');
		e.preventDefault();
		let search = this.state.search;
	}
	render() {
		return (
			<div className="search-form">
				<input
					onChange={e => this.onInputChange(e)}
					placeholder="Where to ?"
					type="text"
					value={this.state.search}
				/>
			</div>
		);
	}
}

export default SearchForm;
