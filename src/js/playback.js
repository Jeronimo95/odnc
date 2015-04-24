var Playback = {};
Playback.Data = {
	mode: "edit",
	items: {}
}
Playback.Funcs = {
	clicked: function (pbNum) {//click handler checks what mode we're in and calls edit/create or run
		if(Playback.Data.mode==="edit"){//are we in edit mode?
			if(typeof Playback.Data.items[pbNum] !== "undefined"){//is the playback in the obj
				$('#playbackmodal_remove').show();
				this.edit(pbNum);//it is, so edit
			}else{
				$('#playbackmodal_remove').hide();
				this.create(pbNum);//its not, create
			}
		}else{
			this.run(pbNum);//we're in playbakc mode, run the damn thing
		}
	},
	run: function (pbNum){//executes the playback
		if(typeof Playback.Data.items[pbNum] === "undefined")return;//if we clicked on a black space do nothing
		
		Object.keys(Playback.Data.items[pbNum]["data"]).forEach(function(key) {//interate though our data
			var data = Playback.Data.items[pbNum]["data"][key];
			var strarray = data.split(" ");//our data in this case is just a hex string with spaces
			var result = strarray.map(function (x) { 
				return parseInt(x, 16);//make it an array of ints
			});
			serial.send(result);//SEND IT!
			$( document ).trigger("serial:newData", [data]);//pass it to our new data event (as a string!)
		});

		$("#playback_exec_"+pbNum).addClass("highlight");//display the highlight
		window.setTimeout(function(){$("#playback_exec_"+pbNum).removeClass("highlight");},150);
	},
	edit: function (pbNum){
		$('#playbackmodal_label').text('Edit Playback');
		$('#playbackmodal').data('pbnum', pbNum);
		$('#playbackmodal').data('type', "edit");
		$('#playbackmodal_title').val(Playback.Data.items[pbNum]["name"]);

		Object.keys(Playback.Data.items[pbNum]["data"]).forEach(function(key) {//interate though our data and place it back in the modal
			var data = Playback.Data.items[pbNum]["data"][key];
			$("#playbackmodal_dataDiv").append("<div><button class='btn btn-xs btn-danger playbackmodal_removedataline'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button> <span class='dataitem' data-data='{0}'>{1}</span></div>".format(data, key));
		});	

		this.savedToPbDOM();//get the list of saved items

		$('#playbackmodal').modal('show');//show modal
	},
	save: function (){//save the data to the Playback.data.items
		var pbnum = $('#playbackmodal').data('pbnum');//its number
		var name = $('#playbackmodal_title').val();//its name
		var data = {};//data
		$('#playbackmodal_dataDiv').children("div").children(".dataitem").each(function () {//interate though our data and place it the data obj
			data[$(this).text()] = $(this).data("data");//data[name]=dataData;
		});

		if(name==""){//if the name is blank, give it a default name
			name="Playback "+pbnum;
		}

		var finalob = {name: name, data: data}//save and update
		Playback.Data.items[pbnum] = finalob;
		this.updateDOM()
	},
	updateDOM: function (){//clear and update the dom
		$(".playback-item").addClass("playback-unused");
		$(".playback-item").text("");
		Object.keys(Playback.Data.items).forEach(function(key) {
			$("#playback_exec_"+key).removeClass("playback-unused");
			$("#playback_exec_"+key).text(Playback.Data.items[key]["name"]);
		});
	},
	create: function (pbNum){//shows the dom for new items
		$('#playbackmodal_label').text('New Playback');
		$('#playbackmodal').data('pbnum', pbNum);
		$('#playbackmodal').data('type', "new");

		$('#playbackmodal_addDataSel').empty();
		this.savedToPbDOM();
		$('#playbackmodal').modal('show');
	},
	remove: function (){//removes a playback and updates dom
		var pbnum = $('#playbackmodal').data('pbnum');
		this.clearModal();
		delete Playback.Data.items[pbnum];
		$('#playbackmodal').modal('hide');
		this.updateDOM();
	},
	clearModal: function (){//clears the modal when we're done with it
		$("#playbackmodal_dataDiv").empty();
		$('#playbackmodal').data('pbnum', "");
		$('#playbackmodal').data('type', "");
		$('#playbackmodal_title').val("");
	},
	savedToPbDOM: function (){//gets the saved data and places in into the 
		$('#playbackmodal_addDataSel').empty();
		Saved.savedItems.forEach(function (element, index, array){
			var str = element["data"].map(function (x){
				return x.toString(16).lpad("0",2);
			});
			var data = str.join(" ").toUpperCase();
			
			var string = "<option data-data='{0}'>{1}</option>".format(data, element["name"]);
			$('#playbackmodal_addDataSel').append(string);
		});
	}
}

$(document).ready(function() {
	$(".playback-item").click(function (){
		var id = $(this).attr("id");
		var pbNumS = id.replace("playback_exec_","");
		var pbNum = parseInt(pbNumS);
		Playback.Funcs.clicked(pbNum);
	});

	$("#playbackmodal_addDataBtn").click(function (){
		var savedName = $("#playbackmodal_addDataSel option:selected").text();
		var savedData = $("#playbackmodal_addDataSel option:selected").data("data");
		$("#playbackmodal_dataDiv").append("<div><button class='btn btn-xs btn-danger playbackmodal_removedataline'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button> <span class='dataitem' data-data='{0}'>{1}</span></div>".format(savedData, savedName));
	});

	$("#playback_mode").click(function (){
		if(Playback.Data.mode==="edit"){
			Playback.Data.mode="playback";
			$("#playback_mode").text("Playback Mode");
			$(".playback-unused").addClass("transparent");
		}else if(Playback.Data.mode="playback"){
			Playback.Data.mode="edit";
			$("#playback_mode").text("Edit Mode");
			$(".playback-unused").removeClass("transparent");
		}
	});

	$("#playbackmodal_save").click(function (){
		Playback.Funcs.save();
		Playback.Funcs.clearModal();
		$('#playbackmodal').modal('hide');
	});

	$("#playbackmodal_remove").click(function (){
		Playback.Funcs.remove();
	});

	$("#playbackmodal_dataDiv").on("click", ".playbackmodal_removedataline", function(event){
		$(this).parent('div').remove();
	});
	$('#playbackmodal').on('hidden.bs.modal', function () {
  		Playback.Funcs.clearModal();
	});

});