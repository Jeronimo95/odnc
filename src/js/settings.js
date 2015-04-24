var Settings = {
	area0warn: true
}

$( document ).on( "serial:portsAvalible", function( event ) {
	for(x in serial.avaliblePorts){
		var port = serial.avaliblePorts[x].comName;
		var finalString = "<option>{0}</option>".replace("{0}", port);
		$("#setting_serial_port").append(finalString);
	}
});
$("#setting_save").click(function (){
	serial.baudrate = parseInt($("#setting_baud_rate").val());
	serial.activePort = $("#setting_serial_port option:selected").text();
	$("#setting_save_comp").show();
	$("#setting_save_comp").delay(3000).fadeOut(400);
});