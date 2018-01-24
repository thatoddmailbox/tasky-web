import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import "App.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

import AddTodo from "todo/AddTodo.jsx";
import TodoList from "todo/TodoList.jsx";

export default class App extends Component {
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
							user: userData.user,
							classes: classesData.classes,
							todoLists: todoLists
						}, function() {
							if (todoLists.length > 0) {
								that.selectList.call(that, todoLists[0]);
							}
						});
					});
				});
			});
		} else {
			this.setState({
				loggedIn: false
			});
		}
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
			<h3>To-do</h3>
			{state.todoLists.length == 0 && <p>You don't have any to-do lists!</p>}
			{state.loadingList && <p><i class="fa fa-spin fa-refresh" /> Getting to-do list, please wait...</p>}
			
			{!state.loadingList && state.selectedList && <div>
				<TodoList listInfo={state.selectedList} list={state.selectedListData} />
				<AddTodo token={state.token} listInfo={state.selectedList} reloadList={this.reloadList.bind(this)} />
			</div>}
		</div>;
	}
};