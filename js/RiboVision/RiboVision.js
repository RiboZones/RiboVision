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

/////////////////////////// Global Variable Declaration ///////////////////////
// Main Variables
var rvDataSets = [];
var rvViews = [];

// Other Global Variables
var FullBasePairSet;
var AgreeFunction = function () {};
var drag;

// Website Settings
var localStorageAvailable = false;
//var zoomEnabled = true;  //needs restoration, after adding a switch for it.
var onebuttonmode;      //needs restoration
var CurrPrivacyCookie;
var PanelDivide = 0.5; //needs restoration
var TopDivide = 0.28; //needs restoration
var OpenStateOnLoad = true;
var UserName = "Guest";

// Color Palettes, need to be consolidated
var OnionColors = ["#000000", "#ff0000", "#008000", "#0000ff", "#800080", "#ff8c00", "#ff8c00", "#ff8c00"];
var DomainColors = ["#ffd4a2", "#a999fb", "#3aa7ff", "#cc99cc", "#f0ff00", "#ff99cc", "#0ba34a", "#8ec640", "#B27643"];
var HelixColors = ["#000000", "#ed1c24", "#00a651", "#1c75bc", "#662d91"];
var ShapeColors = ["#808080", "#0000ff", "#008000", "#ffd700", "#ff0000"];
var BinaryColors = ["#509467", "#FF784F", "#FF0DE7"];
var RainBowColors = ["#00008f", "#00009f", "#0000af", "#0000bf", "#0000cf", "#0000df",
	"#0000ef", "#0000ff", "#0010ff", "#0020ff", "#0030ff", "#0040ff",
	"#0050ff", "#0060ff", "#0070ff", "#0080ff", "#008fff", "#009fff",
	"#00afff", "#00bfff", "#00cfff", "#00dfff", "#00efff", "#00ffff",
	"#10ffef", "#20ffdf", "#30ffcf", "#40ffbf", "#50ffaf", "#60ff9f",
	"#70ff8f", "#80ff80", "#8fff70", "#9fff60", "#afff50", "#bfff40",
	"#cfff30", "#dfff20", "#efff10", "#ffff00", "#ffef00", "#ffdf00",
	"#ffcf00", "#ffbf00", "#ffaf00", "#ff9f00", "#ff8f00", "#ff8000",
	"#ff7000", "#ff6000", "#ff5000", "#ff4000", "#ff3000", "#ff2000",
	"#ff1000", "#ff0000", "#ef0000", "#df0000", "#cf0000", "#bf0000",
	"#af0000", "#9f0000", "#8f0000", "#800000"];


///////////////////////////////////////////////////////////////////////////////
var canvas2DSupported = !!window.CanvasRenderingContext2D;
/////////////////////////// D3 Library IE 9+ //////////////////////////////////
if (canvas2DSupported){
	$.holdReady(true);
	$.ajax({
		type: "GET",
		async : false,
		url: "js/d3.js",
		dataType: "script",
		success: function(){
			$.holdReady(false);},
		error: function(){
			alert("js load fail");}
	});
	$.holdReady(true);
	$.ajax({
		type: "GET",
		async : false,
		url: "js/d3.csv.js",
		dataType: "script",
		success: function(){
		$.holdReady(false);},
		error: function(){
		alert("js load fail");}
	});
	$.holdReady(true);
	$.ajax({
		type: "GET",
		async : false,
		url: "js/d3.v3.js",
		dataType: "script",
		success: function(){
		$.holdReady(false);},
		error: function(){
		alert("js load fail");}
	});
	$.holdReady(true);
	$.ajax({
		type: "GET",
		async : false,
		url: "js/d3.v2.js",
		dataType: "script",
		success: function(){
		$.holdReady(false);},
		error: function(){
		alert("js load fail");}
	});
}
///////////////////////////////////////////////////////////////////////////////
////////////////////////// RiboVision Object Definitions  /////////////////////
$.holdReady(true);
$.ajax({
	type: "GET",
	crossDomain : true,
	url: "js/RiboVision/RiboVisionObjects.js",
	dataType: "script",
	success: function(){
		$.holdReady(false);},
	error: function(){
		alert("js load fail");}
});
///////////////////////////////////////////////////////////////////////////////

////////////////////////// Initialize RiboVision Jmol  ////////////////////////
$.holdReady(true);
$.ajax({
	type: "GET",
	crossDomain : true,
	url: "js/RiboVision/RiboVisionJmol.js",
	dataType: "script",
	success: function(){
		$.holdReady(false);},
	error: function(){
		alert("js load fail");}
});
///////////////////////////////////////////////////////////////////////////////

////////////////////////// Initialize RiboVision Functions  ////////////////////////
$.holdReady(true);
$.ajax({
	type: "GET",
	crossDomain : true,
	url: "js/RiboVision/RiboVisionLoadSpecies.js",
	dataType: "script",
	success: function(){
		$.holdReady(false);},
	error: function(){
		alert("js load fail");}
});
$.holdReady(true);
$.ajax({
	type: "GET",
	crossDomain : true,
	url: "js/RiboVision/RiboVisionSelections.js",
	dataType: "script",
	success: function(){
		$.holdReady(false);},
	error: function(){
		alert("js load fail");}
});
$.holdReady(true);
$.ajax({
	type: "GET",
	crossDomain : true,
	url: "js/RiboVision/RiboVisionLayers.js",
	dataType: "script",
	success: function(){
		$.holdReady(false);},
	error: function(){
		alert("js load fail");}
});
$.holdReady(true);
$.ajax({
	type: "GET",
	crossDomain : true,
	url: "js/RiboVision/RiboVisionFunctions.js",
	dataType: "script",
	success: function(){
		$.holdReady(false);},
	error: function(){
		alert("js load fail");}
});
///////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
	$.ajax({
		type: "GET",
		crossDomain : true,
		url: "js/RiboVision/RiboVisionInitialization.js",
		dataType: "script",
		success: function(){
			RiboVisionReady();},
		error: function(){
			alert("js load fail");}
	});
});

