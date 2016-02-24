/* RiboVision 1.2 script library RiboVision.js 6:42 PM 04/25/2015 Chad R. Bernier


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

// for documentation see apollo.chemistry.gatech.edu/RiboVision/Documentation
//This doesn't exist and this probably won't be the final license.

// Initialize Jmol
//jmolInitialize("./jmol");
//Jmol.debugCode = true
/*
var myJmol1;
var myInfo1 = {
        height: '100%',
        width: '100%',
        jarFile: "JmolApplet.jar",
        jarPath: '..',
        j2sPath: "j2s",
        use: 'HTML5',
	console: "myJmol1_infodiv",
        debug: false
};*/

var JmolInfo = {
	addSelectionOptions: false,
	color: "#FFFFFF",
	debug: false,
	defaultModel: "",
	height: "100%",
	j2sPath: "./jmol/j2s", 
	isSigned: true,
	jarFile: "JmolAppletSigned0.jar",
	jarPath: "./jmol/java",
	//j2sPath: "jmol/jsmol/j2s",
	memoryLimit: 1024,
	readyFunction: null,
	script: null,
	serverURL: "./jmol/jsmol.php",
	src: null,
	use: "Java HTML5",
	width: "100%"
};	

function load3Dstructure(){
	if(myJmol!=null){
		Jmol.script(myJmol, "script states/" + rvDataSets[speciesIndex].SpeciesEntry.Jmol_Script);
		var jscript = "display " + rvDataSets[speciesIndex].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
		Jmol.script(myJmol, jscript);
		updateModel();
	}
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

//////////////////////////////// Jmol Functions ////////////////////////////////
function updateModel() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	var n;
	var script;
	$.each(rvDataSets, function (index, rvds) {
		//Come back and support multiple selections?
		var targetSelection = rvds.getSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
		if (targetSelection.Residues.length > 0){
			if (typeof script == 'undefined'){
				script='set hideNotSelected true;select (';
			}
			script += rvds.SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and (";
			for (var i = 0; i < targetSelection.Residues.length; i++) {
				if (targetSelection.Residues[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") != null) {
					if (i > 0 || (index > 0 && i > 0)) {
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
			if (index !== rvDataSets.length - 1){
				script += ") or ";
			}
		} else {
			refreshModel();
		}
	});
	if (typeof script != 'undefined'){
		script += "));center selected;";
		Jmol.script(myJmol, script);
	}
}

function refreshModel() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	var script= "set hideNotSelected true;select (";
	$.each(rvDataSets, function (index, rvds) {
		if (index > 0 ){
			script +=" or ";
		}
		script += rvds.SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and (";
		if (rvds.SpeciesEntry.PDB_chains){
			for (var ii = 0; ii < rvds.SpeciesEntry.PDB_chains.length; ii++) {
				script += ":" + rvds.SpeciesEntry.PDB_chains[ii];
				if (ii < (rvds.SpeciesEntry.PDB_chains.length - 1)) {
					script += " or ";
				}
			}
			
		}
		script += ")";
	});
	script += "); center selected;";
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