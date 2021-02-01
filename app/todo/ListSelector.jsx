import "todo/ListSelector.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

export default class ListSelector extends Component {
	selectList(e) {
		var that = this;
		this.props.lists.forEach(function(list) {
			if (list.id == e.target.value) {
				// found the object
				that.props.selectList(list);
			}
		});
	}

	newList() {
		var that = this;
		var name = prompt("Enter a name for the new list");
		if (name) {
			mhs.post(that.props.token, "classes/add", {
				color: "40ccff",
				name: "To-do (" + name + ")",
				teacher: ""
			}, function(data) {
				that.props.getLists(true);
			});
		}
	}

	render(props, state) {
		return <div class="listSelector">
			<select value={props.listInfo && props.listInfo.id} onChange={this.selectList.bind(this)}>
				{props.lists.filter(function(list) {
					return !list.archived;	
				}).map(function(list) {
					return <option value={list.id}>{list.listName}</option>;
				})}
			</select>
			<button class="btn btn-outline-dark btn-sm" onClick={this.newList.bind(this)}>
				<i class="fa fa-fw fa-plus" /> new list
			</button>
			<button class="btn btn-outline-dark btn-sm" onClick={props.openManager}>
				<i class="fa fa-fw fa-cogs" /> manage lists
			</button>
			<button class="btn btn-outline-dark btn-sm" onClick={props.openExporter}>
				<i class="fa fa-fw fa-table" /> export data
			</button>
		</div>;
	}
};