
var SymSequence = function() {
	this.name = function(lang) {""};
	this.min = function(soft) { if (soft) return 1; return Number.NaN};
	this.max = function(soft) { if (soft) return 20; return Number.NaN};
	this.loc = function(n) {return ""+n};
}

var ArabicNumbers = function () {
	this.name = function() {return "arabic numbers"};
}

ArabicNumbers.prototype=new SymSequence();

function LowercaseAlpha() {
	this.name = function() {return "alphabet"};
	this.min = function(soft) { return 1};
	this.max = function(soft) { return 26};
	this.loc = function(n) {return String.fromCharCode("a".charCodeAt(0)+n-1)};
}

LowercaseAlpha.prototype=new SymSequence();

function MorseAlpha() {
	this.name = function() {return "morse alphabet"};
	var alpha = [0, ".-", "-...","-.-.","-..",".","..-.","--.","....","..",
		".---","-.-",".-..","--","-.","---",".--.","--.-",".-.",
		"...","-","..-","...-",".--","-..-","-.--","--.."];
	this.min = function(soft) { return 1};
	this.max = function(soft) { return 26};
	this.loc = function(n) {return (alpha[n])};
}

LowercaseAlpha.prototype=new SymSequence();

var all = [new ArabicNumbers(), new LowercaseAlpha(), new MorseAlpha()];
module.exports = {allents:all};
