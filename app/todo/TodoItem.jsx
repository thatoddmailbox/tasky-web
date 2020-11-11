import "todo/TodoItem.styl";

import { h, Component } from "preact";
import linkState from "linkstate";
import moment from "moment";

import mhs from "mhs.js";

export default class TodoItem extends Component {
	componentWillReceiveProps(nextProps, nextState) {
		if (this.props && this.props.view != nextProps.view) {
			this.setState({
				ignoreView: null
			});
		}
	}

	update(changes, callback) {
		var that = this;
		var updated = this.props.item;
		for (var change in changes) {
			updated[change] = changes[change];
		}
		mhs.post(this.props.token, "homework/edit", updated, function(data) {
			changes["ignoreView"] = true;
			that.props.updateListData(changes);
			that.setState(changes, callback);
		});
	}

	onCompleteChange(e) {
		this.update({
			complete: (e.target.checked ? "1" : "0")
		}, function() {
			
		});
	}

	edit() {
		this.setState({
			edit: true,
			editName: this.props.item.name
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.saveEdit();
		}
	}

	saveEdit() {
		this.update({
			name: this.state.editName
		}, function() {
			this.setState({
				edit: false
			});
		});
	}

	cancelEdit() {
		this.setState({
			edit: false
		});
	}

	deleteItem() {
		var that = this;
		if (confirm("Are you sure?")) {
			mhs.post(this.props.token, "homework/delete", {
				id: this.props.item.id
			}, function(data) {
				that.props.reloadList();
			});
		}
	}

	render(props, state) {
		var complete = (props.item.complete == "1");

		if (props.view == "uncompleted" && complete && !state.ignoreView) {
			return;
		}

		if (state.edit) {
			return <div class={`todoItem edit ${complete ? "complete" : ""}`}>
				<div class="form-check">
					<input type="checkbox" class="form-check-input" checked={complete} disabled />
					<div class="todoItemEditContainer">
						<input type="text" class="form-control todoItemEditName" onKeyUp={this.keyup.bind(this)} onChange={linkState(this, "editName")} value={state.editName} />
						<div class="todoItemActions">
							<i class="fa fa-fw fa-check" onClick={this.saveEdit.bind(this)} />
							<i class="fa fa-fw fa-times" onClick={this.cancelEdit.bind(this)} />
							<i class="fa fa-fw fa-trash" onClick={this.deleteItem.bind(this)} />
						</div>
					</div>
				</div>
			</div>;
		}

		var dueDate = moment(this.props.item.due, "YYYY-MM-DD");
		var dueDateDisplay = dueDate.format("dddd, MMMM Do, YYYY");

		return <div class={`todoItem ${complete ? "complete" : ""}`}>
			<div class="form-check">
				<label class="form-check-label">
					<input type="checkbox" class="form-check-input" checked={complete} onChange={this.onCompleteChange.bind(this)} />
					<span class="todoItemName">{props.item.name}</span>
				</label>
				<div class="todoItemActions">
					<i class="fa fa-pencil" onClick={this.edit.bind(this)} />
					<span class="todoItemDate">
						Added on {dueDateDisplay}
					</span>
				</div>
			</div>
		</div>;
	}
};