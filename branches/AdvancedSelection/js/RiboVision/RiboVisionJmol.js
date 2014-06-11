/* RiboVision 1.15 script library RiboVisionJmol.js 5:24 PM 06/10/2014 Chad R. Bernier


 * The MIT License (MIT)
 *
 * Copyright (C) 2012-2014  RiboEvo, Georgia Institute of Technology, apollo.chemistry.gatech.edu
 *
 * Contact: Bernier.C.R@gatech.edu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.

// For user documentation see http://apollo.chemistry.gatech.edu/RiboVision/Documentation/index.html
// For developer documentation see http://apollo.chemistry.gatech.edu/RiboVision/Documentation/DeveloperHelp.html
*/

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
	isSigned: true,
	jarFile: "JmolAppletSigned0.jar",
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