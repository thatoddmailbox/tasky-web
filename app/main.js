import { h, render, Component } from "preact";

import App from "App.jsx";

var getToken = function() {
	return unescape(window.location.href.match("\\?token=(.*?)(&|$)") ? window.location.href.match("\\?token=(.*?)(&|$)")[1] : "");
};

var token = getToken();

window.onload = function() {
	render(h(App, {
		haveToken: !!token,
		token: token
	}), document.querySelector("body"));
};