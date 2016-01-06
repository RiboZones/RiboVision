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

function load3Dstructure(structure_3d){
	if (stage.compList[0]==undefined  || stage.compList[0].name.substr(0,4)!=structure_3d){
		
		if(structure_3d.indexOf(".pdb")> 0){
			var loadstring="data://structures/pdb/" + structure_3d + ".cif";
			
		} else {
			var loadstring="data://structures/mmcif/" + structure_3d;
		}
		
		stage.loadFile( loadstring).then( function( o ){	
			Struct=o;
			Struct.addRepresentation( "cartoon");
			Struct.addRepresentation( "licorice" );	
			var sele="rna and (:" + rvDataSets[0].SpeciesEntry.New_PDB_Chains.replace(/:/,' or :') + ")";
			Struct.setSelection(sele);
		} );
	} else {
		var sele="rna and (:" + rvDataSets[0].SpeciesEntry.New_PDB_Chains.replace(/:/,' or :') + ")";
		Struct.setSelection(sele);
	}
	

	

}

function update3Dcolors() {
}