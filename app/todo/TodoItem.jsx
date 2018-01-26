import "todo/TodoItem.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

export default class TodoItem extends Component {
	componentWillMount() {
		this.componentWillReceiveProps(this.props, {});
	}

	componentWillReceiveProps(nextProps, nextState) {
		this.setState({
			complete: (nextProps.item.complete == "1")
		});
	}

	update(changes, callback) {
		var that = this;
		var updated = this.props.item;
		for (var change in changes) {
			updated[change] = changes[change];
		}
		mhs.post(this.props.token, "homework/edit", updated, function(data) {
			if (changes["complete"]) {
				changes["complete"] = (changes["complete"] == "1");
			}
			changes["ignoreView"] = true;
			that.setState(changes, callback);
		});
	}

	onCompleteChange(e) {
		this.update({
			complete: (e.target.checked ? "1" : "0")
		}, function() {
			
		});
	}

	render(props, state) {
		if (props.view == "uncompleted" && state.complete && !state.ignoreView) {
			return;
		}

		return <div class={`todoItem ${state.complete ? "complete" : ""}`}>
			<div class="form-check">
				<label class="form-check-label">
					<input type="checkbox" class="form-check-input" checked={state.complete} onChange={this.onCompleteChange.bind(this)} /> {props.item.name}
				</label>
			</div>
		</div>;
	}
};