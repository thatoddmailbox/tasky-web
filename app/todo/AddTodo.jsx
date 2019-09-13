import "todo/AddTodo.styl";

import { h, Component } from "preact";
import linkState from "linkstate";
import moment from "moment";

import mhs from "mhs.js";

export default class AddTodo extends Component {
	addTodo(e) {
		var that = this;
		if (this.state.todoPrompt) {
			if (!this.state.todoText || this.state.todoText.trim() == "") {
				// no text was entered, just cancel it
				this.cancelTodo(e);
				return true;
			}
			this.setState({
				loading: true
			}, function() {
				mhs.post(this.props.token, "homework/add", {
					name: this.state.todoText,
					due: moment().format("YYYY-MM-DD"),
					complete: "0",
					classId: this.props.listInfo.id
				}, function() {
					that.setState({
						loading: false,
						todoPrompt: false
					}, function() {
						that.props.reloadList.call(that);
					});
				});
			});
		} else {
			this.setState({
				todoPrompt: true
			});
		}
	}

	cancelTodo(e) {
		this.setState({
			todoPrompt: false
		});
		e.stopPropagation();
		return true;
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.addTodo(e);
		}
	}

	render(props, state) {
		return <div>
			{!state.todoPrompt && <div class="addTodo" onClick={this.addTodo.bind(this)}>+ add to-do</div>}
			{state.todoPrompt && <div class="addTodoPrompt">
				<input type="text" disabled={!!this.state.loading} placeholder="Enter a task..." class="form-control addTodoPrompt" onChange={linkState(this, "todoText")} onKeyup={this.keyup.bind(this)} />
				<button class="btn btn-secondary" disabled={!!this.state.loading} onClick={this.cancelTodo.bind(this)}><i class="fa fa-fw fa-times" /></button>
				<button class="btn btn-primary" disabled={!!this.state.loading} onClick={this.addTodo.bind(this)}>+ add</button>
			</div>}
		</div>;
	}
};