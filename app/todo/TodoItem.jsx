import "todo/TodoItem.styl";

import { h, Component } from "preact";

export default class TodoItem extends Component {
	render(props, state) {
		return <div>
			{props.item.name}
		</div>;
	}
};