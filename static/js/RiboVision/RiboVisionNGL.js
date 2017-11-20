function init3D(){
	initNGL();
}
function initNGL(){
	$("#the3DpanelDiv").append("<div id='NGLviewPort' style='height:100%;width:100%'></div>");
	stage = new NGL.Stage( "NGLviewPort", { backgroundColor: "white" , quality: "auto"} );
	resizeElements()
	resize3D()
}
function resize3D(){
	stage.handleResize()
}
function waitFor3Dinit(dataStructure){
    if(typeof stage !== "undefined"){
        //variable exists, do what you want
		if (dataStructure && dataStructure.StructureName != undefined){
			load3Dstructure(dataStructure.StructureName);
		}
    }
    else{
        setTimeout(function(){
            waitFor3Dinit(dataStructure);
        },100);
    }
}
function waitFor3Dload(){
    
	if(typeof Struct !== "undefined"){
        //variable exists, do what you want
		init3dStructures();
    }
    else{
        setTimeout(function(){
            waitFor3Dload();
        },100);
    }
}

function load3Dstructure(structure_3d){
	if (stage.compList[0]==undefined  || stage.compList[0].name.substr(0,4)!=structure_3d){
		
		if(structure_3d.indexOf(".pdb")> 0){
			var loadstring="static/structures/pdb/" + structure_3d ;
			
		} else if(structure_3d.indexOf(".cif")> 0){
			var loadstring="static/structures/mmcif/" + structure_3d + ".cif";	
		} else {
			var loadstring="static/structures/mmtf/" + structure_3d + ".mmtf";
		}
		//Assume BU2 for today. Fix for BU1 during database update.
		stage.loadFile( loadstring, {assembly: "BU2"}).then( function( o ){	
			Struct=o;
			//Struct.addRepresentation( "cartoon");
			//Struct.addRepresentation( "licorice" );	
			
		} );
	}
}

function init3dStructures() {
	if (rvDataSets[1]) {
		var rna_chains = ":" + rvDataSets[0].SpeciesEntry.PDB_chains.join(' or :') + " or :" + rvDataSets[1].SpeciesEntry.PDB_chains.join(' or :');
	} else {
		var rna_chains = ":" + rvDataSets[0].SpeciesEntry.PDB_chains.join(' or :');
	}
	
	var rna_sele = "rna and (" + rna_chains + ")";
	//var protein_sele = "protein and (:" + rvDataSets[0].SpeciesEntry.PDB_chains_rProtein.replace(/;/g,' or :') + ")";
	
	Struct.addRepresentation( "cartoon", { sele: rna_sele, visible: true, name:"rrna_cartoon" });
	Struct.addRepresentation( "base" , { sele: rna_sele, visible: true, name:"rrna_base" }); 
	Struct.addRepresentation( "cartoon", { sele: "none", visible: true, name:"proteins", aspectRatio: 6.0, scale: 2 } );
	
	//Struct.setSelection(rna_sele);
	
	update3Dcolors();
	Struct.autoView(rna_sele);

}

function update3DProteinsLow(newcolor){
	
}	

function colorMappingLoop3DLow(changeProteins){
	changeProteins;
	var repr = stage.getRepresentationsByName("proteins");

	var sele_protein=[];
	if (changeProteins.length >= 2){ 
		changeProteins.reduce(function(a,b){
			sele_protein.foundProt = a.foundProt + " or :" + b.foundProt;
			return sele_protein
			});
		sele_protein.foundProt = ":" + sele_protein.foundProt;
	} else if (changeProteins.length == 1) {
		sele_protein.foundProt = ":" + changeProteins[0].foundProt;
	} else {
		sele_protein.foundProt="none";
	}
	
	var selection_scheme =[];
	$.each(changeProteins, function (index,value){
		selection_scheme.push([colorNameToHex(value.newcolor,'#',"0x858585"),":" + value.foundProt]);
	});
	var mySelectionScheme = NGL.ColormakerRegistry.addSelectionScheme( selection_scheme );
	
	repr.setParameters( { colorScheme: mySelectionScheme } )
	repr.setSelection(sele_protein.foundProt);

	
	
}

function update3Dcolors() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	
	var targetLayer=[];
	$.each(rvDataSets, function (index, rvds) {
		if (rvds.Residues[0] == undefined){return};
		targetLayer[index]=rvds.getLinkedLayer();
	});
	
	
	var myScheme = NGL.ColormakerRegistry.addScheme( function( params ){
		this.atomColor = function( atom ){
			try {
				var uResName = MainResidueMap[atom.chainname + ":" + atom.resno];
				var color = targetLayer[MainResidueMap[uResName].rvds_index].dataLayerColors[MainResidueMap[uResName].index];
				return colorNameToHex(color,'0x',"0x858585");
			} catch (e) {
				return "#858585";
			}
		};
	} );
	
	var repr1 = stage.getRepresentationsByName("rrna_cartoon");
	var repr2 = stage.getRepresentationsByName("rrna_base");

	repr1.setParameters( { colorScheme: myScheme } );
	repr2.setParameters( { colorScheme: myScheme } );


}

function updateModel() {
}

function refreshModel() {
}

function resetColorState() {
}

function save3dImg() {
	AgreeFunction = function () {
		stage.makeImage({
			factor: 2,
			antialias: true,
			trim: true,
			transparent: false
		}).then(function (blob) {
			  NGL.download(blob, 'RiboVisionFigure3D.png')
		})
	}
	checkSavePrivacyStatus();
}

function ColorProteins3D(ColorProteins){
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	if (rvDataSets[0].Residues[0] == undefined){return};
	
	var script = "set hideNotSelected false;";
	$.each(ColorProteins, function (index,value){
		var ressplit = value.ResNum.split("_");
		if (ressplit[0] !== "undefined"){
			if (colorNameToHex(value.Color).indexOf("#") == -1) {
				//script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + ressplit[0] + " and " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "; color Cartoon opaque [x" + value.Color + "]; ";
			} else {
				//script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + ressplit[0] + " and " + ressplit[1].replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "; color Cartoon opaque [" + value.Color.replace("#", "x") + "]; ";
			}
		}
	});
	
	//Jmol.script(myJmol, script);
}