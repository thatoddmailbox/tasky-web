import "todo/AddTodo.styl";

import { h, Component } from "preact";
import linkState from "linkstate";
import moment from "moment";

import mhs from "mhs.js";

export default class AddTodo extends Component {
	addTodo() {
		var that = this;
		if (this.state.todoPrompt) {
			this.setState({
				loading: true
			}, function() {
				console.log(this.state.todoText);
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

	keyup(e) {
		if (e.keyCode == 13) {
			this.addTodo();
		}
	}

	render(props, state) {
		return <div>
			{!state.todoPrompt && <div class="addTodo" onClick={this.addTodo.bind(this)}>+ add to-do</div>}
			{state.todoPrompt && <div class="addTodoPrompt">
				<input type="text" disabled={!!this.state.loading} placeholder="Enter a task..." class="form-control addTodoPrompt" onChange={linkState(this, "todoText")} onKeyup={this.keyup.bind(this)} />	
				<button class="btn btn-primary" disabled={!!this.state.loading} onClick={this.addTodo.bind(this)}>+ add</button>
			</div>}
		</div>;
	}
};