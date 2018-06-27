import "manager/ListManagerList.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

export default class ListManagerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}

	toggleArchived(list) {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			var newName = "";
			if (list.archived) {
				list.archived = false;
				newName = "To-do (" + list.listName + ")";
			} else {
				list.archived = true;
				newName = "To-do (archived, " + list.listName + ")";
			}
			mhs.post(that.props.token, "classes/edit", {
				id: list.id,
				color: "40ccff",
				name: newName
			}, function(data) {
				that.props.getLists();
			});
		});
	}

	rename(list) {
		var that = this;
		var newListName = prompt("Enter a new name for the list", list.listName);
		if (newListName) {
			var newName = "To-do (" + (list.archived ? "archived, " : "") + newListName + ")";
			mhs.post(that.props.token, "classes/edit", {
				id: list.id,
				color: "40ccff",
				name: newName
			}, function(data) {
				that.props.getLists();
			});
		}
	}

	render(props, state) {
		var list = props.list;
		return <div class={`listManagerList row ${list.archived ? "archived" : ""}`}>
			<div class="col listManagerListName">{list.listName}</div>
			<div class="col listManagerActions">
				<button class="btn btn-sm btn-secondary" onClick={this.rename.bind(this, list)}>
					<i class="fa fa-pencil" /> rename
				</button>
				<button class="btn btn-sm btn-secondary" onClick={this.toggleArchived.bind(this, list)} disabled={!!state.loading}>
					{state.loading ? "loading..." : <span><i class="fa fa-archive" /> {list.archived ? "unarchive" : "archive"}</span>}
				</button>
			</div>
		</div>;
	}
};