/* RiboVision 1.15 script library RiboVisionSelections.js 5:24 PM 06/10/2014 Chad R. Bernier


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

function InitSelections() {
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
		clearSelection();
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
				if (namecheck[0].length === $("#newSelectionName").val().length && $("#newSelectionName").val().length <= 16) {
					if (rvDataSets[0].isUniqueSelection($("#newSelectionName").val())) {
						//$("#canvasDiv").append($('<canvas id="' + $("#newLayerName").val() + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 ) + ';"></canvas>'));
						//resizeElements();
						rvDataSets[0].addSelection($("#newSelectionName").val(), [], $("#selectionColor2").val());
						SelectionMenu(rvDataSets[0].getSelection($("#newSelectionName").val()));
						RefreshSelectionMenu();
						$(".oneSelectionGroup[name=" + $("#newSelectionName").val() + "]").find(".selectSelectionRadioBtn").prop("checked", true);
						$(".oneSelectionGroup[name=" + $("#newSelectionName").val() + "]").find(".selectSelectionRadioBtn").trigger("change");
						$(this).dialog("close");
					} else {
						$("#dialog-unique-selection-error").dialog("open");
					}
				} else {
					$("#dialog-name-error").dialog("open");
				}
			},
			Cancel : function () {
				$(this).dialog("close");
			}
		},
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
			$("#newSelectionName").val("Selection_" + (rvDataSets[0].Selections.length + 1));
		},
		close : function () {
			$("#myJmol_object").css("visibility", "visible");
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
				rvDataSets[0].deleteSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
				$("[name=" + $('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name') + "]").remove();
				$(".oneSelectionGroup[name='" + rvDataSets[0].Selections[0].Name + "']").find(".selectSelectionRadioBtn").prop("checked", true);
				$(".oneSelectionGroup[name='" + rvDataSets[0].Selections[0].Name + "']").find(".selectSelectionRadioBtn").trigger("change");
				rvDataSets[0].drawSelection("selected");
				$(this).dialog("close");
			},
			Cancel : function () {
				$(this).dialog("close");
			}
		},
		open : function (event) {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () {
			$("#myJmol_object").css("visibility", "visible");
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

	//Accordion that support multiple sections open
	$("#SelectionPanel").multiAccordion();
	$("#SelectionPanel").sortable({
		update : function (event, ui) {
			$("#SelectionPanel .selectionContent").each(function (e, f) {
				var ts = rvDataSets[0].getSelection($(this).parent().attr("name"));
				ts.ZIndex = rvDataSets[0].Selections.length - e;
				rvDataSets[0].drawSelection("selected");
				console.log($(this).parent().attr("name") + ": " + ts.ZIndex);
			});
			rvDataSets[0].SelectionsSort();
		},
		items : ".oneSelectionGroup",
		axis : "y"

	});
	$("#SelectionPanel").disableSelection();

	$("#SelectionPreferenceDialog").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 300
		},
		modal : true,
		height : 600,
		width : 400,
		position : {
			my : "center",
			at : "center",
			of : $("#canvasDiv")
		},
		open : function (event) {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () {
			$("#myJmol_object").css("visibility", "visible");
		}
	});

	$("#openSelectionBtn").click(function () {
		$("#PanelTabs").tabs("option", "active", 1);
		$("#LayerDialog").dialog("open");
		return false;
	});

	$("#openSelectionBtn").button({
		text : false,
		icons : {
			primary : "ui-icon-tag"
		}
	});

	$(".toolBarBtn2").css('height', $("#openLayerBtn").css('height'));

}

function SelectionMenu(targetSelection, key, RVcolor) {

	var $currentSelectionName = targetSelection.Name;
	$('[name=TopSelectionBar]').after(($("<div>").addClass("oneSelectionGroup").attr({
				'name' : $currentSelectionName
			})));

	var $currentGroup = $(".oneSelectionGroup[name=" + $currentSelectionName + "]")[0];

	//adding color box
	$($currentGroup)
	.append($("<div>").addClass("colorBox"));
	//targetSelection = rvDataSets[0].getSelection($currentSelectionName);
	if (RVcolor) {
		$($currentGroup).find(".colorBox").css("background", RVcolor);
		targetSelection.Color = RVcolor;
	} else {
		$($currentGroup).find(".colorBox").css("background", targetSelection.Color);
	}

	//hide and show icon: eye
	var $visibleImgPath = "images/visible.png";
	var $invisibleImgPath = "images/invisible.png";
	$($currentGroup)
	.append($("<div>").addClass("checkBoxDIV-S").css({
			'float' : 'left',
			'padding-top' : 5,
			'margin-left' : 5,
			'width' : 20
		}).append($("<img class='visibilityCheckImg' value='visible' title='visibility' src='./images/visible.png'/>").css({
				'width' : '24px',
				'height' : 'auto',
				'margin-top' : 3
			}).click(function () {
				var $type = this.getAttribute('value');
				if ($type == 'visible') {
					this.setAttribute('value', 'invisible');
					this.setAttribute('src', $invisibleImgPath);
					rvDataSets[0].drawSelection("selected");
					//targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
					//targetLayer.setVisibility("hidden");
				} else if ($type == 'invisible') {
					this.setAttribute('value', 'visible');
					this.setAttribute('src', $visibleImgPath);
					rvDataSets[0].drawSelection("selected");
					//targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
					//targetLayer.setVisibility("visible");
				}
			})));

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
			}).addClass("selectSelectionRadioBtn").change(function (event) {
				var selectionname = $(event.currentTarget).parent().parent().attr("name");
				$.each(rvDataSets[0].Selections, function (key, value) {
					if (value.Name === selectionname) {
						value.Selected = true;
					} else {
						value.Selected = false;
					}
				});
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
			}).addClass("mappingRadioBtn").change(function (event) {
				//rvDataSets[0].linkLayer($(event.currentTarget).parent().parent().attr("name"));
				//update3Dcolors();
			})));

	//adding accordion
	$($currentGroup)
	.append($("<h3>").addClass("selectionName").css({
			'margin-left' : 83
		}).append($currentSelectionName)
		.dblclick(function () { //double click to open dialog to change layer name and set color
			//watch out! $currentLayerName != the layer you are clicking right now!
			//open a dialog window for changing layer names
			$("#SelectionPreferenceDialog").dialog("open");

			//get the name of the layer that just got double clicked
			$dblClickedSelectionName = this.innerHTML.substring(this.innerHTML.lastIndexOf("</span>") + 7);
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
	//$('input[name="filled' + key + '"][value=filled]').attr("checked", true);

	$("#SelectionPanel div").first().next().find(".visibilityCheckImg").attr("value", "visible");

}

//RefreshLayerMenu();

// Refresh Menu
function RefreshSelectionMenu() {
	$("#SelectionPanel").multiAccordion();
}

function changeSelectionColor() {
	$($dblClickedSelection).parent().find(".colorBox").css("background", $("#selectionColor").val());
	var targetSelection = rvDataSets[0].getSelection($dblClickedSelectionName);
	targetSelection.Color = $("#selectionColor").val();
	rvDataSets[0].drawSelection("selected");
}

function changeCurrentSelectionName() {
	if ($("#selectionNameInput").val() !== $($dblClickedSelection).parent().attr("name")) {
		var namecheck = $("#selectionNameInput").val().match(/[A-z][\w-_:\.]*/);
		if (namecheck[0].length === $("#selectionNameInput").val().length && $("#selectionNameInput").val().length <= 16) {
			if (rvDataSets[0].isUniqueSelection($("#selectionNameInput").val())) {
				$($dblClickedSelection).parent().attr("name", $("#selectionNameInput").val());
				$($dblClickedSelection).html($("#selectionNameInput").val()).prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>');
				var targetSelection = rvDataSets[0].getSelection($dblClickedSelectionName);
				targetSelection.Name = $("#selectionNameInput").val();
				RefreshSelectionMenu();
				$(this).dialog("close");
			} else {
				$("#dialog-unique-selection-error").dialog("open");
			}
		} else {
			$("#dialog-name-error").dialog("open");
		}
	}
}
