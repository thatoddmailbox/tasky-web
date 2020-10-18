import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import "App.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

import PageTitle from "PageTitle.jsx";

import AccountInfo from "account/AccountInfo.jsx";

import Exporter from "exporter/Exporter.jsx";

import ListManager from "manager/ListManager.jsx";

import AddTodo from "todo/AddTodo.jsx";
import ListSelector from "todo/ListSelector.jsx";
import ProgressDisplay from "todo/ProgressDisplay.jsx";
import TodoList from "todo/TodoList.jsx";
import ViewSelector from "todo/ViewSelector.jsx";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			view: "uncompleted",
			page: "todo"
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
						var listName = matches[1];
						var archived = false;
						if (listName.indexOf("archived, ") == 0) {
							listName = listName.substring(listName.indexOf(",") + 2);
							archived = true;
						}
						classObject.listName = listName;
						classObject.archived = archived;
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

	openExporter() {
		this.setState({
			page: "exporter"
		});
	}

	openManager() {
		this.setState({
			page: "manager"
		});
	}

	openTodo() {
		this.setState({
			page: "todo"
		});
	}

	render(props, state) {
		if (!state.loggedIn) {
			return <div class="app container">
				<PageTitle>Log in</PageTitle>
				<h3>Not logged in!</h3>
				<p>Sign in with your MyHomeworkSpace account to see your tasks</p>
				<a href={mhs.getAuthURL()} class="btn btn-primary">Connect MyHomeworkSpace account</a>
			</div>;
		}
		if (state.loading) {
			return <div class="app">
				<PageTitle>Loading...</PageTitle>
				<div class="headerContainer">
					<div class="container">
						<h3><i class="fa fa-spin fa-refresh" /> Getting your to-do lists, please wait...</h3>
					</div>
				</div>
			</div>;
		}

		var headerContents;
		var bodyContents;
		if (state.page == "todo") {
			headerContents = <div class="pageHeader todoHeader">
				<span class="headerTitle">To-do</span>
				<ListSelector token={state.token} listInfo={state.selectedList} lists={state.todoLists} getLists={this.getLists.bind(this)} selectList={this.selectList.bind(this)} openExporter={this.openExporter.bind(this)} openManager={this.openManager.bind(this)} />
			</div>;
			bodyContents = <div>
				<PageTitle>{state.selectedList ? state.selectedList.listName : "To-do"}</PageTitle>
				{state.todoLists.length == 0 && <p>You don't have any to-do lists!</p>}
				{state.loadingList && <p><i class="fa fa-spin fa-refresh" /> Getting to-do list, please wait...</p>}

				{!state.loadingList && state.selectedList && <div>
					<ViewSelector view={state.view} selectView={this.selectView.bind(this)} />
					<TodoList token={state.token} updateListData={this.updateListData.bind(this)} reloadList={this.reloadList.bind(this)} view={state.view} listInfo={state.selectedList} list={state.selectedListData} />
					<AddTodo token={state.token} listInfo={state.selectedList} reloadList={this.reloadList.bind(this)} />
					<ProgressDisplay list={state.selectedListData} view={state.view} />
				</div>}
			</div>;
		} else {
			headerContents = <div>
				<div class="pageHeader managerHeader">
					<button class="btn btn-outline-dark btn-sm" onClick={this.openTodo.bind(this)}>
						<i class="fa fa-fw fa-arrow-left" /> go back
					</button>
					{state.page == "manager" && <span class="headerTitle">Manage lists</span>}
					{state.page == "exporter" && <span class="headerTitle">Export data</span>}
				</div>
			</div>;
			if (state.page == "manager") {
				bodyContents = <div>
					<PageTitle>Manage lists</PageTitle>
					<ListManager token={state.token} lists={state.todoLists} getLists={this.getLists.bind(this)} />
				</div>;
			} else {
				bodyContents = <div>
					<PageTitle>Export data</PageTitle>
					<Exporter token={state.token} lists={state.todoLists} getLists={this.getLists.bind(this)} />
				</div>;
			}
		}

		return <div class="app">
			<div class="headerContainer">
				<div class="container">
					<div class="row headerRow">
						<div class="col-md-7">
							{headerContents}
						</div>
						<div class="col-md-5">
							<AccountInfo user={state.user} logout={this.logout.bind(this)} />
						</div>
					</div>
				</div>
			</div>

			<div class="container">
				{bodyContents}
			</div>
		</div>;
	}
};