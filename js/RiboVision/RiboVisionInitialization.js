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

	
// Ready Function
function RiboVisionReady() {
	
	Jmol.setDocument(0);
	Jmol.setAppletCss("jmolapplet", "style='left:40px'");
	myJmol = Jmol.getApplet("myJmol", JmolInfo); 
	$('#jmolDiv').html(Jmol.getAppletHtml(myJmol));
	
	$("#ResidueTip").tooltip({
			show: false,
			hide: false,
			track: false,
			open : function(event,ui) {
				//alert(this);
			}
	});
	$("#InteractionTip").tooltip({
			show: false,
			hide: false,
			track: false,
			open : function(event,ui) {
				//alert(this);
			}
	});
	// New Stuff Section, Layers, Selections Panels
	$.fx.speeds._default = 1000;
	$("#PanelTabs").tabs();
	
	$("#LayerDialog").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 500
		}, //change blindin animation attributes
		hide : {
			effect : "blind",
			duration : 500
		},
		height : 600,
		width : 370,
		position : {
			my : "right top",
			at : "right top",
			of : $("#canvasDiv")
		}
	});

	$("#ColorDialog").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 500
		}, //change blindin animation attributes
		hide : {
			effect : "blind",
			duration : 500
		},
		height : 500,
		position : {
			my : "right top",
			at : "right top",
			of : $("#canvasDiv")
		}
	});

	$("#InteractionSettingDialog").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 500
		}, //change blindin animation attributes
		hide : {
			effect : "blind",
			duration : 500
		},
		height : 500,
		position : {
			my : "right top",
			at : "right top",
			of : $("#canvasDiv")
		}
	});
	
	$("#LayerPreferenceDialog").dialog({
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

	$("#RiboVisionSettingsPanel").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 300
		},
		width : 600,
		height : 500,
		position : {
			my : "left top",
			at : "left top",
			of : $("#SiteInfo")
		}
	});
	
	$("#RiboVisionSaveManagerPanel").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 300
		},
		height : 500,
		width : 600,
		position : {
			my : "center",
			at : "center",
			of : $("#canvasDiv")
		},
		open : function () {
			//$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			//$("#myJmol_object").css("visibility", "visible");
		}
	});
	
	$("#openLayerBtn").click(function () {
		$("#PanelTabs").tabs( "option", "active", 0 );
		$("#LayerDialog").dialog("open");
		return false;
	});
	
	$("#openColorBtn").click(function () {
		$("#ColorDialog").dialog("open");
		return false;
	});

	$("#openInteractionSettingBtn").click(function () {
		$("#InteractionSettingDialog").dialog("open");
		return false;
	});
	
	$("#RiboVisionSettings").click(function () {
		$("#RiboVisionSettingsPanel").dialog("open");
		return false;
	});
	
	$("#RiboVisionSaveManager").click(function () {
		$("#RiboVisionSaveManagerPanel").dialog("open");
		return false;
	});
	
	//////////////////////////////////////////////////
	//radio buttons for line interaction
	$(function() {
        $( "#singleMultiChoice" ).buttonset();
    });
	
	///////////////////////////////////////////////////
	
	$('#slider').slider({
		min : 0,
		max : 70,
		value : 20,
		orientation : "vertical",
		slide : function (event, ui) {
			zoom(rvViews[0].width / 2, rvViews[0].height / 2, Math.pow(1.1, (ui.value - $(this).slider("value"))));
			rvViews[0].slideValue = ui.value;
		}
	});
	
	$('.ui-slider-handle').height(21).width(21);
	$("#TemplateLink").button();
	$("#newLayerName").button().addClass('ui-textfield').keydown(function (event) {
		if (event.keyCode == 13) {
			$("#dialog-addLayer").dialog("option", "buttons")['Create New Layer'].apply($("#dialog-addLayer"));
		}
	});
	
	$("#dialog-addLayer").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Create New Layer" : function () {
				var namecheck = $("#newLayerName").val().match(/[A-z][\w-_:\.]*/);
				if (namecheck[0].length === $("#newLayerName").val().length && $("#newLayerName").val().length <= 16){
					if (rvDataSets[0].isUniqueLayer($("#newLayerName").val())){
						//$("#canvasDiv").append($('<canvas id="' + $("#newLayerName").val() + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 ) + ';"></canvas>')); 
						rvDataSets[0].addLayer($("#newLayerName").val(), $("#newLayerName").val(), [], true, 1.0, 'circles',$("#layerColor2").val());
						resizeElements();
						LayerMenu(rvDataSets[0].getLayer($("#newLayerName").val()),(1000 + ( rvDataSets[0].LastLayer + 1 ) ));
						RefreshLayerMenu();
						$(this).dialog("close");
					} else {
						$( "#dialog-unique-layer-error" ).dialog("open");
					}
				} else {
					$( "#dialog-name-error" ).dialog("open");
				}
			},
			Cancel: function (){
				$(this).dialog("close");
			}
		},
		open : function () {
			$("#newLayerName").val("Layer_" + (rvDataSets[0].Layers.length + 1));
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$("#dialog-addLayer p").append("We currently are only supporting the addition of new circle type layers." + 
		" Future updates will let you add additional layers of any type." + 
		"<br><br>Please enter a name for the new layer.");
	$( "#dialog-unique-layer-error" ).dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$( "#dialog-name-error" ).dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$( "#dialog-generic-notice" ).dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$( "#dialog-layer-type-error" ).dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$( "#dialog-restore-state" ).dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons: {
			Ok: function() {
				openRvState();
				$( this ).dialog( "close" );
			},
			"Fresh State": function () {
				InitRibovision(true);
				$( this ).dialog( "close" );
			}
		},
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$("#Privacy-confirm").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"I agree." : function () {
				set_cookie(CurrPrivacyCookie, "Agreed", 42); //default cookie age will be 42 days.
				AgreeFunction();
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
	$("#dialog-confirm-delete").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Delete the Layer" : function (event) {
				//check selected layer and linked layer
				var targetLayer = rvDataSets[0].getSelectedLayer();
				var rLayers = rvDataSets[0].getLayerByType("residues");
				var cLayers = rvDataSets[0].getLayerByType("circles");
				if (rLayers){
					$(".oneLayerGroup[name='" + rLayers[0].LayerName + "']").find(".selectLayerRadioBtn").trigger("click");		
				} else if (cLayers){
					$(".oneLayerGroup[name='" + cLayers[0].LayerName + "']").find(".selectLayerRadioBtn").trigger("click");	
				} else {
					$(".oneLayerGroup[name='" + rvDataSets[0].Layers[0].LayerName + "']").find(".selectLayerRadioBtn").trigger("click");	
				}
				$("[name=" + targetLayer.LayerName + "]").remove();
				rvDataSets[0].deleteLayer(targetLayer.LayerName);
				rvDataSets[0].sort();
				RefreshLayerMenu();
				
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
	
	$("#dialog-selection-warning").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"OK" : function (event) {
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
	
	$("#colorpicker").farbtastic("#color");
	
	//$("#layerColor").change(changeLayerColor);
	
	$("#layerColorPicker").farbtastic("#layerColor");
	$("#layerColorPicker2").farbtastic("#layerColor2");
	
	$("#SideBarAccordian").accordion({
		heightStyle: "fill",
		activate : function (event, ui) {
			resetFileInput($('#files'));
			$('#files').on('change', function (event) {
				handleFileSelect(event);
			});
		}
	});
	
	//$("#tabs").tabs();
	$("#ProtList").multiselect({
		minWidth : 160,
		selectedText : "# of # proteins selected",
		noneSelectedText : 'Select proteins',
		selectedList : 9
	});
	
	$("#StructDataList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1,
		click: function(event,ui){
			var targetLayer = rvDataSets[0].getSelectedLayer();
			targetLayer.DataLabel = ui.text;
			$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer.DataLabel).append($("<br>")).append($("<br>"));
			var ColName = ui.value.match(/[^\'\\,]+/);
			var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
			if (result[0]){
				$(this).parent().find(".DataDescription").text(result[0].Description);
			} else {
				$(this).parent().find(".DataDescription").text("Data Description is missing.");
			}
			updateStructData(ui);
		}
	});
	/*
	$( "#speciesList" ).multiselect({
	multiple: false,
	header: "Select a Species and Molecule",
	noneSelectedText: "Select a Species and Molecule",
	selectedList: 1
	});*/
	$("#speciesList").menu({});
	$("#selectByDomainHelix").multiselect({
		minWidth : 160,
		click : function (event, ui) {
			var array_of_checked_values = $("#selectByDomainHelix").multiselect("getChecked").map(function () {
					return this.value;
				});
			clearSelection();
			$.each(array_of_checked_values, function (i, val) {
				commandSelect(val.replace(/\,/g, ";"))
			});
		},
		optgrouptoggle : function (event, ui) {
			var array_of_checked_values = $("#selectByDomainHelix").multiselect("getChecked").map(function () {
					return this.value;
				});
			clearSelection();
			$.each(array_of_checked_values, function (i, val) {
				commandSelect(val.replace(/\,/g, ";"))
			});
		},
		uncheckAll : function () {
			clearSelection();
		},
		checkAll : function (event, ui) {
			var array_of_checked_values = $("#selectByDomainHelix").multiselect("getChecked").map(function () {
				return this.value;
			});
			clearSelection();
			$.each(array_of_checked_values, function (i, val) {
				commandSelect(val.replace(/\,/g, ";"))
			});
		}
	});
	$("#selectByDomainHelix").multiselect().multiselectfilter();
	
	$("#alnList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1,
		click: function(event,ui){
			var targetLayer = rvDataSets[0].getSelectedLayer();
			targetLayer.DataLabel = ui.text;
			$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer.DataLabel).append($("<br>")).append($("<br>"));
			var ColName = ui.value.match(/[^\'\\,]+/);
			var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
			if (result[0]){
				$(this).parent().find(".DataDescription").text(result[0].Description);
			} else {
				$(this).parent().find(".DataDescription").text("Data Description is missing.");
			}
			colorMapping("42",ui.value);
		}
	});
	$("#PrimaryInteractionList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1,
		click : function (event,ui){
			// For now, go ahead and fetch and draw the whole list, since default will be all on anyways
			var array_of_checked_values = $("#PrimaryInteractionList").multiselect("getChecked").map(function(){
			   return this.value;	
			}).get();
			var interactionchoice = array_of_checked_values[0];
			var p = interactionchoice.indexOf("_NPN");
			if (p>=0){
				var array_of_checked_values2 = $("#ProtList").multiselect("getChecked").map(function(){
				   return this.value;	
				}).get();
				if (array_of_checked_values2.length < 1){
					$("#dialog-generic-notice .ReplaceText").text("You have selected Protein Interactions but the protein list is empty. Please select one or more proteins.");
					$("#dialog-generic-notice").dialog("open");
				}
			}
			//var targetLayer = rvDataSets[0].getSelectedLayer();
			var targetLayer = rvDataSets[0].getLayerByType("lines");
			targetLayer[0].DataLabel = ui.text;
			$("[name=" + targetLayer[0].LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer[0].DataLabel).append($("<br>")).append($("<br>"));
			var ColName = ui.value.replace(/[^_]+_[^_]+_/,"");
			var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
			if (result[0]){
				$(this).parent().parent().find(".DataDescription").text(result[0].Description);
			} else {
				$(this).parent().parent().find(".DataDescription").text("Data Description is missing.");
			}
			refreshBasePairs(interactionchoice);
		}
	});
	$("#SecondaryInteractionList").multiselect({
		minWidth : 160,
		multiple : true,
		selectedText : "# of # types selected",
		noneSelectedText : 'Select interaction types',
		selectedList : 9,
		click : function (event){
			var array_of_checked_values = $("#SecondaryInteractionList").multiselect("getChecked").map(function(){
			   return this.value;	
			}).get();
			filterBasePairs(FullBasePairSet,array_of_checked_values);
		},
		uncheckAll : function () {
			var array_of_checked_values = $("#SecondaryInteractionList").multiselect("getChecked").map(function(){
			   return this.value;	
			}).get();
			filterBasePairs(FullBasePairSet,array_of_checked_values);
		},
		checkAll : function (event, ui) {
			var array_of_checked_values = $("#SecondaryInteractionList").multiselect("getChecked").map(function(){
			   return this.value;	
			}).get();
			filterBasePairs(FullBasePairSet,array_of_checked_values);
		}
	});
	$("#freshenRvState").button().click(function(){
		InitRibovision(true);
	});
	$("#ssSave").button().click(function(){
		rvSaveManager("Save");
	});
	$("#ssRestore").button().click(function(){
		rvSaveManager("Restore")
	});
	$("#openLayerBtn").button({
		text : false,
		icons : {
			primary : "ui-icon-newwin"
		}
	});
	
	$("#openColorBtn").button({
		text : false,
		icons : {
			primary : "ui-icon-pencil"
		}
	});
	
	$("#SelectionMode").button({
		text : false,
		icons : {
			primary : "ui-icon-pin-w"
		}
	});

	$("#openInteractionSettingBtn").button({
		text : false,
		icons : {
			primary : "ui-icon-transfer-e-w"
		}
	});	
	
	$("#RiboVisionSettings").button({
		text : false,
		icons : {
			primary : "ui-icon-gear"
		}
	});
	
	$("#RiboVisionSaveManager").button({
		text : false,
		icons : {
			primary : "ui-icon-wrench"
		}
	});
	
	$("#openManualBtn").button({
		text : false,
		icons : {
			primary : "ui-icon-help"
		}
	});
	
	$("#layerNameInput").button().addClass('ui-textfield').keydown(function (event) {
		if (event.keyCode == 13) {
			changeCurrentLayerName();
		}
	});
	
	$("#moveMode").attr("checked","checked");
	$("#buttonmode").buttonset();
	$("#colorLinesMode").buttonset();
	$("#colorLinesGradientMode").buttonset();
	$("#zaOFF").attr("checked","checked");
	$("#ZAset").buttonset();
	$("[name=za]").button().change(function(event,ui){
		rvDataSets[0].drawBasePairs("lines");
	});
	
	$("#BaseView").buttonset();
	$("#bvOFF").attr("checked","checked");
	$("#BaseView").buttonset("refresh");
	
	$("[name=bv]").button().change(function(event,ui){
		//
	});
	
	$("#SaveControl").buttonset();
	$("#sscB").attr("checked","checked");
	$("#SaveControl").buttonset("refresh");
	$("[name=ssc]").button().change(function(event,ui){
		//rvSaveManager();
	});
	
	
	$("[name=clearColor]").button();
	$("[name=selebutton]").button();
	$("[name=saveas]").button();	
	$("[name=savelayers]").button();
	$("#colorSelection").button();
	//$("#layerColorSelection").button();
	if(typeof(Storage)!=="undefined"){
	  localStorageAvailable = true;
	  // Yes! localStorage and sessionStorage support!
	  // Some code.....
	}else{
	  localStorageAvailable = false;
	  //alert("Sorry! No web storage support..");
	}
	
	$("#ProtList").bind("multiselectclick", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		var targetLayer = rvDataSets[0].getSelectedLayer();
		//targetLayer.DataLabel = ui.text;
		targetLayer.DataLabel = "Protein Contacts";
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer.DataLabel).append($("<br>")).append($("<br>"));
		//var ColName = ui.value.match(/[^\'\\,]+/);
		var ColName = "All_Proteins";
		var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
		if (result[0]){
			$(this).parent().find(".DataDescription").text(result[0].Description);
		} else {
			$(this).parent().find(".DataDescription").text("Data Description is missing.");
		}	
		colorMappingLoop(array_of_checked_values);
	});
	$("#ProtList").bind("multiselectopen", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		var targetLayer = rvDataSets[0].getSelectedLayer();
		//targetLayer.DataLabel = ui.text;
		targetLayer.DataLabel = "Protein Contacts";
		//var ColName = ui.value.match(/[^\'\\,]+/);
		var ColName = "All_Proteins";
		var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
		if (result[0]){
			$(this).parent().find(".DataDescription").text(result[0].Description);
		} else {
			$(this).parent().find(".DataDescription").text("Data Description is missing.");
		}
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer.DataLabel).append($("<br>")).append($("<br>"));
		colorMappingLoop(array_of_checked_values);
	});
	$("#ProtList").bind("multiselectcheckall", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		var targetLayer = rvDataSets[0].getSelectedLayer();
		//targetLayer.DataLabel = ui.text;
		targetLayer.DataLabel = "Protein Contacts";
		//var ColName = ui.value.match(/[^\'\\,]+/);
		var ColName = "All_Proteins";
		var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
		if (result[0]){
			$(this).parent().find(".DataDescription").text(result[0].Description);
		} else {
			$(this).parent().find(".DataDescription").text("Data Description is missing.");
		}
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer.DataLabel).append($("<br>")).append($("<br>"));
		colorMappingLoop(array_of_checked_values);
	});
	$("#ProtList").bind("multiselectuncheckall", function (event, ui) {
			
		resetColorState();
		targetLayer=rvDataSets[0].getSelectedLayer();
		targetLayer.DataLabel = "empty data";
		//var ColName = ui.value.match(/[^\'\\,]+/);
		//var ColName = "All_Proteins";
		//var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
		//if (result[0]){
		//	$(this).parent().find(".DataDescription").text(result[0].Description);
		//} else {
			$(this).parent().find(".DataDescription").text("");
		//}
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("[name=datalabel]").text(targetLayer.DataLabel).append($("<br>")).append($("<br>"));
		targetLayer.clearData();
		if ( targetLayer.Type == "circles"){
			rvDataSets[0].clearCanvas(rvDataSets[0].getSelectedLayer().LayerName);
		}
		var array_of_checked_values = $("#PrimaryInteractionList").multiselect("getChecked").map(function(){
		   return this.value;	
		}).get();
		var interactionchoice = array_of_checked_values[0];
		//var interactionchoice = $('#PrimaryInteractionList').val();
		var p = interactionchoice.indexOf("_NPN");
		if (p>=0){
			rvDataSets[0].BasePairs = [];
			rvDataSets[0].clearCanvas("lines");
		}
	});
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
		$("#files").on('change', function (event) {
			handleFileSelect(event);
		});
		
		//document.getElementById('files').addEventListener('change',{$('#files').on('change', handleFileSelect);handleFileSelect}, false);
		//alert('File APIs are as good as Curiosity');
	} else {
		dd = document.getElementById('FileDiv');
		dd.innerHTML = "Your browser doesn't support file loading feature. IE does not support it until IE10+.";
	}
	
	modeSelect("move");
	
	$("#canvasDiv").bind("mousedown", mouseEventFunction);
	$("#canvasDiv").bind("mouseup", mouseEventFunction);
	$(window).bind("mouseup", function (event) {
		$("#canvasDiv").unbind("mousemove", dragHandle);
		//$("#canvasDiv").unbind("mousemove", mouseMoveFunction);
		$("#canvasDiv").unbind("mousemove", dragSelBox);
		rvDataSets[0].HighlightLayer.clearCanvas();
		return false;
	});
	
	$(window).bind("resize", resizeElements);
	$("#canvasDiv").bind('mousewheel',mouseWheelFunction);
	//$("#canvasDiv").bind("mousemove", mouseMoveFunction);
	
  /////////////
	
	$("#canvasDiv").bind("mouseout", function (event) {
		$("#canvasDiv").trigger({
			type : 'mouseup',
			which : 1,
			clientX : event.clientX,
			clientY : event.clientY
		});
		rvDataSets[0].HighlightLayer.clearCanvas();
		
	});
	   $( "#canvasPorportionSlider" ).slider({
    	min : 5,
		max : 95,
		value : 50,
		orientation : "horizontal",
		slide : function (event, ui) {
			PanelDivide = ui.value / 100;
			resizeElements();
			//views_proportion_change($(this).slider("value"), 100-$(this).slider("value"));
		}
    });
	

	//$("#canvasPorportionSlider").slider({ from: 0, to: 100, step: 1, round: 1, limits:false, dimension: '&nbsp;%', skin: "blue", scale: ['0%', '|', '20%', '|' , '40%', '|', '60%', '|', '80%', '|', '100%'] });

    //var w = document.getElementById('canvasPorportionSlider').style.width;
	
	$( "#topPorportionSlider" ).slider({
		min : 50,
		max : 90,
		value : 72,
		orientation : "vertical",
		slide : function (event, ui) {
			TopDivide = (100 - ui.value) / 100;
			resizeElements();
			//views_proportion_change($(this).slider("value"), 100-$(this).slider("value"));
		}
	});
	$('.ui-slider-handle').height(21).width(21);  
	$( "#lineOpacitySlider" ).slider({
    	min : 0,
		max : 100,
		value : 100,
		orientation : "horizontal",
		slide : function (event, ui) {
			//changeLineOpacity($(this).slider("value"));
		}
    });  
	$('.ui-slider-handle').height(21).width(21);  
	
	$(window).unload(function() {		
		//localStorage.setItem("rvDataSets",rvDataSets);
	});
	
	$("#SelectionMode").click(function () {
	});
	InitRibovision();
	//$("#RiboVisionSaveManagerPanel").dialog("open");

};

function InitRibovision(FreshState) {
	rvDataSets[0] = new rvDataSet("EmptyDataSet");
	rvDataSets[0].addHighlightLayer("HighlightLayer", "HighlightLayer", [], false, 1.176, 'highlight');
	rvDataSets[0].addLayer("Interactions1", "MainLineLayer", [], true, 1.0, 'lines');
	rvDataSets[0].addLayer("Labels", "LabelLayer", [], true, 1.0, 'labels');
	rvDataSets[0].addLayer("Residues", "ResidueLayer", [], true, 1.0, 'residues');
	rvDataSets[0].addLayer("Data1", "CircleLayer1", [], true, 1.0, 'circles');
	rvDataSets[0].addLayer("Data2", "CircleLayer2", [], true, 1.0, 'circles');
	rvDataSets[0].addLayer("Selection", "SelectedLayer", [], false, 1.176, 'selected');
	
	rvViews[0] = new rvView(20, 20, 1.2);
	//resizeElements(true);
	$(".oneLayerGroup").remove();
	$(".oneSelectionGroup").remove();
	rvDataSets[0].addSelection("Main");
	if (canvas2DSupported) {
		InitRibovision2();
	}
	resizeElements();
	if (!canvas2DSupported) {return};
	if (OpenStateOnLoad && !FreshState) {
		$("#RiboVisionSaveManagerPanel").dialog("open");
	} else { 
		// Create rvLayers
		
		//rvDataSets[0].addLayer("Data2", "CircleLayer1", [], true, 1.0, 'circles');
		//rvDataSets[0].addLayer("Data1", "CircleLayer2", [], true, 1.0, 'circles');
		//rvDataSets[0].addLayer("ContourLine", "ContourLayer", [], true, 1.0, 'contour');
		
		// Sort rvLayers by zIndex for convience
		rvDataSets[0].sort();
		if (canvas2DSupported) {
			InitRibovision2();
		}
		resizeElements();
	}
}

function InitRibovision2(noLoad) {
	//adopt to current screen size
	rvViews[0].width = rvDataSets[0].HighlightLayer.Canvas.width;
	rvViews[0].height = rvDataSets[0].HighlightLayer.Canvas.height;
	rvViews[0].clientWidth = rvDataSets[0].HighlightLayer.Canvas.clientWidth;
	rvViews[0].clientHeight = rvDataSets[0].HighlightLayer.Canvas.clientHeight;
	
	// Put in Layers
	$(".oneLayerGroup").remove();
	$.each(rvDataSets[0].Layers, function (key, value){
		LayerMenu(value, key);
	});
	RefreshLayerMenu();
	
	// Put in Selections
	$(".oneSelectionGroup").remove();
	$.each(rvDataSets[0].Selections.reverse(), function (key, value){
		SelectionMenu(value, key);
	});
	
	//Default check first selection. Come back to these to restore saved state
	$("#SelectionPanel div").first().next().find(".selectSelectionRadioBtn").attr("checked", "checked");
	RefreshSelectionMenu();
	
	//Set some menu choices, none being restored yet
	document.getElementById("ProtList").selectedIndex = 0;
	document.getElementById("alnList").selectedIndex = 0;
	document.getElementById("PrimaryInteractionList").selectedIndex = 0;
	document.getElementById("speciesList").selectedIndex = 0;
	document.getElementById('commandline').value = "";	
	

	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
	if (!noLoad){
		InitRibovision3();
	}
}
function InitRibovision3() { 
	$.getJSON('getData.php', {
		FetchMapList : true
	}, function (MapList) {
		
		var SpeciesList = [];
		var SubUnits = [];
		$("#speciesList li[role=presentation]").remove();
		
		$.each(MapList, function (ind, item) {
			SpeciesList.push(MapList[ind].Species_Name);
			SubUnits.push(MapList[ind].Subunit);
		});
		SpeciesListU = $.grep(SpeciesList, function (v, k) {
				return $.inArray(v, SpeciesList) === k;
			});
		//alert(SpeciesList);
		
		
		$.each(SpeciesListU, function (i, item) {
			$("#speciesList").append(
				$("<li>").append(
					$("<a>").attr('href', '#').append(
						SpeciesListU[i])))
			
			// Subunits
			var FoundSubUnits = [];
			for (var j = 0; j < SpeciesList.length; j++) {
				if (SpeciesListU[i] == SpeciesList[j]) {
					FoundSubUnits.push(SubUnits[j]);
				}
			}
			//alert(FoundSubUnits);
			FoundSubUnitsU = $.grep(FoundSubUnits, function (v, k) {
					return $.inArray(v, FoundSubUnits) === k;
				});
			
			$("#speciesList li:last").append($("<ul>").attr('id', SpeciesListU[i].replace(/[\s]/g, "") + 'sub'))
			
			for (var jj = 0; jj < FoundSubUnitsU.length; jj++) {
				if (FoundSubUnitsU[jj] == 'LSU') {
					$("#" + SpeciesListU[i].replace(/[\s]/g, "") + 'sub').append(
						$("<li>").append(
							$("<a>").attr('href', '#').append(
								'Large SubUnit')))
					
					// MapTypes
					$("#speciesList li:last").append($("<ul>").attr('id', SpeciesListU[i].replace(/[\s]/g, "") + 'sub' + 'LSU'))
					
					$.each(MapList, function (ii, item) {
						if (MapList[ii].Species_Name == SpeciesListU[i]) {
							if (MapList[ii].Subunit == FoundSubUnitsU[jj]) {
								$("#" + SpeciesListU[i].replace(/[\s]/g, "") + 'sub' + 'LSU').append(
									$("<li>").append(
										$("<a>").attr('href', '#' + MapList[ii].SS_Table).append(
											MapList[ii].MapType + ' Map')))
							}
						}
					});
				} else if (FoundSubUnitsU[jj] == 'SSU') {
					$("#" + SpeciesListU[i].replace(/[\s]/g, "") + 'sub').append(
						$("<li>").append(
							$("<a>").attr('href', '#').append(
								'Small SubUnit')))
					// MapTypes
					$("#speciesList li:last").append($("<ul>").attr('id', SpeciesListU[i].replace(/[\s]/g, "") + 'sub' + 'SSU'))
					
					$.each(MapList, function (iii, item) {
						if (MapList[iii].Species_Name == SpeciesListU[i]) {
							if (MapList[iii].Subunit == FoundSubUnitsU[jj]) {
								$("#" + SpeciesListU[i].replace(/[\s]/g, "") + 'sub' + 'SSU').append(
									$("<li>").append(
										$("<a>").attr('href', '#' + MapList[iii].SS_Table).append(
											MapList[iii].MapType + ' Map')))
							}
						}
					});
				}
			}
			
		});
		
		$("#speciesList").menu("refresh");
		var list = $('#speciesList');
		var firstLI = list.find('li').first();
		list
		.iosMenu()
		.focus()
		.menu('focus', {}, firstLI)
		.bind('menuselect', function (event, ui) {
			var species = $(ui.item).find("a").attr('href');
			loadSpecies(species.substr(1));
			
		});
	});
}
///////////////////////////////////////////////////////////////////////////////
