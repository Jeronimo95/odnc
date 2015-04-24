var Saved = {
	savedItems: [],
	refreshDOM: function() {
		this.savedItems.sort(function(a, b) {
			var textA = a.name.toUpperCase();
			var textB = b.name.toUpperCase();
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
		$("#saved_table").empty();
		this.savedItems.forEach(function (element, index, array){
			var desc = Dynet.getDescriptionFromArray(element["data"]);
			var string = "<tr data-id='{0}'><td>".format(index);
			//string += "<button class='btn btn-primary btn-xs saved_edit'><span class='glyphicon glyphicon-pencil' aria-hidden='true' title='Remove Area Name'></span></button> ";
			string += "<button class='btn btn-warning btn-xs saved_remove'><span class='glyphicon glyphicon-remove' aria-hidden='true' title='Remove Area Name'></span></button> ";
			string += "<button class='btn btn-danger btn-xs saved_send'><span class='glyphicon glyphicon-send' aria-hidden='true' title='Remove Area Name'></span></button>";
			string += "</td><td> {0} </td> <td> {1} </td> </tr>".format(element["name"], desc);
			$("#saved_table").append(string);
		});
	},
	add: function(name, data) {
		if(name==null)return;
		var obj = {
			name: name,
			data: data//data should be array of ints | TODO validate this
		}
		this.savedItems.push(obj);
		this.refreshDOM();
	},
	remove: function(ID) {
		this.savedItems.splice(ID, 1);
		this.refreshDOM();
	},
	send: function(ID) {
		var d = this.savedItems[ID].data;
		serial.send(d);
		var rtn = d.map(function (x){
			return x.toString(16).lpad("0",2);
		});
		var ownd = rtn.join(" ").toUpperCase();
		$( document ).trigger("serial:newData", [ownd]);
	},

}


$("#saved_table").on("click", ".saved_send", function(event){
	var id = $(this).closest("tr").data("id");
	Saved.send(parseInt(id));
	//TODO add alert
});
$("#saved_table").on("click", ".saved_remove", function(event){
	var id = $(this).closest("tr").data("id");
	Saved.remove(parseInt(id));
	//TODO add undo
});