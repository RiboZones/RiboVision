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
			//Struct.addRepresentation( "cartoon");
			//Struct.addRepresentation( "licorice" );	
			
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
	Struct.addRepresentation( "cartoon");
	Struct.addRepresentation( "base" ); 
	update3Dcolors();
	Struct.centerView(true);

}

function update3DProteinsLow(newcolor){
	
}	

function colorMappingLoop3DLow(changeProteins){
	
}

function update3Dcolors() {
	if($('input[name="jp"][value=off]').is(':checked')){
		return;
	}
	if(typeof Struct == "undefined"){
        setTimeout(function(){
            update3Dcolors();
        },250);
		return;
    }
	var script = "";
	var selection_scheme=[];
	var r0,
	r1,
	curr_chain,
	curr_color,
	compare_color,
	n,
	m;
	$.each(rvDataSets, function (index, rvds) {
		if (rvds.Residues[0] == undefined){return};
		//r0=rvds.Residues[0].resNum.replace(/[^:]*:/g,"");
		r0 = rvds.Residues[0].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
		curr_chain = rvds.Residues[0].ChainID;
		var targetLayer=rvds.getLinkedLayer();
		//rvds.Residues[0].CurrentData=targetLayer.Data[0];

		curr_color = colorNameToHex(targetLayer.dataLayerColors[0]);
		
		if (!curr_color || curr_color === '#000000') {
			curr_color = '#858585';
		}
		for (var i = 1; i < rvds.Residues.length; i++) {
			var residue = rvds.Residues[i];
			var residueLast = rvds.Residues[i - 1];
			var residueLastColor = targetLayer.dataLayerColors[i - 1];
			//rvds.Residues[i].CurrentData=targetLayer.Data[i];
			
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
					if (((compare_color != colorNameToHex(residueLastColor)) || (curr_chain != residue.ChainID)) || (i == (rvds.Residues.length - 1))) {
						r1 = residueLast.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
						n = r1.match(/[A-z]/g);
						if (n != undefined) {
							r1 = r1.replace(n, "^" + n);
						}
						//if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
							//script += "select " + (SubunitNames.indexOf(rvds.SpeciesEntry.Subunit) + 1) + ".1 and :" + curr_chain + " and (" + r0 + " - " + r1 + "); color Cartoon opaque [x" + curr_color + "]; ";
							//script += "select " + rvds.SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color Cartoon opaque [x" + curr_color + "]; ";
							//script += "select " + rvds.SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color opaque [x" + curr_color + "]; ";

						//} else {
							selection_scheme.push([curr_color,r0 + "-" + r1 + ":" + curr_chain]);
							//script += "select " + rvds.SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
							//script += "select " + rvds.SpeciesEntry.Jmol_Model_Num_rRNA + ".1 and " + r0 + " - " + r1 + ":" + curr_chain + "; color opaque [" + curr_color.replace("#", "x") + "]; ";

						//}
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
		selection_scheme.push([curr_color,r0 + "-" + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain]);
	});
	
	//if (colorNameToHex(residueLastColor).indexOf("#") == -1) {
		//script += "select " + (rvds.SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color Cartoon opaque [x" + curr_color + "]; ";
		//script += "select " + (rvds.SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color opaque [x" + curr_color + "]; ";
	//} else {
	//	script += "select " + (rvds.SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
	//	script += "select " + (rvds.SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and "  + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + ":" + curr_chain + "; color opaque [" + curr_color.replace("#", "x") + "]; ";
//}
	//updateSelectionDiv();
	//jmolScript(script);
	//Jmol.script(myJmol, script);
	
	//var ccc=0;
	stage.eachRepresentation(function (repr){
		var mySelectionScheme = NGL.ColorMakerRegistry.addSelectionScheme( selection_scheme );
		/*
		// color residues 1 to 100 in red, 101-200 in blue and the remaining in white
		var mySelectionScheme = NGL.ColorMakerRegistry.addSelectionScheme( [
			[ "red", "1-100" ],
			[ "blue", "101-200" ],
			[ "green", "1000-2000" ],
			[ "purple", "2001-3000"],
			[ "white", "*" ]
		] );*/
		// apply colorscheme to an existing representation
		repr.setParameters( { colorScheme: mySelectionScheme } )
		//ccc++;
		//console.log(ccc);
	})
	


	
}

function updateModel() {
}

function refreshModel() {
}

function resetColorState() {
}