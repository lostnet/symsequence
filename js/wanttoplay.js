var _ = require('underscore');
var d3 = require('d3');


function Strategy() {
	this.step = 1;
	this.transition = function (n) {
		if (this.cur + this.step === n.next) {
			this.cur = n.next;
			if (this.cur >= this.max) {
				n.win = true;
				this.reset(n);
			}
			return true;
		} else {
			this.userError();
			return false;
		}
	};
	this.reset = function (r) {
		var d = new Date();
		if (r.win) {
			this.last = d - this.start;
			if (this.best === undefined || this.last < this.best) this.best = this.last;
		}
		this.start = new Date();
		this.cur = this.min - this.step;
		this.userError(true);
		if (r.onReset)
			r.onReset();

	};

}

function GameOps() {
	this.state = function (op) {
		if (op.next !== undefined) if (this.transition(op) && op.onOk) op.onOk();
		if (op.reset !== undefined) this.reset(op);
	};
	this.userError = function (reset) {
		if (reset) this.fails = 0;
		this.fails++;
	};

}
GameOps.prototype = new Strategy();

function Stats() {
	this.min = 1;
	this.cur = 0;
	this.max = 30;
	this.fails = 0;
	this.best = undefined;
	this.reset({win:false});
}

Stats.prototype = new GameOps();

function init(stats) {
	var stats = new Stats();
	cl = function () {
		e = d3.select(this);
		d = e.data();
		if (d.length === 1)
			stats.state({
					"next": d[0],
					"onOk": function () {
						e.attr('data-found', true);
						},
					"onReset": function() {
						init(stats);
						}
				});
		sv = state.selectAll("span");
		sv.data(d3.entries(stats)).text(function (d) {
				console.info(d);
				return d.key + ": " + d.value;
				});
	};

	chips = d3.select(".g1").selectAll(".nummer").data(d3.shuffle(_.range(stats.min, stats.max + 1)));
	chips.enter().append("span");
	chips.transition().delay(300).duration(20).attr('data-found', null);
	chips.text(function (d, e) {
			return "" + d;
			}).attr("class", "nummer").attr('data-val', function (d, e) {
				return d;
			}).on('click', cl).attr('style', function () {
				return 'margin-left:' + (12 * Math.random()) + 'em;margin-top:' + Math.random() + 'em;';
			});

	state = d3.select(".stats");
	sv = state.selectAll("span");

	sr = sv.data(d3.entries(stats));
	sr.enter().append("span");
	sr.attr('data-stat', function(d) {return d.key})
		.attr('data-type', function (d) {return typeof d.value});
	sr.text(function (d) {
			return d.key + ": " + d.value;
			});
}


module.exports = {
initialize: function () {
		    return {play:function () {init()}};
	    }
};
