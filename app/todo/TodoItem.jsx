import "todo/TodoItem.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

export default class TodoItem extends Component {
	update(changes, callback) {
		var updated = this.props.item;
		for (var change in changes) {
			updated[change] = changes[change];
		}
		mhs.post(this.props.token, "homework/edit", updated, function(data) {
			callback();
		});
	}

	onCompleteChange(e) {
		this.update({
			complete: (e.target.checked ? "1" : "0")
		}, function() {

		});
	}

	render(props, state) {
		var complete = !!props.item.complete;

		return <div>
			<div class="form-check">
				<label class="form-check-label">
					<input type="checkbox" class="form-check-input" checked={complete} onChange={this.onCompleteChange.bind(this)} /> {props.item.name}
				</label>
			</div>
		</div>;
	}
};