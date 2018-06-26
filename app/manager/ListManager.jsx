import "manager/ListManager.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

import ListManagerList from "manager/ListManagerList.jsx";

export default class ListManager extends Component {
	render(props, state) {
		return <div class="listManager">
			{props.lists.map(function(list) {
				return <ListManagerList list={list} />;
			})}
		</div>;
	}
};