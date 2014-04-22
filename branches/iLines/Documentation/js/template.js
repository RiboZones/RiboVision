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

/*
/***********************************************
* Encrypt Email script- Please keep notice intact
* Tool URL: http://www.dynamicdrive.com/emailriddler/
* **********************************************/
/*<!-- Encrypted version of: Ri**Z***s [at] *****.*** //-->
*/
var emailriddlerarray=[82,105,98,111,90,111,110,101,115,64,103,109,97,105,108,46,99,111,109];
var encryptedemail_id16=''; //variable to contain encrypted email 
for (var i=0; i<emailriddlerarray.length; i++){
 encryptedemail_id16+=String.fromCharCode(emailriddlerarray[i]);
}

$(document).ready(function () {
	$("#HeaderDiv").load("header.html");
	$("#MenuDiv").load("menu.html");
	$("#FooterDiv").load("footer.html", function () {
		$("#contactaF").attr("href",'mailto:'+encryptedemail_id16+'?subject=RiboVision Question');
	});
	$("#contacta").attr("href",'mailto:'+encryptedemail_id16+'?subject=RiboVision Question');
	/*
	$.ajax({
		type: "GET",
		async : false,
		url: "http://s10.histats.com/js15.js",
		dataType: "script",
		success: function(){
			try {Histats.start(1,2246248,4,0,0,0,"");
			Histats.track_hits();} catch(err){};
			},
		error: function(){
			alert("js load fail");}
	});*/
});
