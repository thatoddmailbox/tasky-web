import "account/AccountInfo.styl";

import { h, Component } from "preact";

export default class AccountInfo extends Component {
	logout() {
		if (confirm("Are you sure?")) {
			this.props.logout();
		}
	}

	render(props, state) {
		return <div class="accountInfo">
			Logged in as <strong>{props.user.name}</strong>
			<button type="button" class="btn btn-sm btn-outline-dark" onClick={this.logout.bind(this)}>
				Log out
			</button>
		</div>;
	}
};