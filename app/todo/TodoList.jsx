import "todo/TodoList.styl";

import { h, Component } from "preact";

import TodoItem from "todo/TodoItem.jsx";

export default class TodoList extends Component {
	render(props, state) {
		return <div>
			{props.list.map(function(item) {
				return <TodoItem token={props.token} view={props.view} item={item} />;
			})}
		</div>;
	}
};