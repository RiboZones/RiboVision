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
$("#SelectionsPanel").prepend($("<div id='topBarS'>").attr({
		'name' : 'TopSelectionBar'
	}).html("C&nbspV&nbsp&nbsp&nbspS&nbsp&nbsp&nbsp&nbspL&nbsp&nbspSelectionName&nbsp")); // where to add letters
$('[name=TopSelectionBar]').append($('<button id="newSelection" class="toolBarBtn2" title="Create a new selection"></button>'));
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
$("#deleteSelection").button({
	text : false,
	icons : {
		primary : "ui-icon-trash"
	}
});

$("#deleteSelection").click(function (event) {
	$("#dialog-confirm-delete-S p").text("The " + "Selection Name here" + " selection will be permanently deleted and cannot be recovered.");
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
			/*
			if (rvDataSets[0].isUnique($("#newSelectionName").val())){
				$("#canvasDiv").append($('<canvas id="' + $("#newLayerName").val() + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 ) + ';"></canvas>')); 
				resizeElements();
				rvDataSets[0].addLayer($("#newLayerName").val(), $("#newLayerName").val(), [], true, 1.0, 'circles',$("#layerColor2").val());
				LayerMenu(rvDataSets[0].getLayer($("#newLayerName").val()),(1000 + ( rvDataSets[0].LastLayer + 1 ) ));
				RefreshLayerMenu();
				$(this).dialog("close");
			} else {
				$( "#dialog-unique-layer-error" ).dialog("open");
			}*/
			$(this).dialog("close");
		},
		Cancel: function (){
			$(this).dialog("close");
		}
	},
	open : function () {
		$("#jmolApplet0").css("visibility", "hidden");
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
			/*
			$("[name=" + rvDataSets[0].getSelectedLayer().LayerName + "]").remove();
			rvDataSets[0].deleteLayer(rvDataSets[0].getSelectedLayer().LayerName);
			*/
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