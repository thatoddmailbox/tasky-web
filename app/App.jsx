import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import "App.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

import AccountInfo from "account/AccountInfo.jsx";

import AddTodo from "todo/AddTodo.jsx";
import ListSelector from "todo/ListSelector.jsx";
import ProgressDisplay from "todo/ProgressDisplay.jsx";
import TodoList from "todo/TodoList.jsx";
import ViewSelector from "todo/ViewSelector.jsx";

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			view: "uncompleted"
		};
	}

	componentWillMount() {
		var that = this;

		if (this.props.haveToken) {
			// save the token
			localStorage.mhsToken = this.props.token;
			// clear the url
			window.location.href = "/";
		}

		if (localStorage.mhsToken) {
			this.setState({
				loggedIn: true,
				loading: true,
				token: localStorage.mhsToken
			}, function() {
				mhs.get(that.state.token, "auth/me", {}, function(userData) {
					that.setState({
						user: userData.user
					}, function() {
						that.getLists.call(that);
					});
				});
			});
		} else {
			this.setState({
				loggedIn: false
			});
		}
	}

	logout() {
		localStorage.removeItem("mhsToken");
		window.location.reload();
	}

	getLists() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			mhs.get(that.state.token, "classes/get", {}, function(classesData) {
				var todoLists = [];
	
				classesData.classes.forEach(function(classObject) {
					var matches = classObject.name.match(/To-do \((.*)\)/i);
					if (matches) {
						classObject.listName = matches[1];
						todoLists.push(classObject);
					}
				});
	
				that.setState({
					loading: false,
					classes: classesData.classes,
					todoLists: todoLists
				}, function() {
					if (todoLists.length > 0) {
						that.selectList.call(that, todoLists[0]);
					}
				});
			});
		});
	}

	selectList(classObject) {
		var that = this;
		this.setState({
			loadingList: true,
			selectedList: classObject
		}, function() {
			mhs.get(that.state.token, "homework/getForClass/" + classObject.id, {}, function(data) {
				that.setState({
					loadingList: false,
					selectedListData: data.homework
				});
			});
		});
	}

	reloadList() {
		this.selectList(this.state.selectedList);
	}

	selectView(view) {
		this.setState({
			view: view
		});
	}

	updateListData(id, changes) {
		for (var i = 0; i < this.state.selectedListData.length; i++) {
			var item = this.state.selectedListData[i];
			if (item.id == id) {
				for (var updateKey in changes) {
					item[updateKey] = changes[updateKey];
				}
				break;
			}
		}
		this.setState({
			selectedListData: this.state.selectedListData
		});
	}

	render(props, state) {
		if (!state.loggedIn) {
			return <div class="app container">
				<h3>Not logged in!</h3>
				<p>Sign in with your MyHomeworkSpace account to see your tasks</p>
				<a href={mhs.getAuthURL()} class="btn btn-primary">Connect MyHomeworkSpace account</a>
			</div>;
		}
		if (state.loading) {
			return <div class="app container">
				<h3><i class="fa fa-spin fa-refresh" /> Getting your to-do lists, please wait...</h3>
			</div>;
		}

		return <div class="app container">
			<div class="pull-right">
				<AccountInfo user={state.user} logout={this.logout.bind(this)} />
			</div>

			<h3>
				To-do 
				<ListSelector token={state.token} listInfo={state.selectedList} lists={state.todoLists} getLists={this.getLists.bind(this)} selectList={this.selectList.bind(this)} />
			</h3>
			{state.todoLists.length == 0 && <p>You don't have any to-do lists!</p>}
			{state.loadingList && <p><i class="fa fa-spin fa-refresh" /> Getting to-do list, please wait...</p>}
			
			{!state.loadingList && state.selectedList && <div>
				<ViewSelector view={state.view} selectView={this.selectView.bind(this)} />
				<TodoList token={state.token} updateListData={this.updateListData.bind(this)} view={state.view} listInfo={state.selectedList} list={state.selectedListData} />
				<AddTodo token={state.token} listInfo={state.selectedList} reloadList={this.reloadList.bind(this)} />
				<ProgressDisplay list={state.selectedListData} view={state.view} />
			</div>}
		</div>;
	}
};