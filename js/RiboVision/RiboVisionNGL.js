function init3D(){
	initNGL();
}
function initNGL(){
	if( !Detector.webgl ) Detector.addGetWebGLMessage();


	NGL.mainScriptFilePath = "js/ngl/core.js";
	$("#the3DpanelDiv").append("<div id='NGLviewPort' style='height:100%;width:100%'></div>");
	function onInit(){
		stage = new NGL.Stage( "NGLviewPort" );
		stage.setTheme("light");
		
	}

	//document.addEventListener( "DOMContentLoaded", function() {
		NGL.init( onInit );
	//} );
}

function waitFor3Dinit(dataStructure){
    if(typeof stage !== "undefined"){
        //variable exists, do what you want
		load3Dstructure(dataStructure.StructureName);
    }
    else{
        setTimeout(function(){
            waitFor3Dinit(dataStructure);
        },250);
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
        },250);
    }
}

function load3Dstructure(structure_3d){
	if (stage.compList[0]==undefined  || stage.compList[0].name.substr(0,4)!=structure_3d){
		
		if(structure_3d.indexOf(".pdb")> 0){
			var loadstring="../structures/pdb/" + structure_3d ;
			
		} else {
			var loadstring="../structures/mmcif/" + structure_3d + ".cif";
		}
		
		stage.loadFile( loadstring).then( function( o ){	
			Struct=o;
			Struct.addRepresentation( "cartoon");
			Struct.addRepresentation( "licorice" );	
			
		} );
	}
}
	
function init3dStructures() {
	if (rvDataSets[1]) {
		var rna_chains = ":" + rvDataSets[0].SpeciesEntry.New_PDB_Chains.replace(/:/,' or :') + " or :" + rvDataSets[1].SpeciesEntry.New_PDB_Chains.replace(/:/,' or :');
	} else {
		var rna_chains = ":" + rvDataSets[0].SpeciesEntry.New_PDB_Chains.replace(/:/,' or :');
	}
	
	var sele="rna and (" + rna_chains + ")";
	Struct.setSelection(sele);
	Struct.centerView(true);
	
}
	

function update3Dcolors() {
}

function updateModel() {
}

function refreshModel() {
}

function resetColorState() {
}