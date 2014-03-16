var _ = require('underscore');
var d3 = require('d3');

var play = function () {
	console.info("play");

}

module.exports = {
initialize: function () {
	console.info("hiya");
	return {play:play};
}
};
