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



///////////////////////// New Experimental Section  ???? //////////////////////
///////////////////////////////////////////////////////////////////////////////

/////////////////////////// Label Functions ///////////////////////////////////
function initLabels(species) {
	/*
	var array_of_checked_values = $("#speciesList").multiselect("getChecked").map(function(){
	return this.value;
	}).get();
	var species=array_of_checked_values[0];
	 */
	rvDataSets[0].addLabels([], []);
	
	if (species != "None") {
		$.getJSON('getData.php', {
			TextLabels : rvDataSets[0].SpeciesEntry.TextLabels
		}, function (labelData2) {
			var TextLabels = labelData2;
			$.getJSON('getData.php', {
				LineLabels : rvDataSets[0].SpeciesEntry.LineLabels
			}, function (labelLines2) {
				var LineLabels = labelLines2;
				rvDataSets[0].clearCanvas("labels");
				rvDataSets[0].addLabels(TextLabels, LineLabels);
				rvDataSets[0].drawLabels("labels");
			});
		});
		
		$.getJSON('getData.php', {
			FullTable : "SC_LSU_3D_Extra"
				}, function (data) {
				rvDataSets[0].addLabels(undefined, undefined, data);
				rvDataSets[0].drawLabels("labels",true);
		});
		
	} else {
		rvDataSets[0].clearCanvas("labels");
		rvDataSets[0].addLabels([], []);
	}
}

//function drawLabels(){}
///////////////////////////////////////////////////////////////////////////////


////////////////////////// Window Functions ///////////////////////////////////
function zoom(px, py, factor, rvViewObj) {
	if (rvViewObj == undefined) {
		rvViewObj = rvViews[0];
	}
	
	rvViewObj.x = (rvViewObj.x - px) * factor + px;
	rvViewObj.y = (rvViewObj.y - py) * factor + py;
	rvViewObj.scale *= factor;
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
}

function pan(dx, dy) {
	rvViews[0].x += dx;
	rvViews[0].y += dy;
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
}

function resizeElements(noDraw) {
	var MajorBorderSize = 1;
	var width = $(window).width();
	var height = $(window).height();
	var MainMenuFrac = 0.65;
	//ToolBar
	$(".toolBarBtn").css("height",0.04*height);
	$(".toolBarBtn").css("width",0.04*height);
	$("#toolBar").css("width",1.1*$(".toolBarBtn").first().outerHeight() + 4);
	var toolBarWidth = $("#toolBar").outerWidth();
	$("#toolBar").css("left",width-toolBarWidth);
	//Menu
	$("#menu").css('height', 0.9 * height);
	$("#menu").css('width', 0.16 * width);
	var xcorr = $("#menu").outerWidth();
	
	//Top Menu Section
	$("#topMenu").css('left', xcorr );
	$("#topMenu").css('top', 0);
	if($('input[name="nl"][value=on]').is(':checked')){
		$("#topMenu").show();
		$("#topMenu").outerHeight(TopDivide * height);
		$("#topMenu").css('width', width - xcorr - toolBarWidth);
		var ycorr = $("#topMenu").outerHeight();
	} else {
		$("#topMenu").hide();
		$("#topMenu").outerHeight(0);
		$("#topMenu").css('width', 0);
	}
	var ycorr = $("#topMenu").outerHeight();
	if($('input[name="jp"][value=on]').is(':checked')){
		var lp = (width - xcorr - toolBarWidth) * PanelDivide;
	} else {
		var lp = (width - xcorr - toolBarWidth);
	}
	var rp = (width - xcorr - toolBarWidth) - lp;
	var s = (height - ycorr);
	
	//SiteInfo
	$("#SiteInfo").css('width', xcorr);
	
	//ExportData
	$("#ExportData").css('width', xcorr);

	//MainMenu
	$("#MainMenu").css('width', MainMenuFrac * xcorr); //65%, make room for new MiniLayer
	$("#MainMenu").css('height', (0.9 * height) - parseFloat($("#SiteInfo").css('height')) - parseFloat($("#ExportData").css('height')));
	$("#MainMenu").css('top', parseFloat($("#SiteInfo").css('height')));
	
	//LinkSection
	$("#LinkSection").css('width', (1 - MainMenuFrac) * xcorr);
	$("#LinkSection").css('height',parseFloat($("#LinkSection .ui-widget-header3").css('height')) + parseFloat($(".miniLayerName").first().css('height')) + 13);
	$("#LinkSection").css('top', (0.9 * height) - parseFloat($("#ExportData").css('height')) - parseFloat($("#LinkSection").css('height')));
	
	//MiniLayer
	$("#MiniLayer").css('width', (1 - MainMenuFrac) * xcorr); //35%, for new MiniLayer
	$("#MiniLayer").css('height', (0.9 * height) - parseFloat($("#SiteInfo").css('height')) - parseFloat($("#ExportData").css('height')) - parseFloat($("#LinkSection").css('height')));
	$("#MiniLayer").css('top', parseFloat($("#SiteInfo").css('height')));
	
	//SideBarAccordian
	$("#SideBarAccordian").accordion("refresh");
	
	//Canvas Section
	$("#canvasDiv").css('height', s);
	$("#canvasDiv").css('width', lp);
	$("#canvasDiv").css('left', xcorr - 1);
	$("#canvasDiv").css('top', ycorr - 1);
	
	$("canvas").attr({
		width : lp - 2 * MajorBorderSize,
		height : s - 2 * MajorBorderSize
	});
	$("canvas").css('top', 0);
	$("canvas").css('left', 0);
	
	//Navigator Section
	$("#navigator").css('left', xcorr);
	$("#navigator").css('top', ycorr + parseFloat($("#canvaslabel").css("height")));
	
	//Jmol Section
	$("#jmolDiv").css('height', s);
	$("#jmolDiv").css('width', rp + 1);
	$("#jmolDiv").css('left', xcorr + parseFloat($("#canvasDiv").css('width')) - 1);
	$("#jmolDiv").css('top', ycorr - 1);
	
	//Jmol.resizeApplet(myJmol,[(rp - 2 * MajorBorderSize),(s - 2 * MajorBorderSize)]);
	//$("#myJmol_object").css('height', );
	//$("#myJmol_object").css('width', );
	//$("#myJmol_object").css('top', 0);
	//$("#myJmol_object").css('left', 0);
	
	// Layer Panel
	$( "#LayerDialog" ).dialog( "option", "height", s - 2 * MajorBorderSize );	
	$( "#LayerDialog" ).dialog("widget").position({
		my: "right top",
		at: "right top",
		of: $( "#canvasDiv" )
	});
	// Color Panel
	$( "#ColorDialog" ).dialog( "option", "height", 0.75 * s - 2 * MajorBorderSize );	
	$( "#ColorDialog" ).dialog("widget").position({
		my: "right top",
		at: "right top",
		of: $( "#canvasDiv" )
	});
	
	//LogoDiv
	$("#LogoDiv").css('width', xcorr);
	$("#LogoDiv").css('height', 0.1 * height);
	$("#LogoDiv").css('top', $("#menu").css('height'));
	
	rvViews[0].width = rvDataSets[0].HighlightLayer.Canvas.width;
	rvViews[0].height = rvDataSets[0].HighlightLayer.Canvas.height;
	rvViews[0].clientWidth = rvDataSets[0].HighlightLayer.Canvas.clientWidth;
	rvViews[0].clientHeight = rvDataSets[0].HighlightLayer.Canvas.clientHeight;
	
	if (noDraw!==true){
		rvDataSets[0].drawResidues("residues");
		rvDataSets[0].drawSelection("selected");
		rvDataSets[0].refreshResiduesExpanded("circles");
		rvDataSets[0].drawLabels("labels");
		rvDataSets[0].drawBasePairs("lines");
	}
	drawNavLine();
}

function resetView() {
	rvViews[0].x = 20;
	rvViews[0].y = 20;
	rvViews[0].scale = 1.2;
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
	$("#slider").slider("value", 20);
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////////// Selection Functions ///////////////////////////////
function dragHandle(event) {
	pan(event.clientX - rvViews[0].lastX, event.clientY - rvViews[0].lastY);
	rvViews[0].lastX = event.clientX;
	rvViews[0].lastY = event.clientY;
}

function getSelectedLine(event){
	var nx = (event.clientX - rvViews[0].x - $("#menu").width()) / rvViews[0].scale; //subtract 250 for the menu width
	var ny = (event.clientY - rvViews[0].y - $("#topMenu").height()) / rvViews[0].scale; //subtract 80 for the info height
	var zoomEnabled = $('input[name="za"][value=on]').is(':checked');
	if(rvDataSets[0].BasePairs != undefined){
		for (var i = 0; i < rvDataSets[0].BasePairs.length; i++) {
			var j = rvDataSets[0].BasePairs[i].resIndex1;
			var k = rvDataSets[0].BasePairs[i].resIndex2;
			var jdist = Math.sqrt(((nx - rvDataSets[0].Residues[j].X)*(nx - rvDataSets[0].Residues[j].X) + (ny - rvDataSets[0].Residues[j].Y)*(ny - rvDataSets[0].Residues[j].Y)));
			var kdist = Math.sqrt(((nx - rvDataSets[0].Residues[k].X)*(nx - rvDataSets[0].Residues[k].X) + (ny - rvDataSets[0].Residues[k].Y)*(ny - rvDataSets[0].Residues[k].Y)));
			var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X)*(rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)*(rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
						
			
			if(zoomEnabled){
					var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X)*(rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)*(rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
					if((150 - rvViews[0].scale*23) > jkdist){
						continue;
					}
					if(( (rvDataSets[0].Residues[j].X*rvViews[0].scale+rvViews[0].x < 0) || (rvDataSets[0].Residues[j].X*rvViews[0].scale+rvViews[0].x > rvViews[0].clientWidth) || (rvDataSets[0].Residues[j].Y*rvViews[0].scale+rvViews[0].y < 0) ||  (rvDataSets[0].Residues[j].Y*rvViews[0].scale+rvViews[0].y > rvViews[0].clientHeight))
					&& ( (rvDataSets[0].Residues[k].X*rvViews[0].scale+rvViews[0].x < 0) || (rvDataSets[0].Residues[k].X*rvViews[0].scale+rvViews[0].x > rvViews[0].clientWidth) || (rvDataSets[0].Residues[k].Y*rvViews[0].scale+rvViews[0].y < 0) ||  (rvDataSets[0].Residues[k].Y*rvViews[0].scale+rvViews[0].y > rvViews[0].clientHeight)) )  {
					continue;
						}
						}
			if( (jdist+kdist - jkdist) < .03){
					return i;
				}
			
			}
	
	}
	return -1;
}

function getSelected(event) {
	var nx = (event.clientX - rvViews[0].x - $("#menu").width()) / rvViews[0].scale; //subtract 250 for the menu width
	var ny = (event.clientY - rvViews[0].y - $("#topMenu").height()) / rvViews[0].scale; //subtract 80 for the info height
	if (rvDataSets[0].Residues != undefined) {
		for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
			var res = rvDataSets[0].Residues[i];
			if (((nx > res.X) ? nx - res.X : res.X - nx) + ((ny > res.Y) ? ny - res.Y : res.Y - ny) < 2) {
				return i;
			}
		}
		return -1;
	} else {
		return -1;
	}
}

function expandSelection(command, SelectionName) {
	if (!SelectionName){
		SelectionName = "Main";
	}
	for (var i = 0; i < command.length; i++) {
		var com = command[i];
		var comsplit = com.split(":");
		if (comsplit.length > 1) {
			var index = comsplit[1].indexOf("-");
			if (index != -1) {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
				var start = chainID + "_" + comsplit[1].substring(1, index);
				var end = chainID + "_" + comsplit[1].substring(index + 1, comsplit[1].length - 1);
				
				if (start && end) {
					var start_ind = rvDataSets[0].ResidueList.indexOf(start);
					var end_ind = rvDataSets[0].ResidueList.indexOf(end);
					
					for (var j = start_ind; j <= end_ind; j++) {
						var targetSelection=rvDataSets[0].getSelection(SelectionName);
						targetSelection.Residues.push(rvDataSets[0].Residues[j]);
					}
				}
			} else {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
				//var aloneRes = chainID + "_" + comsplit[1].substring(1,comsplit[1].length-1);
				var aloneRes = chainID + "_" + comsplit[1];
				var alone_ind = rvDataSets[0].ResidueList.indexOf(aloneRes);
				if (alone_ind >=0){
					var targetSelection=rvDataSets[0].getSelection(SelectionName);
					targetSelection.Residues.push(rvDataSets[0].Residues[alone_ind]);
				}
			}
		} else if (comsplit[0] != "") {
			var index = comsplit[0].indexOf("-");
			if (index != -1) {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[0];
				var start = chainID + "_" + comsplit[0].substring(0, index);
				var end = chainID + "_" + comsplit[0].substring(index + 1, comsplit[0].length);
				
				if (start && end) {
					var start_ind = rvDataSets[0].ResidueList.indexOf(start);
					var end_ind = rvDataSets[0].ResidueList.indexOf(end);
					for (var j = start_ind; j <= end_ind; j++) {
						var targetSelection=rvDataSets[0].getSelection(SelectionName);
						targetSelection.Residues.push(rvDataSets[0].Residues[j]);
					}
				}
			} else {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[0];
				var aloneRes = chainID + "_" + comsplit[0];
				var alone_ind = rvDataSets[0].ResidueList.indexOf(aloneRes);
				if (alone_ind >=0){
					var targetSelection=rvDataSets[0].getSelection(SelectionName);
					targetSelection.Residues.push(rvDataSets[0].Residues[alone_ind]);
				}
			}
		}
	}
}

function commandSelect(command,SeleName) {
	if (!command) {
		var command = document.getElementById("commandline").value;
	}
	if (!SeleName) {
		var SeleName = $('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name');
	}
	command = command.split(";");
	expandSelection(command,SeleName);
	updateSelectionDiv(SeleName);
	drawNavLine();
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].drawBasePairs("lines");
	//console.log('selected Residue by command input');
}

function selectResidue(event) {
	var targetSelection = rvDataSets[0].getSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
	if (drag) {
		var curX = (event.clientX - $("#menu").width() - rvViews[0].x) / rvViews[0].scale;
		var curY = (event.clientY - $("#topMenu").height() - rvViews[0].y) / rvViews[0].scale;
		if (rvDataSets[0].Residues != undefined) {
			for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
				if (rvViews[0].startX <= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X <= curX && rvViews[0].startY <= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y <= curY) {
					targetSelection.Residues.push(rvDataSets[0].Residues[i]);
				}
				if (rvViews[0].startX >= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X >= curX && rvViews[0].startY <= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y <= curY) {
					targetSelection.Residues.push(rvDataSets[0].Residues[i]);
				}
				if (rvViews[0].startX <= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X <= curX && rvViews[0].startY >= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y >= curY) {
					targetSelection.Residues.push(rvDataSets[0].Residues[i]);
				}
				if (rvViews[0].startX >= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X >= curX && rvViews[0].startY >= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y >= curY) {
					targetSelection.Residues.push(rvDataSets[0].Residues[i]);
				}
			}
			var sel = getSelected(event);
			//Unselect code
			if (sel != -1) {
				var res = rvDataSets[0].Residues[sel];
				var result = $.grep(targetSelection.Residues, function(e){ return e.map_Index == res.map_Index; });
				//alert(result[0].resNum);
				
				if (result[0]) {
					targetSelection.Residues = $.grep(targetSelection.Residues, function(e){ return e.map_Index !== result[0].map_Index; });
				} else {
					targetSelection.Residues.push(res);
				}
			}
			rvDataSets[0].drawResidues("residues");
			rvDataSets[0].drawSelection("selected");
			rvDataSets[0].drawBasePairs("lines");
			
			//drawLabels();
			updateSelectionDiv(targetSelection.Name);
			drawNavLine();
			drag = false;
			//updateModel();
		} else {
			drag = false;
		}
	}
	$("#canvasDiv").off("mouseup", selectResidue);
	/*
	if (onebuttonmode === "move") {
		$("#canvasDiv").bind("mousemove", mouseMoveFunction);
	}*/
	//console.log('selected Residue by mouse' );
	//drawNavLine(1);
}

function updateSelectionDiv(SeleName) {
	if (!SeleName){
		SeleName = "Main";
	}
	var text = "";
	var targetSelection = rvDataSets[0].getSelection(SeleName);
	for (var i = 0; i < targetSelection.Residues.length; i++) {
		res = targetSelection.Residues[i];
		//text = text + rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(res.ChainID)] + ":" + res.resNum.replace(/[^:]*:/g, "") + "( " + res.CurrentData + " ); ";
		text = text + rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(res.ChainID)] + ":" + res.resNum.replace(/[^:]*:/g, "") + "; ";
		
	}
	//$("#selectDiv").html(text)
	$("[name=" + SeleName + "]").find(".selectionContent").find("[name=selectDiv]").text(text);
}

function clearSelection(AllFlag) {
	if (AllFlag){
		$.each(rvDataSets[0].Selections, function(index,value){
			value.Residues = [];
			updateSelectionDiv(value.Name);
		});
	} else {
		var targetSelection = rvDataSets[0].getSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
		targetSelection.Residues = []
		updateSelectionDiv(targetSelection.Name);
		updateModel();
	}
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].drawBasePairs("lines");
	drawNavLine();
}

function selectionBox(event) {
	rvViews[0].startX = (event.clientX - rvViews[0].x - $("#menu").width()) / rvViews[0].scale;
	rvViews[0].startY = (event.clientY - rvViews[0].y - $("#topMenu").height()) / rvViews[0].scale;
	drag = true;
}
///////////////////////////////////////////////////////////////////////////////


///////////////////////// Color Functions /////////////////////////////////////
function colorResidue(event) {
	var sel = getSelected(event);
	if (sel != -1) {
		var targetLayer=rvDataSets[0].getSelectedLayer();
		var color = $("#MainColor").val();
		targetLayer.dataLayerColors[sel]=color;	
		switch (targetLayer.Type){
			case "residues" : 
				var res = rvDataSets[0].Residues[sel];
				res.color = color;
				rvDataSets[0].drawResidues("residues");
				break;
			case "circles" :
				rvDataSets[0].refreshResiduesExpanded(targetLayer.LayerName);
				break;
			default:
		}
		//drawLabels();
		update3Dcolors();
	}
}

function clearColor(update3D) {
	var	targetLayer=rvDataSets[0].getLayerByType("residues");
	if (arguments.length < 1) {
		var update3D = true;
	}
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		rvDataSets[0].Residues[i].color = "#000000";
		targetLayer[0].dataLayerColors[i]= "#000000";
		//targetLayer[0].Data[i] = rvDataSets[0].Residues[i].map_Index;
		targetLayer[0].Data[i] = undefined;
	}
	rvDataSets[0].drawResidues("residues");
	//drawLabels();
	
	if (update3D) {
		update3Dcolors();
		updateModel();
	}
	
}

function colorSelection() {
	var targetLayer=rvDataSets[0].getSelectedLayer();
	var color = $("#MainColor").val();
	var targetSelection = rvDataSets[0].getSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
	for (var i = 0; i < targetSelection.Residues.length; i++) {
		targetLayer.dataLayerColors[targetSelection.Residues[i].map_Index - 1] = color;
	}
	//rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawDataCircles(targetLayer.LayerName,undefined,undefined,true);
	rvDataSets[0].drawResidues(targetLayer.LayerName,undefined,undefined,true);
	//drawLabels();
	update3Dcolors();
}

function update3Dcolors() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	var script = "set hideNotSelected false;";
	var r0,
	r1,
	curr_chain,
	curr_color,
	compare_color,
	n,
	m;
	if (rvDataSets[0].Residues[0] == undefined){return};
	//r0=rvDataSets[0].Residues[0].resNum.replace(/[^:]*:/g,"");
	r0 = rvDataSets[0].Residues[0].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
	curr_chain = rvDataSets[0].Residues[0].ChainID;
	var targetLayer=rvDataSets[0].getLinkedLayer();
	//rvDataSets[0].Residues[0].CurrentData=targetLayer.Data[0];

	curr_color = colorNameToHex(targetLayer.dataLayerColors[0]);
	
	if (!curr_color || curr_color === '#000000') {
		curr_color = '#858585';
	}
	for (var i = 1; i < rvDataSets[0].Residues.length; i++) {
		var residue = rvDataSets[0].Residues[i];
		var residueLast = rvDataSets[0].Residues[i - 1];
		var residueLastColor = targetLayer.dataLayerColors[i - 1];
		//rvDataSets[0].Residues[i].CurrentData=targetLayer.Data[i];
		
		if (!residueLastColor){
			residueLastColor = '#858585';
		}
		if (residue.ChainID != "") {
			if (curr_chain == "") {
				curr_chain = residue.ChainID;
				curr_color = colorNameToHex(targetLayer.dataLayerColors[i]);
				if (!curr_color || curr_color === '#000000') {
					curr_color = '#858585';
				}
				r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
			} else if (residue.ChainID == null) {
				curr_chain = residue.ChainID;
				curr_color = colorNameToHex(targetLayer.dataLayerColors[i]);
				if (!curr_color || curr_color === '#000000') {
					curr_color = '#858585';
				}
				r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
			} else {
				if (!targetLayer.dataLayerColors[i]){
					compare_color = '#858585';
				} else {
					compare_color = colorNameToHex(targetLayer.dataLayerColors[i]);
				}
				if (((compare_color != colorNameToHex(residueLastColor)) || (curr_chain != residue.ChainID)) || (i == (rvDataSets[0].Residues.length - 1))) {
					r1 = residueLast.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
					n = r1.match(/[A-z]/g);
					if (n != undefined) {
						r1 = r1.replace(n, "^" + n);
					}
					if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
						//script += "select " + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1) + ".1 and :" + curr_chain + " and (" + r0 + " - " + r1 + "); color Cartoon opaque [x" + curr_color + "]; ";
						script += "select " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and :" + curr_chain + " and (" + r0 + " - " + r1 + "); color Cartoon opaque [x" + curr_color + "]; ";
					} else {
						script += "select " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and :" + curr_chain + " and (" + r0 + " - " + r1 + "); color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
					}
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
					m = r0.match(/[A-z]/g);
					if (m != undefined) {
						r0 = r0.replace(m, "^" + m);
					}
					if (residue.ChainID != "") {
						curr_chain = residue.ChainID;
					}
					curr_color = colorNameToHex(targetLayer.dataLayerColors[i]);
					if (!curr_color || curr_color === '#000000') {
						curr_color = '#858585';
					}
				}
			}
		}
	}
	if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and :" + curr_chain + " and (" + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "); color Cartoon opaque [x" + curr_color + "]; ";
	} else {
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and :" + curr_chain + " and (" + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "); color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
	}
	//updateSelectionDiv();
	//jmolScript(script);
	Jmol.script(myJmol, script);
}

function colorProcess(DataInput, indexMode,targetLayer,colors) {
	var color_data = new Array();
	var color_data_IN = new Array();
	var data = new Array();
	var DataPoints = 0;
	if (DataInput.IncludeData){
		color_data_IN = DataInput.IncludeData;
		if (DataInput.ExtraData){
			color_data_IN = color_data_IN.concat(DataInput.ExtraData);
		}
		data = DataInput.IncludeData;
	} else {
		color_data_IN = DataInput;
		data = DataInput;
	}
	$.each(color_data_IN, function (index, value) {
		var f = parseFloat(value);
		if (!isNaN(f)){
			color_data.push(f);
		}
	});
	$.each(data, function (index, value) {
		var f = parseFloat(value);
		if (isNaN(f)){
			data[index]=undefined;
		} else {
			data[index]=f;
		}
	});
	
	var min = Math.min.apply(Math, color_data);
	var max = Math.max.apply(Math, color_data);
	var range = max - min;
	
	if (arguments.length < 3) {
		var targetLayer = rvDataSets[0].getSelectedLayer();
	}
	
	if (!targetLayer) {
		$("#dialog-selection-warning p").text("Please select a valid layer and try again.");
		$("#dialog-selection-warning").dialog("open");
		return;
	}
	switch (targetLayer.Type) {
	case "circles":
		targetLayer.Data = data;
		if (indexMode == "1") {
			var dataIndices = data;
		} else {
			var dataIndices = new Array;
			for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
				dataIndices[i] = Math.round((data[i] - min) / range * (colors.length - 1));
			}
		}
		rvDataSets[0].drawDataCircles(targetLayer.LayerName, dataIndices, colors);
		update3Dcolors();
		break;
	case "residues":
		targetLayer.Data = data;
		if (indexMode == "1") {
				dataIndices = data;
		} else {
			var dataIndices = new Array;
			for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
				dataIndices[i] = Math.round((data[i] - min) / range * (colors.length - 1));
			}
		}
		
		rvDataSets[0].drawResidues(targetLayer.LayerName, dataIndices, colors);
		update3Dcolors();
		break;
	default:
		$( "#dialog-layer-type-error" ).dialog("open")
	}

}

function colorMappingLoop(targetLayer, seleProt, seleProtNames, OverRideColors) {
	if (arguments.length >= 4) {
		var colors2 = OverRideColors;
	} else {
		var colors2 = RainBowColors;
	}
	//Residue Part
	if (targetLayer){
		//var targetLayer = rvDataSets[0].getSelectedLayer();
		if (targetLayer.Type === "circles"){
			targetLayer.clearCanvas();
			targetLayer.clearData();
		}
		if (targetLayer.Type === "residues"){
			//targetLayer.clearCanvas();
			clearColor(false);
			targetLayer.clearData();
		}
		targetLayer.Data = new Array;
		for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
			targetLayer.Data[j] = " ";
		}
		
	}
	
	//Interaction Part
	var array_of_checked_values = $("#PrimaryInteractionList").multiselect("getChecked").map(function(){
	   return this.value;	
	}).get();
	var interactionchoice = array_of_checked_values[0];
	//var interactionchoice = $('#PrimaryInteractionList').val();
	var p = interactionchoice.indexOf("_NPN");
	if ( p >=0 ){
		rvDataSets[0].BasePairs = [];
		rvDataSets[0].clearCanvas("lines");
	}
	
	//Jmol Part
	var Jscript = "display (selected), (" + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and (";
	var JscriptP = "set hideNotSelected false;";
	
	$("#ProtList").multiselect("widget").find(".ui-multiselect-checkboxes").find("span").css("color","black"); // Reset Protein colors to black.
	//Loop
	
	for (var i = 0; i < seleProt.length; i++) {
		if (seleProt.length > 1) {
			var val = Math.round((i / (seleProt.length - 1)) * (colors2.length - 1));
		} else {
			var val = 0;
		}	

		var newcolor = (val < 0 || val >= colors2.length) ? "#000000" : colors2[val];
		var ProtName = $.grep($("#ProtList").multiselect("getChecked"), function(e) {
			return e.value == seleProt[i];
		});
		$(ProtName).next().css("color",newcolor);
		
		if (targetLayer){
			var dataIndices = new Array;
			for (var jj = 0; jj < rvDataSets[0].Residues.length; jj++) {
				if (rvDataSets[0].Residues[jj][seleProt[i]] && rvDataSets[0].Residues[jj][seleProt[i]] >0){
					dataIndices[jj] = rvDataSets[0].Residues[jj][seleProt[i]];
					targetLayer.Data[jj] = targetLayer.Data[jj] + seleProtNames[i] + " ";
				}
			}
			rvDataSets[0].drawDataCircles(targetLayer.LayerName, dataIndices, ["#000000", newcolor], true);
			rvDataSets[0].drawResidues(targetLayer.LayerName, dataIndices, ["#000000", newcolor], true);
		}
		if (i === 0) {
			Jscript += ":" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])];
		} else {
			Jscript += " or :" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])];
		}
		JscriptP += "select (" + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])] + "); color Cartoon opaque [" + newcolor.replace("#", "x") + "];spacefill off;";
		if (p > 0) {
			appendBasePairs(interactionchoice, seleProt[i]);
		}
	}
	
	drawNavLine();
	Jscript += "));";
	//JscriptP+="display " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA ) + ".1, " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein ) + ".1;" ;
	if($('input[name="jp"][value=on]').is(':checked')){
		update3Dcolors();
		refreshModel();
		Jmol.script(myJmol, Jscript);
		Jmol.script(myJmol, JscriptP);
	}
}

function update3DProteins(seleProt, OverRideColors) {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	if (arguments.length >= 2) {
		var colors2 = OverRideColors;
	} else {
		var colors2 = RainBowColors;
	}
	
	var JscriptP = "set hideNotSelected false;";
	
	for (var i = 0; i < seleProt.length; i++) {
		if (seleProt.length > 1) {
			var val = Math.round((i / (seleProt.length - 1)) * (colors2.length - 1));
		} else {
			var val = 0;
		}
		var newcolor = (val < 0 || val >= colors2.length) ? "#000000" : colors2[val];
		
		JscriptP += "select (" + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])] + "); color Cartoon opaque [" + newcolor.replace("#", "x") + "];";
	}
	//JscriptP+="display " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA ) + ".1, " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein ) + ".1;";
	//jmolScript(JscriptP);
	Jmol.script(myJmol, JscriptP);
}

function colorMapping(targetLayer,ChoiceList, ManualCol, OverRideColors, indexMode, rePlaceData) {
	if (arguments.length == 2 || ManualCol == "42") {		
		var colName = $("#" + ChoiceList).val();
	}
	if (arguments.length >= 3 && ManualCol != "42") {
		var colName = ManualCol;
	}
	if (arguments.length >= 4) {
		var colors = OverRideColors;
	} else {
		var colors = RainBowColors;
	}
	if (indexMode==undefined){
		var indexMode=[];
		indexMode[0]=false;
	}
	
		if (!targetLayer) {
			$("#dialog-selection-warning p").text("Please select a valid layer and try again.");
			$("#dialog-selection-warning").dialog("open");
			return;
		}
		switch (targetLayer.Type) {
		case "circles":
			var data = new Array;
			for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
				data[j] = rvDataSets[0].Residues[j][colName[0]];
			}
			colorProcess(data, indexMode[0],targetLayer,colors);
			break;
		case "residues":
			var data = new Array;
			for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
				data[j] = rvDataSets[0].Residues[j][colName[0]];
			}
			colorProcess(data, indexMode[0],targetLayer,colors);
			break;
		default:
			$( "#dialog-layer-type-error" ).dialog("open")
		}
		
}

function colorNameToHex(color) {
	var colors = { 
		"aliceblue": "#f0f8ff",
		 "antiquewhite": "#faebd7",
		 "aqua": "#00ffff",
		 "aquamarine": "#7fffd4",
		 "azure": "#f0ffff",
		 "beige": "#f5f5dc",
		 "bisque": "#ffe4c4",
		 "black": "#000000",
		 "blanchedalmond": "#ffebcd",
		 "blue": "#0000ff",
		 "blueviolet": "#8a2be2",
		 "brown": "#a52a2a",
		 "burlywood": "#deb887",
		 "cadetblue": "#5f9ea0",
		 "chartreuse": "#7fff00",
		 "chocolate": "#d2691e",
		 "coral": "#ff7f50",
		 "cornflowerblue": "#6495ed",
		 "cornsilk": "#fff8dc",
		 "crimson": "#dc143c",
		 "cyan": "#00ffff",
		 "darkblue": "#00008b",
		 "darkcyan": "#008b8b",
		 "darkgoldenrod": "#b8860b",
		 "darkgray": "#a9a9a9",
		 "darkgreen": "#006400",
		 "darkkhaki": "#bdb76b",
		 "darkmagenta": "#8b008b",
		 "darkolivegreen": "#556b2f",
		 "darkorange": "#ff8c00",
		 "darkorchid": "#9932cc",
		 "darkred": "#8b0000",
		 "darksalmon": "#e9967a",
		 "darkseagreen": "#8fbc8f",
		 "darkslateblue": "#483d8b",
		 "darkslategray": "#2f4f4f",
		 "darkturquoise": "#00ced1",
		 "darkviolet": "#9400d3",
		 "deeppink": "#ff1493",
		 "deepskyblue": "#00bfff",
		 "dimgray": "#696969",
		 "dodgerblue": "#1e90ff",
		 "firebrick": "#b22222",
		 "floralwhite": "#fffaf0",
		 "forestgreen": "#228b22",
		 "fuchsia": "#ff00ff",
		 "gainsboro": "#dcdcdc",
		 "ghostwhite": "#f8f8ff",
		 "gold": "#ffd700",
		 "goldenrod": "#daa520",
		 "gray": "#808080",
		 "green": "#008000",
		 "greenyellow": "#adff2f",
		 "honeydew": "#f0fff0",
		 "hotpink": "#ff69b4",
		 "indianred": "#cd5c5c",
		 "indigo": "#4b0082",
		 "ivory": "#fffff0",
		 "khaki": "#f0e68c",
		 "lavender": "#e6e6fa",
		 "lavenderblush": "#fff0f5",
		 "lawngreen": "#7cfc00",
		 "lemonchiffon": "#fffacd",
		 "lightblue": "#add8e6",
		 "lightcoral": "#f08080",
		 "lightcyan": "#e0ffff",
		 "lightgoldenrodyellow": "#fafad2",
		 "lightgrey": "#d3d3d3",
		 "lightgreen": "#90ee90",
		 "lightpink": "#ffb6c1",
		 "lightsalmon": "#ffa07a",
		 "lightseagreen": "#20b2aa",
		 "lightskyblue": "#87cefa",
		 "lightslategray": "#778899",
		 "lightsteelblue": "#b0c4de",
		 "lightyellow": "#ffffe0",
		 "lime": "#00ff00",
		 "limegreen": "#32cd32",
		 "linen": "#faf0e6",
		 "magenta": "#ff00ff",
		 "maroon": "#800000",
		 "mediumaquamarine": "#66cdaa",
		 "mediumblue": "#0000cd",
		 "mediumorchid": "#ba55d3",
		 "mediumpurple": "#9370d8",
		 "mediumseagreen": "#3cb371",
		 "mediumslateblue": "#7b68ee",
		 "mediumspringgreen": "#00fa9a",
		 "mediumturquoise": "#48d1cc",
		 "mediumvioletred": "#c71585",
		 "midnightblue": "#191970",
		 "mintcream": "#f5fffa",
		 "mistyrose": "#ffe4e1",
		 "moccasin": "#ffe4b5",
		 "navajowhite": "#ffdead",
		 "navy": "#000080",
		 "oldlace": "#fdf5e6",
		 "olive": "#808000",
		 "olivedrab": "#6b8e23",
		 "orange": "#ffa500",
		 "orangered": "#ff4500",
		 "orchid": "#da70d6",
		 "palegoldenrod": "#eee8aa",
		 "palegreen": "#98fb98",
		 "paleturquoise": "#afeeee",
		 "palevioletred": "#d87093",
		 "papayawhip": "#ffefd5",
		 "peachpuff": "#ffdab9",
		 "peru": "#cd853f",
		 "pink": "#ffc0cb",
		 "plum": "#dda0dd",
		 "powderblue": "#b0e0e6",
		 "purple": "#800080",
		 "red": "#ff0000",
		 "rosybrown": "#bc8f8f",
		 "royalblue": "#4169e1",
		 "saddlebrown": "#8b4513",
		 "salmon": "#fa8072",
		 "sandybrown": "#f4a460",
		 "seagreen": "#2e8b57",
		 "seashell": "#fff5ee",
		 "sienna": "#a0522d",
		 "silver": "#c0c0c0",
		 "skyblue": "#87ceeb",
		 "slateblue": "#6a5acd",
		 "slategray": "#708090",
		 "snow": "#fffafa",
		 "springgreen": "#00ff7f",
		 "steelblue": "#4682b4",
		 "tan": "#d2b48c",
		 "teal": "#008080",
		 "thistle": "#d8bfd8",
		 "tomato": "#ff6347",
		 "turquoise": "#40e0d0",
		 "violet": "#ee82ee",
		 "wheat": "#f5deb3",
		 "white": "#ffffff",
		 "whitesmoke": "#f5f5f5",
		 "yellow": "#ffff00",
		 "yellowgreen": "#9acd32",
		 "darkgrey": "#a9a9a9",
		 "darkslategrey": "#2f4f4f",
		 "dimgrey": "#696969",
		 "grey": "#808080",
		 "lightgray": "#d3d3d3",
		 "lightslategrey": "#778899",
		 "slategrey": "#708090"
	};
	if (color) {
		var newcolorH = color.match(/#[\dABCDEFabcdef]{6,6}$/);
		if ((newcolorH  !=null) && newcolorH[0].length === 7){
			return newcolorH[0];
		} else if (typeof colors[color.toLowerCase()] != 'undefined'){
			return colors[color.toLowerCase()];
		} else {
			return false
		}
	} else {
		return false;
	}
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////// Residue Functions /////////////////////////////////////
//function refreshResiduesExpanded(targetLayer){}

//function drawResiduesExpanded(targetLayer,dataIndices,ColorArray){}

//function drawResidues(){}
///////////////////////////////////////////////////////////////////////////////


//////////////////////// Interaction Functions ////////////////////////////////
//function drawBasePairs(){}

function appendBasePairs(BasePairTable, colName) {
	var p = BasePairTable.indexOf("_NPN");
	if (p < 0) {
		$.getJSON('getData.php', {
			BasePairs : BasePairTable
		}, function (basePairs2) {
			rvDataSets[0].BasePairs = rvDataSets[0].BasePairs.concat(basePairs2);
			FullBasePairSet = rvDataSets[0].BasePairs;
			rvDataSets[0].drawBasePairs("lines");
		});
	} else {
		//var dd = document.getElementById("ProtList");
		//var colName = dd.options[dd.selectedIndex].value;
		$.getJSON('getData.php', {
			ProtBasePairs : BasePairTable,
			ProtChain : colName
		}, function (basePairs2) {
			rvDataSets[0].BasePairs = rvDataSets[0].BasePairs.concat(basePairs2);
			FullBasePairSet = rvDataSets[0].BasePairs;
			rvDataSets[0].drawBasePairs("lines");
		});
	}
}

function refreshBasePairs(BasePairTable) {
	
	if (BasePairTable != "clear_lines") {
		var p = BasePairTable.indexOf("_NPN");
		if (p < 0) {
			$.getJSON('getData.php', {
				BasePairs : BasePairTable
			}, function (basePairs2) {
				rvDataSets[0].BasePairs = basePairs2;
				rvDataSets[0].drawBasePairs("lines");
				// Set interaction submenu to allow for subsets of these basepairs to be displayed. 
				// For now, let's set a global variable to store the whole table, so that it doesn't have to be refetched everytime a subset is chosen. 
				// This will get better when I revamp who BasePair interactions work
	
				FullBasePairSet = rvDataSets[0].BasePairs;
				var BP_Type = [];	
				$.each(rvDataSets[0].BasePairs, function (ind, item) {
					BP_Type.push(item.bp_type);
				});
				BP_TypeU = $.grep(BP_Type, function (v, k) {
					return $.inArray(v, BP_Type) === k;
				});
							
				var ims = document.getElementById("SecondaryInteractionList");
				ims.options.length = 0;
				$.each(BP_TypeU, function (ind, item) {
					ims.options[ind] = new Option(item, item);
					ims.options[ind].setAttribute("selected", "selected");
				});	
				$("#SecondaryInteractionList").multiselect("refresh");
			});
		} else {
			var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
			var array_of_checked_titles = $("#ProtList").multiselect("getChecked").map(function () {
					return this.title;
			}).get();
			var ims = document.getElementById("SecondaryInteractionList");
			ims.options.length = 0;
			ims.options[0] = new Option("NPN", "NPN");
			ims.options[0].setAttribute("selected", "selected");
			$("#SecondaryInteractionList").multiselect("refresh");
			colorMappingLoop(undefined,array_of_checked_values,array_of_checked_titles);
			
		}
		
	} else {
		rvDataSets[0].BasePairs = [];
		rvDataSets[0].clearCanvas("lines");
	}
	
	
}

function filterBasePairs(FullBasePairSet,IncludeTypes){
	rvDataSets[0].BasePairs=[];
	$.each(FullBasePairSet, function (index, value){
		if ($.inArray(value.bp_type,IncludeTypes) >= 0){
			rvDataSets[0].BasePairs.push(value);
		}
	});
	rvDataSets[0].drawBasePairs("lines");
}
///////////////////////////////////////////////////////////////////////////////


//////////////////////////// Mouse Functions //////////////////////////////////
function mouseEventFunction(event) {
	var BaseViewMode = $('input[name="bv"][value=on]').is(':checked');
	$("#ResidueTip").tooltip("close");
	$("#InteractionTip").tooltip("close");
	if (event.handleObj.origType == "mousedown" && !BaseViewMode) {
		if (onebuttonmode == "select" || (event.which == 3 && event.altKey == false) || (event.which == 1 && event.shiftKey == true)) {
			$("#canvasDiv").off("mousemove", dragHandle);
			$("#canvasDiv").off("mousemove", mouseMoveFunction);
			selectionBox(event);
			$("#canvasDiv").on("mousemove", dragSelBox);
			$("#canvasDiv").on("mouseup", selectResidue);
		} else if (onebuttonmode == "selectL" || (event.which == 3 && event.altKey == true )) {
			$("#canvasDiv").off("mousemove", dragHandle);
			$("#canvasDiv").off("mousemove", mouseMoveFunction);
		} else if (onebuttonmode == "color" || event.which == 2 || (event.which == 1 && event.ctrlKey == true)) {
			$("#canvasDiv").off("mousemove", dragHandle);
			//$("#canvasDiv").unbind("mousemove", mouseMoveFunction);
			colorResidue(event);
		} else {
			rvViews[0].lastX = event.clientX;
			rvViews[0].lastY = event.clientY;
			$("#canvasDiv").on("mousemove", dragHandle);
		}
	} else if (event.handleObj.origType == "mousedown" && BaseViewMode) {
		$("#canvasDiv").off("mousemove", dragHandle);
		BaseViewCenter(event);
	}
	if (event.handleObj.origType == "mouseup") {
		$("#canvasDiv").off("mousemove", dragHandle);
		$("#canvasDiv").off("mousemove", dragSelBox);
		$("#canvasDiv").on("mousemove", mouseMoveFunction);
		rvDataSets[0].HighlightLayer.clearCanvas();
	}
}

function mouseMoveFunction(event){
	rvDataSets[0].HighlightLayer.clearCanvas();
	$("#ResidueTip").tooltip("close");
	$("#InteractionTip").tooltip("close");
	switch (onebuttonmode){
		case "selectL":
			return;
			break;
		case "select":
			return;
			break;
		case "move":
			if (event.altKey == true){
				var seleLine = getSelectedLine(event);
				if(seleLine >=0 ){
					var j = rvDataSets[0].BasePairs[seleLine].resIndex1;
					var k = rvDataSets[0].BasePairs[seleLine].resIndex2;
					rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
					rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
					rvDataSets[0].HighlightLayer.CanvasContext.moveTo(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y);
					rvDataSets[0].HighlightLayer.CanvasContext.lineTo(rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
					rvDataSets[0].HighlightLayer.CanvasContext.closePath();
					rvDataSets[0].HighlightLayer.CanvasContext.stroke();
					if($('input[name="rt"][value=on]').is(':checked')){
						createInfoWindow(seleLine,"lines");
						$("#InteractionTip").css("bottom",$(window).height() - event.clientY);
						$("#InteractionTip").css("left",event.clientX);
						$("#InteractionTip").tooltip("open");
					}
				}	
			} else if (event.ctrlKey == true) {
				var sel = getSelected(event);
				if (sel != -1) {
					var targetLayer=rvDataSets[0].getSelectedLayer();
					switch (targetLayer.Type){
						case "residues" : 
							rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#000000";
							rvDataSets[0].HighlightLayer.CanvasContext.font = "3pt Arial";
							rvDataSets[0].HighlightLayer.CanvasContext.textBaseline = "middle";
							rvDataSets[0].HighlightLayer.CanvasContext.textAlign = "center";
							rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = $("#MainColor").val();
							rvDataSets[0].HighlightLayer.CanvasContext.fillText(rvDataSets[0].Residues[sel].resName, rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y);
							break;
						case "circles" :
							rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
							rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, (targetLayer.ScaleFactor * 1.7), 0, 2 * Math.PI, false);
							rvDataSets[0].HighlightLayer.CanvasContext.closePath();
							rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = $("#MainColor").val();
							rvDataSets[0].HighlightLayer.CanvasContext.stroke();
							if (targetLayer.Filled) {
								rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = $("#MainColor").val();
								rvDataSets[0].HighlightLayer.CanvasContext.fill();
							}
							break;
						default :
					}
				}
			} else {
				var sel = getSelected(event);
				if (sel >=0){
					rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
					rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, 2, 0, 2 * Math.PI, false);
					rvDataSets[0].HighlightLayer.CanvasContext.closePath();
					rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
					rvDataSets[0].HighlightLayer.CanvasContext.stroke();
					if($('input[name="rt"][value=on]').is(':checked')){
						createInfoWindow(sel,"residue");
						$("#ResidueTip").css("bottom",$(window).height() - event.clientY);
						$("#ResidueTip").css("left",event.clientX);
						$("#ResidueTip").tooltip("open");
					}
				}
			}
			break;
		case "color":
			var sel = getSelected(event);
			if (sel != -1) {
				var targetLayer=rvDataSets[0].getSelectedLayer();
				switch (targetLayer.Type){
					case "residues" : 
						rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#000000";
						rvDataSets[0].HighlightLayer.CanvasContext.font = "3pt Arial";
						rvDataSets[0].HighlightLayer.CanvasContext.textBaseline = "middle";
						rvDataSets[0].HighlightLayer.CanvasContext.textAlign = "center";
						rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = $("#MainColor").val();
						rvDataSets[0].HighlightLayer.CanvasContext.fillText(rvDataSets[0].Residues[sel].resName, rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y);
						break;
					case "circles" :
						rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
						rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, (targetLayer.ScaleFactor * 1.7), 0, 2 * Math.PI, false);
						rvDataSets[0].HighlightLayer.CanvasContext.closePath();
						rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = $("#MainColor").val();
						rvDataSets[0].HighlightLayer.CanvasContext.stroke();
						if (targetLayer.Filled) {
							rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = $("#MainColor").val();
							rvDataSets[0].HighlightLayer.CanvasContext.fill();
						}
						break;
					default :
				}
			}
			
			
			break;
		default: 
	}
}

function dragSelBox(event){
	rvDataSets[0].HighlightLayer.clearCanvas();
	rvViews[0].drag(event);
}

function mouseWheelFunction(event,delta){
	rvViews[0].zoom(event, delta);
	
	var sel = getSelected(event);
	rvDataSets[0].HighlightLayer.clearCanvas();
	
	if (sel == -1) {
		//document.getElementById("currentDiv").innerHTML = "<br/>";
	} else {
		//document.getElementById("currentDiv").innerHTML = rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[sel].ChainID)] + ":" + rvDataSets[0].Residues[sel].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
		
		rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
		rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, 2, 0, 2 * Math.PI, false);
		rvDataSets[0].HighlightLayer.CanvasContext.closePath();
		rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
		rvDataSets[0].HighlightLayer.CanvasContext.stroke();
		
	}
	if (drag) {
		rvViews[0].drag(event);
	}
	return false;


}

///////For popup window////
function createInfoWindow(Index,InfoMode){
	if (InfoMode === "residue"){
		addPopUpWindowResidue(Index);
		$("#ResidueTip").tooltip("option","content",$("#residuetip").html());
	} else {
		addPopUpWindowLine(Index);
		$("#InteractionTip").tooltip("option","content",$("#interactiontip").html());
	}
}
///////////////////////////////////////////////////////////////////////////////


// Misc Functions
/*function secretBox(event) {
	if (event == "nasa") {
		alert("Hey, don't click me there!");
		clickedNASA = clickedNASA + 1;
	}
	
	if (event == "riboevo") {
		if (clickedNASA > 0) {
			alert("Hey, you clicked on NASA. Don't you love me too?");
		}
	}
	
}*/
function BaseViewCenter(event){
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	var sel = getSelected(event);
	if (sel != -1) {
		var res = rvDataSets[0].Residues[sel];
		var script = "center " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and " + res.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') +":" + res.ChainID;
		Jmol.script(myJmol, script);
	}
}
function modeSelect(mode) {
	onebuttonmode = mode;
	/*
	switch (mode){
		case "selectL":
			$("#canvasDiv").unbind("mousemove", mouseMoveFunction);
			break;
		case "select":
			$("#canvasDiv").unbind("mousemove", mouseMoveFunction);
			break;
		case "move":
			$("#canvasDiv").bind("mousemove", mouseMoveFunction);
			break;
		case "color":
			$("#canvasDiv").unbind("mousemove", mouseMoveFunction);
			$("#canvasDiv").bind("mousemove", mouseMoveFunction);
			break;
		default: 
			//seleLineMode = false;
	}*/
}
function ProcessBubble(ui,targetLayer){
	switch ($(ui).parent().attr("id")) {
		case "AlnBubbles" :
			colorMapping(targetLayer,"42",[$(ui).attr("name")]);
			drawNavLine();
			break;
		case "StructDataBubbles" :
			updateStructData(ui,targetLayer);
			break;
		case "ProteinBubbles" : 
			var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
					return this.value;
				}).get();
			var array_of_checked_titles = $("#ProtList").multiselect("getChecked").map(function () {
				return this.title;
			}).get();
			colorMappingLoop(targetLayer,array_of_checked_values,array_of_checked_titles);
			break;
		case "CustomDataBubbles" :
			customDataProcess(ui,targetLayer)
			break;
		default :
			alert("other");
	}
	
}
function updateStructData(ui,targetLayer) {
	var newargs = $(ui).attr("name").split(",");
	for (var i = 0; i < newargs.length; i++) {
		if (newargs[i].indexOf("'") > -1) {
			newargs[i] = newargs[i].match(/[^\\']+/);
		} else {
			newargs[i] = window[newargs[i]];
		}
	}
	newargs.unshift('42');
	newargs.unshift(targetLayer);
	colorMapping.apply(this, newargs);
	drawNavLine();
}
function openRvState() {
	var PrivacyStatus = get_cookie("privacy_status_data");
	var PrivacyString = "This feature does not currently upload any data to our server. We don't have a privacy policy at this time"
		 + " because one isn't needed. We can not see these data you are about to graph. Click \"I agree\" to acknowledge acceptance of our policy.";
	 
	 var FileReaderFile = $("#files2")[0].files; // FileList object
	 
	 AgreeFunction = function () {
		for (var i = 0; i < FileReaderFile.length; i++) {
			reader = new FileReader();
			switch (FileReaderFile[i].name.split('.').pop().toLowerCase()){
				case "zip":
					//alert("zip");
					reader.readAsBinaryString(FileReaderFile[i]);
					reader.onload = function (){
						//var loader = new ZipLoader(reader.result);
						var loader = new ZipLoader(reader.result);
						//var data = loader.load('localfile.zip://Ribovision_State.rvs.txt');
						alert("Unfinished zip support. Please unzip your file.");
					}
					break;	
				default:
					reader.readAsText(FileReaderFile[i]);
					reader.onload = function () {
						var rvSaveState = JSON.parse(reader.result);
						rvDataSets[0]=rvDataSets[0].fromJSON(rvSaveState["RvDS"]);
						// Re stringify a few things for compatibility / symmetry with local storage
						rvSaveState["rvLayers"] = JSON.stringify(rvDataSets[0].Layers);
						rvSaveState["rvSelections"] = JSON.stringify(rvDataSets[0].Selections);
						rvSaveState["rvLastSpecies"] = rvDataSets[0].Name;
						if($('input[name="jp"][value=on]').is(':checked')){
							Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
							var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
							Jmol.script(myJmol, jscript);
						}				
						processRvState(rvSaveState);
					}
					break;
			}
			
		}
		/*welcomeScreen();
		rvDataSets[0].drawResidues("residues");
		rvDataSets[0].drawSelection("selected");
		rvDataSets[0].refreshResiduesExpanded("circles");
		rvDataSets[0].drawLabels("labels");
		rvDataSets[0].drawBasePairs("lines");*/
	 };
	 
	 if (PrivacyStatus != "Agreed") {
		$("#Privacy-confirm").text(PrivacyString);
		CurrPrivacyCookie = "privacy_status_data";
		$("#Privacy-confirm").dialog('open');
	} else {
		AgreeFunction();
	}
}

function handleFileSelect(event) {
	var PrivacyStatus = get_cookie("privacy_status_data");
	var PrivacyString = "This feature does not currently upload any data to our server. We don't have a privacy policy at this time"
		 + " because one isn't needed. We can not see these data you are about to graph. Click \"I agree\" to acknowledge acceptance of our policy.";
	var NewData;
	var command;
	var ColorList=[];
	var ColorListU;
	var DataList=[];
	var DataListU;
	var ColorGrad=[];
	
	FileReaderFile = event.target.files; // FileList object
	$("#CustomDataBubbles").find(".dataBubble").remove();
	AgreeFunction = function (event) {
		for (var i = 0; i < FileReaderFile.length; i++) {
			reader = new FileReader();
			reader.readAsText(FileReaderFile[i]);
			$("#CustomDataBubbles").append($('<h3 class="dataBubble ui-helper-reset ui-corner-all ui-state-default ui-corner-bottom" style="text-align:center;padding:0.2em">')
				.text("User Data").attr('name',"CustomData").attr('title',"Custom"));
			$("#CustomDataBubbles").sortable({
				update : function (event, ui) {
				},
				items : ".dataBubble"
			});
			reader.onload = function () {
				//Process File
				rvDataSets[0].addCustomData($.csv.toObjects(reader.result));
				var customkeys = Object.keys(rvDataSets[0].CustomData[0]);
				if ($.inArray("DataDescription", customkeys) >= 0) {
					$("#FileDiv").find(".DataDescription").text(rvDataSets[0].CustomData[0]["DataDescription"]);
					$("#CustomDataBubbles").find(".dataBubble").attr("title",rvDataSets[0].CustomData[0]["DataDescription"]);
				} else {
					$("#FileDiv").find(".DataDescription").text("Data Description is missing.");
				}
				$("#CustomDataBubbles").find(".dataBubble").attr("FileName",FileReaderFile[0].name);
			
			};
		}
	};
	
	if (PrivacyStatus != "Agreed") {
		$("#Privacy-confirm").text(PrivacyString);
		CurrPrivacyCookie = "privacy_status_data";
		$("#Privacy-confirm").dialog('open');
	} else {
		AgreeFunction(event);
	}
	
}

function customDataProcess(ui,targetLayer){
	var NewData;
	targetLayer.DataLabel = $(ui[0]).attr("filename");
	$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text("User File:").append($("<br>")).append(targetLayer.DataLabel);
	targetLayer.clearData();
	
	var customkeys = Object.keys(rvDataSets[0].CustomData[0]);
	NewData = CustomDataExpand(targetLayer);
	targetLayer.Data = NewData.IncludeData;
	var targetSelection = rvDataSets[0].Selections[0];
	SelectionMenu(targetSelection);
	RefreshSelectionMenu();
	
	if (targetLayer.Type === "selected"){

	} else {
		if ($.inArray("ColorCol", customkeys) >= 0) {
			rvDataSets[0].drawResidues("residues");
			rvDataSets[0].refreshResiduesExpanded(targetLayer.LayerName);
			update3Dcolors();
		} else if ($.inArray("DataCol", customkeys) >= 0) {
			var colors = RainBowColors;
			colorProcess(NewData,undefined,targetLayer,colors);
		} else {
			alert("No recognized colomns found. Please check input.");
		}
	}

	updateSelectionDiv(targetSelection.Name);
	drawNavLine();
}
function resetFileInput($element) {
	var clone = $element.clone(false, false);
	$element.replaceWith(clone);
	alert(42);
}

function CustomDataExpand(targetLayer){
	rvDataSets[0].addSelection();
	var SeleLen = 0;
	var NewData = [];
	$.each(rvDataSets[0].Residues, function (index,value){
		NewData[index]=undefined;
	});

	var ExtraData = [];
	var customkeys = Object.keys(rvDataSets[0].CustomData[0]);
	for (var ii = 0; ii < rvDataSets[0].CustomData.length; ii++) {
		var command = rvDataSets[0].CustomData[ii][customkeys[0]].split(";");
		var targetSelection = rvDataSets[0].Selections[0];
		expandSelection(command, targetSelection.Name);
		var l = targetSelection.Residues.length;
		if (l == 0){
			if ($.inArray("DataCol", customkeys) >= 0) {
				if (isNaN(parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]))){
					ExtraData.push(rvDataSets[0].CustomData[ii]["DataCol"]);
				} else {
					ExtraData.push(parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]));
				}
			}
		} else {
			for (var iii = SeleLen; iii < l; iii++) {
				if (targetSelection.Residues[iii].resNum.indexOf(":") >= 0) {
					var ressplit = targetSelection.Residues[iii].resNum.split(":");
					var ResName = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(ressplit[0])] + "_" + ressplit[1];				
				} else {
					var chainID =  targetSelection.Residues[iii].ChainID;
					var ResName = chainID + "_" + targetSelection.Residues[iii].resNum;
				}
				var k = rvDataSets[0].ResidueList.indexOf(ResName);
				
				if ($.inArray("DataCol", customkeys) >= 0) {
					if (isNaN(parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]))){
						NewData[k] = rvDataSets[0].CustomData[ii]["DataCol"];
					} else {
						NewData[k] = parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]);
					}
				}
				if ($.inArray("ColorCol", customkeys) >= 0) {
					targetLayer.dataLayerColors[k] = rvDataSets[0].CustomData[ii]["ColorCol"];
				}
				SeleLen = l;
			}
		}
	}
	return {IncludeData : NewData,ExtraData : ExtraData}
}
///////////////////////////////////////////////////////////////////////////////


////////////////////////////// Cookie Functions ///////////////////////////////
function set_cookie(cookie_name, cookie_value, lifespan_in_days, valid_domain) {
	// http://www.thesitewizard.com/javascripts/cookies.shtml
	var domain_string = valid_domain ? ("; domain=" + valid_domain) : '';
	document.cookie = cookie_name +
		"=" + encodeURIComponent(cookie_value) +
		"; max-age=" + 60 * 60 *
		24 * lifespan_in_days +
		"; path=/" + domain_string;
}

function get_cookie(cookie_name) {
	// http://www.thesitewizard.com/javascripts/cookies.shtml
	var cookie_string = document.cookie;
	if (cookie_string.length != 0) {
		var pattern = cookie_name + "=[^;]*";
		var patt = new RegExp(pattern, "g");
		var cookie_value = cookie_string.match(patt);
		if (cookie_value == null) {
			return "";
		} else {
			var p = cookie_value[0].split("=");
			return decodeURIComponent(p[1]);
		}
	}
}

function checkSavePrivacyStatus() {
	var PrivacyStatus = get_cookie("privacy_status_text");
	var PrivacyString = "This feature requires uploading data to our server. Our privacy policy at this time is to not look at these files without permission."
		 + " We will set up autodelete for these files soon. Click \"I agree\" to acknowledge acceptance of our policy.";
	
	if (PrivacyStatus != "Agreed") {
		$("#Privacy-confirm").text(PrivacyString);
		CurrPrivacyCookie = "privacy_status_text";
		$("#Privacy-confirm").dialog('open');
	} else {
		AgreeFunction();
	}
}
///////////////////////////////////////////////////////////////////////////////


//////////////////////////////// Save Functions ///////////////////////////////
function saveNavLine() {
	AgreeFunction = function () {
		var tmp  = document.getElementById("NavLineDiv");
		var svg = tmp.getElementsByTagName("svg")[0];
		// Extract the data as SVG text string
		var svg_xml = (new XMLSerializer).serializeToString(svg);
		
		//alert(jmlImgB64);
		//var CS = canvasToSVG();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveNavLine.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", svg_xml);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function saveJmolImg() {
	AgreeFunction = function () {
		if($('input[name="jp"][value=off]').is(':checked')){
			return;
		}
		var jmlImgB64 = Jmol.getPropertyAsString(myJmol,'image');
		//alert(jmlImgB64);
		//var CS = canvasToSVG();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveJmolImg.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", jmlImgB64);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function retrieveRvState(filename) {
	SaveStateFileName=filename;
	$.post('retrieveRvState.php', {
		datasetname : SaveStateFileName,
		username : UserName
	}, function (RvSaveState) {
		//alert(RvSaveState);
		var rvSaveState = JSON.parse(RvSaveState);
		rvDataSets[0]=rvDataSets[0].fromJSON(rvSaveState["RvDS"]);
		// Re stringify a few things for compatibility / symmetry with local storage
		rvSaveState["rvLayers"] = JSON.stringify(rvDataSets[0].Layers);
		rvSaveState["rvSelections"] = JSON.stringify(rvDataSets[0].Selections);
		rvSaveState["rvLastSpecies"] = rvDataSets[0].Name;
		if($('input[name="jp"][value=on]').is(':checked')){
			Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
			var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
			Jmol.script(myJmol, jscript);
		}
		processRvState(rvSaveState);
	});
}

function storeRvState(filename){
	SaveStateFileName=filename;
	AgreeFunction = function () {
		var RvSaveState = {};
		RvSaveState["RvDS"] = JSON.stringify(rvDataSets[0]);
		RvSaveState["rvView"] = JSON.stringify(rvViews[0]);
		if($('input[name="jp"][value=on]').is(':checked')){
			RvSaveState["rvJmolOrientation"] = Jmol.evaluate(myJmol,"script('show orientation')");
		}
	
		if($("input[name='PanelSizesCheck']").attr("checked")){
			var po = {
				PanelDivide : PanelDivide,
				TopDivide : TopDivide
			}
			RvSaveState["rvPanelSizes"] = JSON.stringify(po);
		}
		if($("input[name='MouseModeCheck']").attr("checked")){
			RvSaveState["rvMouseMode"] = onebuttonmode;	
		}
		
		$form = $("<form></form>");
		$('body').append($form);
		data = {
			content: JSON.stringify(RvSaveState,null,'\t'),
			datasetname : SaveStateFileName,
			username : UserName
		};
		$.post("storeRvState.php", data, function(d) {});
	}
	checkSavePrivacyStatus();
}
function saveRvState(filename){
	SaveStateFileName=filename;
	AgreeFunction = function () {
		//var CS = canvasToSVG();
		
		var RvSaveState = {};
		RvSaveState["RvDS"] = JSON.stringify(rvDataSets[0]);
		RvSaveState["rvView"] = JSON.stringify(rvViews[0]);
		if($('input[name="jp"][value=on]').is(':checked')){
			RvSaveState["rvJmolOrientation"] = Jmol.evaluate(myJmol,"script('show orientation')");
		}
		
		if($("input[name='PanelSizesCheck']").attr("checked")){
			var po = {
				PanelDivide : PanelDivide,
				TopDivide : TopDivide
			}
			RvSaveState["rvPanelSizes"] = JSON.stringify(po);
		}
		if($("input[name='MouseModeCheck']").attr("checked")){
			RvSaveState["rvMouseMode"] = onebuttonmode;	
		}
		
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveRvState.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", JSON.stringify(RvSaveState,null,'\t'));
		var hiddenField2 = document.createElement("input");
		hiddenField2.setAttribute("type", "hidden");
		hiddenField2.setAttribute("name", "datasetname");
		hiddenField2.setAttribute("value", SaveStateFileName);
		form.appendChild(hiddenField);
		form.appendChild(hiddenField2);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function saveJPG() {
	AgreeFunction = function () {
		var CS = canvasToSVG();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveJPG.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", CS.SVG);
		var hiddenField2 = document.createElement("input");
		hiddenField2.setAttribute("type", "hidden");
		hiddenField2.setAttribute("name", "orientation");
		hiddenField2.setAttribute("value", CS.Orientation);
		form.appendChild(hiddenField);
		form.appendChild(hiddenField2);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function savePNG() {
	AgreeFunction = function () {
		var CS = canvasToSVG();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "savePNG.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", CS.SVG);
		var hiddenField2 = document.createElement("input");
		hiddenField2.setAttribute("type", "hidden");
		hiddenField2.setAttribute("name", "orientation");
		hiddenField2.setAttribute("value", CS.Orientation);
		form.appendChild(hiddenField);
		form.appendChild(hiddenField2);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function saveSVG() {
	AgreeFunction = function () {
		var CS = canvasToSVG();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveSVG.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", CS.SVG);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function savePDF() {
	AgreeFunction = function () {
		var CS = canvasToSVG();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "savePDF.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", CS.SVG);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function savePML() {
	AgreeFunction = function () {
		var script = "";
		var PDB_Obj_Names = [];
		
		//Default option
		script += "bg_color white\nunset ignore_case\n";
		//PDB Files
		var PDB_files = [rvDataSets[0].SpeciesEntry.PDB_File_rRNA, rvDataSets[0].SpeciesEntry.PDB_File_rProtein];
		if (PDB_files[1] === PDB_files[0]) {
			PDB_Obj_Names[0] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Subunit + "_Full";
			PDB_Obj_Names[1] = PDB_Obj_Names[0];
			script += "load " + PDB_files[0] + ", " + PDB_Obj_Names[0] + "\n";
			script += "as cartoon, " + PDB_Obj_Names[0] + "\n";
			script += "disable " + PDB_Obj_Names[0] + "\n";
		} else {
			PDB_Obj_Names[0] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Subunit + "_rRNA";
			PDB_Obj_Names[1] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Subunit + "_rProtein"
			script += "load " + PDB_files[0] + ", " + PDB_Obj_Names[0] + "\n";
			script += "load " + PDB_files[1] + ", " + PDB_Obj_Names[1] + "\n";
			script += "as cartoon, " + PDB_Obj_Names[0] + "\n";
			script += "as cartoon, " + PDB_Obj_Names[1] + "\n";
			script += "disable " + PDB_Obj_Names[0] + "\n";
			script += "disable " + PDB_Obj_Names[1] + "\n";
		}
		script += "\n";
		// Layers to PyMOL
		var dsLayers = rvDataSets[0].getLayerByType(["residues","circles","selected"]);
		$.each(dsLayers, function (key, value) {
			script += layerToPML(PDB_Obj_Names,value);
		});
		
		//Proteins to PyMOL
		script += proteinsToPML(PDB_Obj_Names);
		
		//Selection to PyMOL
		$.each(rvDataSets[0].Selections, function (key, value) {
			script += selectionToPML(PDB_Obj_Names,value);
		});
		script += "\ndisable RV_Sele_*\n";
		
		//Default zoom
		script += "\nzoom all\n";
		
		//Form Submit;
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "savePML.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", script);
		form.appendChild(hiddenField);
		
		PDB_filesU = $.grep(PDB_files, function (v, k) {
			return $.inArray(v, PDB_files) === k;
		});
		var hiddenField2 = document.createElement("input");
		hiddenField2.setAttribute("type", "hidden");
		hiddenField2.setAttribute("name", "pdbfiles");
		hiddenField2.setAttribute("value", PDB_filesU);
		form.appendChild(hiddenField2);
		
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function layerToPML(PDB_Obj_Names,targetLayer) {
	var PyMOL_obj = [];
	var script = "";
	var r0,r1,curr_chain,curr_color,n,m;
	if (rvDataSets[0].Residues[0] == undefined){return};
	
	for (var j = 0; j < rvDataSets[0].SpeciesEntry.Molecule_Names.length; j++) {
			PyMOL_obj[j] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Molecule_Names[j] + "_" + targetLayer.LayerName;
			script += "create " + PyMOL_obj[j] + ", " + PDB_Obj_Names[0] + " and chain " + rvDataSets[0].SpeciesEntry.PDB_chains[j] + "\n";
			if (targetLayer.Linked){
				script += "enable " + PyMOL_obj[j] + "\n";
			} else {
				script += "disable " + PyMOL_obj[j] + "\n";
			}
		}
		script += "\n";
		
		r0 = rvDataSets[0].Residues[0].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
		curr_chain = rvDataSets[0].Residues[0].ChainID;
		curr_color = colorNameToHex(targetLayer.dataLayerColors[0]);
		if (!curr_color || curr_color === '#000000') {
			curr_color = '#858585';
		}
		for (var i = 1; i < rvDataSets[0].Residues.length; i++) {
			var residue = rvDataSets[0].Residues[i];
			var residueLast = rvDataSets[0].Residues[i - 1];
			var residueLastColor = targetLayer.dataLayerColors[i - 1];
			if (!residueLastColor){
				residueLastColor = '#858585';
			}
			if (residue.ChainID != "") {
				if (curr_chain == "") {
					curr_chain = residue.ChainID;
					curr_color = colorNameToHex(targetLayer.dataLayerColors[i]);
					if (!curr_color || curr_color === '#000000') {
						curr_color = '#858585';
					}
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
				} else if (residue.ChainID == null) {
					curr_chain = residue.ChainID;
					curr_color = colorNameToHex(targetLayer.dataLayerColors[i]);
					if (!curr_color || curr_color === '#000000') {
						curr_color = '#858585';
					}
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
				} else {
					if (!targetLayer.dataLayerColors[i]){
						compare_color = '#858585';
					} else {
						compare_color = colorNameToHex(targetLayer.dataLayerColors[i]);
					}
					if (((compare_color != colorNameToHex(residueLastColor)) || (curr_chain != residue.ChainID)) || (i == (rvDataSets[0].Residues.length - 1))) {
						r1 = residueLast.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
						if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
							script += "color 0x" + curr_color + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + r1 + "\n";
						} else {
							script += "color " + curr_color.replace("#", "0x") + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + r1 + "\n";
						}
						r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
						if (residue.ChainID != "") {
							curr_chain = residue.ChainID;
						}
						curr_color = colorNameToHex(targetLayer.dataLayerColors[i]);
						if (!curr_color || curr_color === '#000000') {
							curr_color = '#858585';
						}
					}
				}
			}
		}
		if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
			script += "color 0x" + curr_color + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + "\n";
		} else {
			script += "color " + curr_color.replace("#", "0x") + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + "\n";
		}
		script += "\n";
	
	return script;
}

function proteinsToPML(PDB_Obj_Names){
	var script = "";
	var curr_color;
	// Protein Section
	for (var jj = 0; jj < rvDataSets[0].SpeciesEntry.SubunitProtChains[0].length; jj++) {
		script += "create " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][jj] + ", " + PDB_Obj_Names[1] + " and chain " + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][jj] + "\n";
	}
	script += "\ndisable *rp*\n";
	script += "color wheat, *rp*\n";
	
	var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
			return this.value;
		}).get();
	
	for (jjj = 0; jjj < array_of_checked_values.length; jjj++) {
		var h = rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(array_of_checked_values[jjj]);
		var ProtName = $.grep($("#ProtList").multiselect("getChecked"), function(e) {
			return e.value == array_of_checked_values[jjj];
		});
		if (h >= 0) {
			curr_color = rgb2hex($(ProtName).next().css("color"));
			if(curr_color.indexOf("#") == -1) {
				curr_color = "0x" + curr_color;
			} else {
				curr_color = curr_color.replace("#", "0x");
			}
			script += "color " + curr_color + ", " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][h].replace(/\(/g,"_").replace(/\)/g,"") + "\n";
			script += "enable " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][h].replace(/\(/g,"_").replace(/\)/g,"") + "\n";
		}
	}
	return script;
}

function selectionToPML(PDB_Obj_Names,targetSelection){
	var script = "";
	
	if (targetSelection.Residues.length > 0) {
		var SeleScript = "create RV_Sele_" + targetSelection.Name + ", " + PDB_Obj_Names[0] + " and ((resi " + targetSelection.Residues[0].resNum.replace(/[^:]*:/g, "") + " and chain " + targetSelection.Residues[0].ChainID + ")";
		// Selected Section
		for (var ii = 1; ii < targetSelection.Residues.length; ii++) {
			if (targetSelection.Residues[ii].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") != null) {
				r1 = targetSelection.Residues[ii].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
				SeleScript += " or (resi " + r1 + " and chain " + targetSelection.Residues[ii].ChainID + ")";
			}
		}
		SeleScript += ")\n";
		script += "\n" + SeleScript;
		script += "color " + targetSelection.Color.replace("#", "0x") + ", " + "RV_Sele_" + targetSelection.Name + "\n";
	}
	return script;
}

function canvasToSVG() {
	var SupportesLayerTypes = ["lines", "labels", "residues", "circles", "selected"];
	var ChosenSide;
	var Orientation;
	var AllMode = $('input[name="savelayers"][value=all]').attr("checked");
	
	if (rvDataSets[0].SpeciesEntry.Orientation.indexOf("portrait") >= 0) {
		var mapsize = "612 792";
		var mapsize2 = 'width="612px" height="792px" ';
		Orientation = "portrait";
	} else {
		var mapsize = "792 612";
		var mapsize2 = 'width="792px" height="612px" ';
		Orientation = "landscape";
	}
	output = "<?xml version='1.0' encoding='UTF-8'?>\n" +
		'<svg version="1.1" baseProfile="basic" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" ' +
		mapsize2 + 'viewBox="0 0 ' + mapsize + '" xml:space="preserve">\n';
	if(rvDataSets[0].Name === 'SC_LSU_3D'){;
		var stringData = $.ajax({
						url: "images/SC_28S_Struct_Dash_Lines_g.svg",
						async: false
					 }).responseText;
		output = output + stringData;
	}
	$.each(rvDataSets[0].Layers, function (index, value) {
		if (AllMode || value.Visible){
			switch (value.Type) {
				case "lines":
					output = output + '<g id="' + value.LayerName + '">\n';
					if (value.ColorLayer === "gray_lines"){
						for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
							var BasePair = rvDataSets[0].BasePairs[j];
							output = output + '<line fill="none" stroke="' + '#231F20' + '" stroke-opacity="' + rvDataSets[0].BasePairs[j].color.match(/,[\.\d]+\)/g)[0].slice(1,-1) + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
						}
					} else {
						if (value.ColorLayer.ColorGradientMode == "Matched") {
							//var grd_order = [0, 1];
							ChosenSide="resIndex1";
						} else if (value.ColorLayer.ColorGradientMode == "Opposite") {
							//var grd_order = [1, 0];
							ChosenSide="resIndex2";
						} else {
							alert("how did we get here? 34");
						}
						switch  (value.ColorLayer.Type){
							case "residues" : 
								//var grd = value.ColorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
								/*
								if (rvDataSets[0].Residues[j].color && rvDataSets[0].Residues[k].color){
									color1 = colorNameToHex(rvDataSets[0].Residues[j].color);
									color2 = colorNameToHex(rvDataSets[0].Residues[k].color);
									
									grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + ",.5)");
									grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + ",.5)");
								}
								value.ColorLayer.addLinearGradient(grd);
								rvDataSets[0].BasePairs[i]["color"] = grd;
								*/
								for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
									var BasePair = rvDataSets[0].BasePairs[j];
									output = output + '<line fill="none" stroke="' + rvDataSets[0].Residues[BasePair[ChosenSide]].color + '" stroke-opacity="' + rvDataSets[0].BasePairs[j].color.match(/,[\.\d]+\)/g)[0].slice(1,-1) + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
								}
								break;
							case "circles" : 
								for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
									var BasePair = rvDataSets[0].BasePairs[j];
									output = output + '<line fill="none" stroke="' + value.ColorLayer.dataLayerColors[BasePair[ChosenSide]] + '" stroke-opacity="' + rvDataSets[0].BasePairs[j].color.match(/,[\.\d]+\)/g)[0].slice(1,-1) + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
								}
								break;
							case "selected" : 
								for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
									var BasePair = rvDataSets[0].BasePairs[j];
									if (value.ColorLayer.Data[BasePair.resIndex1] || value.ColorLayer.Data[BasePair.resIndex2]) {
										output = output + '<line fill="none" stroke="' + '#231F20' + '" stroke-opacity="' + '0.5' + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
									}		
								}
								break;
							default :
								alert("this shouldn't be happening right now 54.");
							
						}
					}
					output = output + '</g>\n';
					break;
				case "labels":
					output = output + '<g id="' + value.LayerName + '_Lines">\n';
					for (var iii = 0; iii < rvDataSets[0].rvLineLabels.length; iii++) {
						var LabelLine = rvDataSets[0].rvLineLabels[iii];
						output = output + '<line fill="none" stroke="#211E1F" stroke-width="0.25" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(LabelLine.X1).toFixed(3) + '" y1="' + parseFloat(LabelLine.Y1).toFixed(3) + '" x2="' + parseFloat(LabelLine.X2).toFixed(3) + '" y2="' + parseFloat(LabelLine.Y2).toFixed(3) + '"/>\n';
					}
					output = output + '</g>\n';
					
					output = output + '<g id="' + value.LayerName + '_Text">\n';
					for (var ii = 0; ii < rvDataSets[0].rvTextLabels.length; ii++) {
						var LabelData = rvDataSets[0].rvTextLabels[ii];
						output = output + '<text transform="matrix(1 0 0 1 ' + parseFloat(LabelData.X).toFixed(3) + ' ' + parseFloat(LabelData.Y).toFixed(3) + ')" fill="' + LabelData.Fill + '" font-family="Myriad Pro" font-size="' + LabelData.FontSize + '">' + LabelData.LabelText + '</text>\n';
					}
					output = output + '</g>\n';
					break;
				case "residues":
					output = output + '<g id="' + value.LayerName + '">\n';
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						var residue = rvDataSets[0].Residues[i];
						output = output + '<text id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" transform="matrix(1 0 0 1 ' + (parseFloat(residue.X) - 1.262).toFixed(3) + ' ' + (parseFloat(residue.Y) + 1.145).toFixed(3) + ')" fill="' + residue.color + '" font-family="Myriad Pro" font-size="3.9">' + residue.resName + '</text>\n';
					}
					output = output + '</g>\n';
					break;
				case "circles":
					output = output + '<g id="' + value.LayerName + '">\n';
					var radius = 1.7 * value.ScaleFactor;
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						var residue = rvDataSets[0].Residues[i];
						if (residue && value.dataLayerColors[i]) {
							if (value.Filled) {
								output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" fill="' + value.dataLayerColors[i] + '" stroke="' + value.dataLayerColors[i] + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) + '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="' + radius + '"/>\n';
							} else {
								output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" fill="' + 'none' + '" stroke="' + value.dataLayerColors[i] + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) + '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="' + radius + '"/>\n';
							}
						}
					}
					output = output + '</g>\n';
					break;
				case "selected":
					output = output + '<g id="' + value.LayerName + '">\n';
					var radius = 1.7 * value.ScaleFactor;
					
					var SelectionList =[];
					$('.checkBoxDIV-S').find(".visibilityCheckImg[value=visible]").parent().parent().each(function (index){SelectionList.push($(this).attr("name"))});

					$.each(SelectionList, function (index,SelectionName) {
						var targetSelection = rvDataSets[0].getSelection(SelectionName);
						output = output + '<g id="' + targetSelection.Name + '">\n';
						$.each(targetSelection.Residues, function (index,residue){
							output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" fill="' + 'none' + '" stroke="' + targetSelection.Color + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) + '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="' + radius + '"/>\n';
						});
						output = output + '</g>\n';
					});
					output = output + '</g>\n';
					break;
					
				default:
					break;
			}
		}
	});
	
	output = output + watermark(true);
	output = output + '</svg>';
	return { 'SVG': output, "Orientation" : Orientation };
}
function computeSeqTable(){
	var WholeSet="";
	var OutputString="";
	var WholeSet= WholeSet + "WholeSet,WholeSet\n";
	var WholeSet= WholeSet + "resNum,resName\n";
	$.each(rvDataSets[0].Residues, function (index,residue) {
		WholeSet+= rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(residue.ChainID)] + ":" + residue.resNum.replace(/[^:]*:/g, "") + "," + residue.resName + "\n";
	});
	var OutputObject = $.csv.toArrays(WholeSet);
	$.each(rvDataSets[0].Selections, function (index, selection) {
		if (selection.Residues.length >0){
			OutputObject[0].push(selection.Name,selection.Name);
			OutputObject[1].push("resNum","resName");
			$.each(selection.Residues, function (index, residue) {
				OutputObject[2+index].push(rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(residue.ChainID)] + ":" + residue.resNum.replace(/[^:]*:/g, ""),residue.resName);
			});
		}
	});
	
	$.each(OutputObject, function (index, outputline){
		OutputString+=outputline.toString() + "\n";
	});
	
	
	return OutputString;
}
function saveSeqTable(){
	AgreeFunction = function () {
		var ST = computeSeqTable();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveSeqTable.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", ST);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function saveFasta(){
	AgreeFunction = function () {
		var FA = computeFasta();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveFasta.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", FA);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function computeFasta(){
	var WholeSet="";
	var OutputString="";
	OutputString+=">" + rvDataSets[0].Name + "\n";
	
	$.each(rvDataSets[0].Residues, function (index,residue) {
		OutputString+= residue.resName;
	});
	OutputString+="\n\n"
	
	$.each(rvDataSets[0].Selections, function (index, selection) {
		if (selection.Residues.length >0){
			OutputString+=">" + selection.Name + "\n";
			$.each(selection.Residues, function (index, residue) {
				OutputString+= residue.resName;
			});
			OutputString+="\n\n"
		}
	});
	return OutputString;
}
///////////////////////////////////////////////////////////////////////////////


//////////////////////////////// Jmol Functions ////////////////////////////////
function updateModel() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	var n;
	
	//Come back and support multiple selections?
	var targetSelection = rvDataSets[0].getSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
	if (targetSelection.Residues.length > 0){
		var script = "set hideNotSelected true;select (" + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and (";
		for (var i = 0; i < targetSelection.Residues.length; i++) {
			if (targetSelection.Residues[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") != null) {
				if (script != "set hideNotSelected true;select (" + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and (") {
					script += " or ";
				};
				n = targetSelection.Residues[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "").match(/[A-z]/g);
				if (n != null) {
					r1 = targetSelection.Residues[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "").replace(n, "^" + n);
				} else {
					r1 = targetSelection.Residues[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
				}
				script += r1 + ":" + targetSelection.Residues[i].ChainID;
			}
		}
		script += ")); center selected;";
		Jmol.script(myJmol, script);
	} else {
		refreshModel();
	}
}

function refreshModel() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	var script = "set hideNotSelected true;select (" + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and (";
	for (var ii = 0; ii < rvDataSets[0].SpeciesEntry.PDB_chains.length; ii++) {
		script += ":" + rvDataSets[0].SpeciesEntry.PDB_chains[ii];
		if (ii < (rvDataSets[0].SpeciesEntry.PDB_chains.length - 1)) {
			script += " or ";
		}
	}
	script += ")); center selected;";
	Jmol.script(myJmol, script);
}

function resetColorState() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	clearColor(false);
	Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
	var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
	
	Jmol.script(myJmol, jscript);
	//commandSelect();
	updateModel();
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////////////// Load Data Functions ///////////////////////////
function populateDomainHelixMenu() {
	$("#selectByDomainHelix").find('option').remove().end();
	
	// Do the Domains
	var DomainList_AN = new Array;
	var DomainList_RN = new Array;
	var DomainSelections = new Array;
	
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		DomainList_AN[i] = rvDataSets[0].Residues[i].Domain_AN;
		DomainList_RN[i] = rvDataSets[0].Residues[i].Domain_RN;
		if (!DomainSelections[DomainList_AN[i]]) {
			DomainSelections[DomainList_AN[i]] = new Array;
		}
		if (rvDataSets[0].Residues[i].resNum.indexOf(":") >= 0) {
			DomainSelections[DomainList_AN[i]].push(rvDataSets[0].Residues[i].resNum);
		} else {
			DomainSelections[DomainList_AN[i]].push(rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[i].ChainID)] + ":" + rvDataSets[0].Residues[i].resNum);
		}
	}
	
	var DomainList_ANU = $.grep(DomainList_AN, function (v, k) {
		return $.inArray(v, DomainList_AN) === k;
	});
	var DomainList_RNU = $.grep(DomainList_RN, function (v, k) {
			return $.inArray(v, DomainList_RN) === k;
		});
	
	$('#selectByDomainHelix').append('<optgroup label="Domains" id="domainsList" />');
	$.each(DomainList_ANU, function (i, val) {
		if (DomainList_RNU[i] && DomainList_RNU[i].indexOf("S") >= 0) {
			$('#domainsList').append(new Option(DomainList_RNU[i], DomainSelections[val]));
		} else {
			$('#domainsList').append(new Option("Domain " + DomainList_RNU[i], DomainSelections[val]));
		}
		//console.log(DomainSelections[val]);
	});
	
	// Do the Helices
	var HelixList = new Array;
	var HelixSelections = new Array;
	
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		HelixList[i] = rvDataSets[0].Residues[i].Helix_Num;
		if (!HelixSelections[HelixList[i]]) {
			HelixSelections[HelixList[i]] = new Array;
		}
		if (rvDataSets[0].Residues[i].resNum.indexOf(":") >= 0) {
			HelixSelections[HelixList[i]].push(rvDataSets[0].Residues[i].resNum);
		} else {
			HelixSelections[HelixList[i]].push(rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[i].ChainID)] + ":" + rvDataSets[0].Residues[i].resNum);
		}
	}
	
	var HelixListU = $.grep(HelixList, function (v, k) {
			return $.inArray(v, HelixList) === k;
		});
	
	$('#selectByDomainHelix').append('<optgroup label="Helices" id="helciesList" />');
	
	$.each(HelixListU, function (i, val) {
		$('#helciesList').append(new Option("Helix " + val, HelixSelections[val]));
	});
	
	// Refresh Menu
	$("#selectByDomainHelix").multiselect("refresh");
	
}


///////////////////////////////////////////////////////////////////////////////


////////////////////////////////// Canvas Functions ///////////////////////////
function watermark(usetime) {
	if (rvDataSets[0].SpeciesEntry.MapType && rvDataSets[0].SpeciesEntry.MapType != "None") {
		var h = (rvDataSets[0].SpeciesEntry.Orientation == "portrait") ? 762 : 612;
		var d = new Date();
		var df;
		
		var x = 10;
		var y = h - 20;
		var Message = "A " + rvDataSets[0].SpeciesEntry.MapType + " secondary structure, generated by RiboVision.";
		var df = d.toLocaleString().indexOf("G");
		var LabelLayers = rvDataSets[0].getLayerByType("labels");
		var targetLayer = LabelLayers[0];
		targetLayer.CanvasContext.textAlign = 'left';
		targetLayer.CanvasContext.font = "10pt Calibri";
		targetLayer.CanvasContext.fillStyle = "#FF5500";
		targetLayer.CanvasContext.fillText(Message, x, y);
		
		var output = '<g id="WaterMark">\n';
		output = output + '<text id="WaterMark" transform="matrix(1 0 0 1 ' + (parseFloat(x) - 1.262).toFixed(3) + ' ' + (parseFloat(y) + 1.145).toFixed(3) + ')" fill="#f6a828" font-family="Myriad Pro" font-size="10">' + Message + '</text>\n';
		if (usetime) {
			targetLayer.CanvasContext.fillText("Saved on " + d.toLocaleString().slice(0, df - 1), x + 75, y + 15);
			output = output + '<text id="Date" transform="matrix(1 0 0 1 ' + (parseFloat(x) - 1.262 + 75).toFixed(3) + ' ' + (parseFloat(y) + 15 + 1.145).toFixed(3) + ')" fill="#f6a828" font-family="Myriad Pro" font-size="8">' + "Saved on " + d.toLocaleString().slice(0, df - 1) + '</text>\n';
		}
		output = output + '</g>\n';
		return output;
	}
}

function canvas_arrow(fromx, fromy, tox, toy) {
	
	//rvDataSets[0].Layers[rvDataSets[0].LastLayer].CanvasContext = ResidueLayer.getContext("2d");
	
	var headlen = 10; // length of head in pixels
	var angle = Math.atan2(toy - fromy, tox - fromx);
	rvDataSets[0].Layers[0].CanvasContext.moveTo(fromx, fromy);
	rvDataSets[0].Layers[0].CanvasContext.lineTo(tox, toy);
	rvDataSets[0].Layers[0].CanvasContext.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
	rvDataSets[0].Layers[0].CanvasContext.moveTo(tox, toy);
	rvDataSets[0].Layers[0].CanvasContext.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function welcomeScreen() {
	var scale_factor = parseFloat($("#canvasDiv").css('width')) / 733;
	// New Welcome Screen
	var img = new Image();
	img.onload = function() {
		if (canvas2DSupported) {
			rvDataSets[0].Layers[0].clearCanvas();
			rvDataSets[0].Layers[0].CanvasContext.drawImage(img,  -1 * rvViews[0].x, -1 * rvViews[0].y,733 * scale_factor,550 * scale_factor);
		}
	}
	img.src = "images/RiboVisionLogo.png"; //

	
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////// Math //////////////////////////////////
function d2h(d) {
	return d.toString(16);
};
function h2d(h) {
	return parseInt(h, 16);
};
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
///////////////////////////////////////////////////////////////////////////////

function changeLineOpacity(opacity){
	document.getElementById('lineOpacity').innerHTML = "Line Opacity: " + opacity + "%";
}
	////////////////Nav Line ///////

function drawNavLine(){
		if($('input[name="nl"][value=off]').is(':checked')){
			return;
		}
		$('#NavLineDiv').empty(); //clean div before draw new graph
		var data = [];
		var selectedData=[];
		var selectedDataX=[];
		var selectedDataY=[];
		var maxdata = undefined; 
		var mindata = undefined; 
		
		var targetLayer=rvDataSets[0].getSelectedLayer();
		if (targetLayer===false){
			return;
		}
		var linename = targetLayer.DataLabel;
		var	w = 1.00 * $('#NavLineDiv').innerWidth();
		var h = 0.95 * $('#NavLineDiv').innerHeight();
		var	MarginXL = 60;
		var MarginXR = 120;
		var MarginYT = 40;
		var MarginYB = 40;
		
		var maxdata2 = d3.max($.map(targetLayer.Data, function(d) { return parseFloat(d); }));
		var mindata2 = d3.min($.map(targetLayer.Data, function(d) { return parseFloat(d); }));
		
		if (maxdata2 !== undefined){
			maxdata = maxdata2;
		} 
		if (mindata2 !== undefined){
			mindata = mindata2;
		} 
		if (targetLayer.Type == "selected"){
			maxdata=1;
			mindata=0;
		}
		if (targetLayer.DataLabel === "Protein Contacts"){
			maxdata=1;
			mindata=0;
		}
		var	xScale = d3.scale.linear().domain([0, rvDataSets[0].Residues.length]).range([0 + MarginXL, w - MarginXR]);
		var	yScale = d3.scale.linear().domain([mindata, maxdata]).range([h - MarginYB,0 + MarginYT ]);

		var NavLine = d3.select("#NavLineDiv")
			.append("svg:svg")
			.attr("width", w)
			.attr("height", h)

		var g = NavLine.append("svg:g")
			.attr("width", w)
			.attr("height", h);
			//.attr("transform", "translate(0, " + 200+")");
			
			
		var line = d3.svg.line()
			.defined(function(d) { 
				return (((d!==undefined) && d!=="") ? !isNaN(d) : false) 
			})			
			.x(function(d,i) { return xScale(i); })
			.y(function(d) { return yScale(d); });	
		
		var GraphData = [];
		if (targetLayer.Type === "selected"){
			$.each(targetLayer.Data, function (index,value){
				if (value === false){
					GraphData[index]=0;
				} else {
					GraphData[index]=1;
				}
			});
			linename = "Selected Residues";
		} else if ((targetLayer.DataLabel === "empty data") || (targetLayer.DataLabel === "None")){
			$.each(targetLayer.Data, function (index,value){
				GraphData[index]=0;
			});
		} else if (targetLayer.DataLabel === "Protein Contacts"){
			$.each(targetLayer.Data, function (index,value){
					if (value === " "){
						GraphData[index]=0;
					} else {
						GraphData[index]=1;
					}
				});
			linename = "Protein Contacts";
		} else {
			GraphData = targetLayer.Data;
		}
		g.append("svg:path").attr("d", line(GraphData)).style("stroke", targetLayer.Color);
		
		//Axes
		var xAxis = d3.svg.axis()
			  .scale(xScale)
			  .orient("bottom")
			  .ticks(20);  //Set rough # of ticks
			  
		NavLine.append("g")
			.attr("class", "axis")  //Assign "axis" class
			.attr("transform", "translate(0," + (yScale(0)) + ")")
			.call(xAxis);
			
		var yAxis = d3.svg.axis()
			  .scale(yScale)
			  .orient("left")
			  .ticks(5);
		
		NavLine.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + MarginXL + ",0)")
			.call(yAxis);
		
		//XLabel			
		g.append("text")
		  .attr("x", (w - MarginXR-MarginXL)/2 + MarginXL)
		  .attr("y", h-MarginYB/4)
		  .attr("text-anchor", "middle")
		  .text("Nucleotide Number");	
		  
		//add legend to the navline 
		 g.append("text")
		  .attr("x", MarginXL/4)
		  .attr("y", h/2)
		  .attr("text-anchor", "middle")
		  .attr("transform", "rotate(-90 " + "," + MarginXL/4 + "," + h/2 + ")")
		  .text(linename);	
		
}

function addPopUpWindowResidue(ResIndex){
	//Width and height
	var Xoffset = 40;
	var Yoffset = 20;
	//var barHeight = 120;
	//var barWidth = 200;
		
	//var w = barWidth + Xoffset;
	//var h = barHeight + Yoffset;
	
	var w = 240;
	var h = 160;
	
	//var barPadding = 10;
	var barPaddingPer = 20;
	//var Xoffset = 40;
	//var padding = 30;
	//var Xpadding = 30;
	var barColors = ["green","blue","black","red","orange"];
	
	//Remove old SVG
	d3.select("#residuetip svg").remove();
	
	if (rvDataSets[0].Residues[ResIndex].resNum.indexOf(":") >= 0 ){
		var ResName = rvDataSets[0].Residues[ResIndex].resNum;
	} else {
		var ResName = rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[ResIndex].ChainID)] +
		":" + rvDataSets[0].Residues[ResIndex].resNum;
	}
	
	var dobj = $.grep(rvDataSets[0].ConservationTable, function(e){ return e.resNum == ResName; })[0];
	//var dobj = rvDataSets[0].ConservationTable[ResIndex];
	if (dobj){
		//round the number to two decimal places
		var Anum = dobj.A*100;
		var An = Anum.toFixed(1);
		var Cnum = dobj.C*100;
		var Cn = Cnum.toFixed(1);
		var Gnum = dobj.G*100;
		var Gn = Gnum.toFixed(1);
		var Unum = dobj.U*100;
		var Un = Unum.toFixed(1);
		var Hnum = dobj.Shannon * 1;
		var Hn = Hnum.toFixed(2);	 
		var Gpnum = dobj.Gaps*100;
		var Gpn = Gpnum.toFixed(1);	 
		var dataset = [An,Cn,Gn,Un,Gpn];
		var sLabels = ["A","C","G","U","gaps"];
		var lenDataSet = dataset.length;
		var ConsensusSymbol = dobj.Consensus;
		drawConGraph();
	} else {
		var ConsensusSymbol = "n/a";
		var Hn = "n/a";
	}
		
	var targetLayer=rvDataSets[0].getSelectedLayer();
	$('#resName').html("Residue: " + rvDataSets[0].Residues[ResIndex].resName + "(" + ConsensusSymbol  + ") " + ResName);
	$('#activeData').html("Selected Data: " + targetLayer.Data[ResIndex]);
	$("#conPercentage").html("Shannon Entropy: " + Hn);
	
	function drawConGraph(){
		
		//Create SVG element
		var svg = d3.select("#residuetip")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
		
		var barWidth = (w - Xoffset) / (lenDataSet + ( barPaddingPer/100 * (lenDataSet -1) ) );
		//Scales
		//var xScale = d3.scale.linear();				
		
		var xScale = d3.scale.linear()
								 .domain([0, lenDataSet - 1])
								 .range([Xoffset, w - barWidth]);
								
		var yScale = d3.scale.linear()
							.domain([0, 100])
							.range([h - 2*Yoffset,0]);
			
		svg.selectAll("rect")
		   .data(dataset)
		   .enter()
		   .append("rect")
		   .attr("x", function(d, i) {
				return xScale(i);
		  })
		   .attr("y", function(d) {
				return Yoffset + yScale(d);
		   })
		   .attr("width", barWidth)
		   .attr("height", function(d) {
				return h - 2*Yoffset - yScale(d);
		   })
		   .attr("fill", function(d, i) {
			 return barColors[i];
			});

		svg.selectAll("text.number")
		   .data(dataset)		 
		   .enter()
		   .append("text")
		   .text(function(d) {
				return d;
		   })
		   .attr("text-anchor", "middle")
		   .attr("x", function(d, i) {
				return xScale(i) + barWidth/2;
		   })
		   .attr("y", function(d) {
				return Yoffset + yScale(d) - 5;
		   })
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "10px")
		   .attr("fill", "black")
		   .attr('class','number')
		   .text(String);
		   
		   //Define X axis
				
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(5);

		   //Define Y axis
			var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(5);
			xAxis.tickFormat(function(d,i){
					return sLabels[i];
			});
			
			//Create X axis
			
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + barWidth/2 + "," + (h - Yoffset) + ")")
				.call(xAxis);
			//Create Y axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + 0.8* Xoffset + "," + Yoffset + ")")
				.call(yAxis);	
	}			
}
function addPopUpWindowLine(SeleLine){
	
	var j = rvDataSets[0].BasePairs[SeleLine].resIndex1;
	var k = rvDataSets[0].BasePairs[SeleLine].resIndex2;
	
	if (rvDataSets[0].Residues[j].resNum.indexOf(":") >= 0 ){
		var ResName1 = rvDataSets[0].Residues[j].resNum;
	} else {
		var ResName1 = rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[j].ChainID)] +
		":" + rvDataSets[0].Residues[j].resNum;
	}
	if (rvDataSets[0].Residues[k].resNum.indexOf(":") >= 0 ){
		var ResName2 = rvDataSets[0].Residues[k].resNum;
	} else {
		var ResName2 = rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[k].ChainID)] +
		":" + rvDataSets[0].Residues[k].resNum;
	}
	$('#BasePairType').html("Interaction Type: " +  $("#PrimaryInteractionList").multiselect("getChecked").attr("title"));
	if (rvDataSets[0].BasePairs[SeleLine].ProteinName){
		$('#BasePairSubType').html("Interaction Subtype: " + rvDataSets[0].BasePairs[SeleLine].ProteinName + " " + rvDataSets[0].BasePairs[SeleLine].bp_type);
	} else {
		$('#BasePairSubType').html("Interaction Subtype: " + rvDataSets[0].BasePairs[SeleLine].bp_type);
	}
	
	$("#BasePairRes1").html("Residue1: " + ResName1);
	$("#BasePairRes2").html("Residue2: " + ResName2);
	
}
//////////End of navline functions////

function UpdateLocalStorage(SaveStateFileName){
	var rvSaveState = {};
	if (localStorageAvailable){
		if($("input[name='LayersCheck']").attr("checked")){
			//localStorage.setItem("rvLayers",JSON.stringify(rvDataSets[0].Layers));
			rvSaveState["rvLayers"] = JSON.stringify(rvDataSets[0].Layers);
		}
		if($("input[name='SelectionsCheck']").attr("checked")){
			//localStorage.setItem("rvSelections",JSON.stringify(rvDataSets[0].Selections));
			rvSaveState["rvSelections"] = JSON.stringify(rvDataSets[0].Selections);
		}
		if($("input[name='LastSpeciesCheck']").attr("checked")){
			//localStorage.setItem("rvLastSpecies",rvDataSets[0].Name);
			rvSaveState["rvLastSpecies"] = rvDataSets[0].Name;
		}
		if($("input[name='PanelSizesCheck']").attr("checked")){
			var po = {
				PanelDivide : PanelDivide,
				TopDivide : TopDivide
			}
			//localStorage.setItem("rvPanelSizes",JSON.stringify(po));
			rvSaveState["rvPanelSizes"] = JSON.stringify(po);
		}
		if($("input[name='MouseModeCheck']").attr("checked")){
			//localStorage.setItem("rvMouseMode",onebuttonmode);	
			rvSaveState["rvMouseMode"] = onebuttonmode;
		}
		if($("input[name='CanvasOrientationCheck']").attr("checked")){
			//localStorage.setItem("rvView",JSON.stringify(rvViews[0]));
			rvSaveState["rvView"] = JSON.stringify(rvViews[0]);			
		}
		if($("input[name='JmolOrientationCheck']").attr("checked")){
			if($('input[name="jp"][value=on]').is(':checked')){
				rvSaveState["rvJmolOrientation"] = Jmol.evaluate(myJmol,"script('show orientation')");	
			}			
		}
		localStorage.setItem(SaveStateFileName,JSON.stringify(rvSaveState));
	}
}
function RestoreLocalStorage(SaveStateFileName) { 
	var DoneLoading = $.Deferred();
	var DoneLoading2 = $.Deferred();
	
	if (localStorageAvailable){
		rvSaveState = JSON.parse(localStorage[SaveStateFileName]);
		if($("input[name='LastSpeciesCheck']").attr("checked")){
			loadSpecies(rvSaveState.rvLastSpecies,DoneLoading,DoneLoading2);
		} else {
			DoneLoading.resolve();
		}
	}
	DoneLoading.done(function() {
		processRvState(rvSaveState);
		//RestoreLocalStorage2();
	});
	DoneLoading2.done(function() {
		//updateSelectionDiv();
		updateModel();
		update3Dcolors();
		if($("input[name='JmolOrientationCheck']").attr("checked")){
			if($('input[name="jp"][value=on]').is(':checked')){
				var a = rvSaveState.rvJmolOrientation.match(/reset[^\n]+/);
				Jmol.script(myJmol, a[0]);
			}
			
		}
	});
}
function RestoreLocalStorage2(rvSaveState) {
	processRvState(rvSaveState);
	/*
	if($("input[name='LayersCheck']").attr("checked")){
		var data = JSON.parse(rvSSobj.rvLayers);
		$.each(data, function (index, value) {
			rvDataSets[0].Layers[index] = rvDataSets[0].HighlightLayer.fromJSON(value);
		});
		// Sort rvLayers by zIndex for convience
		//rvDataSets[0].sort();
		
		$.each(rvDataSets[0].Layers,function (index, value) {
			$("#" + this.CanvasName).css('zIndex', index);
		});
		// Restore Selected and Linked
		var selectedLayer = rvDataSets[0].getSelectedLayer();
		var linkedLayer = rvDataSets[0].getLinkedLayer();
		resizeElements(true);
		$(".oneLayerGroup").remove();
		// Put in Layers
		$.each(rvDataSets[0].Layers, function (key, value){
			LayerMenu(value, key);
		});
		RefreshLayerMenu();
		
		$(".oneLayerGroup" + "[name=" + selectedLayer.LayerName + "]").find(".selectLayerRadioBtn").attr("checked","checked");
		rvDataSets[0].selectLayer(selectedLayer.LayerName);
		$(".oneLayerGroup" + "[name=" + linkedLayer.LayerName + "]").find(".mappingRadioBtn").attr("checked","checked");
		rvDataSets[0].linkLayer(linkedLayer.LayerName);
	}
	if($("input[name='SelectionsCheck']").attr("checked")){
		rvDataSets[0].Selections = JSON.parse(rvSSobj.rvSelections);
		$(".oneSelectionGroup").remove();
		// Put in Selections
		$.each(rvDataSets[0].Selections.reverse(), function (key, value){
			SelectionMenu(value, key);
		});
		//Default check first selection. Come back to these to restore saved state
		$("#SelectionPanel div").first().next().find(".selectSelectionRadioBtn").attr("checked", "checked");
		RefreshSelectionMenu();
	}
	
	if($("input[name='PanelSizesCheck']").attr("checked")){
		var po = JSON.parse(rvSSobj.rvPanelSizes);
		PanelDivide = po.PanelDivide;
		TopDivide = po.TopDivide;
		$( "#canvasPorportionSlider" ).slider("value",PanelDivide);
		$( "#topPorportionSlider" ).slider("value",TopDivide);
		resizeElements();
	}
	if($("input[name='MouseModeCheck']").attr("checked")){
		$("#buttonmode").find("input[value='" + rvSSobj.rvMouseMode + "']").trigger("click");
	}
	if($("input[name='CanvasOrientationCheck']").attr("checked")){
		//localStorage.setItem("rvView",7);
		rvViews[0] = rvViews[0].fromJSON(rvSSobj.rvView);
		rvViews[0].restore();
	}
	if($("input[name='JmolOrientationCheck']").attr("checked")){
		//localStorage.setItem("rvJmolOrientation",8);
		var a = rvSSobj.rvJmolOrientation.match(/reset[^\n]+/);
		Jmol.script(myJmol, a[0]);
	}
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	if(!$("input[name='LastSpeciesCheck']").attr("checked")){
		updateModel();
		update3Dcolors();
	}*/
}

function rvSaveManager(rvAction) {
	var SaveStateFileName = $("#SaveStateFileName").attr("value");
	
	switch (rvAction) {
		case "Save":
			switch ($("input[name='ssc']:checked").attr("value")) {
				case "LocalStorage":
					//alert(SaveStateFileName);
					UpdateLocalStorage(SaveStateFileName);
					break;
				case "File":
					saveRvState(SaveStateFileName);
					break;		
				case "Server":
					storeRvState(SaveStateFileName);
					break;
				default:
					alert("huh?");
			}
			break;
		case "Restore":
			switch ($("input[name='ssc']:checked").attr("value")) {
				case "LocalStorage":
					//alert(SaveStateFileName);
					RestoreLocalStorage(SaveStateFileName);
					break;
				case "File":
					$("#dialog-restore-state").dialog("open");
					break;		
				case "Server":
					retrieveRvState(SaveStateFileName);
					break;
				default:
					alert("huh?");
			}
			break;
		default: 
			alert("shouldn't happen right now");
		}
}

function processRvState(rvSaveState) {
	if($("input[name='LayersCheck']").attr("checked")){
		var data = JSON.parse(rvSaveState.rvLayers);
		$.each(data, function (index, value) {
			rvDataSets[0].Layers[index] = rvDataSets[0].HighlightLayer.fromJSON(value);
		});
		
		$.each(rvDataSets[0].Layers,function (index, value) {
			value.updateZIndex(index);
		});
		// Restore Selected and Linked
		var selectedLayer = rvDataSets[0].getSelectedLayer();
		var linkedLayer = rvDataSets[0].getLinkedLayer();
		resizeElements(true);
		$(".oneLayerGroup").remove();
		// Put in Layers
		$.each(rvDataSets[0].Layers, function (key, value){
			LayerMenu(value, key);
		});
		RefreshLayerMenu();
		
		$(".oneLayerGroup" + "[name=" + selectedLayer.LayerName + "]").find(".selectLayerRadioBtn").attr("checked","checked");
		rvDataSets[0].selectLayer(selectedLayer.LayerName);
		$(".oneLayerGroup" + "[name=" + linkedLayer.LayerName + "]").find(".mappingRadioBtn").attr("checked","checked");
		rvDataSets[0].linkLayer(linkedLayer.LayerName);
	}
	if($("input[name='SelectionsCheck']").attr("checked")){
		rvDataSets[0].Selections = JSON.parse(rvSaveState.rvSelections);
		$(".oneSelectionGroup").remove();
		// Put in Selections
		$.each(rvDataSets[0].Selections.reverse(), function (key, value){
			SelectionMenu(value, key);
		});
		//Default check first selection. Come back to these to restore saved state
		$("#SelectionPanel div").first().next().find(".selectSelectionRadioBtn").attr("checked", "checked");
		RefreshSelectionMenu();
		var ret = false;
		$.each(rvDataSets[0].Selections, function (key, value) {
			if (value.Selected) {
				ret = value.Name;
				return false;
			}
		});
		$(".oneSelectionGroup[name='" + ret + "']").find(".selectSelectionRadioBtn").trigger("click");
	}
	if($("input[name='PanelSizesCheck']").attr("checked")){
		var po = JSON.parse(rvSaveState.rvPanelSizes);
		PanelDivide = po.PanelDivide;
		TopDivide = po.TopDivide;
		$( "#canvasPorportionSlider" ).slider("value",PanelDivide);
		$( "#topPorportionSlider" ).slider("value",TopDivide);					
	}
	if($("input[name='MouseModeCheck']").attr("checked")){
		$("#buttonmode").find("input[value='" + rvSaveState.rvMouseMode + "']").trigger("click");
	}
	if($("input[name='CanvasOrientationCheck']").attr("checked")){
		//localStorage.setItem("rvView",7);
		rvViews[0] = rvViews[0].fromJSON(rvSaveState.rvView);
		rvViews[0].restore();
	}
	if($("input[name='JmolOrientationCheck']").attr("checked")){
		//localStorage.setItem("rvJmolOrientation",8);
		if($('input[name="jp"][value=on]').is(':checked')){
			var a = rvSaveState.rvJmolOrientation.match(/reset[^\n]+/);
			Jmol.script(myJmol, a[0]);
		}
	}
	
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
	if(!$("input[name='LastSpeciesCheck']").attr("checked")){
		updateModel();
		update3Dcolors();
	}
	
	//InitRibovision2(true);
}