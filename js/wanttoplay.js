var _ = require('underscore');
var d3 = require('d3');
var seqs = require('./sequences');


function Strategy() {
	this.transition = function (n) {
		if (this.cur + 1 === n.next) {
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
	var that = this;
	this.best = undefined;
	this.reset({win:false});
	this.reinit = function(gametype) {
		var gametype = gametype || Math.floor(Math.random() * seqs.allents.length);
		that.seq = seqs.allents[gametype];
		that.min = that.seq.min(true);
		that.max = that.seq.max(true);
		that.cur = that.min-1;
		that.fails = 0;
		that.display = that.seq.loc;
	};
	this.reinit();
	return this;
}

Stats.prototype = new GameOps();

function init(stats) {
	var stats = (stats && stats.reinit()) || new Stats();
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
				return d.key + ": " + d.value;
				});
	};

	chips = d3.select(".g1").selectAll(".nummer").data(d3.shuffle(_.range(stats.min, stats.max+1)));
	chips.enter().append("span");
	chips.exit().remove();
	chips.transition().delay(300).duration(20).attr('data-found', null);
	chips.text(function (d, e) {
			return "" + stats.display(d);
			}).attr("class", "nummer").attr('data-val', function (d, e) {
				return d;
			}).on('click', cl).attr('style', function () {
				return 'margin-left:' + (12 * Math.random()) + 'em;margin-top:' + Math.random() + 'em;';
			});

	state = d3.select(".stats");
	sv = state.selectAll(".item").data(d3.entries(stats));

	sr = sv;
	sr.exit().remove();
	sr.enter().append("span");
	sr.text(function (d) {
			return d.key + ": " + d.value;
			}).attr("class","item");
	sr.attr('data-stat', function(d) {return d.key})
		.attr('data-type', function (d) {return typeof d.value});
}


module.exports = {
initialize: function () {
		    return {play:function () {init()}};
	    }
};
