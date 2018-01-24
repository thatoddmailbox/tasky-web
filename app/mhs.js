import ajax from "ajax.js";

var basePath = MHS_API_HOST;
var clientID = MHS_CLIENT_ID;

var request = function(method, token, url, data, callback) {
	ajax.request(method, basePath + url, data, function(data) {
		callback(data);
	}, {
		headers: {
			Authorization: "Bearer " + token
		}
	});
};

export default {
	getAuthURL: function() {
		return basePath + "application/requestAuth/" + clientID;
	},

	get: function(token, url, data, callback) {
		request("GET", token, url, data, callback);
	},

	post: function(token, url, data, callback) {
		request("POST", token, url, data, callback);
	}
};