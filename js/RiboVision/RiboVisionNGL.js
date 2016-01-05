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

function load3Dstructure(){
	if (stage.compList[0]==undefined  || stage.compList[0].name.substr(0,4)!=rvDataSets[0].SpeciesEntry.PDB_ID){
		stage.loadFile( "rcsb://" + rvDataSets[0].SpeciesEntry.PDB_ID ).then( function( o ){	
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