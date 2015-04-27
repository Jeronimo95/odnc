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

		finalobj.Settings = Settings;

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
			Settings = loadobj.Settings;

			serial.activePort = loadobj.Serial.activePort;
			$( "#setting_serial_port" ).val(loadobj.Serial.activePort);

			$("#setting_a0").prop('checked', Settings.area0warn);
			$("#setting_1c").prop('checked', Settings.only1c);
			
			if(Settings.only1c){
				$("#live_in_0").prop('disabled', true);
				$("#live_in_0").val('1C');
			}else{
				$("#live_in_0").prop('disabled', false);
			}

			$("#setting_opps").prop('checked', Settings.onlyknownopps);

			AreaNaming.refreshDOM();
			Playback.Funcs.updateDOM();
			Saved.refreshDOM();

			Statusbar.push("Project loaded!");

			$(this).val('');
		});
		$("#loadDialog").trigger('click');
	}
}