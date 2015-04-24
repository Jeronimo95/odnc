var AreaNaming = {
	areanames: [],
	getAeraName: function (num){
		if(num=="0"||num=="00")return "ALL AREAS"
		var rtn = "";
		this.areanames.forEach(function (element, index, array){
			if(element["num"]===num){
				rtn = element["name"];
			}
		});
		return rtn;
	},
	addAreaName: function (num, name){
		this.areanames.push({num: num, name: name});
		this.areanames.sort(function(a, b){
			return (parseInt(a.num) - parseInt(b.num))
		});
	},
	removeAreaName: function (num){
		this.areanames.forEach(function (element, index, array){
			if(element["num"]===num){
				array.splice(index, 1);
				return
			}
		});
	},
	refreshDOM: function (){
		$("#areaMap_current_table").empty();
		this.areanames.forEach(function (element, index, array){
			var string = "<tr><td>{0}</td><td>{1}</td><td>".format(element["num"], element["name"]);
			string += "<button class='btn btn-danger btn-xs areaMap_removeItem'><span class='glyphicon glyphicon-remove' aria-hidden='true' title='Remove Area Name'></span></button>";
			string += "</td><tr>";
			$("#areaMap_current_table").append(string);
		});
	},
	saveNewFromDOM: function (){
		if (parseInt($("#areaMap_new_num").val())>0 && parseInt($("#areaMap_new_num").val())<=255) {
			this.addAreaName( $("#areaMap_new_num").val() , $("#areaMap_new_name").val() );
			$("#areaMap_new").hide();
			this.refreshDOM();
			$("#areaMap_new_num").val("");
			$("#areaMap_new_name").val("");
		};
	}
}

$("#areaMap_addNew").click(function(){ 
	$("#areaMap_new").toggle();

});

$("#areaMap_saveNew").click(function(){ 
	AreaNaming.saveNewFromDOM();
});

$(".areaMap_input").keydown(function(e){ 
    var code = e.which;
    if(code==13){
    	AreaNaming.saveNewFromDOM();
    };
});

$("#areaMap_current_table").on("click", ".areaMap_removeItem", function(event){
	var numToRem = $(this).closest("tr").children('td:nth-child(1)').text();
	AreaNaming.removeAreaName(numToRem);
	AreaNaming.refreshDOM();
});
