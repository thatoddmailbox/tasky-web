import "todo/ProgressDisplay.styl"

import { h, Component } from "preact";

export default class ProgressDisplay extends Component {
	render(props, state) {
		var completeCount = 0;
		props.list.forEach(function(item) {
			if (item.complete != 0) {
				completeCount++;
			}
		});
		var percentage = Math.round((completeCount / props.list.length) * 100);
		return <div class="progressDisplay">
			<div class="progress">
				<div class="progress-bar" role="progressbar" style={`width: ${percentage}%`} />
			</div>
			{percentage}% complete
		</div>;
	}
};