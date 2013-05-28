/* Ribovision 0.6 script library Ribovision.js 7:34 PM 01/07/2013 Chad R. Bernier


based on:
 *
 * Copyright (C) 2012,2013  RiboEvo, Georgia Institute of Technology, apollo.chemistry.gatech.edu
 *
 * Contact: Bernier.C.R@gatech.edu
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307  USA.
 */

// for documentation see apollo.chemistry.gatech.edu/Ribovision/documentation
//This doesn't exist and this probably won't be the final license.

// Initialize Jmol
//jmolInitialize("./jmol");
//Jmol.debugCode = true
/*
var myJmol1;
var myInfo1 = {
        height: '100%',
        width: '100%',
        jarFile: "JmolApplet.jar",
        jarPath: '..',
        j2sPath: "j2s",
        use: 'HTML5',
	console: "myJmol1_infodiv",
        debug: false
};*/

var JmolInfo = {
	addSelectionOptions: false,
	color: "#FFFFFF",
	debug: false,
	defaultModel: "",
	height: "100%",
	j2sPath: "./jmol/j2s", 
	isSigned: false,
	jarFile: "JmolApplet0.jar",
	jarPath: "./jmol/java",
	//j2sPath: "jmol/jsmol/j2s",
	memoryLimit: 1024,
	readyFunction: null,
	script: null,
	serverURL: "./jmol/jsmol.php",
	src: null,
	use: "Java HTML5",
	width: "100%"
};	