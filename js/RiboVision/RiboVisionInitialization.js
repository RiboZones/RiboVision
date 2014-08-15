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
	$("#MiniOpenLayerBtn").button({
	});
	$("#LinkSection").droppable({
		drop: function (event,ui) {
			if ($(ui.draggable[0]).hasClass("miniLayerName")){
				var targetLayer = rvDataSets[0].getLayer($(ui.draggable[0]).attr("name"));
				$(".oneLayerGroup[name='" + targetLayer.LayerName + "']").find(".mappingRadioBtn").prop("checked",true);	
				$(".oneLayerGroup[name='" + targetLayer.LayerName + "']").find(".mappingRadioBtn").trigger("change");	
			}
		}
	});
	$("#MiniOpenLayerBtn").click(function () {
		$("#PanelTabs").tabs( "option", "active", 0 );
		$("#LayerDialog").dialog("open");
		return false;
	});
	
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
	$("#SaveTabs").tabs();
	
	$("#dialog-saveEverything").dialog({
		resizable : false,
		autoOpen : false,
		height : 600,
		width : 1000,
		modal : true,
		open : function () {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
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

	$("#RiboVisionSettingsPanel").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 300
		},
		width : 1200,
		height : 650,
		position : {
			my : "left top",
			at : "left top",
			of : $("#SiteInfo")
		},
		open : function (event) {
			$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			$("#myJmol_object").css("visibility", "visible");
		}
	});
	$("#clearLS").click(function(){
		if(localStorageAvailable){
			localStorage.clear();
			$("#SessionList").text("");			
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
		$("#SaveTabs").tabs( "option", "active", 2 );
		$("#dialog-saveEverything").dialog("open");
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
			//$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			//$("#myJmol_object").css("visibility", "visible");
		}
	});
	$( "#dialog-invalid-color-error" ).dialog({
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
			//$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			//$("#myJmol_object").css("visibility", "visible");
		}
	});
	$( "#dialog-unique-selection-error" ).dialog({
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
			//$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			//$("#myJmol_object").css("visibility", "visible");
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
			//$("#myJmol_object").css("visibility", "hidden");
		},
		close : function () { 
			//$("#myJmol_object").css("visibility", "visible");
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
			"Restore": function() {
				openRvState();
				$( this ).dialog( "close" );
			}/*,
			"Fresh State": function () {
				InitRibovision(true);
				$( this ).dialog( "close" );
			}*/
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
	
	$("#colorpicker").farbtastic("#MainColor");
	$("#MainColor").button().addClass('ui-textfield').keydown(function (event) {
		if (event.keyCode == 13) {
			var farbobj = $.farbtastic("#colorpicker");
			farbobj.setColor(colorNameToHex($("#MainColor").val()));
		}
	});
	$("#colorpicker3").farbtastic("#LineColor");
	$("#LineColor").button().addClass('ui-textfield').keydown(function (event) {
		if (event.keyCode == 13) {
			var farbobj = $.farbtastic("#colorpicker3");
			farbobj.setColor(colorNameToHex($("#LineColor").val()));
		}
	});
	//$("#layerColor").change(changeLayerColor);
	
	$("#layerColorPicker").farbtastic("#layerColor");
	$("#layerColorPicker2").farbtastic("#layerColor2");
	
	$("#SideBarAccordian").accordion({
		heightStyle: "fill",
		activate : function (event, ui) {},
		animate: 300
	});
	
	//$("#tabs").tabs();
	$("#ProtList").multiselect({
		minWidth : 160,
		selectedText : "# of # proteins selected",
		noneSelectedText : 'Select proteins',
		selectedList : 9
	});
	$("#ProtList").multiselect().multiselectfilter();
	/*
	$("#StructDataList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1,
		click: function(event,ui){
			
			var targetLayer = rvDataSets[0].getSelectedLayer();
			targetLayer.DataLabel = ui.text;
			$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer.DataLabel);
			var ColName = ui.value.match(/[^\'\\,]+/);
			var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
			if (result[0]){
				$(this).parent().find(".DataDescription").text(result[0].Description);
				$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation/" + result[0].HelpLink + ".html");
			} else {
				$(this).parent().find(".DataDescription").text("Data Description is missing.");
				$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation");				
			}
			updateStructData(ui);
		}
	});*/
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
	
	/*$("#alnList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1,
		click: function(event,ui){
			
			var targetLayer = rvDataSets[0].getSelectedLayer();
			targetLayer.DataLabel = ui.text;
			$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer.DataLabel);
			var ColName = ui.value.match(/[^\'\\,]+/);
			var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
			if (result[0]){
				//$(this).parent().find(".DataDescription").text(result[0].Description);
				//$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation/" + result[0].HelpLink + ".html");				
			} else {
				//$(this).parent().find(".DataDescription").text("Data Description is missing.");
				//$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation");				
			}
			colorMapping("42",ui.value);
			drawNavLine();
		}
	});*/
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
			$("[name=" + targetLayer[0].LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer[0].DataLabel);
			var ColName =[];
			ColName[0] = ui.value.replace(/[^_]+_[^_]+_/,"").replace(/[^_]+_/,"");
			var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
			if (result[0]){
				$(this).parent().parent().find(".DataDescription").text(result[0].Description);
				$(this).parent().parent().find(".ManualLink").attr("href","./Documentation/" + result[0].HelpLink + ".html");
			} else {
				$(this).parent().parent().find(".DataDescription").text("Data Description is missing.");
				$(this).parent().parent().find(".ManualLink").attr("href","./Documentation");				
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
	$("#SaveEverythingBtn").button().click(function(){
		$("#dialog-saveEverything").dialog("open");
		return false;
	});

	$("#freshenRvState").button().click(function(){
		InitRibovision(true);
	});
	$("#ssSaveB").button().click(function(){
		rvSaveManager("Save","LocalStorage");
	});
	$("#ssRestoreB").button().click(function(){
		rvSaveManager("Restore","LocalStorage");
	});
	$("#ssSaveF").button().click(function(){
		rvSaveManager("Save","File");
	});
	$("#ssRestoreF").button().click(function(){
		rvSaveManager("Restore","File");
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
	
	$(".toolBarBtn").css('height', $("#openLayerBtn").css('height'));
	$(".toolBarBtn").css('width', $("#openLayerBtn").css('width'));
	
	
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
	
	$("#ResidueTipToggle").buttonset();
	$("#rtON").attr("checked","checked");
	$("#ResidueTipToggle").buttonset("refresh");
	
	$("#NavLineToggle").buttonset();
	$("#nlON").attr("checked","checked");
	$("#NavLineToggle").buttonset("refresh");
	$("[name=nl]").button().change(function(event,ui){
		resizeElements();
		$('#NavLineDiv').empty();
		drawNavLine();
	});
	
	$("#JmolToggle").buttonset();
	//$("#jpON").attr("checked","checked");
	//$("#JmolToggle").buttonset("refresh");
	$("[name=jp]").button().change(function(event,ui){
		if($('input[name="jp"][value=on]').is(':checked')){
			if($('input[name="jjsmol"][value=JS]').is(':checked')){
				JmolInfo["use"]="HTML5";
			} else {
				JmolInfo["use"]="Java";
			}
			myJmol = Jmol.getApplet("myJmol", JmolInfo); 
			$('#jmolDiv').html(Jmol.getAppletHtml(myJmol));
			$('#myJmol_appletdiv').css("z-index",-9000);
			if(rvDataSets[0].SpeciesEntry.Jmol_Script){
				Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
				var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
				Jmol.script(myJmol, jscript);
				updateModel();
				update3Dcolors();
				var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
					return this.value;
				}).get();
				colorMappingLoop(undefined,array_of_checked_values);
			}
		} else {
			$("#jmolDiv").html("");
			myJmol=null;
		}
		resizeElements();
	});
	$("[name=ptmod]").button().change(function(event,ui){
		var resMod = $('input[name="ptmod"][value=on]').is(':checked');
			$.each(rvDataSets[0].Residues, function (i, item) {
				if (resMod){
					item["resName"]=item["modResName"];
				} else {
					item["resName"]=item["unModResName"];
				}
			});
		rvDataSets[0].drawResidues("residues");
	});
	
	$("#JmolTypeToggle").buttonset();
	//$("#JmolJava").attr("checked","checked");
	//$("#JmolTypeToggle").buttonset("refresh");
	$("[name=jjsmol]").button().change(function(event,ui){
		if($('input[name="jp"][value=off]').is(':checked')){
			return;
		}
		if($('input[name="jjsmol"][value=JS]').is(':checked')){
			JmolInfo["use"]="HTML5";
		} else {
			JmolInfo["use"]="Java";
		}
		
		var O = Jmol.evaluate(myJmol,"script('show orientation')");
		myJmol = Jmol.getApplet("myJmol", JmolInfo); 
		$('#jmolDiv').html(Jmol.getAppletHtml(myJmol));
		Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
		var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
		Jmol.script(myJmol, jscript);
		updateModel();
		update3Dcolors();
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
			return this.value;
		}).get();
		colorMappingLoop(undefined,array_of_checked_values);
		var a = O.match(/reset[^\n]+/);
		Jmol.script(myJmol, a[0]);
	});
	
	$("[name=clearColor]").button();
	$("[name=selebutton]").button();
	//$("[name=saveas]").button();	
	$(":button").button();	
	$(":radio").button();
	$("[name=savelayers]").button();
	$("#colorSelection").button();
	//$("#layerColorSelection").button();
	if(typeof(Storage)!=="undefined"){
	  localStorageAvailable = true;
	  // Yes! localStorage and sessionStorage support!
	  // Some code.....
		var RSL = localStorage["RV_Session_List"];
		if(RSL){
			$("#SessionList").text(localStorage["RV_Session_List"].replace(/[\[\]"]/g,"").replace(/,/g,", "));
			var RSLa = JSON.parse(RSL);
			$("#SaveStateFileName").val(RSLa[RSLa.length -1]);
		}
	}else{
	  localStorageAvailable = false;
	  //alert("Sorry! No web storage support..");
	}
	$("#ProtList").on("multiselectclick", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(undefined,array_of_checked_values);
	});
	$("#ProtList").on("multiselectopen", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(undefined,array_of_checked_values);
		/*
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		var targetLayer = rvDataSets[0].getSelectedLayer();
		//targetLayer.DataLabel = ui.text;
		targetLayer.DataLabel = "Protein Contacts";
		//var ColName = ui.value.match(/[^\'\\,]+/);
		var ColName = [];
		ColName[0] = "All_Proteins";
		var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
		if (result[0]){
			$(this).parent().find(".DataDescription").text(result[0].Description);
			$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation/" + result[0].HelpLink + ".html");
		} else {
			$(this).parent().find(".DataDescription").text("Data Description is missing.");
			$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation");
		}
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer.DataLabel);
		colorMappingLoop(array_of_checked_values);
		//drawNavLine();*/
	});
	$("#ProtList").on("multiselectcheckall", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(undefined,array_of_checked_values);
		/*
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		var targetLayer = rvDataSets[0].getSelectedLayer();
		//targetLayer.DataLabel = ui.text;
		targetLayer.DataLabel = "Protein Contacts";
		//var ColName = ui.value.match(/[^\'\\,]+/);
		var ColName = [];
		ColName[0] = "All_Proteins";
		var result = $.grep(rvDataSets[0].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
		if (result[0]){
			$(this).parent().find(".DataDescription").text(result[0].Description);
			$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation/" + result[0].HelpLink + ".html");
		} else {
			$(this).parent().find(".DataDescription").text("Data Description is missing.");
			$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation");
		}
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer.DataLabel);
		colorMappingLoop(array_of_checked_values);*/
	});
	$("#ProtList").on("multiselectuncheckall", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(undefined,array_of_checked_values);
		/*	
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
			$(this).parent().find(".ManualLink").find("a").attr("href","/Documentation");
	
		//}
		$("[name=" + targetLayer.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer.DataLabel);
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
		drawNavLine();*/
	});
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
		
		$("#FileDiv").on('click', "input:file", function (event) {
			    this.value = null;
		});
		$("#FileDiv").on('change', "input:file", function (event) {
			handleFileSelect(event);
			//resetFileInput($('#files'));
		});
		
		//document.getElementById('files').addEventListener('change',{$('#files').on('change', handleFileSelect);handleFileSelect}, false);
		//alert('File APIs are as good as Curiosity');
	} else {
		dd = document.getElementById('FileDiv');
		dd.innerHTML = "Your browser doesn't support file loading feature. IE does not support it until IE10+.";
	}
	
	modeSelect("move");
	
	$("#canvasDiv").on('mousewheel',mouseWheelFunction);
	$("#canvasDiv").on("mousemove", mouseMoveFunction);
	$("#canvasDiv").on("mousedown", mouseEventFunction);
	$("#canvasDiv").on("mouseup", mouseEventFunction);
	$(window).on("resize", resizeElements);

	$(window).on("mouseup", function (event) {
		$("#canvasDiv").off("mousemove", dragHandle);
		$("#canvasDiv").off("mousemove", dragSelBox);
		rvDataSets[0].HighlightLayer.clearCanvas();
	});
	
  /////////////
	$("#canvasDiv").on("mouseout", function (event) {
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
		value : 78.5,
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
		max : 1,
		value : 0.5,
		step : 0.05,
		orientation : "horizontal",
		slide : function (event, ui) {
			changeLineOpacity(ui.value);
		}
    });  
	$('.ui-slider-handle').height(21).width(21);  
	
	$(window).unload(function() {		
		//localStorage.setItem("rvDataSets",rvDataSets);
	});
	
	$("#SelectionMode").click(function () {
	});
	/*
	$("#New3DTestButton").button().click(function(){
		Jmol.script(myJmol, "script states/" + "3OFR_23s_supNone_state8_d6.spt");
		var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
		Jmol.script(myJmol, jscript);
		updateModel();
	});*/
	
	$("#JmolTypeToggle2").buttonset();
	$("#SetDefaultJmolType").button().click(function() {
		$("#dialog-Jmol-Type").dialog("open");
	});
	
	$( "#dialog-Jmol-Type" ).dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 900,
		modal : true,
		buttons: {
			Ok: function() {
				var JmolState;
				if ($('input[name="jjsmol2"][value=Java]').is(':checked')){
					$('[name="jjsmol"][value="Java"]').attr("checked", true);
					$('[name="jp"][value="on"]').attr("checked", true).trigger("change");
					//.trigger("change");
					JmolState="Java";
				} else if ($('input[name="jjsmol2"][value=JS]').is(':checked')) {
					$('[name="jjsmol"][value="JS"]').attr("checked", true)
					$('[name="jp"][value="on"]').attr("checked", true).trigger("change");
					//.trigger("change");
					JmolState="JS";
				} else if ($('input[name="jjsmol2"][value=Disabled]').is(':checked')) {
					$('[name="jp"][value="off"]').attr("checked", true).trigger("change");;
					$('[name="jjsmol"][value="Java"]').attr("checked", true);
					JmolState="Disabled";
				} else {
					alert("How did this happen?");
				}
				$("#JmolTypeToggle").buttonset("refresh");
				if($("#RememberJmol").is(":checked")){
					set_cookie("JmolState", JmolState, 365);
				};
				$( this ).dialog( "close" );
			}
		},
		open : function () {
			myJmol = Jmol.getApplet("myJmol", JmolInfo,true); 
			//$("#myJmol_object").css("visibility", "hidden");
			$("#JMolDisabled").attr("checked","checked");	
			/*
			if (myJmol._isJava){
				//$("#JmolType").text("Jmol (Java)");	
				//$("#JmolJava2").attr("checked","checked");
			} else {
				//$("#JmolType").text("JSmol (no Java)");
				//$("#JSmolJS2").attr("checked","checked");				
			}*/
			$("#JmolTypeToggle2").buttonset("refresh");
		},
		close : function () { 
			//$("#myJmol_object").css("visibility", "visible");
		}
	});
	
	
	Jmol.setDocument(0);	
	
	$("#JmolTypeToggle").buttonset("refresh");
	InitLayers();
	InitSelections();
	
	
	InitRibovision();
};

function InitRibovision(FreshState) {
	//debugger;
	rvDataSets[0] = new rvDataSet("EmptyDataSet");
	rvDataSets[0].addHighlightLayer("HighlightLayer", "HighlightLayer", [], false, 1.176, 'highlight');
	rvDataSets[0].addLayer("Interactions", "InteractionsLayer", [], true, 1.0, 'lines');
	rvDataSets[0].addLayer("Labels", "LabelLayer", [], true, 1.0, 'labels');
	rvDataSets[0].addLayer("ContourLine", "ContourLine", [], true, 1.0, 'contour');
	rvDataSets[0].addLayer("Letters", "NucleotideLayer", [], true, 1.0, 'residues');
	rvDataSets[0].addLayer("Circles", "CircleLayer1", [], true, 1.0, 'circles');
	//rvDataSets[0].addLayer("Data2", "CircleLayer2", [], true, 1.0, 'circles');
	rvDataSets[0].addLayer("Selection", "SSelectionLayer", [], false, 1.176, 'selected');
	rvDataSets[0].sort();
	
	rvViews[0] = new rvView(20, 20, 1.2);
	//resizeElements(true);
	$(".oneLayerGroup").remove();
	$(".oneSelectionGroup").remove();
	rvDataSets[0].addSelection("Selection_1");
	switch (get_cookie("JmolState")) {
		case "Java" :
			$('[name="jjsmol"][value="Java"]').attr("checked", true);
			$('[name="jp"][value="on"]').attr("checked", true).trigger("change");
			break;
		case "JS" :
			$('[name="jjsmol"][value="JS"]').attr("checked", true)
			$('[name="jp"][value="on"]').attr("checked", true).trigger("change");
			break;
		case "Disabled" :
			$('[name="jp"][value="off"]').attr("checked", true).trigger("change");;
			$('[name="jjsmol"][value="Java"]').attr("checked", true);
			break
		default :
			$("#dialog-Jmol-Type").dialog("open");
	}
	if (canvas2DSupported) {
		InitRibovision2(false,FreshState);
	}
	resizeElements();
	if (!canvas2DSupported) {return};
	if (OpenStateOnLoad && !FreshState) {
		$("#SaveTabs").tabs( "option", "active", 2 );
		$("#dialog-saveEverything").dialog("open");
	}
}

function InitRibovision2(noLoad,FreshState) {
	//adopt to current screen size
	rvViews[0].width = rvDataSets[0].HighlightLayer.Canvas.width;
	rvViews[0].height = rvDataSets[0].HighlightLayer.Canvas.height;
	rvViews[0].clientWidth = rvDataSets[0].HighlightLayer.Canvas.clientWidth;
	rvViews[0].clientHeight = rvDataSets[0].HighlightLayer.Canvas.clientHeight;
	
	//remove minilayers
	$(".miniLayerName").remove();
	
	// Put in Layers
	$(".oneLayerGroup").remove();
	$.each(rvDataSets[0].Layers, function (key, value){
		LayerMenu(value, key);
	});
	RefreshLayerMenu();
	//Refresh Linked MiniLayer
	var linkedLayer = rvDataSets[0].getLinkedLayer();
	$("#LinkSection").find(".miniLayerName").remove();
	$("#LinkSection").append($('<h3 class="miniLayerName ui-helper-reset ui-corner-all ui-state-default ui-corner-bottom ">')
		.text(linkedLayer.LayerName).attr('name',linkedLayer.LayerName).droppable({
			drop: function (event,ui) {
				ProcessBubbleDrop(event,ui);
			}
		}));
	// Put in Selections
	$(".oneSelectionGroup").remove();
	$.each(rvDataSets[0].Selections.reverse(), function (key, value){
		SelectionMenu(value, key);
	});
	
	//Default check first selection. Come back to these to restore saved state
	$("#SelectionPanel div").first().next().find(".selectSelectionRadioBtn").attr("checked", "checked");
	RefreshSelectionMenu();
	
	//Set some menu choices, none being restored yet
	//document.getElementById("ProtList").selectedIndex = 0;
	//document.getElementById("alnList").selectedIndex = 0;
	//document.getElementById("PrimaryInteractionList").selectedIndex = 0;
	//document.getElementById("speciesList").selectedIndex = 0;
	document.getElementById('commandline').value = "";	
	

	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	rvDataSets[0].drawContourLines("contour");
	
	if (!noLoad){
		InitRibovision3(FreshState);
	}
}
function InitRibovision3(FreshState) { 
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
					$("<a>").attr('href', '#').append($('<i>').append(
						SpeciesListU[i]))))
			
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
											MapList[ii].DataSetName)))
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
											MapList[iii].DataSetName)))
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
		.on('menuselect', function (event, ui) {
			var species = $(ui.item).find("a").attr('href');
			loadSpecies(species.substr(1));
			
		});
		if (FreshState){
			list.iosMenu().data("iosMenu")._insertBackButtons();
		};
		if(window.location.hash) {
			var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
			loadSpecies(hash);
			// auto-load species if direct link
		}
	});
}
///////////////////////////////////////////////////////////////////////////////
