var Project = {
	save: function () {
		var finalobj = {};
		finalobj.AreaNaming = {};
		finalobj.AreaNaming.areanames = AreaNaming.areanames;

		finalobj.Saved = {};
		finalobj.Saved.savedItems = Saved.savedItems;

		finalobj.playback = {}
		finalobj.playback.items = Playback.Data.items;

		finalobj.Serial = {};
		finalobj.Serial.activePort = serial.activePort;
		finalobj.Serial.baudrate = serial.baudrate;
		var jsonstr = JSON.stringify(finalobj);

		var ouputfile;
		$("#saveDialog").change(function(evt) {
			if($(this).val()==''){return;}
			ouputfile = $(this).val();
			fs.writeFile(ouputfile, jsonstr, function(err) {
			if(err) {
				return Statusbar.push("Project save error: "+err);
			}
				Statusbar.push("Project saved");
			}); 
			$(this).val('');
		});
		$("#saveDialog").trigger('click');
	},
	load: function() {
		var inputfile;
		$("#loadDialog").change(function(evt) {
			if($(this).val()==''){return;}
			serial.dissconect();
			inputfile = $(this).val();
			var loadstr = fs.readFileSync(inputfile).toString('utf8');
			var loadobj = JSON.parse(loadstr);
			
			AreaNaming.areanames = loadobj.AreaNaming.areanames;
			Saved.savedItems = loadobj.Saved.savedItems;
			Playback.Data.items = loadobj.playback.items;
			serial.baudrate = loadobj.Serial.baudrate;

			serial.activePort = loadobj.Serial.activePort;
			$( "#setting_serial_port" ).val(loadobj.Serial.activePort);

			AreaNaming.refreshDOM();
			Playback.Funcs.updateDOM();
			Saved.refreshDOM();

			Statusbar.push("Project loaded!");

			$(this).val('');
		});
		$("#loadDialog").trigger('click');
	}
}