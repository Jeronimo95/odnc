var Settings = {
	area0warn: true,
	only1c: true,
	onlyknownopps: true
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

	Settings.area0warn = $( "#setting_a0" ).is( ":checked" );
	Settings.only1c = $( "#setting_1c" ).is( ":checked" );
	
	if(Settings.only1c){
		$("#live_in_0").prop('disabled', true);
		$("#live_in_0").val('1C');
	}else{
		$("#live_in_0").prop('disabled', false);
	}

	Settings.onlyknownopps = $( "#setting_opps" ).is( ":checked" );

	$("#setting_save_comp").show();
	$("#setting_save_comp").delay(3000).fadeOut(400);
});