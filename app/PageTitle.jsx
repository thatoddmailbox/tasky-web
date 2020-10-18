import { h, Component } from "preact";

export default class PageTitle extends Component {
	render(props) {
		// TODO: this is not the best implementation, but it suffices for tasky's limited needs
		// TODO: should be updated with the better version at some point
		document.title = props.children + " | Tasky";
		return null;
	}
};