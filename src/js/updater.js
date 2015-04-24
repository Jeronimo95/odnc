var Updater = {
	updateURL: "http://updates.saferindoors.com/odnc.json"
}
$(document).ready(function() {
	$.getJSON( Updater.updateURL , function( json ) {
		var strarray = GUI.App.manifest.version.split(".")
		var current = strarray.map(function (x) { 
			return parseInt(x);//make it an array of ints
		});
		var latest = json.latestVersion;
		Updater.latestVersion = latest;
		Updater.updateSite = json.updateURL;

		if(latest.maj>current[0] || latest.min>current[1] || latest.pat>current[2]){
			alert("An Update is avalible! \n Select Help > Updates from the menu to view.")
		}
		$("#updatepage_lversion").text(latest.maj+"."+latest.min+"."+latest.pat);
		$("#updatepage_releases").text(Updater.updateSite);
		$("#updatepage_releases").click(function () {
			openExternal(Updater.updateSite);
		});
	});
});