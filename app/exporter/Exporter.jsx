import "exporter/Exporter.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import mhs from "mhs.js";

export default class Exporter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: "",
			exportType: "all",
			resultType: "ugly"
		};
	}

	exportList(listID, callback) {
		var that = this;
		var list = [];
		mhs.get(this.props.token, "homework/getForClass/" + listID, {}, function(data) {
			for (var i in data.homework) {
				var item = data.homework[i];
				list.push({
					id: item.id,
					name: item.name,
					complete: (item.complete == 1),
					createdOn: item.due
				});
			}
			callback(list);
		});
	}

	formatObject(object, pretty) {
		if (pretty) {
			return JSON.stringify(object, null, 4);
		} else {
			return JSON.stringify(object);
		}
	}

	export() {
		var that = this;

		if (this.state.exportType == "specific") {
			if (!this.state.exportList) {
				this.setState({
					error: "You must select the list you want to export!"
				});
				return;
			}
		}

		this.setState({
			loading: true,
			error: ""
		}, function() {
			if (this.state.exportType == "specific") {
				this.exportList(this.state.exportList, function(list) {
					that.setState({
						loading: false,
						done: true,
						resultUgly: that.formatObject(list, false),
						resultPretty: that.formatObject(list, true)
					});
				});
			} else {
				var result = [];
				var lists = this.props.lists;
				var currentIndex = -1;
				var callback = function(lastListItems) {
					if (lastListItems) {
						// do list stuff
						var currentList = lists[currentIndex];
						result.push({
							name: currentList.listName,
							archived: currentList.archived,
							items: lastListItems
						});
					}

					currentIndex++;
					if (currentIndex >= lists.length) {
						// done
						that.setState({
							loading: false,
							done: true,
							resultUgly: that.formatObject(result, false),
							resultPretty: that.formatObject(result, true)
						});

						return;
					}

					var nextList = lists[currentIndex];
					that.exportList(nextList.id, callback);
				};
				callback(null);
			}
		});
	}

	selectSpecificType() {
		this.setState({
			exportType: "specific"
		});
	}

	selectResultType(type) {
		this.setState({
			resultType: type
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="exporter">
				<h4>Export in progress...</h4>
				Please wait...
			</div>;
		}
		if (state.done) {
			return <div class="exporter">
				<h4>Export complete</h4>
				<textarea readOnly>
					{state.resultType == "ugly" ? state.resultUgly : state.resultPretty}
				</textarea>
				{state.resultType == "ugly" && <button class="btn btn-primary" onClick={this.selectResultType.bind(this, "pretty")}>Format</button>}
				{state.resultType == "pretty" && <button class="btn btn-primary" onClick={this.selectResultType.bind(this, "ugly")}>Unformat</button>}
			</div>;
		}

		return <div class="exporter">
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<h4>What would you like to export?</h4>
			<label><input type="radio" name="exportType" checked={state.exportType == "all"} onChange={linkState(this, "exportType", "target.value")} value="all" /> All of my lists</label>
			<label><input type="radio" name="exportType" checked={state.exportType == "specific"} onChange={linkState(this, "exportType", "target.value")} value="specific" /> A specific list: 
				<select value={state.exportList} onClick={this.selectSpecificType.bind(this)} onChange={linkState(this, "exportList")}>
					{props.lists.map(function(list) {
						return <option value={list.id}>{list.listName}{list.archived && " (archived)"}</option>;
					})}
				</select>
			</label>
			<button class="btn btn-primary" onClick={this.export.bind(this)}>Export data</button>
		</div>;
	}
};