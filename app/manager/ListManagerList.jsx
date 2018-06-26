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
		this.setState({
			loading: true
		});
	}

	render(props, state) {
		var list = props.list;
		return <div class={`listManagerList row ${list.archived ? "archived" : ""}`}>
			<div class="col listManagerListName">{list.listName}</div>
			<div class="col listManagerActions">
				<button class="btn btn-sm btn-secondary" onClick={this.toggleArchived.bind(this, list)}>
					<i class="fa fa-archive" /> {list.archived ? "unarchive" : "archive"}
				</button>
			</div>
		</div>;
	}
};