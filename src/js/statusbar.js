var Statusbar = {
	defaultData: "ODNC v"+GUI.App.manifest.version,
	push: function (string){
		$("#statusbar").html(string);
		window.setTimeout(function(){ Statusbar.setDefault(); }, 6000);
	},
	setDefault: function (){
		$("#statusbar").html(this.defaultData);
	}
}

//on app start set default
$(function() {
	Statusbar.push("Open DyNet Controller, Version: "+GUI.App.manifest.version+" | Copyright &copy; 2015 Jeremy Ryan. Licensed under GPLv2");
});