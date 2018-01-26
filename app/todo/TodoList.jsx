import "todo/TodoList.styl";

import { h, Component } from "preact";

import TodoItem from "todo/TodoItem.jsx";

export default class TodoList extends Component {
	updateListData(item, changes) {
		this.props.updateListData(item.id, changes);
	}

	render(props, state) {
		var that = this;
		return <div>
			{props.list.map(function(item) {
				return <TodoItem token={props.token} updateListData={that.updateListData.bind(that, item)} view={props.view} item={item} />;
			})}
		</div>;
	}
};