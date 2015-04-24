var Section = {
	sectionList: ["network", "saved", "about", "settings", "areanames", "playback", "artnet", "updates"],
	current: "",
	last: "",

	changeSection: function(sectionid) {
		this.last=this.current;
		this.current=sectionid;

		var usection="#"+sectionid;
		$(".app_section").hide();
		$("title").text("ODNC - "+$(usection).data("name"));
		$(usection).show();
	},

	backToLast: function (){
		if (this.last=="") {
			this.changeSection("network");
		}else{
			this.changeSection(this.last);
		};
	},

	addSection: function (section){
		$("#container").append(fs.readFileSync('./html/'+section+'.html').toString('utf8'));
	},

	init: function (){
		for(x in this.sectionList){
			this.addSection(this.sectionList[x]);
		}
	}

}
Section.init();

$(function() {
	$(".toLastPage").click(function() {
		Section.backToLast();
	});
	Section.changeSection("network");//default for startup
});