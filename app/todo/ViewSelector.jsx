import "todo/ViewSelector.styl";

import { h, Component } from "preact";

export default class ViewSelector extends Component {
	selectView(view) {
		this.props.selectView(view);
	}

	render(props, state) {
		return <div class="viewSelector btn-group">
			<button type="button" onClick={this.selectView.bind(this, "uncompleted")} class={`btn btn-sm btn-${props.view == "uncompleted" ? "" : "outline-"}dark`}>
				Uncompleted
			</button>
			<button type="button" onClick={this.selectView.bind(this, "all")} class={`btn btn-sm btn-${props.view == "all" ? "" : "outline-"}dark`}>
				All tasks
			</button>
		</div>;
	}
};