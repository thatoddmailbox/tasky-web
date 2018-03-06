import { h, render, Component } from "preact";

import App from "App.jsx";

var getToken = function() {
	return unescape(window.location.href.match("\\?token=(.*?)(&|$)") ? window.location.href.match("\\?token=(.*?)(&|$)")[1] : "");
};

if (window.location.protocol == "http:" && window.location.host == "tasky.studerfamily.us") {
	window.location.protocol = "https:";
}

var token = getToken();

window.onload = function() {
	render(h(App, {
		haveToken: !!token,
		token: token
	}), document.querySelector("body"));
};