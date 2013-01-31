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


function loadSpecies(species,DoneLoading,DoneLoading2) {
	rvDataSets[0].Name=species;
	$.each(rvDataSets[0].Layers, function (i, item){
		item.clearCanvas();
	});
	if (species != "None") {
		$.getJSON('getData.php', {
			Residues : species
		}, function (data) {
			$.each(data, function (i, item) {
				data[i]["color"] = "#000000";
				data[i]["selected"] = 0;
				data[i]["CurrentData"] = data[i]["map_Index"];
			});
			rvDataSets[0].addResidues(data);
			rvDataSets[0].clearData("circles");
			clearColor(false);
			
			$.getJSON('getData.php', {
				SpeciesTable : species
			}, function (species_entry2) {
				rvDataSets[0].addSpeciesEntry(species_entry2[0]);
				initLabels(species);
				// Set Selection Menu
				populateDomainHelixMenu();
				
				//Set Protein Menu
				var pl = document.getElementById("ProtList");
				var ProtList = rvDataSets[0].SpeciesEntry.ProteinMenu.split(";");
				pl.options.length = 0;
				//pl.options[0]=new Option("None","clear_data");
				rvDataSets[0].SpeciesEntry.SubunitProtChains = new Array;
				rvDataSets[0].SpeciesEntry.SubunitProtChains[0] = new Array;
				rvDataSets[0].SpeciesEntry.SubunitProtChains[1] = new Array;
				rvDataSets[0].SpeciesEntry.SubunitProtChains[2] = new Array;
				
				if (ProtList[0] != "") {
					for (var i = 0; i < ProtList.length; i++) {
						var NewProtPair = ProtList[i].split(":");
						pl.options[i] = new Option(NewProtPair[0], NewProtPair[1]);
						rvDataSets[0].SpeciesEntry.SubunitProtChains[0][i] = NewProtPair[0];
						rvDataSets[0].SpeciesEntry.SubunitProtChains[1][i] = NewProtPair[2];
						rvDataSets[0].SpeciesEntry.SubunitProtChains[2][i] = NewProtPair[1];
						
					}
				}
				rvDataSets[0].SpeciesEntry["SubunitProtChains"] = rvDataSets[0].SpeciesEntry.SubunitProtChains;
				$("#ProtList").multiselect("refresh");
				
				//Set Alignment Menu
				var al = document.getElementById("alnList");
				var AlnList = rvDataSets[0].SpeciesEntry.AlnMenu.split(";");
				al.options.length = 0;
				al.options[0] = new Option("None", "clear_data");
				al.options[0].setAttribute("selected", "selected");
				if (AlnList[0] != "") {
					for (var ii = 0; ii < AlnList.length; ii++) {
						var NewAlnPair = AlnList[ii].split(":");
						al.options[ii + 1] = new Option(NewAlnPair[0], NewAlnPair[1]);
					}
				}
				
				$("#alnList").multiselect("refresh");
				
				//Set StructData Menu
				var sl = document.getElementById("StructDataList");
				var SDList = rvDataSets[0].SpeciesEntry.StructDataMenu.split(";");
				sl.options.length = 0;
				sl.options[0] = new Option("None", "'clear_data'");				
				sl.options[0].setAttribute("selected", "selected");
				if (SDList[0] != "") {
					for (var ii = 0; ii < SDList.length; ii++) {
						var NewSDPair = SDList[ii].split(":");
						sl.options[ii + 1] = new Option(NewSDPair[0], NewSDPair[1]);
					}
				}
				
				$("#StructDataList").multiselect("refresh");
				
				//Set interaction Menu
				var il = document.getElementById("PrimaryInteractionList");
				var BPList = rvDataSets[0].SpeciesEntry.InterActionMenu.split(";");
				il.options.length = 0;
				il.options[0] = new Option("None", "clear_lines", true, true);				
				il.options[0].setAttribute("selected", "selected");
				if (BPList[0] != "") {
					for (var iii = 0; iii < BPList.length; iii++) {
						var NewBPair = BPList[iii].split(":");
						il.options[iii + 1] = new Option(NewBPair[0], NewBPair[1]);
					}
				}
				$("#PrimaryInteractionList").multiselect("refresh");
				
				Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
				var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
				Jmol.script(myJmol, jscript);
				
				//clearSelection();
				rvDataSets[0].drawResidues("residues");
				rvDataSets[0].drawLabels("labels");
				
				$("#TemplateLink").attr("href", "./Templates/" + species + "_UserDataTemplate.csv")
				// Get conservation table
				$.getJSON('getData.php', {
					FullTable : rvDataSets[0].SpeciesEntry.ConservationTable
					}, function (ConservationTable) {
						rvDataSets[0].ConservationTable=ConservationTable;
				});
				// get data description table
				$.getJSON('getData.php', {
					FullTable : "DataDescriptions"
					}, function (data) {
					rvDataSets[0].DataDescriptions=data;
				});
				
				drawNavLine(); //load navLine 
				if (DoneLoading2){
				DoneLoading2.resolve();
				}
			}
			);
			if (DoneLoading){
				DoneLoading.resolve();
			}
		});
	} else {
		rvDataSets[0].addResidues([]);
		rvDataSets[0].SpeciesEntry = [];
		rvDataSets[0].SpeciesEntry.Species_Abr = [];
		rvDataSets[0].SpeciesEntry.PDB_chains = [];
		rvDataSets[0].SpeciesEntry.Molecule_Names = [];
		rvDataSets[0].SpeciesEntry.TextLabels = [];
		rvDataSets[0].SpeciesEntry.LineLabels = [];
		rvDataSets[0].SpeciesEntry["SubunitProtChains"] = [];
		rvDataSets[0].SpeciesEntry.MapType = "None";
		
		initLabels(species);
		
		var pl = document.getElementById("ProtList");
		pl.options.length = 0;
		pl.options[0] = new Option("None", "clear_data");
		var al = document.getElementById("alnList");
		al.options.length = 0;
		al.options[0] = new Option("None", "clear_data");
		var sl = document.getElementById("StructDataList");
		sl.options.length = 0;
		sl.options[0] = new Option("None", "clear_data");
		var il = document.getElementById("PrimaryInteractionList");
		il.options.length = 0;
		il.options[0] = new Option("None", "clear_lines");
		
		rvDataSets[0].SpeciesEntry.Jmol_Script = "blank_state.spt";
		//jmolScript("script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
		Jmol.script(myJmol, "script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
		//clearSelection();
		//console.log("Nothing to see here, move along now, and 42!");
		welcomeScreen();
		if (DoneLoading){
			DoneLoading.resolve();
		}
	}
	document.getElementById("ProtList").selectedIndex = 0;
	document.getElementById("alnList").selectedIndex = 0;
	document.getElementById("PrimaryInteractionList").selectedIndex = 0;
	rvDataSets[0].BasePairs = [];
}