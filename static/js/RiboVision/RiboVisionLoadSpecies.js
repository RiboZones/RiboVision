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

function processResidueData(ResidueData,speciesIndex){
	var resMod = $('input[name="ptmod"][value=on]').is(':checked');
	var resXs=[];
	var resYs=[];
	var targetLayer = rvDataSets[speciesIndex].getLayerByType("residues");
	
	ResidueData["speciesIndex"]=speciesIndex;
	$.each(ResidueData, function (i, item) {
		item["color"] = "#000000";
		item["selected"] = 0;
		item["font-weight"] = "normal";
		targetLayer[0].Data[i] = item["Domains_Color"];
		if (resMod){
			item["resName"]=item["modResName"];
		} else {
			item["resName"]=item["unModResName"];
		}
		resXs[i]=parseFloat(item["X"]);
		resYs[i]=parseFloat(item["Y"]);
		ResiduePositions[speciesIndex][i]=[[]];
		ResiduePositions[speciesIndex][i]["X"]=resXs[i] + rvDataSets[speciesIndex].PageOffset[0];
		ResiduePositions[speciesIndex][i]["Y"]=resYs[i] + rvDataSets[speciesIndex].PageOffset[1];
	});
	rvDataSets[speciesIndex].addResidues(ResidueData);
	//Deal with Views
	var resRangeX=Math.max.apply(null,resXs) - Math.min.apply(null,resXs);
	var resXcenter=Math.min.apply(null,resXs) + resRangeX/2;
	var resRangeY=Math.max.apply(null,resYs) - Math.min.apply(null,resYs);
	var resYcenter=Math.min.apply(null,resYs) + resRangeY/2;
	
	rvViews[0].defaultScale=612/resRangeX;
	rvViews[0].defaultX=rvViews[0].defaultScale*(306-resXcenter);
	rvViews[0].defaultY=rvViews[0].defaultScale * (398-resYcenter);
	
	resetView();
	
	//
	
}


function loadSpecies(species,customResidues,DoneLoading,DoneLoading2) {
	var speciesSplit=species.split("&");
	
	// Start loading 3D
	$.getJSON('RiboVision/v1.0/fetchStructure', {
		structure_hash : species
		}, function (data) {
			waitFor3Dinit(data[0]);
	});
	
	// get data description table
	$.getJSON('RiboVision/v1.0/fullTable', {
		FullTable : "DataDescriptions"
		}, function (data) {
		rvDataSets[0].DataDescriptions=data;
	});
	
	//load SpeciesEntry
	$.ajax({
            type: 'POST',
			contentType: 'application/json', 
			accept: 'application/json',
			url: 'RiboVision/v1.0/speciesTable',
            data: JSON.stringify(speciesSplit),
            success: function(data) {
				$.each(data, function (index, value) {
					speciesIndex=$.inArray(value.SS_Table,speciesSplit);
					prepare_rvDataSet(speciesIndex);
					rvDataSets[speciesIndex].selectLayer($('input:radio[name=selectedRadioL]').filter(':checked').parent().parent().attr('name'));
					rvDataSets[speciesIndex].linkLayer($('input:radio[name=mappingRadioL]').filter(':checked').parent().parent().attr('name'));
					rvDataSets[speciesIndex].addSpeciesEntry(value);
					// Set offset. Right now, only side by side, two structures are allowed, so this is easy.
					rvDataSets[speciesIndex].PageOffset[0] = (rvDataSets[speciesIndex].SpeciesEntry.Orientation == "landscape") ? 792 * rvDataSets[speciesIndex].SetNumber : 612 * rvDataSets[speciesIndex].SetNumber  ; //X direction
					rvDataSets[speciesIndex].PageOffset[1]=0; //Y direction
				})	
				initLabels(speciesSplit,customResidues);
				resizeElements(true);
				processDataSets(speciesSplit,customResidues,DoneLoading,DoneLoading2);        
				waitFor3Dload();    
				},
            error: function(error) {
                console.log(error);
            }
        });
	
	/* $.getJSON('/speciesTable', {
		SpeciesTable : JSON.stringify(speciesSplit)
		}, function (data) {
			$.each(data, function (index, value) {
				speciesIndex=$.inArray(value.SS_Table,speciesSplit);
				prepare_rvDataSet(speciesIndex);
				rvDataSets[speciesIndex].selectLayer($('input:radio[name=selectedRadioL]').filter(':checked').parent().parent().attr('name'));
				rvDataSets[speciesIndex].linkLayer($('input:radio[name=mappingRadioL]').filter(':checked').parent().parent().attr('name'));
				rvDataSets[speciesIndex].addSpeciesEntry(value);
				// Set offset. Right now, only side by side, two structures are allowed, so this is easy.
				rvDataSets[speciesIndex].PageOffset[0] = (rvDataSets[speciesIndex].SpeciesEntry.Orientation == "landscape") ? 792 * rvDataSets[speciesIndex].SetNumber : 612 * rvDataSets[speciesIndex].SetNumber  ; //X direction
				rvDataSets[speciesIndex].PageOffset[1]=0; //Y direction
			})	
			initLabels(speciesSplit,customResidues);
			resizeElements(true);
			waitFor3Dload();
			processDataSets(speciesSplit,customResidues,DoneLoading,DoneLoading2);
	}); */
	
	//ResiduePositions=[[]];
	MainResidueMap=[[]];

	if (speciesSplit.length >1){
		console.log("two species mode is not finished.");
		//Experimental code
	}
	
	//Set interaction Menu
	var il = document.getElementById("PrimaryInteractionList");
	il.options.length = 0;
	il.options[0] = new Option("None", "clear_lines", true, true);				
	il.options[0].setAttribute("selected", "selected");
		
	// Reset Domain Helix menu and Protein menu
	$("#selectByDomainHelix").find('option').remove().end();
	$("#ProtList").find('option').remove().end();
	
	window.location.hash = species;
	document.getElementById("ProtList").selectedIndex = 0;
	//document.getElementById("alnList").selectedIndex = 0;
	document.getElementById("PrimaryInteractionList").selectedIndex = 0;
	
}

function processDataSets(speciesSplit,customResidues,DoneLoading,DoneLoading2){
	$.each(speciesSplit, function (speciesIndex,speciesInterest){
		if(speciesInterest == ""){
			return false;
		}
		
		rvDataSets[speciesIndex].Name=speciesInterest;
		rvDataSets[speciesIndex].ColorProteins=[];
		$.each(rvDataSets[speciesIndex].Layers, function (i, item){
			item.clearAll();
		});
		rvDataSets[speciesIndex].ConservationTable=[];
		$(".dataBubble").remove();
		if (speciesInterest != "None") {
			rvDataSets[speciesIndex].clearData("residues");

			if (speciesInterest == "custom"){
				// Set offset. Right now, only side by side, two structures are allowed, so this is easy.
				rvDataSets[speciesIndex].PageOffset[0] = (rvDataSets[speciesIndex].SpeciesEntry.Orientation == "landscape") ? 792 * rvDataSets[speciesIndex].SetNumber : 612 * rvDataSets[speciesIndex].SetNumber  ; //X direction
				rvDataSets[speciesIndex].PageOffset[1]=0; //Y direction
				
				if  (customResidues){
					ResiduePositions[speciesIndex]=[[]];
					// Magic equation for Font_Size_SVG=x, Font_Size_Canvas = y 
					// y = 0.8x
					var x = customResidues[0].FontSize;
					var y = 0.8*x;
					rvDataSets[speciesIndex].Font_Size_SVG = x;
					rvDataSets[speciesIndex].Font_Size_Canvas = y;
					rvDataSets[speciesIndex].Circle_Radius = 0.55 * y; // Magic equation
					
					$.each(customResidues, function (i, item) {
						if (item["resName"]){
							item["modResName"]=item["resName"];
							item["unModResName"]=item["resName"];
						} else if (item["unModResName"]) {
							item["unModResName"]=item["unModResName"];
							if (item["modResName"]) {
								item["modResName"]=item["modResName"];
							} else {
								item["modResName"]=item["unModResName"];
							}
						} else {
							alert("no recognized residue numbers defined")
						}
					});
					processResidueData(customResidues,speciesIndex);
					//initLabels(speciesInterest,speciesIndex,customResidues);
				} else {
					//initLabels(speciesInterest,speciesIndex);
				}
				//MainResidueMap Section
				$.each(rvDataSets[speciesIndex].Residues, function (i,data){
					MainResidueMap[data.resNum]={};
					MainResidueMap[data.resNum].index=i;
					MainResidueMap[data.resNum].rvds_index=speciesIndex;
					MainResidueMap[data.resNum].X=parseFloat(ResiduePositions[speciesIndex][i]["X"]);
					MainResidueMap[data.resNum].Y=parseFloat(ResiduePositions[speciesIndex][i]["Y"]);
				});
				rvDataSets[speciesIndex].makeResidueList();
				rvDataSets[speciesIndex].makeContourLinePoints();
				if (!DoneLoading2) {
					clearSelection(true);
				}
				
				
			} else {
				ResiduePositions[speciesIndex]=[[]];
				$.getJSON('RiboVision/v1.0/fetchResidues', {
					structure_hash : speciesInterest
				}, function (db_residues) {
					processResidueData(db_residues,speciesIndex);
					var targetLayer = rvDataSets[speciesIndex].getLayerByType("residues");

					//Default Domain
					targetLayer[0].DataLabel = "Domains";
					$("[name=" + targetLayer[0].LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(targetLayer[0].DataLabel);
					var ColName = ["Domains_Color"];
					var result = $.grep(rvDataSets[speciesIndex].DataDescriptions, function(e){ return e.ColName === ColName[0]; });
					if (result[0]){
						var title = "Domains" + ": " + result[0].Description;
					} else {
						var title = "Data Description is missing.";
					}
					$(".miniLayerName[name=" + targetLayer[0].LayerName + "]").attr("title",title);
					if (DoneLoading){
						DoneLoading.resolve();
					}
					
					
					//MainResidueMap Section
					$.each(rvDataSets[speciesIndex].Residues, function (i,data){
						var uResName=rvDataSets[speciesIndex].SpeciesEntry.Molecule_Names[rvDataSets[speciesIndex].SpeciesEntry.PDB_chains.indexOf(data.ChainID)] + ":" + data.resNum.replace(/[^:]*:/g, "");
						//Overwrite resNum with molecule:number style, here. This will hold things over until the database is updated to only have that style. 
						data.resNum=uResName;
						
						MainResidueMap[uResName] = {};
						MainResidueMap[uResName].index = i;
						MainResidueMap[uResName].rvds_index = speciesIndex;
						MainResidueMap[uResName].X = parseFloat(ResiduePositions[speciesIndex][i]["X"]);
						MainResidueMap[uResName].Y = parseFloat(ResiduePositions[speciesIndex][i]["Y"]);
						
						var cResName = data.ChainID + ":" + data.resNum.replace(/[^:]*:/g, "");
						MainResidueMap[cResName] = uResName;
						//console.log(MainResidueMap[uResName]);
					});
					
					rvDataSets[speciesIndex].makeResidueList();
					rvDataSets[speciesIndex].makeContourLinePoints();
					
					if (!DoneLoading2) {
						clearSelection(true);
					}
					//initLabels(speciesInterest,speciesIndex);
					// Get conservation table
					$.getJSON('RiboVision/v1.0/fullTable', {
						FullTable : rvDataSets[speciesIndex].SpeciesEntry.ConservationTable
						}, function (ConservationTable) {
							rvDataSets[speciesIndex].ConservationTable=ConservationTable;
					});
					$("#TemplateLink").attr("href", "./Templates/" + speciesInterest + "_UserDataTemplate.csv")

					
					
					ProcessBubble($("#StructDataBubbles").find(".dataBubble:contains('Domains')"),targetLayer[0].LayerName)
					//rvDataSets[speciesIndex].drawResidues("residues");
					rvDataSets[speciesIndex].drawLabels("labels");
					rvDataSets[speciesIndex].drawContourLines("contour");
					
					drawNavLine(); //load navLine 				
					
					if (DoneLoading2){
						DoneLoading2.resolve();
					} 
					$(".oneLayerGroup[name='" + targetLayer[0].LayerName + "']").find(".mappingRadioBtn").prop("checked", true);
					$(".oneLayerGroup[name='" + targetLayer[0].LayerName + "']").find(".mappingRadioBtn").trigger("change");
				})
				
			}
			
		} else {
			rvDataSets[speciesIndex].addResidues([]);
			rvDataSets[speciesIndex].SpeciesEntry = [];
			rvDataSets[speciesIndex].SpeciesEntry.Species_Abr = [];
			rvDataSets[speciesIndex].SpeciesEntry.PDB_chains = [];
			rvDataSets[speciesIndex].SpeciesEntry.Molecule_Names = [];
			rvDataSets[speciesIndex].SpeciesEntry.TextLabels = [];
			rvDataSets[speciesIndex].SpeciesEntry.LineLabels = [];
			rvDataSets[speciesIndex].SpeciesEntry.PDB_chains_rProtein = [];
			rvDataSets[speciesIndex].SpeciesEntry.Molecule_Names_rProtein =[];
			rvDataSets[speciesIndex].SpeciesEntry.internal_protein_names =[];
			rvDataSets[speciesIndex].SpeciesEntry.MapType = "None";
			
			//initLabels(speciesInterest,speciesIndex);
			
			var pl = document.getElementById("ProtList");
			pl.options.length = 0;
			pl.options[0] = new Option("None", "clear_data");
			//var al = document.getElementById("alnList");
			//al.options.length = 0;
			//al.options[0] = new Option("None", "clear_data");
			//var sl = document.getElementById("StructDataList");
			//sl.options.length = 0;
			//sl.options[0] = new Option("None", "clear_data");
			var il = document.getElementById("PrimaryInteractionList");
			il.options.length = 0;
			il.options[0] = new Option("None", "clear_lines");
			
			rvDataSets[speciesIndex].SpeciesEntry.Jmol_Script = "blank_state.spt";
			if(myJmol!=null){
				Jmol.script(myJmol, "script states/" + rvDataSets[speciesIndex].SpeciesEntry.Jmol_Script);
			}
			
			welcomeScreen();
			if (DoneLoading){
				DoneLoading.resolve();
			}
		}
		//rvDataSets[speciesIndex].BasePairs = [];
	});
	populateMenus()
}

function populateMenus(){
	// Set Selection Menu
	populateDomainHelixMenu();
	
	//Set Protein Menu
	var title = populateProteinMenu();
	$("#ProteinBubbles").append($('<h3 class="dataBubble ui-helper-reset ui-corner-all ui-state-default ui-corner-bottom" style="text-align:center;padding:0.2em">')
		.text("Protein Contacts").attr('name',"All_Proteins").attr('title',title));
	
	//Set Alignment Menu
	populateAlignmentMenu()
					
	//Set StructData Menu
	populateStructDataMenu();
	$("#StructDataList").multiselect("refresh");
	
	//Set interaction Menu	
	populateInteractionMenu()
	$("#PrimaryInteractionList").multiselect("refresh");
	
	//Set sortable to imply draggable
	$("#StructDataDiv").sortable({
		update : function (event, ui) {
			/*$("#LayerPanel .layerContent").each(function (e, f) {
				var tl = rvDataSets[speciesIndex].getLayer($(this).parent().attr("name"));
				tl.updateZIndex(rvDataSets[speciesIndex].LastLayer - e);
				});
			rvDataSets[speciesIndex].sort();*/
		},
		items : ".dataBubble"
	});
	$("#AlnDiv").sortable({
		update : function (event, ui) {
			/*$("#LayerPanel .layerContent").each(function (e, f) {
				var tl = rvDataSets[speciesIndex].getLayer($(this).parent().attr("name"));
				tl.updateZIndex(rvDataSets[speciesIndex].LastLayer - e);
				});
			rvDataSets[speciesIndex].sort();*/
		},
		items : ".dataBubble"
	});
	$("#ProtDiv").sortable({
		update : function (event, ui) {
			/*$("#LayerPanel .layerContent").each(function (e, f) {
				var tl = rvDataSets[speciesIndex].getLayer($(this).parent().attr("name"));
				tl.updateZIndex(rvDataSets[speciesIndex].LastLayer - e);
				});
			rvDataSets[speciesIndex].sort();*/
		},
		items : ".dataBubble"
	});
}