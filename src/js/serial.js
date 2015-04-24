var Serial = function () {
	this.serialport = require("serialport");
	this.SerialPort = this.serialport.SerialPort;
	this.activePort = "";
	this.baudrate = 9600;

	this.listPorts();//on init, list the ports
};

Serial.prototype.connect = function (){
	this.sp = new this.SerialPort(this.activePort, {//create the class
		baudrate: this.baudrate,
		bufferSize: 8,
		parser: this.serialport.parsers.byteLength(8)//dynet1 is always 8 bytes long
	}, false); // this is the openImmediately flag

	this.sp.open(function (error) {
		if ( error ) {
			Statusbar.push('Serial: failed to open: '+error);
		} else {
			Statusbar.push('Serial: Connected');
			window.serial.sp.on('data', function(data) {//setup the data handler
				window.serial.praseData(data);
			});
		}
	});
};

Serial.prototype.dissconect = function (){
	if(typeof this.sp === "undefined") return;//if our port wasn't created, we shouldn't do anything
	if(!this.sp.isOpen()) return;
	this.sp.close(function (err){
		if(err){
			Statusbar.push('Serial: '+err);
		}else{
			Statusbar.push('Serial: Dissconect');
		}
	});
};

Serial.prototype.send = function (data){
	if(data[1]===0 && Settings.area0warn){//if byte 1 is 0 all areas are effected, we'll make sure the user wants this
		if(!confirm("This will be sent to all areas! \n Are you sure you want to continue?")){
			return false;
		}
	}

	if (this.sp.isOpen()) this.sp.write(data);
	return true;
};

Serial.prototype.toString = function (data){
	return data.toString('hex').toUpperCase().chunk(2).join(" ");//returns data buffer as string
};

Serial.prototype.praseData = function (data){
	$( document ).trigger("serial:newData", [data]);//triggers new data event
};

Serial.prototype.listPorts = function(){//lis all our ports into serial.avaliblePorts
	this.serialport.list(function (err, ports){
		window.serial.avaliblePorts = ports;
		$( document ).trigger("serial:portsAvalible");
	});
}

var serial = new Serial();//this whole thing should probably be an object not a class

var Dynet = {
	getDescriptionFromString: function (data){//convert sting to int array and differ to getDescriptionFromArray
		var strarray = data.split(" ");
		var result = strarray.map(function (x) { 
		    return parseInt(x, 16); 
		});
		return this.getDescriptionFromArray(result);
	},
	getDescriptionFromArray: function (data){//returns a string description of the packet
		if(data[0]!==0x1C)return "Unknown Sync Byte";//if the sync byte is not 1C we don't have a description
		if(isNaN(data[1]))return "";//if the area is NaN, we'll just return a blank string
		
		/////////////////// byte 1 is always area
		var string = "Area "

		string += data[1]
		//get the area name if it has one
		if(AreaNaming.getAeraName(data[1].toString())!==""){
			string += " ("+AreaNaming.getAeraName(data[1].toString())+")"
		}
		//byte 6 is always join, we'll put this just after the area in our description
		if (data[6]!==0xFF){
			string += " Domain "+data[6];
		}

		//now the fun part, a switch statement for the opp code
		switch(data[3]){//Don't mind this, just an 150 line switch statement.
			case 0x00:
			case 0x01:
			case 0x02:
			case 0x03:
			case 0x0A:
			case 0x0B:
			case 0x0C:
			case 0x0D://1-4 & A-D are presets
				string += " Preset ";
				var data5 = data[5];//not sure why i did that
				if (isNaN(data[5])) {//preset offset
					data5 = 0;
				}
				if(data[3]<=3){
					string += (data[3]+1)*(data5+1);//if preset is 1-4 we need to add one to the byte
				}else{
					string += (data[3]-5)*(data5+1);//if preset is 5-8 we need to remove 5 from the byte
				}
				string += " over ";
				string += (256*data[4]+data[2])/50;//this takes our high and low bytes for fade time, combines them to a single number and divides it by 50 to get seconds
				string += " seconds";
				break;

			case 0x04:
				string += " Off";
				string += " over ";
				string += (256*data[4]+data[2])/50;
				string += " seconds";
				break;

			case 0x05:
				string += " Decrement Level";
				string += " over ";
				string += (256*data[4]+data[2])/50;
				string += " seconds";
				break;

			case 0x06:
				string += " Increment Level";
				string += " over ";
				string += (256*data[4]+data[2])/50;
				string += " seconds";
				break;

			case 0x66:
				string += " Save current preset";
				break;

			case 0x67:
				string += " Restore Saved Preset";
				string += " over ";
				string += (256*data[4]+data[2])/50;
				string += " seconds";
				break;

			case 0x64:
				string += " Preset Offset ";
				string += data[2];
				break;

			case 0x0f:
				string += " Reset Preset";
				string += " over ";
				string += (256*data[4]+data[2])/50;
				string += " seconds";
				break;

			case 0x17:
				string += " PANIC";//ARRRRRRRRRRGHGHHGHJDSAHFJISDHF
				break;

			case 0x18:
				string += " Un Panic";//all okay now!
				break;

			case 0x61:
				string += " Request Level of Channel ";
				string += data[2]+1;
				break;

			case 0x60://reply from 0x61
				string += " Channel ";
				string += data[2]+1;
				string += " Current: ";
				string += this.getPercentageFromPacket(data[5]);
				string += "% Target: ";
				string += this.getPercentageFromPacket(data[4]);
				string += "%";
				break;

			case 0x71:
			case 0x72:
			case 0x73://these 3 are all channel to level, but over different time scales
				string += " Channel ";
				string += data[2]+1;
				string += " Fade to ";
				string += this.getPercentageFromPacket(data[4]);
				string += " over "
				switch(data[3]){
					case 0x71:
						string += data[5]/10;//0.1 sec to 25.5 sec
						break;

					case 0x72:
						string += data[5];//1 sec to 255 sec
						break;

					case 0x73:
						string += data[5]*60;//1 min to 22 min
						break;

				}
				string += " seconds";
				break;

			case 0x76:
				string += " Stop Fading channel ";
				string += data[2]+1;
				break;

			case 0x62://reply from 0x63
				string += " is in preset ";
				string += data[2]+1;
				break;

			case 0x63:
				string += " request preset";
				break;

			case 0x79:
				string += " all channels to ";
				string += this.getPercentageFromPacket(data[2]);
				string += " over "
				string += (256*data[5]+data[4])/50;
				string += " seconds";
				break;

			case 0x7A:
				string += " Stop Fading all";
				break;

			case 0x70:
				string += " toggle chanel state";
				break;

			case 0x7D:
				string += " channel ";
				string += data[2]+1;
				string += " program toggle preset";
				break;

			case 0x08:
				string += " Leave Program Mode";
				break;

			case 0x15:
				string += " Lock Control Panels";
				break;

			case 0x16:
				string += " Unlock Control Panels";
				break;

			default:
				string += " UNKNOWEN OPP CODE? ";
		}
		return string;//all done return the string
	},
	calcCecksum: function (data){//calculates the Negative 8 bit 2’s complement sum of Bytes 1-7
		var sum = 0;
		for(d in data){
			sum+=data[d];
		}
		var inv = ~sum;
		var add = inv+1;
		var and = add&0xFF;
		return and;
	},
	getPercentageFromPacket: function (data){//calculates the percent from the dynet packet
		var d = data ^ 255;
		d = (d / 254)*100;
		return d.toFixed(2);
	}
}