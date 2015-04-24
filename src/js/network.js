$( document ).on( "serial:newData", function( event, data ) {

	//if data is already a string, its our own data
	if (typeof data !== 'string') {
		var pretty_data = serial.toString(data);
		var extraClass = "";
	}else{
		var pretty_data = data;
		var extraClass = "";//might be unneeded
	}

	var lastrow = $("#data_live_table").children('tr:first');//get latest TR
	var lastdata = lastrow.children('td:nth-child(2)');//get data collum

	//if data in last row is the same as new data
	if (lastdata.children(".dataitem").html()==pretty_data) {
		if (lastdata.has(".badge").length===0) {//if it dosent alredy has a .badge, add one; else increment the badge value.
			lastdata.html(lastdata.html()+" <span class='badge'>2</span>")//init badge starts at 2
		}else{
			var count = lastdata.children(".badge").text();
			count = parseInt(count);
			count += 1;
			lastdata.children(".badge").text(count);
		}
		return;
	};

	//build string
	var finalString = "<tr class='live_net_tr {0}'>".format(extraClass);
	finalString += "<td>";
	finalString += "<button class='btn btn-default btn-xs network_resend' title='Load into send bar'><span class='glyphicon glyphicon-send' aria-hidden='true'></span></button>";
	finalString += "<button class='btn btn-default btn-xs network_save' title='Save'><span class='glyphicon glyphicon-floppy-disk' aria-hidden='true'></span></button>";
	finalString += "</td><td><span class='dataitem'>{0}</span></td><td>{1}</td></tr>".format(pretty_data, Dynet.getDescriptionFromString(pretty_data));
	$("#data_live_table").prepend(finalString);

	// if($("#data_live_table").children("tr").length>2000){
	// 	$("#data_live_table").empty();	
	// }

});

var Live = {
	get_data_nochk: function () {
		var data = [];
		data[0]=parseInt($("#live_in_0").val(),16);
		data[1]=parseInt($("#live_in_1").val(),16);
		data[2]=parseInt($("#live_in_2").val(),16);
		data[3]=parseInt($("#live_in_3").val(),16);
		data[4]=parseInt($("#live_in_4").val(),16);
		data[5]=parseInt($("#live_in_5").val(),16);
		data[6]=parseInt($("#live_in_6").val(),16);
		return data
	},

	get_data: function (){
		var data = this.get_data_nochk();
		data.push(Dynet.calcCecksum(data));
		return data;
	},
	sendData: function(){
		var wasSent = serial.send(this.get_data());
		var rtn = this.get_data().map(function (x){
			return x.toString(16).lpad("0",2);
		});
		var ownd = rtn.join(" ").toUpperCase();
		if(wasSent) $( document ).trigger("serial:newData", [ownd]);
		
	}
}



$("#live_clear").click(function(){ 
	$("#data_live_table").empty();
});


$("#live_send").click(function(){ 
	Live.sendData();
});

$("#live_save").click(function(){ 
	var name = prompt("Name?","");
	Saved.add(name, Live.get_data());
});

$(".live_data_in").keyup(function() {
	$("#live_in_7").val( Dynet.calcCecksum( Live.get_data_nochk() ).toString(16) );
	$("#live_desc").val( Dynet.getDescriptionFromArray( Live.get_data() ) );
});

$(".live_data_in").keydown(function(e){ 
    var code = e.which;
    if(code==13){
    	e.preventDefault();
    	Live.sendData();
    };
});

$("#data_live_table").on("click", ".network_resend", function(event){
	var data = $(this).closest("tr").children('td:nth-child(2)').children(".dataitem").text();
	var d = data.split(" ");
	for(x in d){
		$("#live_in_"+x).val(d[x]);
	}
	$(".live_data_in").trigger("keyup");
});

$("#data_live_table").on("click", ".network_save", function(event){
	var data = $(this).closest("tr").children('td:nth-child(2)').children(".dataitem").text();
	var d = data.split(" ");
	var result = d.map(function (x) { 
	    return parseInt(x, 16); 
	});
	var name = prompt("Name?","");
	Saved.add(name, result);
	//TODO add alert saying item has been saved
});


