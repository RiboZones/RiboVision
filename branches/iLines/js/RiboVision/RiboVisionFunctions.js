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
		
		/*
		$.getJSON('getData.php', {
			FullTable : "SC_LSU_3D_Extra"
				}, function (data) {
				rvDataSets[0].addLabels(undefined, undefined, data);
				rvDataSets[0].drawLabels("labels",true);
		});*/
		
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
	var targetSelection=rvDataSets[0].getSelection(SelectionName);
	for (var i = 0; i < command.length; i++) {
		var com = command[i];
		if (!com){return;};
		var comsplit = com.split(":");
		if (comsplit.length > 1) {
			var index = comsplit[1].indexOf("-");
			if (index != -1) {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
				if (chainID){
					var start = chainID + "_" + comsplit[1].substring(1, index);
					var end = chainID + "_" + comsplit[1].substring(index + 1, comsplit[1].length - 1);
					
					if (start && end) {
						var start_ind = rvDataSets[0].ResidueList.indexOf(start);
						var end_ind = rvDataSets[0].ResidueList.indexOf(end);
						
						for (var j = start_ind; j <= end_ind; j++) {
							
							targetSelection.Residues.push(rvDataSets[0].Residues[j]);
						}
					}
				} else {
					//rProteins with ranges will need the rProtein residue list to be defined first.
				}
			} else {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
				if (chainID){
					//var aloneRes = chainID + "_" + comsplit[1].substring(1,comsplit[1].length-1);
					var aloneRes = chainID + "_" + comsplit[1];
					var alone_ind = rvDataSets[0].ResidueList.indexOf(aloneRes);
					if (alone_ind >=0){
						//var targetSelection=rvDataSets[0].getSelection(SelectionName);
						targetSelection.Residues.push(rvDataSets[0].Residues[alone_ind]);
					}
				} else {
					var chainID = rvDataSets[0].SpeciesEntry.PDB_chains_rProtein[rvDataSets[0].SpeciesEntry.Molecule_Names_rProtein.indexOf(comsplit[0])];
					var aloneRes = chainID + "_" + comsplit[1];
					// Skip the residue list check for now
					//var alone_ind = rvDataSets[0].ResidueList_rProtein.indexOf(aloneRes);
					//if (alone_ind >=0){
						//var targetSelection=rvDataSets[0].getSelection(SelectionName);
						targetSelection.Residues_rProtein.push(aloneRes);
						return aloneRes;
					//}
				}
			}
		} else if (comsplit[0] != "") {
			//It is either a basic range selection or a regular expression search. Go by first number/letter for now.
			if (comsplit[0].search(/\d/) > -1){
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
			} else {
                var re = new RegExp(comsplit[0],"g");
                while ((match = re.exec(rvDataSets[0].SequenceList)) != null) {
					var start_ind = match.index;
					var end_ind = match.index + match[0].length - 1;
					for (var j = start_ind; j <= end_ind; j++) {
						var targetSelection=rvDataSets[0].getSelection(SelectionName);
						targetSelection.Residues.push(rvDataSets[0].Residues[j]);
					}
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
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].drawBasePairs("lines");
	drawNavLine();
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

function clearLineSelection(event) {
}
///////////////////////////////////////////////////////////////////////////////


///////////////////////// Color Functions /////////////////////////////////////
function colorResidue(event) {
	var sel = getSelected(event);
	if (sel >=0) {
		var targetLayer=rvDataSets[0].getSelectedLayer();
		var color = colorNameToHex($("#MainColor").val());
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

function colorLine(event) {
	var seleLine = getSelectedLine(event);
	if(seleLine >=0 ){
		var	targetLayer=rvDataSets[0].getLayerByType("lines");
		var color = colorNameToHex($("#LineColor").val());
		var j = targetLayer[0].Data[seleLine].resIndex1;
		var k = targetLayer[0].Data[seleLine].resIndex2;
		var grd = rvDataSets[0].HighlightLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
		grd.addColorStop(0, "rgba(" + h2d(color.slice(1, 3)) + "," + h2d(color.slice(3, 5)) + "," + h2d(color.slice(5)) + "," + targetLayer[0].Data[seleLine].opacity + ")");
		grd.addColorStop(1, "rgba(" + h2d(color.slice(1, 3)) + "," + h2d(color.slice(3, 5)) + "," + h2d(color.slice(5)) + "," + targetLayer[0].Data[seleLine].opacity + ")");
		targetLayer[0].Data[seleLine]["color"] = grd;		
		rvDataSets[0].BasePairs[seleLine]["color"]=color;
		rvDataSets[0].BasePairs[seleLine]["color_hex"]=color;
		rvDataSets[0].drawBasePairs("lines");
	}
}

function clearColor(update3D) {
	var	targetLayer=rvDataSets[0].getLayerByType("residues");
	if (arguments.length < 1) {
		var update3D = true;
	}
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		rvDataSets[0].Residues[i].color = "#000000";
		targetLayer[0].dataLayerColors[i]= undefined;
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
	var color = colorNameToHex($("#MainColor").val());
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
						script += "select " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color Cartoon opaque [x" + curr_color + "]; ";
						script += "select " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color opaque [x" + curr_color + "]; ";

					} else {
						script += "select " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
						script += "select " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color opaque [" + curr_color.replace("#", "x") + "]; ";

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
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color Cartoon opaque [x" + curr_color + "]; ";
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color opaque [x" + curr_color + "]; ";
	} else {
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color opaque [" + curr_color.replace("#", "x") + "]; ";
	}
	//updateSelectionDiv();
	//jmolScript(script);
	Jmol.script(myJmol, script);
}

function colorProcess(DataInput, indexMode,targetLayer,colors,SkipDraw) {
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
	
	if (arguments.length < 3 || targetLayer==undefined) {
		var targetLayer = rvDataSets[0].getSelectedLayer();
	}
	
	if (!targetLayer) {
		$("#dialog-selection-warning p").text("Please select a valid layer and try again.");
		$("#dialog-selection-warning").dialog("open");
		return;
	}
	
	if (indexMode == "1") {
		var dataIndices = data;
	} else {
		var dataIndices = new Array;
		for (var i = 0; i < data.length; i++) {
			dataIndices[i] = Math.round((data[i] - min) / range * (colors.length - 1));
		}
	}
	
	if (!SkipDraw){
		targetLayer.Data = data;
		switch (targetLayer.Type) {
			case "circles":
				rvDataSets[0].drawDataCircles(targetLayer.LayerName, dataIndices, colors);
				break;
			case "residues":
				rvDataSets[0].drawResidues(targetLayer.LayerName, dataIndices, colors);
				break;
			default:
				$( "#dialog-layer-type-error" ).dialog("open")
		}
		update3Dcolors();
	}
	return dataIndices
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
		"black":"#000000",
		"navyblue":"#000080",
		"webdarkblue":"#00008b",
		"darkblue":"#0000c8",
		"mediumblue":"#0000cd",
		"blue":"#0000ff",
		"stratos":"#000741",
		"swamp":"#001b1c",
		"resolutionblue":"#002387",
		"deepfir":"#002900",
		"burnham":"#002e20",
		"internationalkleinblue":"#002fa7",
		"prussianblue":"#003153",
		"midnightblue":"#003366",
		"smalt":"#003399",
		"deepteal":"#003532",
		"cyprus":"#003e40",
		"kaitokegreen":"#004620",
		"cobalt":"#0047ab",
		"crusoe":"#004816",
		"sherpablue":"#004950",
		"endeavour":"#0056a7",
		"camarone":"#00581a",
		"darkgreen":"#006400",
		"scienceblue":"#0066cc",
		"blueribbon":"#0066ff",
		"tropicalrainforest":"#00755e",
		"allports":"#0076a3",
		"deepcerulean":"#007ba7",
		"lochmara":"#007ec7",
		"azureradiance":"#007fff",
		"webgreen":"#008000",
		"teal":"#008080",
		"darkcyan":"#008b8b",
		"bondiblue":"#0095b6",
		"pacificblue":"#009dc4",
		"persiangreen":"#00a693",
		"jade":"#00a86b",
		"pymolteal":"#00bfbf",
		"deepskyblue":"#00bfff",
		"caribbeangreen":"#00cc99",
		"robin'seggblue":"#00cccc",
		"darkturquoise":"#00ced1",
		"mediumspringgreen":"#00fa9a",
		"green":"#00ff00",
		"springgreen":"#00ff7f",
		"aqua":"#00ffff",
		"cyan":"#00ffff",
		"bluecharcoal":"#010d1a",
		"midnight":"#011635",
		"holly":"#011d13",
		"daintree":"#012731",
		"cardingreen":"#01361c",
		"countygreen":"#01371a",
		"astronautblue":"#013e62",
		"regalblue":"#013f6a",
		"aquadeep":"#014b43",
		"orient":"#015e85",
		"bluestone":"#016162",
		"fungreen":"#016d39",
		"pinegreen":"#01796f",
		"bluelagoon":"#017987",
		"deepsea":"#01826b",
		"greenhaze":"#01a368",
		"englishholly":"#022d15",
		"sherwoodgreen":"#02402c",
		"congressblue":"#02478e",
		"eveningsea":"#024e46",
		"bahamablue":"#026395",
		"observatory":"#02866f",
		"cerulean":"#02a4d3",
		"tangaroa":"#03163c",
		"greenvogue":"#032b52",
		"mosque":"#036a6e",
		"midnightmoss":"#041004",
		"blackpearl":"#041322",
		"bluewhale":"#042e4c",
		"zuccini":"#044022",
		"tealblue":"#044259",
		"deepcove":"#051040",
		"gulfblue":"#051657",
		"veniceblue":"#055989",
		"watercourse":"#056f57",
		"catalinablue":"#062a78",
		"tiber":"#063537",
		"gossamer":"#069b81",
		"niagara":"#06a189",
		"tarawera":"#073a50",
		"jaguar":"#080110",
		"blackbean":"#081910",
		"deepsapphire":"#082567",
		"elfgreen":"#088370",
		"brightturquoise":"#08e8de",
		"downriver":"#092256",
		"palmgreen":"#09230f",
		"madison":"#09255d",
		"bottlegreen":"#093624",
		"deepseagreen":"#095859",
		"salem":"#097f4b",
		"blackrussian":"#0a001c",
		"darkfern":"#0a480d",
		"japaneselaurel":"#0a6906",
		"atoll":"#0a6f75",
		"codgray":"#0b0b0b",
		"marshland":"#0b0f08",
		"gordonsgreen":"#0b1107",
		"blackforest":"#0b1304",
		"sanfelix":"#0b6207",
		"malachite":"#0bda51",
		"ebony":"#0c0b1d",
		"woodsmoke":"#0c0d0f",
		"racinggreen":"#0c1911",
		"surfiegreen":"#0c7a79",
		"bluechill":"#0c8990",
		"blackrock":"#0d0332",
		"bunker":"#0d1117",
		"aztec":"#0d1c19",
		"bush":"#0d2e1c",
		"cinder":"#0e0e18",
		"firefly":"#0e2a30",
		"toreabay":"#0f2d9e",
		"vulcan":"#10121d",
		"greenwaterloo":"#101405",
		"eden":"#105852",
		"arapawa":"#110c6c",
		"ultramarine":"#120a8f",
		"elephant":"#123447",
		"jewel":"#126b40",
		"diesel":"#130000",
		"asphalt":"#130a06",
		"bluezodiac":"#13264d",
		"parsley":"#134f19",
		"nero":"#140600",
		"toryblue":"#1450aa",
		"bunting":"#151f4c",
		"denim":"#1560bd",
		"genoa":"#15736b",
		"mirage":"#161928",
		"huntergreen":"#161d10",
		"bigstone":"#162a40",
		"celtic":"#163222",
		"timbergreen":"#16322c",
		"gablegreen":"#163531",
		"pinetree":"#171f04",
		"chathamsblue":"#175579",
		"deepforestgreen":"#182d09",
		"blumine":"#18587a",
		"gray10":"#191919",
		"webmidnightblue":"#191970",
		"density":"#191999",
		"palmleaf":"#19330e",
		"nileblue":"#193751",
		"funblue":"#1959a8",
		"deepteal":"#199999",
		"luckypoint":"#1a1a68",
		"mountainmeadow":"#1ab385",
		"tolopea":"#1b0245",
		"haiti":"#1b1035",
		"deepkoamaru":"#1b127b",
		"acadia":"#1b1404",
		"seaweed":"#1b2f11",
		"biscay":"#1b3162",
		"matisse":"#1b659d",
		"crowshead":"#1c1208",
		"rangoongreen":"#1c1e13",
		"persianblue":"#1c39bb",
		"everglade":"#1c402e",
		"elm":"#1c7c7d",
		"greenpea":"#1d6142",
		"creole":"#1e0f04",
		"karaka":"#1e1609",
		"elpaso":"#1e1708",
		"cello":"#1e385b",
		"tepapagreen":"#1e433c",
		"dodgerblue":"#1e90ff",
		"easternblue":"#1e9ab0",
		"nightrider":"#1f120f",
		"java":"#1fc2c2",
		"jacksonspurple":"#20208d",
		"cloudburst":"#202e54",
		"bluedianne":"#204852",
		"lightseagreen":"#20b2aa",
		"eternity":"#211a0e",
		"deepblue":"#220878",
		"forestgreen":"#228b22",
		"mallard":"#233418",
		"violet":"#240a40",
		"kilamanjaro":"#240c02",
		"logcabin":"#242a1d",
		"blackolive":"#242e16",
		"greenhouse":"#24500f",
		"graphite":"#251607",
		"cannonblack":"#251706",
		"portgore":"#251f4f",
		"shark":"#25272c",
		"greenkelp":"#25311c",
		"curiousblue":"#2596d1",
		"paua":"#260368",
		"parism":"#26056a",
		"woodbark":"#261105",
		"gondola":"#261414",
		"steelgray":"#262335",
		"ebonyclay":"#26283b",
		"bayofmany":"#273a81",
		"plantation":"#27504b",
		"eucalyptus":"#278a5b",
		"oil":"#281e15",
		"astronaut":"#283a77",
		"mariner":"#286acd",
		"violentviolet":"#290c5e",
		"bastille":"#292130",
		"zeus":"#292319",
		"charade":"#292937",
		"jellybean":"#297b9a",
		"junglegreen":"#29ab87",
		"cherrypie":"#2a0359",
		"coffeebean":"#2a140e",
		"balticsea":"#2a2630",
		"turtlegreen":"#2a380b",
		"ceruleanblue":"#2a52be",
		"sepiablack":"#2b0202",
		"valhalla":"#2b194f",
		"heavymetal":"#2b3228",
		"bluegem":"#2c0e8c",
		"revolver":"#2c1632",
		"bleachedcedar":"#2c2133",
		"lochinvar":"#2c8c84",
		"mikado":"#2d2510",
		"outerspace":"#2d383a",
		"sttropaz":"#2d569b",
		"jacaranda":"#2e0329",
		"jackobean":"#2e1905",
		"rangitoto":"#2e3222",
		"rhino":"#2e3f62",
		"seagreen":"#2e8b57",
		"scooter":"#2ebfd4",
		"onion":"#2f270e",
		"governorbay":"#2f3cb3",
		"darkslategray":"#2f4f4f",
		"sapphire":"#2f519e",
		"spectra":"#2f5a57",
		"casal":"#2f6168",
		"melanzane":"#300529",
		"cocoabrown":"#301f1e",
		"woodrush":"#302a0f",
		"sanjuan":"#304b6a",
		"turquoise":"#30d5c8",
		"eclipse":"#311c17",
		"pickledbluewood":"#314459",
		"azure":"#315ba1",
		"calypso":"#31728d",
		"paradiso":"#317d82",
		"persianindigo":"#32127a",
		"blackcurrant":"#32293a",
		"mineshaft":"#323232",
		"stromboli":"#325d52",
		"bilbao":"#327c14",
		"astral":"#327da0",
		"limegreen":"#32cd32",
		"christalle":"#33036b",
		"thunder":"#33292f",
		"gray20":"#333333",
		"pymolskyblue":"#337fcc",
		"forest":"#339933",
		"shamrock":"#33cc99",
		"tv_green":"#33ff33",
		"tamarind":"#341515",
		"mardigras":"#350036",
		"valentino":"#350e42",
		"jagger":"#350e57",
		"tuna":"#353542",
		"chambray":"#354e8c",
		"martinique":"#363050",
		"tuatara":"#363534",
		"waiouru":"#363c0d",
		"ming":"#36747d",
		"lapalma":"#368716",
		"chocolate":"#370202",
		"clinker":"#371d09",
		"browntumbleweed":"#37290e",
		"birch":"#373021",
		"oracle":"#377475",
		"bluediamond":"#380474",
		"grape":"#381a51",
		"dune":"#383533",
		"oxfordblue":"#384555",
		"clover":"#384910",
		"limedspruce":"#394851",
		"dell":"#396413",
		"toledo":"#3a0020",
		"sambuca":"#3a2010",
		"jacarta":"#3a2a6a",
		"william":"#3a686c",
		"killarney":"#3a6a47",
		"keppel":"#3ab09e",
		"temptress":"#3b000b",
		"aubergine":"#3b0910",
		"jon":"#3b1f1f",
		"treehouse":"#3b2820",
		"amazon":"#3b7a57",
		"bostonblue":"#3b91b4",
		"windsor":"#3c0878",
		"rebel":"#3c1206",
		"meteorite":"#3c1f76",
		"darkebony":"#3c2005",
		"camouflage":"#3c3910",
		"brightgray":"#3c4151",
		"capecod":"#3c4443",
		"lunargreen":"#3c493a",
		"mediumseagreen":"#3cb371",
		"bean":"#3d0c02",
		"bistre":"#3d2b1f",
		"goblin":"#3d7d52",
		"kingfisherdaisy":"#3e0480",
		"cedar":"#3e1c14",
		"englishwalnut":"#3e2b23",
		"blackmarlin":"#3e2c1c",
		"shipgray":"#3e3a44",
		"pelorous":"#3eabbf",
		"bronze":"#3f2109",
		"cola":"#3f2500",
		"madras":"#3f3002",
		"minsk":"#3f307f",
		"pymoldeepblue":"#3f3fa5",
		"cabbagepont":"#3f4c3a",
		"tomthumb":"#3f583b",
		"mineralgreen":"#3f5d53",
		"puertorico":"#3fc1aa",
		"harlequin":"#3fff00",
		"greencyan":"#3fffbf",
		"brownpod":"#401801",
		"cork":"#40291d",
		"masala":"#403b38",
		"thatchgreen":"#403d19",
		"fiord":"#405169",
		"viridian":"#40826d",
		"chateaugreen":"#40a860",
		"webturquoise":"#40e0d0",
		"ripeplum":"#410056",
		"paco":"#411f10",
		"deepoak":"#412010",
		"merlin":"#413c37",
		"gunpowder":"#414257",
		"eastbay":"#414c7d",
		"royalblue":"#4169e1",
		"oceangreen":"#41aa78",
		"burntmaroon":"#420303",
		"lisbonbrown":"#423921",
		"fadedjade":"#427977",
		"scarletgum":"#431560",
		"iroko":"#433120",
		"armadillo":"#433e37",
		"riverbed":"#434c59",
		"greenleaf":"#436a0d",
		"barossa":"#44012d",
		"moroccobrown":"#441d00",
		"mako":"#444954",
		"kelp":"#454936",
		"sanmarino":"#456cac",
		"pictonblue":"#45b1e8",
		"loulou":"#460b41",
		"craterbrown":"#462425",
		"grayasparagus":"#465945",
		"steelblue":"#4682b4",
		"rusticred":"#480404",
		"bulgarianrose":"#480607",
		"clairvoyant":"#480656",
		"cocoabean":"#481c1c",
		"woodybrown":"#483131",
		"taupe":"#483c32",
		"darkslateblue":"#483d8b",
		"mediumturquoise":"#48d1cc",
		"vancleef":"#49170c",
		"brownderby":"#492615",
		"metallicbronze":"#49371b",
		"verdungreen":"#495400",
		"bluebayoux":"#496679",
		"bismark":"#497183",
		"bracken":"#4a2a04",
		"deepbronze":"#4a3004",
		"mondo":"#4a3c30",
		"tundora":"#4a4244",
		"gravel":"#4a444b",
		"trout":"#4a4e5a",
		"pigmentindigo":"#4b0082",
		"nandor":"#4b5d52",
		"saddle":"#4c3024",
		"gray30":"#4c4c4c",
		"tv_blue":"#4c4cff",
		"abbey":"#4c4f56",
		"blackberry":"#4d0135",
		"cabsav":"#4d0a18",
		"indiantan":"#4d1e01",
		"cowboy":"#4d282d",
		"lividbrown":"#4d282e",
		"rock":"#4d3833",
		"punga":"#4d3d14",
		"bronzetone":"#4d400f",
		"woodland":"#4d5328",
		"mahogany":"#4e0606",
		"bossanova":"#4e2a5a",
		"matterhorn":"#4e3b41",
		"bronzeolive":"#4e420c",
		"mulledwine":"#4e4562",
		"axolotl":"#4e6649",
		"wedgewood":"#4e7f9e",
		"shakespeare":"#4eabd1",
		"honeyflower":"#4f1c70",
		"daisybush":"#4f2398",
		"indigo":"#4f69c6",
		"ferngreen":"#4f7942",
		"fruitsalad":"#4f9d5d",
		"apple":"#4fa83d",
		"mortar":"#504351",
		"kashmirblue":"#507096",
		"cuttysark":"#507672",
		"emerald":"#50c878",
		"emperor":"#514649",
		"chaletgreen":"#516e3d",
		"como":"#517c66",
		"smaltblue":"#51808f",
		"castro":"#52001f",
		"maroonoak":"#520c17",
		"gigas":"#523c94",
		"voodoo":"#533455",
		"victoria":"#534491",
		"hippiegreen":"#53824b",
		"heath":"#541012",
		"judgegray":"#544333",
		"fuscousgray":"#54534d",
		"vidaloca":"#549019",
		"cioccolato":"#55280c",
		"saratoga":"#555b10",
		"darkolivegreen":"#556b2f",
		"finlandia":"#556d56",
		"havelockblue":"#5590d9",
		"fountainblue":"#56b4be",
		"springleaves":"#578363",
		"saddlebrown":"#583401",
		"scarpaflow":"#585562",
		"cactus":"#587156",
		"hippieblue":"#589aaf",
		"wineberry":"#591d35",
		"brownbramble":"#592804",
		"congobrown":"#593737",
		"millbrook":"#594433",
		"waikawagray":"#5a6e9c",
		"horizon":"#5a87a0",
		"jambalaya":"#5b3013",
		"bordeaux":"#5c0120",
		"mulberrywood":"#5c0536",
		"carnabytan":"#5c2e01",
		"comet":"#5c5d75",
		"redwood":"#5d1e0f",
		"donjuan":"#5d4c51",
		"chicago":"#5d5c58",
		"verdigris":"#5d5e37",
		"dingley":"#5d7747",
		"breakerbay":"#5da19f",
		"kabul":"#5e483e",
		"hemlock":"#5e5d3b",
		"irishcoffee":"#5f3d26",
		"midgray":"#5f5f6e",
		"shuttlegray":"#5f6672",
		"webcadetblue":"#5f9ea0",
		"aquaforest":"#5fa777",
		"tradewind":"#5fb3ac",
		"horsesneck":"#604913",
		"smoky":"#605b73",
		"corduroy":"#606e68",
		"danube":"#6093d1",
		"espresso":"#612718",
		"eggplant":"#614051",
		"costadelsol":"#615d30",
		"gladegreen":"#61845f",
		"buccaneer":"#622f30",
		"quincy":"#623f2d",
		"butterflybush":"#624e9a",
		"westcoast":"#625119",
		"finch":"#626649",
		"patina":"#639a8f",
		"fern":"#63b76c",
		"blueviolet":"#6456b7",
		"dolphin":"#646077",
		"stormdust":"#646463",
		"siam":"#646a54",
		"nevada":"#646e75",
		"cornflowerblue":"#6495ed",
		"viking":"#64ccdb",
		"rosewood":"#65000b",
		"cherrywood":"#651a14",
		"purpleheart":"#652dc1",
		"fernfrond":"#657220",
		"willowgrove":"#65745d",
		"hoki":"#65869f",
		"pompadour":"#660045",
		"purple":"#660099",
		"tyrianpurple":"#66023c",
		"darktan":"#661010",
		"gray40":"#666666",
		"lightteal":"#66b2b2",
		"silvertree":"#66b58f",
		"mediumaquamarine":"#66cdaa",
		"brightgreen":"#66ff00",
		"screamin'green":"#66ff66",
		"blackrose":"#67032d",
		"scampi":"#675fa6",
		"ironsidegray":"#676662",
		"viridiangreen":"#678975",
		"christi":"#67a712",
		"nutmegwoodfinish":"#683600",
		"zambezi":"#685558",
		"saltbox":"#685e6e",
		"tawnyport":"#692545",
		"finn":"#692d54",
		"scorpion":"#695f62",
		"dimgray":"#696969",
		"lynch":"#697e9a",
		"spice":"#6a442e",
		"slateblue":"#6a5acd",
		"himalaya":"#6a5d1b",
		"soyabean":"#6a6051",
		"hairyheath":"#6b2a14",
		"royalpurple":"#6b3fa0",
		"shinglefawn":"#6b4e31",
		"dorado":"#6b5755",
		"bermudagray":"#6b8ba2",
		"olivedrab":"#6b8e23",
		"eminence":"#6c3082",
		"turquoiseblue":"#6cdae7",
		"lonestar":"#6d0101",
		"pinecone":"#6d5e54",
		"dovegray":"#6d6c6c",
		"juniper":"#6d9292",
		"gothic":"#6d92a1",
		"redoxide":"#6e0902",
		"moccaccino":"#6e1d14",
		"pickledbean":"#6e4826",
		"dallas":"#6e4b26",
		"kokoda":"#6e6d57",
		"palesky":"#6e7783",
		"caferoyale":"#6f440c",
		"flint":"#6f6a61",
		"highland":"#6f8e63",
		"limeade":"#6f9d02",
		"downy":"#6fd0c5",
		"persianplum":"#701c1c",
		"sepia":"#704214",
		"antiquebronze":"#704a07",
		"ferra":"#704f50",
		"coffee":"#706555",
		"slategray":"#708090",
		"cedarwoodfinish":"#711a00",
		"metalliccopper":"#71291d",
		"affair":"#714693",
		"studio":"#714ab2",
		"tobaccobrown":"#715d47",
		"yellowmetal":"#716338",
		"peat":"#716b56",
		"olivetone":"#716e10",
		"stormgray":"#717486",
		"sirocco":"#718080",
		"aquamarineblue":"#71d9e2",
		"venetianred":"#72010f",
		"oldcopper":"#724a2f",
		"goben":"#726d4e",
		"raven":"#727b89",
		"seance":"#731e8f",
		"rawumber":"#734a12",
		"kimberly":"#736c9f",
		"crocodile":"#736d58",
		"crete":"#737829",
		"xanadu":"#738678",
		"spicymustard":"#74640d",
		"limedash":"#747d63",
		"rollingstone":"#747d83",
		"bluesmoke":"#748881",
		"laurel":"#749378",
		"mantis":"#74c365",
		"russett":"#755a57",
		"deluge":"#7563a8",
		"cosmic":"#76395d",
		"bluemarguerite":"#7666c6",
		"lima":"#76bd17",
		"skyblue":"#76d7ea",
		"darkburgundy":"#770f05",
		"crownofthorns":"#771f1f",
		"walnut":"#773f1a",
		"pablo":"#776f61",
		"pacifika":"#778120",
		"lightslategray":"#778899",
		"oxley":"#779e86",
		"pastelgreen":"#77dd77",
		"japanesemaple":"#780109",
		"mocha":"#782d19",
		"peanut":"#782f16",
		"camouflagegreen":"#78866b",
		"wasabi":"#788a25",
		"shipcove":"#788bba",
		"seanymph":"#78a39c",
		"romancoffee":"#795d4c",
		"oldlavender":"#796878",
		"rum":"#796989",
		"fedora":"#796a78",
		"sandstone":"#796d62",
		"spray":"#79deec",
		"siren":"#7a013a",
		"fuchsiablue":"#7a58c1",
		"boulder":"#7a7a7a",
		"wildblueyonder":"#7a89b8",
		"deyork":"#7ac488",
		"redbeech":"#7b3801",
		"cinnamon":"#7b3f00",
		"yukongold":"#7b6608",
		"mediumslateblue":"#7b68ee",
		"tapa":"#7b7874",
		"waterloo":"#7b7c94",
		"flaxsmoke":"#7b8265",
		"amulet":"#7b9f80",
		"asparagus":"#7ba05b",
		"kenyancopper":"#7c1c05",
		"pesto":"#7c7631",
		"topaz":"#7c778a",
		"concord":"#7c7b7a",
		"jumbo":"#7c7b82",
		"trendygreen":"#7c881a",
		"gumbo":"#7ca1a6",
		"acapulco":"#7cb0a1",
		"neptune":"#7cb7bb",
		"lawngreen":"#7cfc00",
		"pueblo":"#7d2c14",
		"bayleaf":"#7da98d",
		"malibu":"#7dc8f7",
		"bermuda":"#7dd8c6",
		"coppercanyon":"#7e3a15",
		"purpleblue":"#7f00ff",
		"claret":"#7f1734",
		"perutan":"#7f3a02",
		"falcon":"#7f626d",
		"mobster":"#7f7589",
		"moodyblue":"#7f76d3",
		"gray50":"#7f7f7f",
		"slate":"#7f7fff",
		"chartreuse":"#7fff00",
		"pymollime":"#7fff7f",
		"aquamarine":"#7fffd4",
		"pymolaquamarine":"#7fffff",
		"maroon":"#800000",
		"webpurple":"#800080",
		"rosebudcherry":"#800b47",
		"falured":"#801818",
		"redrobin":"#80341f",
		"vividviolet":"#803790",
		"russet":"#80461b",
		"friargray":"#807e79",
		"olive":"#808000",
		"gray":"#808080",
		"gulfstream":"#80b3ae",
		"glacier":"#80b3c4",
		"seagull":"#80ccea",
		"nutmeg":"#81422c",
		"spicypink":"#816e71",
		"empress":"#817377",
		"spanishgreen":"#819885",
		"sanddune":"#826f65",
		"gunsmoke":"#828685",
		"battleshipgray":"#828f72",
		"merlot":"#831923",
		"shadow":"#837050",
		"chelseacucumber":"#83aa5d",
		"montecarlo":"#83d0c6",
		"plum":"#843179",
		"grannysmith":"#84a0a0",
		"splitpea":"#84bf00",
		"chetwodeblue":"#8581d9",
		"bandicoot":"#858470",
		"balihai":"#859faf",
		"halfbaked":"#85c4cc",
		"reddevil":"#860111",
		"lotus":"#863c3c",
		"ironstone":"#86483c",
		"bullshot":"#864d1e",
		"rustynail":"#86560a",
		"bitter":"#868974",
		"regentgray":"#86949f",
		"disco":"#871550",
		"americano":"#87756e",
		"hurricane":"#877c7b",
		"oslogray":"#878d91",
		"sushi":"#87ab39",
		"webskyblue":"#87ceeb",
		"lightskyblue":"#87cefa",
		"spicymix":"#885342",
		"kumera":"#886221",
		"suvagray":"#888387",
		"avocado":"#888d65",
		"camelot":"#893456",
		"solidpink":"#893843",
		"cannonpink":"#894367",
		"makara":"#897d6d",
		"webblueviolet":"#8a2be2",
		"burntumber":"#8a3324",
		"truev":"#8a73d6",
		"claycreek":"#8a8360",
		"monsoon":"#8a8389",
		"stack":"#8a8f8a",
		"jordyblue":"#8ab9f1",
		"darkred":"#8b0000",
		"darkmagenta":"#8b008b",
		"electricviolet":"#8b00ff",
		"monarch":"#8b0723",
		"websaddlebrown":"#8b4513",
		"cornharvest":"#8b6b0b",
		"olivehaze":"#8b8470",
		"schooner":"#8b847e",
		"naturalgray":"#8b8680",
		"mantle":"#8b9c90",
		"portage":"#8b9fee",
		"envy":"#8ba690",
		"cascade":"#8ba9a5",
		"riptide":"#8be6d8",
		"cardinalpink":"#8c055e",
		"violetpurple":"#8c3f99",
		"mulefawn":"#8c472f",
		"pottersclay":"#8c5738",
		"trendypink":"#8c6495",
		"smudge":"#8cb266",
		"paprika":"#8d0226",
		"pymolchocolate":"#8d381c",
		"sanguinebrown":"#8d3d38",
		"tosca":"#8d3f3f",
		"cement":"#8d7662",
		"granitegreen":"#8d8974",
		"manatee":"#8d90a1",
		"poloblue":"#8da8cc",
		"redberry":"#8e0000",
		"rope":"#8e4d1e",
		"opium":"#8e6f70",
		"domino":"#8e775e",
		"mamba":"#8e8190",
		"nepal":"#8eabc1",
		"pohutukawa":"#8f021c",
		"elsalva":"#8f3e33",
		"korma":"#8f4b0e",
		"squirrel":"#8f8176",
		"darkseagreen":"#8fbc8f",
		"vistablue":"#8fd6b4",
		"burgundy":"#900020",
		"oldbrick":"#901e1e",
		"hemp":"#907874",
		"almondfrost":"#907b71",
		"sycamore":"#908d39",
		"lightgreen":"#90ee90",
		"sangria":"#92000a",
		"cumin":"#924321",
		"beaver":"#926f5b",
		"stonewall":"#928573",
		"venus":"#928590",
		"mediumpurple":"#9370d8",
		"mediumpurple":"#9370db",
		"cornflower":"#93ccea",
		"algaegreen":"#93dfb8",
		"darkviolet":"#9400d3",
		"copperrust":"#944747",
		"arrowtown":"#948771",
		"scarlett":"#950015",
		"strikemaster":"#956387",
		"mountainmist":"#959396",
		"carmine":"#960018",
		"brown":"#964b00",
		"leather":"#967059",
		"purplemountain'smajesty":"#9678b6",
		"lavenderpurple":"#967bb6",
		"pewter":"#96a8a1",
		"summergreen":"#96bbab",
		"auchico":"#97605d",
		"wisteria":"#9771b5",
		"atlantis":"#97cd2d",
		"vinrouge":"#983d61",
		"lilacbush":"#9874d3",
		"bazaar":"#98777b",
		"hacienda":"#98811b",
		"paleoyster":"#988d77",
		"palegreen":"#98fb98",
		"mintgreen":"#98ff98",
		"fresheggplant":"#990066",
		"violeteggplant":"#991199",
		"tamarillo":"#991613",
		"deeppurple":"#991999",
		"totempole":"#991b07",
		"darkorchid":"#9932cc",
		"ruby":"#993333",
		"copperrose":"#996666",
		"amethyst":"#9966cc",
		"mountbattenpink":"#997a8d",
		"deepolive":"#999919",
		"gray60":"#999999",
		"bluebell":"#9999cc",
		"prairiesand":"#9a3820",
		"toast":"#9a6e61",
		"gurkha":"#9a9577",
		"olivine":"#9ab973",
		"shadowgreen":"#9ac2b8",
		"webyellowgreen":"#9acd32",
		"oregon":"#9b4703",
		"lemongrass":"#9b9e8f",
		"stiletto":"#9c3336",
		"hawaiiantan":"#9d5616",
		"gullgray":"#9dacb7",
		"pistachio":"#9dc209",
		"grannysmithapple":"#9de093",
		"anakiwa":"#9de5ff",
		"chelseagem":"#9e5302",
		"sepiaskin":"#9e5b40",
		"sage":"#9ea587",
		"citron":"#9ea91f",
		"rockblue":"#9eb1cd",
		"morningglory":"#9edee0",
		"cognac":"#9f381d",
		"reefgold":"#9f821c",
		"stardust":"#9f9f9c",
		"santasgray":"#9fa0b1",
		"sinbad":"#9fd7d3",
		"feijoa":"#9fdd8c",
		"tabasco":"#a02712",
		"sienna":"#a0522d",
		"butteredrum":"#a1750d",
		"hitgray":"#a1adb5",
		"citrus":"#a1c50a",
		"aquaisland":"#a1dad7",
		"waterleaf":"#a1e9de",
		"flirt":"#a2006d",
		"rouge":"#a23b6c",
		"capepalliser":"#a26645",
		"graychateau":"#a2aab3",
		"edward":"#a2aeab",
		"pharlap":"#a3807b",
		"amethystsmoke":"#a397b4",
		"blizzardblue":"#a3e3ed",
		"delta":"#a4a49d",
		"wistful":"#a4a6d3",
		"greensmoke":"#a4af6e",
		"jazzberryjam":"#a50b5e",
		"webbrown":"#a52a2a",
		"pymolbrown":"#a5512b",
		"zorba":"#a59b91",
		"bahia":"#a5cb0c",
		"pymolpalegreen":"#a5e5a5",
		"roofterracotta":"#a62f20",
		"paarl":"#a65529",
		"barleycorn":"#a68b5b",
		"donkeybrown":"#a69279",
		"dawn":"#a6a29a",
		"mexicanred":"#a72525",
		"luxorgold":"#a7882c",
		"richgold":"#a85307",
		"renosand":"#a86515",
		"coraltree":"#a86b6b",
		"dustygray":"#a8989b",
		"dulllavender":"#a899e6",
		"tallow":"#a8a589",
		"bud":"#a8ae9c",
		"locust":"#a8af8e",
		"norway":"#a8bd9f",
		"chinook":"#a8e3bd",
		"grayolive":"#a9a491",
		"darkgray":"#a9a9a9",
		"aluminium":"#a9acb6",
		"cadetblue":"#a9b2c3",
		"schist":"#a9b497",
		"towergray":"#a9bdbf",
		"perano":"#a9bef2",
		"opal":"#a9c6c2",
		"nightshadz":"#aa375a",
		"fire":"#aa4203",
		"muesli":"#aa8b5b",
		"sandal":"#aa8d6f",
		"shadylady":"#aaa5a9",
		"logan":"#aaa9cd",
		"spunpearl":"#aaabb7",
		"regentstblue":"#aad6e6",
		"magicmint":"#aaf0d1",
		"lipstick":"#ab0563",
		"royalheath":"#ab3472",
		"sandrift":"#ab917a",
		"coldpurple":"#aba0d9",
		"bronco":"#aba196",
		"limedoak":"#ac8a56",
		"eastside":"#ac91ce",
		"lemonginger":"#ac9e22",
		"napa":"#aca494",
		"hillary":"#aca586",
		"cloudy":"#aca59f",
		"silverchalice":"#acacac",
		"swampgreen":"#acb78e",
		"springrain":"#accbb1",
		"conifer":"#acdd4d",
		"celadon":"#ace1af",
		"mandalay":"#ad781b",
		"casper":"#adbed1",
		"lightblue":"#add8e6",
		"mossgreen":"#addfad",
		"padua":"#ade6c4",
		"greenyellow":"#adff2f",
		"hippiepink":"#ae4560",
		"desert":"#ae6020",
		"bouquet":"#ae809e",
		"mediumcarmine":"#af4035",
		"appleblossom":"#af4d43",
		"brownrust":"#af593e",
		"driftwood":"#af8751",
		"alpine":"#af8f2c",
		"lucky":"#af9f1c",
		"martini":"#afa09e",
		"bombay":"#afb1b8",
		"pigeonpost":"#afbdd9",
		"paleturquoise":"#afeeee",
		"cadillac":"#b04c6a",
		"matrix":"#b05d54",
		"tapestry":"#b05e81",
		"maitai":"#b06608",
		"delrio":"#b09a95",
		"lightsteelblue":"#b0c4de",
		"powderblue":"#b0e0e6",
		"inchworm":"#b0e313",
		"brightred":"#b10000",
		"pymolfirebrick":"#b12121",
		"vesuvius":"#b14a0b",
		"pumpkinskin":"#b1610b",
		"santafe":"#b16d52",
		"teak":"#b19461",
		"fringyflower":"#b1e2c1",
		"icecold":"#b1f4e7",
		"shiraz":"#b20931",
		"firebrick":"#b22222",
		"raspberry":"#b24c66",
		"dirtyviolet":"#b27f7f",
		"bilobaflower":"#b2a1ea",
		"gray70":"#b2b2b2",
		"tallpoppy":"#b32d29",
		"fieryorange":"#b35213",
		"hottoddy":"#b38007",
		"taupegray":"#b3af95",
		"larioja":"#b3c110",
		"wellread":"#b43332",
		"blush":"#b44668",
		"junglemist":"#b4cfd3",
		"turkishrose":"#b57281",
		"lavender":"#b57edc",
		"mongoose":"#b5a27f",
		"olivegreen":"#b5b35c",
		"jetstream":"#b5d2ce",
		"cruise":"#b5ecdf",
		"hibiscus":"#b6316c",
		"thatch":"#b69d98",
		"heatheredgray":"#b6b095",
		"eagle":"#b6baa4",
		"spindle":"#b6d1ea",
		"gumleaf":"#b6d3bf",
		"rust":"#b7410e",
		"sand":"#b78c4c",
		"muddywaters":"#b78e5c",
		"sahara":"#b7a214",
		"husk":"#b7a458",
		"nobel":"#b7b1b1",
		"heather":"#b7c3d0",
		"madang":"#b7f0be",
		"milanored":"#b81104",
		"copper":"#b87333",
		"darkgoldenrod":"#b8860b",
		"gimblet":"#b8b56a",
		"greenspring":"#b8c1b1",
		"celery":"#b8c25d",
		"sail":"#b8e0f9",
		"chestnut":"#b94e48",
		"crail":"#b95140",
		"marigold":"#b98d28",
		"wildwillow":"#b9c46a",
		"rainee":"#b9c8ac",
		"guardsmanred":"#ba0101",
		"rockspray":"#ba450c",
		"mediumorchid":"#ba55d3",
		"bourbon":"#ba6f1e",
		"pirategold":"#ba7f03",
		"pymoldarksalmon":"#ba8c84",
		"nomad":"#bab1a2",
		"submarine":"#bac7c9",
		"charlotte":"#baeef9",
		"mediumredviolet":"#bb3385",
		"brandyrose":"#bb8983",
		"riogrande":"#bbd009",
		"surf":"#bbd7c1",
		"rosybrown":"#bc8f8f",
		"powderash":"#bcc9c2",
		"tuscany":"#bd5e2e",
		"quicksand":"#bd978e",
		"silk":"#bdb1a8",
		"malta":"#bdb2a1",
		"chatelle":"#bdb3c7",
		"darkkhaki":"#bdb76b",
		"lavendergray":"#bdbbd7",
		"frenchgray":"#bdbdc6",
		"clayash":"#bdc8b3",
		"loblolly":"#bdc9ce",
		"frenchpass":"#bdedfd",
		"londonhue":"#bea6c3",
		"pinkswan":"#beb5b7",
		"fuego":"#bede0d",
		"pymolpurple":"#bf00bf",
		"roseofsharon":"#bf5500",
		"tide":"#bfb8b0",
		"bluehaze":"#bfbed8",
		"pymollightblue":"#bfbfff",
		"silversand":"#bfc1c2",
		"keylimepie":"#bfc921",
		"ziggurat":"#bfdbe2",
		"lime":"#bfff00",
		"limon":"#bfff3f",
		"thunderbird":"#c02b18",
		"mojo":"#c04737",
		"oldrose":"#c08081",
		"silver":"#c0c0c0",
		"paleleaf":"#c0d3b9",
		"pixiegreen":"#c0d8b6",
		"tiamaria":"#c1440e",
		"fuchsiapink":"#c154c1",
		"buddhagold":"#c1a004",
		"bisonhide":"#c1b7a4",
		"tea":"#c1bab0",
		"graysuit":"#c1becd",
		"sprout":"#c1d7b0",
		"sulu":"#c1f07c",
		"indochine":"#c26b03",
		"twine":"#c2955d",
		"cottonseed":"#c2bdb6",
		"pumice":"#c2cac4",
		"jaggedice":"#c2e8e5",
		"maroonflush":"#c32148",
		"indiankhaki":"#c3b091",
		"paleslate":"#c3bfc1",
		"graynickel":"#c3c3bd",
		"periwinklegray":"#c3cde6",
		"tiara":"#c3d1d1",
		"tropicalblue":"#c3ddf9",
		"cardinal":"#c41e3a",
		"fuzzywuzzybrown":"#c45655",
		"orangeroughy":"#c45719",
		"pymololive":"#c4b200",
		"mistgray":"#c4c4bc",
		"coriander":"#c4d0b0",
		"minttulip":"#c4f4eb",
		"mulberry":"#c54b8c",
		"nugget":"#c59922",
		"tussock":"#c5994b",
		"seamist":"#c5dbca",
		"yellowgreen":"#c5e17a",
		"brickred":"#c62d42",
		"contessa":"#c6726b",
		"orientalpink":"#c69191",
		"roti":"#c6a84b",
		"ash":"#c6c3b5",
		"kangaroo":"#c6c8bd",
		"laspalmas":"#c6e610",
		"monza":"#c7031e",
		"redviolet":"#c71585",
		"coralreef":"#c7bca2",
		"melrose":"#c7c1ff",
		"cloud":"#c7c4bf",
		"ghost":"#c7c9d5",
		"pineglade":"#c7cd90",
		"botticelli":"#c7dde5",
		"antiquebrass":"#c88a65",
		"lilac":"#c8a2c8",
		"hokeypokey":"#c8a528",
		"lily":"#c8aabf",
		"laser":"#c8b568",
		"edgewater":"#c8e3d7",
		"piper":"#c96323",
		"pizza":"#c99415",
		"lightwisteria":"#c9a0dc",
		"rodeodust":"#c9b29b",
		"sundance":"#c9b35b",
		"earlsgreen":"#c9b93b",
		"silverrust":"#c9c0bb",
		"conch":"#c9d9d2",
		"reef":"#c9ffa2",
		"aeroblue":"#c9ffe5",
		"flushmahogany":"#ca3435",
		"turmeric":"#cabb48",
		"pariswhite":"#cadcd4",
		"bitterlemon":"#cae00d",
		"skeptic":"#cae6da",
		"viola":"#cb8fa9",
		"foggygray":"#cbcab6",
		"greenmist":"#cbd3b0",
		"nebula":"#cbdbd6",
		"persianred":"#cc3333",
		"burntorange":"#cc5500",
		"ochre":"#cc7722",
		"puce":"#cc8899",
		"thistlegreen":"#cccaa8",
		"gray80":"#cccccc",
		"periwinkle":"#ccccff",
		"electriclime":"#ccff00",
		"palecyan":"#ccffff",
		"tenn":"#cd5700",
		"chestnutrose":"#cd5c5c",
		"brandypunch":"#cd8429",
		"peru":"#cd853f",
		"onahau":"#cdf4ff",
		"sorrellbrown":"#ceb98f",
		"coldturkey":"#cebaba",
		"yuma":"#cec291",
		"chino":"#cec7a7",
		"eunry":"#cfa39d",
		"oldgold":"#cfb53b",
		"tasman":"#cfdccf",
		"surfcrest":"#cfe5d2",
		"hummingbird":"#cff9f3",
		"scandal":"#cffaf4",
		"redstage":"#d05f04",
		"hopbush":"#d06da1",
		"meteor":"#d07d12",
		"perfume":"#d0bef8",
		"prelude":"#d0c0e5",
		"teagreen":"#d0f0c0",
		"geebung":"#d18f1b",
		"vanilla":"#d1bea8",
		"softamber":"#d1c6b4",
		"celeste":"#d1d2ca",
		"mischka":"#d1d2dd",
		"pear":"#d1e231",
		"hotcinnamon":"#d2691e",
		"rawsienna":"#d27d46",
		"careyspink":"#d29eaa",
		"tan":"#d2b48c",
		"deco":"#d2da97",
		"blueromance":"#d2f6de",
		"gossip":"#d2f8b0",
		"sisal":"#d3cbba",
		"swirl":"#d3cdc5",
		"lightgray":"#d3d3d3",
		"charm":"#d47494",
		"clamshell":"#d4b6af",
		"straw":"#d4bf8d",
		"akaroa":"#d4c4a8",
		"birdflower":"#d4cd16",
		"iron":"#d4d7d9",
		"geyser":"#d4dfe2",
		"hawkesblue":"#d4e2fc",
		"grenadier":"#d54600",
		"cancan":"#d591a4",
		"whiskey":"#d59a6f",
		"winterhazel":"#d5d195",
		"grannyapple":"#d5f6e3",
		"mypink":"#d69188",
		"tacha":"#d6c562",
		"moonraker":"#d6cef6",
		"quillgray":"#d6d6d1",
		"snowymint":"#d6ffdb",
		"newyorkpink":"#d7837f",
		"pavlova":"#d7c498",
		"fog":"#d7d0ff",
		"warmpink":"#d8337f",
		"valencia":"#d84437",
		"palevioletred":"#d87093",
		"japonica":"#d87c63",
		"thistle":"#d8bfd8",
		"maverick":"#d8c2d5",
		"bluewhite":"#d8d8ff",
		"foam":"#d8fcfa",
		"cabaret":"#d94972",
		"burningsand":"#d99376",
		"cameo":"#d9b99b",
		"timberwolf":"#d9d6cf",
		"tana":"#d9dcc1",
		"linkwater":"#d9e4f5",
		"mabel":"#d9f7ff",
		"cerise":"#da3287",
		"flamepea":"#da5b38",
		"bamboo":"#da6304",
		"reddamask":"#da6a41",
		"orchid":"#da70d6",
		"copperfield":"#da8a67",
		"goldengrass":"#daa520",
		"zanah":"#daecd6",
		"iceberg":"#daf4f0",
		"oysterbay":"#dafaff",
		"cranberry":"#db5079",
		"petiteorchid":"#db9690",
		"diserria":"#db995e",
		"alto":"#dbdbdb",
		"frostedmint":"#dbfff8",
		"crimson":"#dc143c",
		"punch":"#dc4333",
		"galliano":"#dcb20c",
		"blossom":"#dcb4bc",
		"wattle":"#dcd747",
		"westar":"#dcd9d2",
		"gainsboro":"#dcdcdc",
		"moonmist":"#dcddcc",
		"caper":"#dcedb4",
		"swansdown":"#dcf0ea",
		"webplum":"#dda0dd",
		"swisscoffee":"#ddd6d5",
		"whiteice":"#ddf9f1",
		"cerisered":"#de3163",
		"roman":"#de6360",
		"tumbleweed":"#dea681",
		"burlywood":"#deb887",
		"goldtips":"#deba13",
		"brandy":"#dec196",
		"wafer":"#decbc6",
		"sapling":"#ded4a4",
		"barberry":"#ded717",
		"berylgreen":"#dee5c0",
		"pattensblue":"#def5ff",
		"heliotrope":"#df73ff",
		"apache":"#dfbe6f",
		"chenin":"#dfcd6f",
		"lola":"#dfcfdb",
		"willowbrook":"#dfecda",
		"chartreuseyellow":"#dfff00",
		"mauve":"#e0b0ff",
		"anzac":"#e0b646",
		"harvestgold":"#e0b974",
		"calico":"#e0c095",
		"babyblue":"#e0ffff",
		"sunglo":"#e16865",
		"equator":"#e1bc64",
		"pinkflare":"#e1c0c8",
		"periglacialblue":"#e1e6d6",
		"kidnapper":"#e1ead4",
		"tara":"#e1f6e8",
		"mandy":"#e25465",
		"terracotta":"#e2725b",
		"goldenbell":"#e28913",
		"shocking":"#e292c0",
		"dixie":"#e29418",
		"lightorchid":"#e29cd2",
		"snuff":"#e2d8ed",
		"mystic":"#e2ebed",
		"applegreen":"#e2f3ec",
		"razzmatazz":"#e30b5c",
		"alizarincrimson":"#e32636",
		"cinnabar":"#e34234",
		"cavernpink":"#e3bebe",
		"peppermint":"#e3f5e1",
		"mindaro":"#e3f988",
		"deepblush":"#e47698",
		"gamboge":"#e49b0f",
		"melanie":"#e4c2d5",
		"twilight":"#e4cfde",
		"bone":"#e4d1c0",
		"sunflower":"#e4d422",
		"grainbrown":"#e4d5b7",
		"zombie":"#e4d69b",
		"frostee":"#e4f6e7",
		"snowflurry":"#e4ffd1",
		"amaranth":"#e52b50",
		"zest":"#e5841b",
		"duststorm":"#e5ccc9",
		"starkwhite":"#e5d7bd",
		"hampton":"#e5d8af",
		"bonjour":"#e5e0e1",
		"mercury":"#e5e5e5",
		"polar":"#e5f9f6",
		"trinidad":"#e64e03",
		"goldsand":"#e6be8a",
		"cashmere":"#e6bea5",
		"doublespanishwhite":"#e6d7b9",
		"satinlinen":"#e6e4d4",
		"weblavender":"#e6e6fa",
		"harp":"#e6f2ea",
		"offgreen":"#e6f8f3",
		"hintofgreen":"#e6ffe9",
		"tranquil":"#e6ffff",
		"mangotango":"#e77200",
		"christine":"#e7730a",
		"tonyspink":"#e79f8c",
		"kobi":"#e79fc4",
		"rosefog":"#e7bcb4",
		"corn":"#e7bf05",
		"putty":"#e7cd8c",
		"graynurse":"#e7ece6",
		"lilywhite":"#e7f8ff",
		"bubbles":"#e7feff",
		"firebush":"#e89928",
		"shilo":"#e8b9b3",
		"pearlbush":"#e8e0d5",
		"greenwhite":"#e8ebe0",
		"chromewhite":"#e8f1d4",
		"gin":"#e8f2eb",
		"aquasqueeze":"#e8f5f2",
		"clementine":"#e96e00",
		"burntsienna":"#e97451",
		"tahitigold":"#e97c07",
		"darksalmon":"#e9967a",
		"oysterpink":"#e9cecd",
		"confetti":"#e9d75a",
		"ebb":"#e9e3e3",
		"ottoman":"#e9f8ed",
		"clearday":"#e9fffd",
		"carissma":"#ea88a8",
		"porsche":"#eaae69",
		"tuliptree":"#eab33b",
		"robroy":"#eac674",
		"raffia":"#eadab8",
		"whiterock":"#eae8d4",
		"panache":"#eaf6ee",
		"solitude":"#eaf6ff",
		"aquaspring":"#eaf9f5",
		"dew":"#eafffe",
		"apricot":"#eb9373",
		"zinnwaldite":"#ebc2af",
		"fuelyellow":"#eca927",
		"ronchi":"#ecc54e",
		"frenchlilac":"#ecc7ee",
		"justright":"#eccdb9",
		"wildrice":"#ece090",
		"fallgreen":"#ecebbd",
		"athsspecial":"#ecebce",
		"starship":"#ecf245",
		"redribbon":"#ed0a3f",
		"tango":"#ed7a1c",
		"carrotorange":"#ed9121",
		"seapink":"#ed989e",
		"tacao":"#edb381",
		"desertsand":"#edc9af",
		"pancho":"#edcdab",
		"chamois":"#eddcb1",
		"primrose":"#edea99",
		"frost":"#edf5dd",
		"aquahaze":"#edf5f5",
		"zumthor":"#edf6ff",
		"narvik":"#edf9f1",
		"honeysuckle":"#edfc84",
		"lavendermagenta":"#ee82ee",
		"beautybush":"#eec1be",
		"chalky":"#eed794",
		"almond":"#eed9c4",
		"flax":"#eedc82",
		"bizarre":"#eededa",
		"doublecolonialwhite":"#eee3ad",
		"palegoldenrod":"#eee8aa",
		"cararra":"#eeeee8",
		"manz":"#eeef78",
		"tahunasands":"#eef0c8",
		"athensgray":"#eef0f3",
		"tusk":"#eef3c3",
		"loafer":"#eef4de",
		"catskillwhite":"#eef6f7",
		"twilightblue":"#eefdff",
		"jonquil":"#eeff9a",
		"riceflower":"#eeffe2",
		"jaffa":"#ef863f",
		"gallery":"#efefef",
		"porcelain":"#eff2f3",
		"lightcoral":"#f08080",
		"mauvelous":"#f091a9",
		"goldendream":"#f0d52d",
		"goldensand":"#f0db7d",
		"buff":"#f0dc82",
		"prim":"#f0e2ec",
		"khaki":"#f0e68c",
		"selago":"#f0eefd",
		"titanwhite":"#f0eeff",
		"aliceblue":"#f0f8ff",
		"feta":"#f0fcea",
		"honeydew":"#f0fff0",
		"webazure":"#f0ffff",
		"golddrop":"#f18200",
		"wewak":"#f19bab",
		"saharasand":"#f1e788",
		"parchment":"#f1e9d2",
		"bluechalk":"#f1e9ff",
		"mintjulep":"#f1eec1",
		"seashell":"#f1f1f1",
		"saltpan":"#f1f7f2",
		"tidal":"#f1ffad",
		"chiffon":"#f1ffc8",
		"flamingo":"#f2552a",
		"tangerine":"#f28500",
		"mandyspink":"#f2c3b2",
		"concrete":"#f2f2f2",
		"blacksqueeze":"#f2fafa",
		"pomegranate":"#f34723",
		"buttercup":"#f3ad16",
		"neworleans":"#f3d69d",
		"vanillaice":"#f3d9df",
		"sidecar":"#f3e7bb",
		"dawnpink":"#f3e9e5",
		"wheatfield":"#f3edcf",
		"canary":"#f3fb62",
		"orinoco":"#f3fbd4",
		"carla":"#f3ffd8",
		"hollywoodcerise":"#f400a1",
		"sandybrown":"#f4a460",
		"saffron":"#f4c430",
		"ripelemon":"#f4d81c",
		"janna":"#f4ebd3",
		"pampas":"#f4f2ee",
		"wildsand":"#f4f4f4",
		"zircon":"#f4f8ff",
		"froly":"#f57584",
		"creamcan":"#f5c85c",
		"manhattan":"#f5c999",
		"maize":"#f5d5a0",
		"wheat":"#f5deb3",
		"sandwisp":"#f5e7a2",
		"potpourri":"#f5e7e2",
		"albescentwhite":"#f5e9d3",
		"softpeach":"#f5edef",
		"ecruwhite":"#f5f3e5",
		"beige":"#f5f5dc",
		"whitesmoke":"#f5f5f5",
		"goldenfizz":"#f5fb3d",
		"australianmint":"#f5ffbe",
		"mintcream":"#f5fffa",
		"frenchrose":"#f64a8a",
		"brilliantrose":"#f653a6",
		"illusion":"#f6a4c9",
		"merino":"#f6f0e6",
		"blackhaze":"#f6f7f7",
		"springsun":"#f6ffdc",
		"violetred":"#f7468a",
		"chileanfire":"#f77703",
		"persianpink":"#f77fbe",
		"rajah":"#f7b668",
		"azalea":"#f7c8da",
		"wepeep":"#f7dbe6",
		"quarterspanishwhite":"#f7f2e1",
		"whisper":"#f7f5fa",
		"snowdrift":"#f7faf7",
		"casablanca":"#f8b853",
		"chantilly":"#f8c3df",
		"cherub":"#f8d9e9",
		"marzipan":"#f8db9d",
		"energyyellow":"#f8dd5c",
		"givry":"#f8e4bf",
		"whitelinen":"#f8f0e8",
		"magnolia":"#f8f4ff",
		"springwood":"#f8f6f1",
		"coconutcream":"#f8f7dc",
		"whitelilac":"#f8f7fc",
		"desertstorm":"#f8f8f7",
		"ghostwhite":"#f8f8ff",
		"texas":"#f8f99c",
		"cornfield":"#f8facd",
		"mimosa":"#f8fdd3",
		"carnation":"#f95a61",
		"saffronmango":"#f9bf58",
		"carouselpink":"#f9e0ed",
		"dairycream":"#f9e4bc",
		"portica":"#f9e663",
		"underagepink":"#f9e6f4",
		"amour":"#f9eaf3",
		"rumswizzle":"#f9f8e4",
		"dolly":"#f9ff8b",
		"sugarcane":"#f9fff6",
		"ecstasy":"#fa7814",
		"websalmon":"#fa8072",
		"tanhide":"#fa9d5a",
		"corvette":"#fad3a2",
		"peachyellow":"#fadfad",
		"turbo":"#fae600",
		"astra":"#faeab9",
		"antiquewhite":"#faebd7",
		"champagne":"#faeccc",
		"linen":"#faf0e6",
		"fantasy":"#faf3f0",
		"citrinewhite":"#faf7d6",
		"lightgoldenrodyellow":"#fafad2",
		"alabaster":"#fafafa",
		"hintofyellow":"#fafde4",
		"milan":"#faffa4",
		"brinkpink":"#fb607f",
		"geraldine":"#fb8989",
		"lavenderrose":"#fba0e3",
		"seabuckthorn":"#fba129",
		"sun":"#fbac13",
		"lavenderpink":"#fbaed2",
		"rosebud":"#fbb2a3",
		"cupid":"#fbbeda",
		"classicrose":"#fbcce7",
		"apricotpeach":"#fbceb1",
		"bananamania":"#fbe7b2",
		"marigoldyellow":"#fbe870",
		"festival":"#fbe96c",
		"sweetcorn":"#fbea8c",
		"candycorn":"#fbec5d",
		"hintofred":"#fbf9f9",
		"shalimar":"#fbffba",
		"shockingpink":"#fc0fc0",
		"ticklemepink":"#fc80a5",
		"treepoppy":"#fc9c1d",
		"lightningyellow":"#fcc01e",
		"pymolwheat":"#fcd1a5",
		"goldenrod":"#fcd667",
		"candlelight":"#fcd917",
		"cherokee":"#fcda98",
		"doublepearllusta":"#fcf4d0",
		"pearllusta":"#fcf4dc",
		"vistawhite":"#fcf8f7",
		"bianca":"#fcfbf3",
		"moonglow":"#fcfeda",
		"chinaivory":"#fcffe7",
		"ceramic":"#fcfff9",
		"torchred":"#fd0e35",
		"wildwatermelon":"#fd5b78",
		"crusta":"#fd7b33",
		"sorbus":"#fd7c07",
		"sweetpink":"#fd9fa2",
		"lightapricot":"#fdd5b1",
		"pigpink":"#fdd7e4",
		"cinderella":"#fde1dc",
		"goldenglow":"#fde295",
		"lemon":"#fde910",
		"oldlace":"#fdf5e6",
		"halfcolonialwhite":"#fdf6d3",
		"drover":"#fdf7ad",
		"paleprim":"#fdfeb8",
		"cumulus":"#fdffd5",
		"persianrose":"#fe28a2",
		"sunsetorange":"#fe4c40",
		"bittersweet":"#fe6f5e",
		"california":"#fe9d04",
		"yellowsea":"#fea904",
		"melon":"#febaad",
		"brightsun":"#fed33c",
		"dandelion":"#fed85d",
		"salomie":"#fedb8d",
		"capehoney":"#fee5ac",
		"remy":"#feebf3",
		"oasis":"#feefce",
		"bridesmaid":"#fef0ec",
		"beeswax":"#fef2c7",
		"bleachwhite":"#fef3d8",
		"pipi":"#fef4cc",
		"halfspanishwhite":"#fef4db",
		"wisppink":"#fef4f8",
		"provincialpink":"#fef5f1",
		"halfdutchwhite":"#fef7de",
		"solitaire":"#fef8e2",
		"whitepointer":"#fef8ff",
		"offyellow":"#fef9e3",
		"orangewhite":"#fefced",
		"red":"#ff0000",
		"rose":"#ff007f",
		"purplepizzazz":"#ff00cc",
		"fuchsia":"#ff00ff",
		"magenta":"#ff00ff",
		"deeppink":"#ff1493",
		"scarlet":"#ff2400",
		"tv_red":"#ff3333",
		"wildstrawberry":"#ff3399",
		"razzledazzlerose":"#ff33cc",
		"radicalred":"#ff355e",
		"redorange":"#ff3f34",
		"coralred":"#ff4040",
		"orangered":"#ff4500",
		"vermilion":"#ff4d00",
		"internationalorange":"#ff4f00",
		"outrageousorange":"#ff6037",
		"tomato":"#ff6347",
		"blazeorange":"#ff6600",
		"pinkflamingo":"#ff66ff",
		"orange":"#ff681f",
		"hotpink":"#ff69b4",
		"persimmon":"#ff6b53",
		"deepsalmon":"#ff6b6b",
		"blushpink":"#ff6fff",
		"burningorange":"#ff7034",
		"pumpkin":"#ff7518",
		"flamenco":"#ff7d07",
		"flushorange":"#ff7f00",
		"coral":"#ff7f50",
		"pymolviolet":"#ff7fff",
		"darkorange":"#ff8c00",
		"tv_orange":"#ff8c26",
		"salmon":"#ff8c69",
		"pizazz":"#ff9000",
		"westside":"#ff910f",
		"pinksalmon":"#ff91a4",
		"neoncarrot":"#ff9933",
		"atomictangerine":"#ff9966",
		"vividtangerine":"#ff9980",
		"pymolsalmon":"#ff9999",
		"sunshade":"#ff9e2c",
		"orangepeel":"#ffa000",
		"lightsalmon":"#ffa07a",
		"monalisa":"#ffa194",
		"weborange":"#ffa500",
		"pymolpink":"#ffa5d8",
		"carnationpink":"#ffa6c9",
		"hitpink":"#ffab81",
		"yelloworange":"#ffae42",
		"cornflowerlilac":"#ffb0ac",
		"sundown":"#ffb1b3",
		"brightorange":"#ffb233",
		"mysin":"#ffb31f",
		"texasrose":"#ffb555",
		"lightpink":"#ffb6c1",
		"cottoncandy":"#ffb7d5",
		"macaroniandcheese":"#ffb97b",
		"selectiveyellow":"#ffba00",
		"koromiko":"#ffbd5f",
		"amber":"#ffbf00",
		"pymollightpink":"#ffbfdd",
		"waxflower":"#ffc0a8",
		"pink":"#ffc0cb",
		"yourpink":"#ffc3c0",
		"supernova":"#ffc901",
		"flesh":"#ffcba4",
		"sunglow":"#ffcc33",
		"goldentainoi":"#ffcc5c",
		"lightorange":"#ffcc7f",
		"peachorange":"#ffcc99",
		"chardonnay":"#ffcd8c",
		"pastelpink":"#ffd1dc",
		"romantic":"#ffd2b7",
		"grandis":"#ffd38c",
		"gold":"#ffd700",
		"schoolbusyellow":"#ffd800",
		"cosmos":"#ffd8d9",
		"peachpuff":"#ffdab9",
		"mustard":"#ffdb58",
		"peachschnapps":"#ffdcd6",
		"pymolyelloworange":"#ffdd5e",
		"caramel":"#ffddaf",
		"tuftbush":"#ffddcd",
		"watusi":"#ffddcf",
		"pinklace":"#ffddf4",
		"navajowhite":"#ffdead",
		"frangipani":"#ffdeb3",
		"pippin":"#ffe1df",
		"palerose":"#ffe1f2",
		"negroni":"#ffe2c5",
		"moccasin":"#ffe4b5",
		"bisque":"#ffe4c4",
		"mistyrose":"#ffe4e1",
		"creambrulee":"#ffe5a0",
		"peach":"#ffe5b4",
		"tequila":"#ffe6c7",
		"kournikova":"#ffe772",
		"sandybeach":"#ffeac8",
		"karry":"#ffead4",
		"blanchedalmond":"#ffebcd",
		"broom":"#ffec13",
		"colonialwhite":"#ffedbc",
		"derby":"#ffeed8",
		"visvis":"#ffefa1",
		"eggwhite":"#ffefc1",
		"papayawhip":"#ffefd5",
		"fairpink":"#ffefec",
		"peachcream":"#fff0db",
		"lavenderblush":"#fff0f5",
		"gorse":"#fff14f",
		"buttermilk":"#fff1b5",
		"pinklady":"#fff1d8",
		"forgetmenot":"#fff1ee",
		"tutu":"#fff1f9",
		"picasso":"#fff39d",
		"chardon":"#fff3f1",
		"parisdaisy":"#fff46e",
		"barleywhite":"#fff4ce",
		"eggsour":"#fff4dd",
		"sazerac":"#fff4e0",
		"serenade":"#fff4e8",
		"chablis":"#fff4f3",
		"seashellpeach":"#fff5ee",
		"sauvignon":"#fff5f3",
		"milkpunch":"#fff6d4",
		"varden":"#fff6df",
		"rosewhite":"#fff6f5",
		"bajawhite":"#fff8d1",
		"cornsilk":"#fff8dc",
		"ginfizz":"#fff9e2",
		"earlydawn":"#fff9e6",
		"lemonchiffon":"#fffacd",
		"floralwhite":"#fffaf0",
		"bridalheath":"#fffaf4",
		"snow":"#fffafa",
		"scotchmist":"#fffbdc",
		"soapstone":"#fffbf9",
		"witchhaze":"#fffc99",
		"butterywhite":"#fffcea",
		"islandspice":"#fffcee",
		"cream":"#fffdd0",
		"chileanheath":"#fffde6",
		"travertine":"#fffde8",
		"orchidwhite":"#fffdf3",
		"quarterpearllusta":"#fffdf4",
		"halfandhalf":"#fffee1",
		"apricotwhite":"#fffeec",
		"ricecake":"#fffef0",
		"blackwhite":"#fffef6",
		"romance":"#fffefd",
		"yellow":"#ffff00",
		"tv_yellow":"#ffff33",
		"laserlemon":"#ffff66",
		"paleyellow":"#ffff7f",
		"palecanary":"#ffff99",
		"portafino":"#ffffb4",
		"lightyellow":"#ffffe0",
		"ivory":"#fffff0",
		"white":"#ffffff"
	};
	if (color) {
		var newcolorH = color.match(/#[\dABCDEFabcdef]{6,6}$/);
		if ((newcolorH  !=null) && newcolorH[0].length === 7){
			return newcolorH[0];
		} else if (typeof colors[color.toLowerCase().replace(/\s+/g, '')] != 'undefined'){
			return colors[color.toLowerCase().replace(/\s+/g, '')];
		} else {
			console.log('Unrecognized color "' + color + '"');
			//return false;
			return '#868686';
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
				//rvDataSets[0].BasePairs = new BasePairs;
				//rvDataSets[0].BasePairs.addBasePairs(basePairs2);
				
				rvDataSets[0].BasePairs = basePairs2;
				$.each(rvDataSets[0].BasePairs, function (ind, item) {
					item.lineWidth = 1;
					item.opacity = 0.5;
				});
				
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
		} else if (onebuttonmode == "color" || (event.which == 2 && event.altKey == false) || (event.which == 1 && event.ctrlKey == true && event.altKey == false)) {
			$("#canvasDiv").off("mousemove", dragHandle);
			//$("#canvasDiv").unbind("mousemove", mouseMoveFunction);
			colorResidue(event);
		} else if (onebuttonmode == "colorL" || (event.which == 2 && event.altKey == true) || (event.which == 1 && event.ctrlKey == true && event.altKey == false)) {
			$("#canvasDiv").off("mousemove", dragHandle);
			colorLine(event);
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
		case "colorL":
			return;
			break;
		case "select":
			return;
			break;
		case "move":
			if (event.altKey == true && event.ctrlKey == false){
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
			} else if (event.ctrlKey == true && event.altKey == false) {
				var sel = getSelected(event);
				if (sel >=0) {
					var targetLayer=rvDataSets[0].getSelectedLayer();
					switch (targetLayer.Type){
						case "residues" : 
							rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#000000";
							rvDataSets[0].HighlightLayer.CanvasContext.font = rvDataSets[0].SpeciesEntry.Font_Size_Canvas + 'pt "Myriad Pro", Calibri, Arial';
							rvDataSets[0].HighlightLayer.CanvasContext.textBaseline = "middle";
							rvDataSets[0].HighlightLayer.CanvasContext.textAlign = "center";
							rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = colorNameToHex($("#MainColor").val());
							rvDataSets[0].HighlightLayer.CanvasContext.fillText(rvDataSets[0].Residues[sel].resName, rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y);
							break;
						case "circles" :
							rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
							rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, (targetLayer.ScaleFactor * rvDataSets[0].SpeciesEntry.Circle_Radius), 0, 2 * Math.PI, false);
							rvDataSets[0].HighlightLayer.CanvasContext.closePath();
							rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = colorNameToHex($("#MainColor").val());
							rvDataSets[0].HighlightLayer.CanvasContext.stroke();
							if (targetLayer.Filled) {
								rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = colorNameToHex($("#MainColor").val());
								rvDataSets[0].HighlightLayer.CanvasContext.fill();
							}
							break;
						default :
					}
				}
			} else if ( event.ctrlKey == true && event.altKey == true) {
				var seleLine = getSelectedLine(event);
				if(seleLine >=0 ){
					var j = rvDataSets[0].BasePairs[seleLine].resIndex1;
					var k = rvDataSets[0].BasePairs[seleLine].resIndex2;
					rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = colorNameToHex($("#LineColor").val());
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
			} else {
				var sel = getSelected(event);
				if (sel >=0){
					rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
					rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, 1.176 * rvDataSets[0].SpeciesEntry.Circle_Radius, 0, 2 * Math.PI, false);
					rvDataSets[0].HighlightLayer.CanvasContext.closePath();
					rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
					rvDataSets[0].HighlightLayer.CanvasContext.lineWidth=rvDataSets[0].SpeciesEntry.Circle_Radius/1.7;
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
						rvDataSets[0].HighlightLayer.CanvasContext.font = rvDataSets[0].SpeciesEntry.Font_Size_Canvas + 'pt "Myriad Pro", Calibri, Arial';
						rvDataSets[0].HighlightLayer.CanvasContext.textBaseline = "middle";
						rvDataSets[0].HighlightLayer.CanvasContext.textAlign = "center";
						rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = colorNameToHex($("#MainColor").val());
						rvDataSets[0].HighlightLayer.CanvasContext.fillText(rvDataSets[0].Residues[sel].resName, rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y);
						break;
					case "circles" :
						rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
						rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, (targetLayer.ScaleFactor * rvDataSets[0].SpeciesEntry.Circle_Radius), 0, 2 * Math.PI, false);
						rvDataSets[0].HighlightLayer.CanvasContext.closePath();
						rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = colorNameToHex($("#MainColor").val());
						rvDataSets[0].HighlightLayer.CanvasContext.stroke();
						if (targetLayer.Filled) {
							rvDataSets[0].HighlightLayer.CanvasContext.fillStyle = colorNameToHex($("#MainColor").val());
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

function colorLineSelection(event) {
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
						updateModel();
						update3Dcolors();
						if($('input[name="jp"][value=on]').is(':checked')){
							var a = rvSaveState.rvJmolOrientation.match(/reset[^\n]+/);
							Jmol.script(myJmol, a[0]);
						}
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
					$("#FileDiv").find(".DataDescription").html(rvDataSets[0].CustomData[0]["DataDescription"]);
					$("#CustomDataBubbles").find(".dataBubble").attr("title",rvDataSets[0].CustomData[0]["DataDescription"].replace(/(<([^>]+)>)/ig,""));
				} else {
					$("#FileDiv").find(".DataDescription").html("Data Description is missing.");
				}
				$("#CustomDataBubbles").find(".dataBubble").attr("FileName",FileReaderFile[0].name);
				//Add Custom Lines support here. 
				if($.inArray("Residue_i", customkeys) >= 0) {
					if ($.inArray("Residue_j", customkeys) >= 0){
						var FullBasePairSet =[];
						$.each(rvDataSets[0].CustomData, function (index,value){
							FullBasePairSet.push({
								bp_type: value.Int_Type,
								color: "rgba(35,31,32,.5)",
								id: (index + 1).toString(),
								pairIndex: (index + 1).toString(),
								resIndex1 : resNumToIndex(value.Residue_i).toString(),
								resIndex2 : resNumToIndex(value.Residue_j).toString()
							});
						});
						rvDataSets[0].BasePairs=FullBasePairSet;
						var targetLayer = rvDataSets[0].getLayerByType("lines");
						targetLayer[0].DataLabel = FileReaderFile[0].name;
						$("[name=" + targetLayer[0].LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer[0].DataLabel);
						rvDataSets[0].drawBasePairs("lines");
					} else {
						alert("Expected Residue_j column. Please check input.");
					}
				}
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

function resNumToIndex(FullResNum){
	var comsplit = FullResNum.split(":");
	var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
	var aloneRes = chainID + "_" + comsplit[1];
	var alone_ind = rvDataSets[0].ResidueList.indexOf(aloneRes);
	return alone_ind;
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
	//Make new selection invisible. 
	$(".oneSelectionGroup[name=" + targetSelection.Name +"]").find(".checkBoxDIV-S").find(".visibilityCheckImg").attr("value","invisible");
	$(".oneSelectionGroup[name=" + targetSelection.Name +"]").find(".checkBoxDIV-S").find(".visibilityCheckImg").attr("src","images/invisible.png");
	rvDataSets[0].drawSelection("selected");
	
	if ($.inArray("ColorPalette", customkeys) >= 0){
	    var colors=[];
		//console.log(rvDataSets[0].CustomData[0].ColorPalette);
		$.each(rvDataSets[0].CustomData, function (index,value){
			if (value.ColorPalette !="") {
				colors.push(value.ColorPalette);
			} else {
				return;
			}
		});
		//Assume if length one, user mean to name a predefined gradient.
		if (colors.length == 1){
			var colors = window[colors[0]];
		}
		//console.log(colors);
	} else {
		var colors = RainBowColors;
	}
	
	if (targetLayer.Type === "selected"){

	} else {
		if ($.inArray("ColorCol", customkeys) >= 0) {
			rvDataSets[0].drawResidues("residues");
			rvDataSets[0].refreshResiduesExpanded(targetLayer.LayerName);
			update3Dcolors();
		} else if ($.inArray("DataCol", customkeys) >= 0) {
			colorProcess(NewData,undefined,targetLayer,colors);
		} else {
			alert("No recognized columns found. Please check input.");
		}
	}

	updateSelectionDiv(targetSelection.Name);
	drawNavLine();
	
	//Finishes doing Nucleotides, move on to rProteins
	CustomProcessProteins(colors);
	
	
}
function CustomProcessProteins(colors){
	var rProtein=undefined;
	var customkeys = Object.keys(rvDataSets[0].CustomData[0]);
	var NewData = [];
	var ColorProteins=new Array;
	for (var ii = 0; ii < rvDataSets[0].CustomData.length; ii++) {
		var command = rvDataSets[0].CustomData[ii]["resNum"];
		var targetSelection = rvDataSets[0].Selections[0];
		var rProtein = expandSelection([command], targetSelection.Name);
		if (rProtein){
			if ($.inArray("DataCol", customkeys) >= 0) {
				ColorProteins.push({ResNum : rProtein, Color : undefined});
				if (isNaN(parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]))){
					NewData.push(rvDataSets[0].CustomData[ii]["DataCol"]);
				} else {
					NewData.push(parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]));
				}
			} else if ($.inArray("ColorCol", customkeys) >= 0) {
				ColorProteins.push({ResNum : rProtein, Color : rvDataSets[0].CustomData[ii]["ColorCol"]});
			}
		}
	}
	var dataIndices = colorProcess(NewData,undefined,undefined,colors,true);
	$.each(dataIndices, function (index,value){
		ColorProteins[index]["Color"] = colors[value];
	});
	ColorProteinsJmol(ColorProteins);
	rvDataSets[0].ColorProteins = rvDataSets[0].ColorProteins.concat(ColorProteins);
}
function ColorProteinsJmol(ColorProteins){
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	if (rvDataSets[0].Residues[0] == undefined){return};
	
	var script = "set hideNotSelected false;";
	$.each(ColorProteins, function (index,value){
		var ressplit = value.ResNum.split("_");
		if (ressplit[0] !== "undefined"){
			if (colorNameToHex(value.Color).indexOf("#") == -1) {
				script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + ressplit[0] + " and " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "; color Cartoon opaque [x" + value.Color + "]; ";
			} else {
				script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + ressplit[0] + " and " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "; color Cartoon opaque [" + value.Color.replace("#", "x") + "]; ";
			}
		}
	});
	
	Jmol.script(myJmol, script);
}

function ColorProteinsPyMOL(PDB_Obj_Names){
	var ColorProteins = rvDataSets[0].ColorProteins;
	if (rvDataSets[0].Residues[0] == undefined){return};
	
	var script = "";
	
	// Protein Section
	for (var jj = 0; jj < rvDataSets[0].SpeciesEntry.SubunitProtChains[0].length; jj++) {
		script += "copy " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][jj].replace(/\(/g, "_").replace(/\)/g, "") + "_custom, " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][jj].replace(/\(/g, "_").replace(/\)/g, "") + "\n";
	}
	
	$.each(ColorProteins, function (index,value){
		var ressplit = value.ResNum.split("_");
		if (ressplit[0] !== "undefined"){
			var curr_color = value.Color;
				var h = rvDataSets[0].SpeciesEntry.SubunitProtChains[1].indexOf(ressplit[0]);
				//if (colorNameToHex(curr_color).indexOf("#") == -1) {
					//script += "color " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + ressplit[0] + " and " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "; color Cartoon opaque [x" + value.Color + "]; ";
					script += "color " + curr_color.replace("#", "0x") + ", " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][h].replace(/\(/g,"_").replace(/\)/g,"") + "_custom" +
						" and resi " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "\n";
				//} else {
					//script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + ressplit[0] + " and " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "; color Cartoon opaque [" + value.Color.replace("#", "x") + "]; ";
				//}
		}
	});
	
	/*
	Jmol.script(myJmol, script);*/
	script += "\ndisable *rp*\n";
	return script;
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
	if($.inArray("resNum", customkeys) >= 0){
		for (var ii = 0; ii < rvDataSets[0].CustomData.length; ii++) {
			var command = rvDataSets[0].CustomData[ii]["resNum"].split(";");
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
						targetLayer.dataLayerColors[k] = colorNameToHex(rvDataSets[0].CustomData[ii]["ColorCol"]);
					}
					SeleLen = l;
				}
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
		script += "set bg_rgb, white\nset seq_view_label_color, hydrogen\nunset ignore_case\n";
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
		script += "\n";
		
		//Proteins to PyMOL
		script += proteinsToPML(PDB_Obj_Names);
		script += "\n";
		
		//Proteins to PyMOL (Custom)
		script += ColorProteinsPyMOL(PDB_Obj_Names);
		script += "\n";
		
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
	var r0,r1,curr_chain,curr_color;
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
					
					if (r0 === r1){
						if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
							script += "color 0x" + curr_color + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "\n";
						} else {
							script += "color " + curr_color.replace("#", "0x") + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "\n";
						}
					} else {
						if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
							script += "color 0x" + curr_color + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + r1 + "\n";
						} else {
							script += "color " + curr_color.replace("#", "0x") + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + r1 + "\n";
						}
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
		script += "create " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][jj].replace(/\(/g, "_").replace(/\)/g, "") + ", " + PDB_Obj_Names[1] + " and chain " + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][jj].replace(/\(/g, "_").replace(/\)/g, "") + "\n";
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
	var PyMOL_obj = "RV_Sele_" + targetSelection.Name;
	var r0,r1,curr_chain;
	var DoneNow=false;
	if (rvDataSets[0].Residues[0] == undefined){return};
	
	script += "create " + PyMOL_obj + ", " + "resi 0\n";
	
	var SeleResidues=targetSelection.Residues.sort(function (a, b) {;
		return (Number(a.map_Index) - Number(b.map_Index));
	});
		
	r0 = SeleResidues[0].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
	curr_chain = SeleResidues[0].ChainID;
	for (var i = 1; i < SeleResidues.length; i++) {
		var residue = SeleResidues[i];
		var residueLast = SeleResidues[i - 1];
		
		if (residue.ChainID != "") {
			if (curr_chain == "") {
				curr_chain = residue.ChainID;
				r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
			} else if (residue.ChainID == null) {
				curr_chain = residue.ChainID;
				r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
			} else {
				if ((residue.map_Index - residueLast.map_Index > 1 ) || (curr_chain != residue.ChainID) || (i == (SeleResidues.length - 1))) {
					if ((i == (SeleResidues.length - 1)) && (curr_chain == residue.ChainID) && (residue.map_Index - residueLast.map_Index == 1 )){
						r1 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
						DoneNow=true;
					} else {
						r1 = residueLast.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
					}
					
					if (r0 === r1){
						script += "create " + PyMOL_obj + ", " + PyMOL_obj + " or (" + PDB_Obj_Names[0] + " and chain " + curr_chain + " and resi " + r0 + ")\n";
					} else {
						script += "create " + PyMOL_obj + ", " + PyMOL_obj + " or (" + PDB_Obj_Names[0] + " and chain " + curr_chain + " and resi " + r0 + "-" + r1 + ")\n";
					}
											
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
					if (residue.ChainID != "") {
						curr_chain = residue.ChainID;
					}
				}
			}
		}
	}
	if(!DoneNow){
		script += "create " + PyMOL_obj + ", " + PyMOL_obj + " or (" + PDB_Obj_Names[0] + " and chain " + curr_chain + " and resi " + r0 + ")\n";
	}
	script += "color " + targetSelection.Color.replace("#", "0x") + ", " + PyMOL_obj + "\n\n";
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
	//if(rvDataSets[0].Name === 'SC_LSU_3D'){;
	var elReq = $.ajax({
		url: "images/" + rvDataSets[0].Name + "_ExtraLabels.svg",
		dataType: "text", 
		cache: false,
		async: false
	 });
	 
	elReq.done(function (data) {
		output = output + data;
	});
		
	//}
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
					} else if (value.ColorLayer === "manual_coloring") {
						for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
							var BasePair = rvDataSets[0].BasePairs[j];
							output = output + '<line fill="none" stroke="' + BasePair.color_hex + '" stroke-opacity="' + BasePair.opacity + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
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
					var xcorr = -0.439 * parseFloat(rvDataSets[0].SpeciesEntry.Font_Size_SVG) + 0.4346; // magic font corrections.
					var ycorr = 0.2944 * parseFloat(rvDataSets[0].SpeciesEntry.Font_Size_SVG) - 0.0033;
					//console.log(xcorr,ycorr);
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						var residue = rvDataSets[0].Residues[i];
						output = output + '<text id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" transform="matrix(1 0 0 1 ' + (parseFloat(residue.X) + xcorr).toFixed(3) + ' ' + (parseFloat(residue.Y) + ycorr).toFixed(3) + ')" fill="' + residue.color + '" font-family="Myriad Pro" font-size="' + rvDataSets[0].SpeciesEntry.Font_Size_SVG + '">' + residue.resName + '</text>\n';
					}
					output = output + '</g>\n';
					break;
				case "circles":
					output = output + '<g id="' + value.LayerName + '">\n';
					var radius = rvDataSets[0].SpeciesEntry.Circle_Radius * value.ScaleFactor;
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
					var radius = rvDataSets[0].SpeciesEntry.Circle_Radius * value.ScaleFactor;
					
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
		hiddenField.setAttribute("value", "\ufeff" + ST);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function computeSeqDataTable(){
	var WholeSet="";
	var OutputString="";
	var WholeSet= WholeSet + "WholeSet,WholeSet\n";
	var WholeSet= WholeSet + "resNum,resName\n";
	$.each(rvDataSets[0].Residues, function (index,residue) {
		WholeSet+= rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(residue.ChainID)] + ":" + residue.resNum.replace(/[^:]*:/g, "") + "," + residue.resName + "\n";
	});
	var OutputObject = $.csv.toArrays(WholeSet);
	$.each(rvDataSets[0].Layers, function (index, targetLayer) {
		if (targetLayer.Data.length >0){
			if (targetLayer.Type == "lines"){
				/*$.each(targetLayer.Data, function (index, data) {
					OutputObject[2+index].push(data);
				});*/
			} else {
				OutputObject[0].push(targetLayer.LayerName);
				OutputObject[1].push('"' + targetLayer.DataLabel.replace(/,/g,'\\comma\\') + '"'); // Come back and solve this comma,tab nonsense.
				$.each(targetLayer.Data, function (index, data) {
					OutputObject[2+index].push(data);
				});
			}
		}
	});
	
	$.each(OutputObject, function (index, outputline){
		OutputString+=outputline.toString() + "\n";
	});
	
	return OutputString.replace(/,/g,'\t').replace(/\\comma\\/g,',');
}
function computeInteractionDataTable(){
	var WholeSet="";
	var WholeSet= WholeSet + "Residue_i,ResidueName_i,Residue_j,ResidueName_j,Int_Type\n";
	//var WholeSet= WholeSet + "resNum,resName,resNum,resName,bp_type\n";
	
	$.each(rvDataSets[0].BasePairs, function (index,basepair) {
		var j = basepair.resIndex1;
		var k = basepair.resIndex2;
		
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
	
		WholeSet+= ResName1 + "," + rvDataSets[0].Residues[j].resName + "," + ResName2 + "," + rvDataSets[0].Residues[k].resName + "," + basepair.bp_type + "\n";
	});
	
	return WholeSet.replace(/,/g,'\t');
}
function saveInteractionDataTable(){
	AgreeFunction = function () {
		var SDT = computeInteractionDataTable();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveInteractionDataTable.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", "\ufeff" + SDT);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}
function saveSeqDataTable(){
	AgreeFunction = function () {
		var SDT = computeSeqDataTable();
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveSeqDataTable.php");
		form.setAttribute("target", "_blank");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", "\ufeff" + SDT);
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
		var h = (rvDataSets[0].SpeciesEntry.Orientation == "portrait") ? 779 : 612;
		var d = new Date();
		var df;
		
		var x = 10;
		var y = h - 20;
		var Message = "A " + rvDataSets[0].SpeciesEntry.MapType + " secondary structure, generated by RiboVision.";
		var df = d.toLocaleString().indexOf("G");
		var LabelLayers = rvDataSets[0].getLayerByType("labels");
		var targetLayer = LabelLayers[0];
		targetLayer.CanvasContext.textAlign = 'left';
		targetLayer.CanvasContext.font = '10pt "Myriad Pro", Calibri, Arial';
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
	document.getElementById('lineOpacity').innerHTML = "Line Opacity: " + Math.round(opacity * 100) + "%";
	$.each(rvDataSets[0].BasePairs, function (ind, item) {
		item.opacity = opacity;
	});
	rvDataSets[0].drawBasePairs("lines");
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
			.attr("transform", "translate(0," + (h - MarginYB) + ")")
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
	
	var w = 192;
	var h = 128;
	
	//var barPadding = 10;
	var barPaddingPer = 20;
	//var Xoffset = 40;
	//var padding = 30;
	//var Xpadding = 30;
	var barColors = ["green","blue","black","red","orange"];
	
	//Remove old SVG
	d3.select("#ResidueTipContent svg").remove();
	
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
	var rn = rvDataSets[0].Residues[ResIndex].resNum.split(":");
	if (rn.length < 2 ){
		$('#resName').html(rvDataSets[0].Residues[ResIndex].resName + rvDataSets[0].Residues[ResIndex].resNum +
			" (" + rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[ResIndex].ChainID)] + " rRNA)");
	} else {
		$('#resName').html(rvDataSets[0].Residues[ResIndex].resName + rn[1] +
			" (" + rn[0] + " rRNA)");
	}
	$('#conSeqLetter').html("Consensus: " + ConsensusSymbol);
	$('#activeData').html("Selected Data: " + targetLayer.Data[ResIndex]);
	$("#conPercentage").html("Shannon Entropy: " + Hn);
	
	function drawConGraph(){
		
		//Create SVG element
		var svg = d3.select("#ResidueTipContent")
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
	
	var targetLayer = rvDataSets[0].getLayerByType("lines");
	
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
	$('#BasePairType').html("Interaction Type: " +  targetLayer[0].DataLabel);
	if (rvDataSets[0].BasePairs[SeleLine].ProteinName){
		$('#BasePairSubType').html("Interaction Subtype: " + rvDataSets[0].BasePairs[SeleLine].ProteinName + " " + rvDataSets[0].BasePairs[SeleLine].bp_type);
	} else {
		$('#BasePairSubType').html("Interaction Subtype: " + rvDataSets[0].BasePairs[SeleLine].bp_type);
	}
	
	addPopUpWindowResidue(j);
	$("#iResidueTipA").html($("#residuetip").find("#ResidueTipContent").html());
	addPopUpWindowResidue(k);
	$("#iResidueTipB").html($("#residuetip").find("#ResidueTipContent").html());
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
		var RSL = localStorage["RV_Session_List"];
		if(RSL){
			var RSLa = JSON.parse(RSL);
			RSLa.push(SaveStateFileName);
			var RSLaU;
			RSLaU = $.grep(RSLa, function (v, k) {
				return $.inArray(v, RSLa) === k;
			});
			localStorage.setItem("RV_Session_List",JSON.stringify(RSLaU));
		} else {
			localStorage.setItem("RV_Session_List",JSON.stringify([SaveStateFileName]));
		}
		$("#SessionList").text(localStorage["RV_Session_List"].replace(/[\[\]"]/g,"").replace(/,/g,", "));
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
		$.each(rvDataSets[0].Selections, function (key, value){
			updateSelectionDiv(value.Name);
		});
		rvDataSets[0].drawSelection("selected");
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
}

function rvSaveManager(rvAction,rvLocation) {
	var SaveStateFileName = $("#SaveStateFileName").val();
	
	switch (rvAction) {
		case "Save":
			switch (rvLocation) {
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
					alert("shouldn't happen right now");
			}
			break;
		case "Restore":
			switch (rvLocation) {
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
					alert("shouldn't happen right now");
			}
			break;
		default: 
			alert("shouldn't happen right now");
		}
}

function processRvState(rvSaveState) {
	if($("input[name='LayersCheck']").attr("checked")){
		var data = JSON.parse(rvSaveState.rvLayers);
		rvDataSets[0].Layers=[];
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
		//remove minilayers
		$(".miniLayerName").remove();
		// Put in Layers
		$.each(rvDataSets[0].Layers, function (key, value){
			LayerMenu(value, key);
		});
		RefreshLayerMenu();
		
		$(".oneLayerGroup" + "[name=" + selectedLayer.LayerName + "]").find(".selectLayerRadioBtn").attr("checked","checked");
		rvDataSets[0].selectLayer(selectedLayer.LayerName);
		$(".oneLayerGroup" + "[name=" + linkedLayer.LayerName + "]").find(".mappingRadioBtn").attr("checked","checked");
		rvDataSets[0].linkLayer(linkedLayer.LayerName);
		
		//Refresh Linked MiniLayer
		var linkedLayer = rvDataSets[0].getLinkedLayer();
		$("#LinkSection").find(".miniLayerName").remove();
		$("#LinkSection").append($('<h3 class="miniLayerName ui-helper-reset ui-corner-all ui-state-default ui-corner-bottom ">')
		.text(linkedLayer.LayerName).attr('name',linkedLayer.LayerName).droppable({
			drop: function (event,ui) {
				ProcessBubbleDrop(event,ui);
			}
		}));
		var	targetLayer=rvDataSets[0].getLayerByType("lines");
		rvDataSets[0].BasePairs=targetLayer[0].Data;
	}
	if($("input[name='SelectionsCheck']").attr("checked")){
		rvDataSets[0].Selections = JSON.parse(rvSaveState.rvSelections);
		$(".oneSelectionGroup").remove();
		// Put in Selections
		$.each(rvDataSets[0].Selections, function (key, value){
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