import React, { Component } from 'react';
import StatusBar from './StatusBar';
import {getByDate, del } from '../classes/httprequests';
import '../style/Section.css';
import CardHolder from './CardHolder';

class Section extends Component {

	constructor(props) {
		super(props);

		this.handleshowchange = this.handleshowchange.bind(this);
		this.removeCard = this.removeCard.bind(this);

		let date = new Date();
		let day = date.getDate();
		let month = date.getMonth();

		switch (this.props.time) {
			case "Today":
			this.state = {
					"sm": month,
					"em": month,
					"sd": day,
					"ed": day,
					"show": false,
					"cards": []
				};
				break;
			case "Yesterday":
				let d = day - 1;
				let m = month;
				if (d <= 0) {
					m = (m - 1 < 0) ? 12 : m - 1;
					d = getLastDay(m) + d;
				}
				this.state = {
					"sm": m,
					"em": m,
					"sd": d,
					"ed": d,
					"show": false
				};
				break;
			case "This Week":
				let sd = day - 7;
				let ed = day - 2;
				let sm = month;
				let em = month;
				if (sd <= 0) {
					sm = (sm - 1 < 0) ? 12 : sm - 1;
					d = getLastDay(sm) + sd;
				}
				if (ed <= 0) {
					em = (em - 1 < 0) ? 12 : em - 1;
					d = getLastDay(em) + ed;
				}
				this.state = {
					"sm": sm,
					"em": em,
					"sd": sd,
					"ed": ed,
					"show": false
				};
				break;
			case "This Month":
				this.state = {
					"sm": month,
					"em": month,
					"sd": 1,
					"ed": (day - 8 <= 0) ? 0 : day - 8,
					"show": false
				};
				break;
			default:
				m = (m - 1 < 0) ? 12 : m - 1;
				this.state = {
					"sm": -1,
					"em": m,
					"sd": 1,
					"ed": 31,
					"show": false
				};
		}
	}

	handleshowchange() {
		if (this.state.show) {
			this.setState({
				show: !this.state.show,
				"cards": []
			});
		} else {
			getByDate(this.state.sm, this.state.em, this.state.sd, this.state.ed)
			.then(res => {
				let cards = res.data.cards;
				this.setState({
					show: !this.state.show,
					"cards": cards
				});
			})
			.catch(err => {
				console.log(err);
			})
		}
	}

	render() {
		return (
			<div className="StatusArea">
				<StatusBar time={this.props.time} show={this.state.show} showHandler={this.handleshowchange} />
				{this.state.show ? <CardHolder cards={this.state.cards} removeCard={this.removeCard} /> : null}
			</div>
		);
	}

	removeCard(id) {
		let cards = this.state.cards;

		let cardinq = 0;
		for(let i = 0; i < cards.length; i++) {
			if (cards[i].id === id) {
				cardinq = i;
				break;
			}
		}

		cards.splice(cardinq);

		del(id);
	}
}

// Gets the maximum number of days in any month
function getLastDay(month) {
	switch (month) {
		case 0 || 2 || 4 || 6 || 7 || 9 || 11:
			return 31;
		case 3 || 5 || 8 || 10:
			return 30;
		default:
			break;
	}
	return (new Date().getFullYear % 4 === 0) ? 29 : 28;
}

export default Section;