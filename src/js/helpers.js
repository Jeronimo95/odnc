String.prototype.chunk = function(n) {
	var ret = [];
	for(var i=0, len=this.length; i < len; i += n) {
		ret.push(this.substr(i, n))
	}
	return ret
};

String.prototype.lpad = function(padString, length) {
	var str = this;
	while (str.length < length)
		str = padString + str;
	return str;
}

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
			? args[number]
			: match
			;
		});
	};
}

function openExternal(argument) {
	GUI.Shell.openExternal(argument);
	return false;
}