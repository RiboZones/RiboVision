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


// Build Selection Menu

// Put in Top Labels and ToolBar
$("#SelectionPanel").prepend($("<div id='topBarS'>").attr({
		'name' : 'TopSelectionBar'
	}).html("C&nbspV&nbsp&nbsp&nbspS&nbsp&nbsp&nbsp&nbspL&nbsp&nbspSelectionName&nbsp")); // where to add letters
$('[name=TopSelectionBar]').append($('<button id="newSelection" class="toolBarBtn2" title="Create a new selection"></button>'));
$('[name=TopSelectionBar]').append($('<button id="clearSelection" class="toolBarBtn2" title="Clear the selected selection"></button>'));
$('[name=TopSelectionBar]').append($('<button id="deleteSelection" class="toolBarBtn2" title="Delete the selected selection"></button>'));
$("#newSelection").button({
	text : false,
	icons : {
		primary : "ui-icon-document"
	}
});

$("#newSelection").click(function () {
	$("#dialog-addSelection").dialog("open");
});

$("#clearSelection").button({
	text : false,
	icons : {
		primary : "ui-icon-cancel"
	}
});

$("#clearSelection").click(function () {
	//$("#dialog-addSelection").dialog("open");
});

$("#deleteSelection").button({
	text : false,
	icons : {
		primary : "ui-icon-trash"
	}
});

$("#deleteSelection").click(function (event) {
	$("#dialog-confirm-delete-S p").text("The " + $('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name') + " selection will be permanently deleted and cannot be recovered.");
	$("#dialog-confirm-delete-S").dialog('open');
});

/*
// Put in Layers
$.each(rvDataSets[0].Layers, function (key, value){
	LayerMenu(value, key);
});

//Accordion that support multiple sections open
$("#LayerPanel").multiAccordion();
$("#LayerPanel").sortable({
	update : function (event, ui) {
		$("#LayerPanel .layerContent").each(function (e, f) {
			//$(this).find('p').text(rvDataSets[0].LastLayer - e - 1);
			$("#" + $(this).parent().find('h3').text()).css('zIndex', rvDataSets[0].LastLayer - e - 1)
			
		});
		rvDataSets[0].sort();
	},
	items : ".oneLayerGroup"
	
});
$("#LayerPanel").disableSelection();

//RefreshLayerMenu();
*/
///////////////////////// Add Selection Dialog ////////////////////////////////
$("#dialog-addSelection").dialog({
	resizable : false,
	autoOpen : false,
	height : "auto",
	width : 400,
	modal : true,
	buttons : {
		"Create New Selection" : function () {
			var namecheck = $("#newSelectionName").val().match(/[A-z][\w-_:\.]*/);
			if (namecheck[0].length === $("#newSelectionName").val().length && $("#newSelectionName").val().length <= 16){
				if (rvDataSets[0].isUniqueSelection($("#newSelectionName").val())){
					//$("#canvasDiv").append($('<canvas id="' + $("#newLayerName").val() + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 ) + ';"></canvas>')); 
					//resizeElements();
					rvDataSets[0].addSelection($("#newSelectionName").val(),[],$("#selectionColor2").val());
					SelectionMenu(rvDataSets[0].getSelection($("#newSelectionName").val()));
					RefreshSelectionMenu();
					$(this).dialog("close");
				} else {
					$( "#dialog-unique-selection-error" ).dialog("open");
				}
				$(this).dialog("close");
			} else {
				$( "#dialog-name-error" ).dialog("open");
			}
		},
		Cancel: function (){
			$(this).dialog("close");
		}
	},
	open : function () {
		$("#jmolApplet0").css("visibility", "hidden");
		$("#newSelectionName").val("Selection_" + (rvDataSets[0].Selections.length + 1));
	},
	close : function () { 
		$("#jmolApplet0").css("visibility", "visible");
	}
});
$("#dialog-addSelection p").append("Not done yet." + 
	"<br><br>Please enter a name for the new Selection.");

	///////////////////////// Delete Selection Dialog ////////////////////////////////
$("#dialog-confirm-delete-S").dialog({
	resizable : false,
	autoOpen : false,
	height : "auto",
	width : 400,
	modal : true,
	buttons : {
		"Delete the Selection" : function (event) {
			$("[name=" + $('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name') + "]").remove();
			rvDataSets[0].deleteSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
			rvDataSets[0].drawSelection("selected");
			$(this).dialog("close");
		},
		Cancel : function () {
			$(this).dialog("close");
		}
	},
	open : function (event) {
		$("#jmolApplet0").css("visibility", "hidden");
	},
	close : function () { 
		$("#jmolApplet0").css("visibility", "visible");
	}
});

$("#newSelectionName").button().addClass('ui-textfield').keydown(function (event) {
	if (event.keyCode == 13) {
		$("#dialog-addSelection").dialog("option", "buttons")['Create New Selection'].apply($("#dialog-addSelection"));
	}
});

$("#selectionNameInput").button().addClass('ui-textfield').keydown(function (event) {
	if (event.keyCode == 13) {
		changeCurrentSelectionName();
	}
});
	
$("#selectionColorPicker").farbtastic("#selectionColor");
$("#selectionColorPicker2").farbtastic("#selectionColor2");



function SelectionMenu(targetSelection, key, RVcolor) {
	
	$currentSelectionName = targetSelection.Name;
	$('[name=TopSelectionBar]').after(($("<div>").addClass("oneSelectionGroup").attr({
		'name' : $currentSelectionName
	})));
	
	//This is necessary because if just use $('.oneSelectionGroup'), then duplicated layers will be added to different groups
	$currentGroup = document.getElementsByName($currentSelectionName);
	
	//adding color box
	$($currentGroup)
	.append($("<div>").addClass("colorBox"));
	//targetSelection = rvDataSets[0].getSelection($currentSelectionName);
	if (RVcolor){
		$($currentGroup).find(".colorBox").css("background",RVcolor);
		targetSelection.Color = RVcolor;
	} else {
		$($currentGroup).find(".colorBox").css("background",targetSelection.Color);
	}
		
	//hide and show icon: eye 
	$visibleImgPath = "images/visible.png";
	$invisibleImgPath = "images/invisible.png";
	$($currentGroup)
	.append($("<div>").addClass("checkBoxDIV-S").css({
			'float' : 'left',
			'padding-top' : 5,
			'margin-left' : 5,
			'width' : 20
		}).append($("<img class='visibilityCheckImg' value='visible' title='visibility' src='./images/visible.png'/>").css({
			'width' : '24px', 
			'height': 'auto',
			'margin-top': 3
		}).click( function() {
			$type = this.getAttribute('value');
			if($type == 'visible'){
				this.setAttribute('value','invisible'); 
				this.setAttribute('src', $invisibleImgPath);
				rvDataSets[0].drawSelection("selected");
				//targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
				//targetLayer.setVisibility("hidden");
			}
			else if($type == 'invisible'){
				this.setAttribute('value','visible');
				this.setAttribute('src', $visibleImgPath);
				rvDataSets[0].drawSelection("selected");
				//targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
				//targetLayer.setVisibility("visible");
			}
		}))		
	);
			
	//adding raido button for selection		
	$($currentGroup)
	.append($("<div>").addClass("radioDIV").css({
		'float' : 'left',
		'padding-top' : 5,
		'padding-left' : 5,
		'width' : 20
	}).append($("<input />").attr({
			type : 'radio',
			name : 'selectedRadioS',
			title : 'select Selection' 
		}).addClass("selectSelectionRadioBtn").change ( function (event) {
			//rvDataSets[0].selectLayer($(event.currentTarget).parent().parent().attr("name"));
			//drawNavLine();
			})));
	
	//raido button for telling 2D-3D mapping 
	$($currentGroup)
	.append($("<div>").addClass("radioDIV2").css({
		'float' : 'left',
		'padding-top' : 5,
		'padding-left' : 5,
		'width' : 20
	}).append($("<input />").attr({
			type : 'radio',	
			name : 'mappingRadioS',
			title : 'select which selection to map into 3D',
			disabled : 'disabled'
		}).addClass("mappingRadioBtn").change (function (event) {
			//rvDataSets[0].linkLayer($(event.currentTarget).parent().parent().attr("name"));
			//update3Dcolors();
			})));
	 
	//adding accordion
	$($currentGroup)
	.append($("<h3>").addClass("selectionName").css({
			'margin-left' : 83
		}).append($currentSelectionName)
	.dblclick(function() { //double click to open dialog to change layer name and set color
		//watch out! $currentLayerName != the layer you are clicking right now!
		//open a dialog window for changing layer names
		$("#SelectionPreferenceDialog").dialog("open");

		//get the name of the layer that just got double clicked
		$dblClickedSelectionName = this.innerHTML.substring(this.innerHTML.lastIndexOf("</span>")+7);
		$dblClickedSelection = this;
		document.getElementById("selectionNameInput").value = "";
		document.getElementById("selectionNameInput").placeholder = $dblClickedSelectionName;			
		var flc = $.farbtastic("#selectionColor");
		flc.setColor(rgb2hex($($dblClickedSelection).parent().find(".colorBox").css("background-color")));
		//console.log(this.innerHTML);			
	}))
	.append($("<div>").addClass("selectionContent").css({
			'margin-left' : 83
		}));	
	
	$("#SelectionPanel div").first().next().find(".selectionContent").first().append($('<div name="' + 'selectDiv' + '">'));
	//Circle buttons
	$("#SelectionPanel div").first().next().find(".selectionContent").append($('<div>').text("Auto Draw Circles:").append($("<br>")));
	$("#SelectionPanel div").first().next().find(".selectionContent").first().find("div").last().append($('<label><input type="radio" name="autodraw' + '" value="on" checked="checked">On</label>'));
	$("#SelectionPanel div").first().next().find(".selectionContent").first().find("div").last().append($('<label><input type="radio" name="autodraw' + '" value="off">Off</label>'));
	$('input[name="filled' + key + '"][value=filled]').attr("checked", true);
	
	//$count++;
/*
	
	switch (Layer.Type) {
		case "circles":
			//Data Label Section 
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div name="' + 'datalabel' + '">').text(Layer.DataLabel).append($("<br>")).append($("<br>")));
			
			//Circle buttons
			$("#LayerPanel div").first().next().find(".layerContent").append($('<div id="' + 'pr-' + key + '">').text("Draw Circles as:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="filled' + key + '" id="' + 'pr-' + key + '-1' + '" value="filled" checked="checked"> <label for="' + 'pr-' + key + '-1' + ' ">filled</label>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="filled' + key + '" id="' + 'pr-' + key + '-2' + '" value="unfilled"> <label for="' + 'pr-' + key + '-2' + '">unfilled</label>'));
			//$('#' + 'pr-' + key).buttonset();
			if (Layer.Filled) {
				$('input[name="filled' + key + '"][value=filled]').attr("checked", true);
			} else {
				$('input[name="filled' + key + '"][value=unfilled]').attr("checked", true);
			}
			$('input[name="filled' + key + '"]').change(function (event) {
				if ($('input[name="filled' + key + '"][value=filled]').attr("checked")) {
					Layer.Filled = true;
				} else {
					Layer.Filled = false;
				}
				rvDataSets[0].refreshResiduesExpanded($(event.currentTarget).parent().parent().parent().attr("name"));
			});
			
			
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="' + 'prs-' + key + '">').text("Circle Size:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="size' + key + '" id="' + 'prs-' + key + '-1' + '" value="regular" checked="checked"> <label for="' + 'prs-' + key + '-1' + ' ">regular</label>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="size' + key + '" id="' + 'prs-' + key + '-2' + '" value="large"> <label for="' + 'prs-' + key + '-2' + '">large</label>'));
			//$('#' + 'pr-' + key).buttonset();
			if (Layer.ScaleFactor <= 1.0) {
				$('input[name="size' + key + '"][value=regular]').attr("checked", true);
			} else {
				$('input[name="size' + key + '"][value=large]').attr("checked", true);
			}
			
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').removeAttr("disabled");
		
			$('input[name="size' + key + '"]').change(function (event) {
				if ($('input[name="size' + key + '"][value=regular]').attr("checked")) {
					Layer.ScaleFactor = 1.0;
				} else {
					Layer.ScaleFactor = 1.2;
				}
				rvDataSets[0].refreshResiduesExpanded($(event.currentTarget).parent().parent().parent().attr("name"));
			});
			$(this);
			break;
		case "lines":
			//Data Label Section 
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div name="' + 'datalabel' + '">').text(Layer.DataLabel).append($("<br>")).append($("<br>")));
			
			$("#LayerPanel div").first().next().find(".layerContent").append($('<div id="' + 'llm-' + key + '">').text("Color lines like:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<select id="' + 'llm-' + key + 'lineselect' + '" name="' + 'llm-' + key + 'lineselect' + '" multiple="multiple"></select>'));
			$('#' + 'llm-' + key + 'lineselect').multiselect({
				minWidth : 160,
				multiple : false,
				header : "Select a layer",
				noneSelectedText : "Select an Option",
				selectedList : 1
			});
			$('#' + 'llm-' + key + 'lineselect').multiselect().multiselectfilter();
			//Fill Menu
			var llm = document.getElementById('llm-' + key + 'lineselect');
			//var SDList=rvDataSets[0].SpeciesEntry.StructDataMenu.split(";");
			//llm.options.length = 0;
			llm.options[0] = new Option("All Gray", "gray_lines");
			llm.options[0].setAttribute("selected", "selected");

			var rLayers = rvDataSets[0].getLayerByType("residues");
			var cLayers = rvDataSets[0].getLayerByType("circles");
			$.each(rLayers, function (key, value) {
				llm.options[llm.options.length] = new Option(value.LayerName, value.LayerName);
			});
			$.each(cLayers, function (key, value) {
				llm.options[llm.options.length] = new Option(value.LayerName, value.LayerName);
			});
			$('#' + 'llm-' + key + 'lineselect').multiselect("refresh");
			
			$('#' + 'llm-' + key + 'lineselect').change(function (event) {
				var array_of_checked_values = $('#' + 'llm-' + key + 'lineselect').multiselect("getChecked").map(function () {
						return this.value;
					});
				if (array_of_checked_values[0] === "gray_lines") {
					rvDataSets[0].drawBasePairs("lines", "gray_lines");
					$(event.currentTarget).parent().parent().find(':radio').attr('disabled','disabled');
				} else {
					rvDataSets[0].drawBasePairs("lines", rvDataSets[0].getLayer(array_of_checked_values[0]));
					$(event.currentTarget).parent().parent().find(':radio').removeAttr('disabled');
				}
			});
			
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<br>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="' + 'llmg-' + key + '">').text("Line Gradient Direction:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="color_lines_gradient' + key + '" id="' + 'llmg-' + key + '-1' + '" value="Matched" checked="checked"> <label for="' + 'llmg-' + key + '-1' + ' ">Matched</label>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="color_lines_gradient' + key + '" id="' + 'llmg-' + key + '-2' + '" value="Opposite"> <label for="' + 'llmg-' + key + '-2' + '">Opposite</label>'));
			$('[name="color_lines_gradient' + key + '"]').attr('disabled', 'disabled');
			$('input[name="color_lines_gradient' + key + '"]').change(function (event) {
				targetLayer = rvDataSets[0].getLayer($('input[name="color_lines_gradient' + key + '"]' + ':checked').parent().parent().parent().find('h3').text());
				targetLayer.ColorGradientMode =  $(event.currentTarget).parent().parent().find('input:checked').val();
				rvDataSets[0].drawBasePairs("lines");
			});
			
			break;
		case "residues":
			//Data Label Section 
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div name="' + 'datalabel' + '">').text(Layer.DataLabel).append($("<br>")).append($("<br>")));
			
			$("#LayerPanel div").first().next().find(".selectLayerRadioBtn").attr("checked", "checked");
			rvDataSets[0].selectLayer($("#LayerPanel div").first().next().attr("name"));
			rvDataSets[0].linkLayer($("#LayerPanel div").first().next().attr("name"));
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').removeAttr("disabled");
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').attr("checked","checked");
		
			break;
		case "selected":
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="selectDiv">'))
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').removeAttr("disabled");
			//$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="' + 'sele-' + key + '">'))
			//$("#selectDiv").html(text)
			break;
		default:
			break;
	}*/
	$("#SelectionPanel div").first().next().find(".visibilityCheckImg").attr("value", "visible");
	
}

//Accordion that support multiple sections open
$("#SelectionPanel").multiAccordion();
$("#SelectionPanel").sortable({
	update : function (event, ui) {
		$("#SelectionPanel .selectionContent").each(function (e, f) {
			rvDataSets[0].drawSelection("selected");
			//$(this).find('p').text(rvDataSets[0].LastLayer - e - 1);
			//$("#" + rvDataSets[0].getLayer($(this).parent().attr("name")).CanvasName).css('zIndex', rvDataSets[0].LastLayer - e - 1)
		});
		//rvDataSets[0].sort();
	},
	items : ".oneSelectionGroup"
	
});
$("#SelectionPanel").disableSelection();

//RefreshLayerMenu();

// Refresh Menu
function RefreshSelectionMenu(){
	$("#SelectionPanel").multiAccordion();
}	
	
$("#SelectionPreferenceDialog").dialog({
	autoOpen : false,
	show : {
		effect : "blind",
		duration : 300
	},
	height : 600,
	width : 400,
	position : {
		my : "center",
		at : "center",
		of : $("#canvasDiv")
	}
});

function changeSelectionColor(){
	$($dblClickedSelection).parent().find(".colorBox").css("background",$("#selectionColor").val());
	targetSelection = rvDataSets[0].getSelection($dblClickedSelectionName);
	targetSelection.Color = $("#selectionColor").val();
	rvDataSets[0].drawSelection("selected");
}

function changeCurrentSelectionName() {
	$($dblClickedSelection).parent().attr("name",$("#selectionNameInput").val());
	$($dblClickedSelection).html($("#selectionNameInput").val()).prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>');
	targetSelection = rvDataSets[0].getSelection($dblClickedSelectionName);
	targetSelection.Name = $("#selectionNameInput").val();
	RefreshSelectionMenu();
}

$("#openSelectionBtn").click(function () {
	$("#PanelTabs").tabs( "option", "active", 1 );
	$("#LayerDialog").dialog("open");
	return false;
});

$("#openSelectionBtn").button({
	text : false,
	icons : {
		primary : "ui-icon-tag"
	}
});


