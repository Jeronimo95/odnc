//native requires
var GUI = require('nw.gui');
var fs = require('fs');

//get the window
var mainWindow = GUI.Window.get();

//when we start, maximise and show the window
onload = function() {
	mainWindow.maximize();
	mainWindow.show();
}


function appMenuBar(){
	var appMenuBar = new GUI.Menu({ type: 'menubar' });

//////////////////////////////////////////////////////// FILE MENU
	var fileMenu = new GUI.MenuItem({ label: 'File' });
	var fileMenuSub = new GUI.Menu();

	fileMenuSub.append(new GUI.MenuItem({ 
		label: 'New Project',
		click: function() {
			if(confirm("This will overwrite any unsaved data! \n Do you want to continue?")){
				serial.dissconect();
				$("body").empty();
				location.reload();//I don't see why this is a bad solution?...
			}
	  	} 
	}));
	fileMenuSub.append(new GUI.MenuItem({ 
		label: 'Open Project',
		click: function() {
			if(confirm("This will overwrite any unsaved data! \n Do you want to continue?")){
		    	Project.load();
		    	$("#data_live_table").empty();
			}
	  	} 
	}));
	fileMenuSub.append(new GUI.MenuItem({ 
		label: 'Save Project',
		click: function() {
	    	Project.save();
	  	} 
	}));

	fileMenuSub.append(new GUI.MenuItem({ type: 'separator' }));

	fileMenuSub.append(new GUI.MenuItem({ 
		label: 'Exit',
		click: function() {
	    	mainWindow.close();
	  	} 
	}));
	fileMenu.submenu = fileMenuSub;
	appMenuBar.append(fileMenu);


//////////////////////////////////////////////////////// VIEW MENU

	var viewMenu = new GUI.MenuItem({ label: 'View' });
	var viewMenuSub = new GUI.Menu();

	viewMenuSub.append(new GUI.MenuItem({ 
		label: 'Network  (F2)',
		key: 'F2',
		click: function() {
			Section.changeSection("network");
	  	} 
	}));
	viewMenuSub.append(new GUI.MenuItem({ 
		label: 'Saved  (F3)',
		key: 'F3',
		click: function() {
			Section.changeSection("saved");
	  	} 
	}));
	viewMenuSub.append(new GUI.MenuItem({ 
		label: 'Playback  (F4)',
		key: 'F4',
		click: function() {
			Section.changeSection("playback");
	  	} 
	}));

	viewMenuSub.append(new GUI.MenuItem({ type: 'separator' }));

	viewMenuSub.append(new GUI.MenuItem({ 
		label: 'Area Naming  (F5)',
		key: 'F5',
		click: function() {
			Section.changeSection("areanames");
	  	} 
	}));
	viewMenuSub.append(new GUI.MenuItem({ 
		label: 'ArtNet  (F6)',
		key: 'F6',
		click: function() {
			Section.changeSection("artnet");
	  	} 
	}));

	viewMenuSub.append(new GUI.MenuItem({ type: 'separator' }));

	viewMenuSub.append(new GUI.MenuItem({ 
		label: 'Settings  (F10)',
		key: 'F10',
		click: function() {
	    	Section.changeSection("settings");
	  	} 
	}));
	viewMenu.submenu = viewMenuSub;
	appMenuBar.append(viewMenu);


//////////////////////////////////////////////////////// SERIAL MENU

	var conMenu = new GUI.MenuItem({ label: 'Serial' });
	var conMenuSub = new GUI.Menu();

	conMenuSub.append(new GUI.MenuItem({ 
		label: 'Connect',
		click: function() {
	    	serial.connect()
	  	} 
	}));
	conMenuSub.append(new GUI.MenuItem({ 
		label: 'Disconnect',
		click: function() {
	    	serial.dissconect()
	  	} 
	}));
	conMenu.submenu = conMenuSub;
	appMenuBar.append(conMenu);



//////////////////////////////////////////////////////// HELP MENU

	var helpMenu = new GUI.MenuItem({ label: 'Help' });
	var helpMenuSub = new GUI.Menu();

	helpMenuSub.append(new GUI.MenuItem({ 
		label: 'About   (F1)',
		key: 'F1',
		click: function() {
		    Section.changeSection("about");
	  	} 
	}));
	helpMenuSub.append(new GUI.MenuItem({ 
		label: 'Updates',
		click: function() {
		    Section.changeSection("updates");
	  	} 
	}));
	helpMenu.submenu = helpMenuSub;
	appMenuBar.append(helpMenu);

	return appMenuBar;
}

//apply menu to app
mainWindow.menu = appMenuBar();


//disconnect before exit/reload
window.onbeforeunload = function() {
	serial.dissconect();
};

mainWindow.on('close', function() {
	serial.dissconect();
	mainWindow.close(true);
});