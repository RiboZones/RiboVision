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

// Build Layer Menu

// Put in Top Labels and ToolBar
$("#LayerPanel").prepend($("<div id='tipBar'>").attr({
		'name' : 'TopLayerBar'
	}).html("C&nbspV&nbsp&nbsp&nbspS&nbsp&nbsp&nbsp&nbspL&nbsp&nbsp&nbsp&nbspLayerName&nbsp&nbsp")); // where to add letters
$('[name=TopLayerBar]').append($('<button id="newLayer" class="toolBarBtn2" title="Create a new layer"></button>'));
$('[name=TopLayerBar]').append($('<button id="clearLayer" class="toolBarBtn2" title="Clear the selected layer"></button>'));	
$('[name=TopLayerBar]').append($('<button id="deleteLayer" class="toolBarBtn2" title="Delete the selected layer"></button>'));
$("#newLayer").button({
	text : false,
	icons : {
		primary : "ui-icon-document"
	}
});
$("#newLayer").click(function () {
	$("#dialog-addLayer").dialog("open");
});

$("#clearLayer").button({
	text : false,
	icons : {
		primary : "ui-icon-cancel"
	}
});

$("#clearLayer").click(function () {
	targetLayer = rvDataSets[0].getSelectedLayer();
	targetLayer.clearAll();
	//$("#dialog-addSelection").dialog("open");
});

$("#deleteLayer").button({
	text : false,
	icons : {
		primary : "ui-icon-trash"
	}
});

$("#deleteLayer").click(function (event) {
	$("#dialog-confirm-delete p").append("The " + rvDataSets[0].getSelectedLayer().LayerName + " layer will be permanently deleted and cannot be recovered.");
	$("#dialog-confirm-delete").dialog('open');
});

$(".toolBarBtn2").css('height', $("#openLayerBtn").css('height'));




function changeLayerColor(){
	$($dblClickedLayer).parent().find(".colorBox").css("background",$("#layerColor").val());
	targetLayer = rvDataSets[0].getLayer($dblClickedLayerName);
	targetLayer.Color = $("#layerColor").val();
	drawNavLine();
	//console.log(42);
	//$dblClickedLayerName = this.innerHTML.substring(this.innerHTML.lastIndexOf("</span>")+7);
	//$dblClickedLayer = this;
	//$($dblClickedLayer).parent().attr("name",$("#layerNameInput").val());
	//console.log(color);
}

//in "Layer Preferfence" 
function changeCurrentLayerName() {
	//console.log("function changeCurrentLayerName is called!");
	//console.log("current layer name: " + $dblClickedLayerName);	
	//$($dblClickedLayer).innerHTML = document.getElementById("layerNameInput").value;
	//$newName = document.getElementById("layerNameInput").value;
	//$currentLayerName = $newName;
	//console.log("new layer name: " + $newName);	
	$($dblClickedLayer).parent().attr("name",$("#layerNameInput").val());
	$($dblClickedLayer).html($("#layerNameInput").val()).prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>');
	targetLayer = rvDataSets[0].getLayer($dblClickedLayerName);
	targetLayer.LayerName = $("#layerNameInput").val();
	RefreshLayerMenu();
}

function LayerMenu(Layer, key, RVcolor) {
	//console.log($count);
	$currentLayerName = Layer.LayerName;
	//console.log($currentLayerName);
	$('[name=TopLayerBar]').after(($("<div>").addClass("oneLayerGroup").attr({
		'name' : $currentLayerName
	})));
	//console.log("id:" + $('.oneLayerGroup').attr("name"));
	//$('.oneLayerGroup').append(("<div>").addClass("visibilityCheckbox"));
	//$('.visibilityCheckbox').append($("<input />").attr({type:'checkbox'}).addClass("layerVisiblity"))
	
	//This is necessary because if just use $('.oneLayerGroup'), then duplicated layers will be added to different groups
	$currentGroup = document.getElementsByName($currentLayerName);
	//console.log($currentGroup);
	
	//adding color box
	$($currentGroup)
	.append($("<div>").addClass("colorBox"));
	targetLayer = rvDataSets[0].getLayer($currentLayerName);
	if (RVcolor){
		$($currentGroup).find(".colorBox").css("background",RVcolor);
		targetLayer.Color = RVcolor;
	} else {
		$($currentGroup).find(".colorBox").css("background",targetLayer.Color);
	}
	
	//targetLayer.Color = $($currentGroup).find(".colorBox").css("background");
	
	//hide and show icon: eye 
	$visibleImgPath = "images/visible.png";
	$invisibleImgPath = "images/invisible.png";
	$($currentGroup)
	.append($("<div>").addClass("checkBoxDIV").css({
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
				targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
				targetLayer.setVisibility("hidden");
			}
			else if($type == 'invisible'){
				this.setAttribute('value','visible');
				this.setAttribute('src', $visibleImgPath);
				targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
				targetLayer.setVisibility("visible");
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
			name : 'selectedRadioL',
			title : 'select layer' 
		}).addClass("selectLayerRadioBtn").change ( function (event) {
			rvDataSets[0].selectLayer($(event.currentTarget).parent().parent().attr("name"));
			drawNavLine();
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
			name : 'mappingRadioL',
			title : 'select which layer to map into 3D',
			disabled : 'disabled'
		}).addClass("mappingRadioBtn").change (function (event) {
			rvDataSets[0].linkLayer($(event.currentTarget).parent().parent().attr("name"));
			update3Dcolors();
			})));
	/*
	$selectBox = document.getElementsByClassName("checkBoxDIV");
	console.log("DivDialog' width: " + $("#LayerDialog").width());
	console.log("panelTabs' width: " + $("#PanelTabs").width());
	console.log("CBDiv width: " + $('.checkBoxDIV').width());
	console.log("checkbox width: " + $('.visibilityCheckBox').width());
	$accordionWidth = $("#PanelTabs").width() - $('.visibilityCheckBox').width();
	console.log("accordion width: " + $accordionWidth); //why 0??!!!
	 */

	//adding accordion
	$($currentGroup)
	.append($("<h3>").addClass("layerName").css({
			'margin-left' : 83
		}).append($currentLayerName)
	.dblclick(function() { //double click to open dialog to change layer name and set color
		//watch out! $currentLayerName != the layer you are clicking right now!
		//open a dialog window for changing layer names
		$("#LayerPreferenceDialog").dialog("open");

		//get the name of the layer that just got double clicked
		$dblClickedLayerName = this.innerHTML.substring(this.innerHTML.lastIndexOf("</span>")+7);
		$dblClickedLayer = this;
		document.getElementById("layerNameInput").value = "";
		document.getElementById("layerNameInput").placeholder = $dblClickedLayerName;			
		var flc = $.farbtastic("#layerColor");
		flc.setColor(rgb2hex($($dblClickedLayer).parent().find(".colorBox").css("background-color")));
		//console.log(this.innerHTML);			
	}))
	.append($("<div>").addClass("layerContent").css({
			'margin-left' : 83
		}));	
		
	//$count++;
	
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
			//$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="selectDiv">'))
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').removeAttr("disabled");
			//$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="' + 'sele-' + key + '">'))
			//$("#selectDiv").html(text)
			break;
		default:
			break;
	}
	$("#LayerPanel div").first().next().find(".visibilityCheckImg").attr("value", "visible");
}
// Refresh Menu
function RefreshLayerMenu(){
	//Assign function to check boxes
	/*
	$(".visibilityCheckImg").change(function (event) {
		console.log("visibilityCheckImg changed!");
		$(event.currentTarget).parent().parent().attr("name")
		if ($(event.currentTarget).attr("value") == "visible") {
			$(rvDataSets[0].getLayer($(event.currentTarget).parent().parent().attr("name")).Canvas).css("visibility", "visible")
		} else {
			$(rvDataSets[0].getLayer($(event.currentTarget).parent().parent().attr("name")).Canvas).css("visibility", "hidden")
		}
	});*/
	/*
	$(".selectLayerRadioBtn").change(function (event) {
		rvDataSets[0].selectLayer($(event.currentTarget).parent().parent().attr("name"));
	});
	$(".mappingRadioBtn").change(function (event) {
		alert($(event.currentTarget).parent().parent().attr("name"));
	});
	*/
	//Accordion that support multiple sections open
	$("#LayerPanel").multiAccordion();
	/*
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
*/	
}
$("#LayerPanel").sortable({
	update : function (event, ui) {
		$("#LayerPanel .layerContent").each(function (e, f) {
			//$(this).find('p').text(rvDataSets[0].LastLayer - e - 1);
			$("#" + rvDataSets[0].getLayer($(this).parent().attr("name")).CanvasName).css('zIndex', rvDataSets[0].LastLayer - e - 1)
		});
		rvDataSets[0].sort();
	},
	items : ".oneLayerGroup"
	
});
$("#LayerPanel").disableSelection();
