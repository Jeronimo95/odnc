# ODNC
Open DyNet Controller

ODNC is an application to interface with a Phillips Dynalite system.

### Features
* Network monitoring
* Saved packets
* Playbacks

For **downloads**, see the [releases](https://github.com/saferindoors/odnc/releases) section.

##### NOTE: USE AT YOUR OWN RISK. This program is distributed WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

![](http://i.imgur.com/37EeNGN.png)
![](http://i.imgur.com/Nvs7Juc.png)
![](http://i.imgur.com/gHdyR0Y.png)

## Linux
ODNC has been tested on Ubuntu. See the "Running from source" section below.

## OSX
ODNC should run on OSX, but it hasnt been tesed. See the "Running from source" section below.

## Running from source

1. Git clone the repo
2. cd into src
3. npm install [serialport](https://github.com/voodootikigod/node-serialport)
4. Install [NW.js](https://github.com/nwjs/nw.js) into the src directory
5. cd into the serialport directory and run `node-pre-gyp build --runtime=node-webkit --targert=0.12.2`
6. Run the NW executable.

## Reporting issues

Please use the [issues](https://github.com/saferindoors/odnc/issues) section to report any issues.

## License
Copyright (C) 2015 Jeremy Ryan.  
This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License version 2 as published by the Free Software Foundation.  
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
