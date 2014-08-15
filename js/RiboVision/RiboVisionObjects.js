/* RiboVision 1.15 script library RiboVisionObjects.js 5:24 PM 06/10/2014 Chad R. Bernier


 * The MIT License (MIT)
 *
 * Copyright (C) 2012-2014  RiboEvo, Georgia Institute of Technology, apollo.chemistry.gatech.edu
 *
 * Contact: Bernier.C.R@gatech.edu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.

// For user documentation see http://apollo.chemistry.gatech.edu/RiboVision/Documentation/index.html
// For developer documentation see http://apollo.chemistry.gatech.edu/RiboVision/Documentation/DeveloperHelp.html
*/


/////////////////////////// Classes ///////////////////////////////////////////
function RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type, Color) {
	//Properties
	this.LayerName = LayerName;
	this.CanvasName = CanvasName;
	if (document.getElementById(CanvasName) == null){
		if (this.Type === "selected"){
			$("#canvasDiv").append($('<canvas id="' + CanvasName + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 + 800) + ';"></canvas>')); 
		} else {			
			$("#canvasDiv").append($('<canvas id="' + CanvasName + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 ) + ';"></canvas>')); 
		}
	}
	//this.Canvas = $("#" + CanvasName);
	this.Canvas = document.getElementById(CanvasName);
	if (this.Canvas.getContext){
		this.CanvasContext = this.Canvas.getContext("2d");
	}
	this.Data = Data;
	this.dataLayerColors = [];
	this.Filled = Filled;
	this.ScaleFactor = ScaleFactor;
	this.LinearGradients = [];
	this.Type = Type;
	this.zIndex = rvDataSets[0].LastLayer + 1;
	this.Visible = true;
	this.Selected = false;
	this.Linked = false;
	this.ColorLayer = [];
	this.ColorGradientMode = "Matched";
	this.DataLabel = "None";
	if (Color) {
		this.Color = Color;
	} else {
		this.Color = "#0000FF";
	}
	if (this.Type === "lines") {
		this.ColorLayer = "gray_lines";
		this.ColorGradientMode = "Matched";
	}
	
	//Methods
	this.updateZIndex = function(zIndex){
		if (this.Type === "selected"){
			this.Canvas.style.zIndex = zIndex + 800;
		} else {
			this.Canvas.style.zIndex = zIndex;
		}
		this.zIndex = zIndex;
	}
	this.toJSON = function () {
		return {
			LayerName: this.LayerName,
			CanvasName: this.CanvasName, 
			Data: this.Data, 
			dataLayerColors: this.dataLayerColors,
			Filled: this.Filled,
			ScaleFactor: this.ScaleFactor,
			LinearGradients: this.LinearGradients,
			Type: this.Type,
			zIndex: this.zIndex,
			Visible: this.Visible,
			Selected: this.Selected,
			Linked: this.Linked,
			ColorLayer: this.ColorLayer,
			ColorGradientMode: this.ColorGradientMode,
			DataLabel: this.DataLabel,
			Color: this.Color,
			ColorLayer: this.ColorLayer,
			ColorGradientMode: this.ColorGradientMode
		};
	};
	
	this.fromJSON = function (json) {
		//var data = JSON.parse(json);
		var data = json;
		var e = new RvLayer(data.LayerName, data.CanvasName, data.Data, data.Filled, data.ScaleFactor, data.Type, data.Color);
		e.dataLayerColors = data.dataLayerColors;
		e.LinearGradients = data.LinearGradients;
		e.zIndex = data.zIndex;
		e.Visible = data.Visible;
		e.Selected = data.Selected;
		e.Linked = data.Linked;
		e.ColorLayer = data.ColorLayer;
		e.ColorGradientMode = data.ColorGradientMode;
		e.DataLabel = data.DataLabel;
		e.ColorLayer = data.ColorLayer;
		e.ColorGradientMode = data.ColorGradientMode;
		return e;
	};
	this.clearCanvas = function () {
		if (canvas2DSupported){
			this.CanvasContext.setTransform(1, 0, 0, 1, 0, 0);
			this.CanvasContext.clearRect(0, 0, rvViews[0].width, rvViews[0].height);
			this.CanvasContext.setTransform(rvViews[0].scale, 0, 0, rvViews[0].scale, rvViews[0].x, rvViews[0].y);
		}
	};
	this.addLinearGradient = function (LinearGradient) {
		this.LinearGradients.push(LinearGradient);
	};
	this.deleteLayer = function () {
		$(this.Canvas).remove();
	};
	this.clearData = function () {
		this.dataLayerColors = new Array;
		this.Data = new Array;
		for (var jj = 0; jj < rvDataSets[0].Residues.length; jj++) {
			this.dataLayerColors[jj] = undefined;
			this.Data[jj] = undefined;
		}
	}
	this.setVisibility = function (visibility_prop) {
		switch (visibility_prop) {
		case "hidden":
			$(this.Canvas).css("visibility", "hidden");
			this.Visible = false;
			break;
		case "visible":
			$(this.Canvas).css("visibility", "visible");
			this.Visible = true;
			break;
		default:
			alert("this shouldn't happen");
		}
	}
	this.clearAll = function (){
		switch (this.Type){
			case "circles":
				this.DataLabel = "None";
				$("[name=" + this.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(this.DataLabel);
				this.clearData();
				drawNavLine();
				rvDataSets[0].clearCanvas(this.LayerName);
				update3Dcolors();
				break;
			case "residues":
				this.DataLabel = "None";
				$("[name=" + this.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(this.DataLabel);
				this.clearData();
				clearColor(false);
				drawNavLine();
				update3Dcolors();
				break;
			case "lines":
				this.DataLabel = "None";
				$("[name=" + this.LayerName + "]").find(".layerContent").find("span[name=DataLabel]").text(this.DataLabel);
				//$(this).find(".layerContent").find("span[name=DataLabel]").text("None"));
				//$(this).parent().parent().find(".DataDescription").text("Empty Data");
				drawNavLine();
				refreshBasePairs("clear_lines");
				break;
			default:
		}			
		//this.DataLabel = "None";
	}
}

function RvSelection(SelectionName,rvResidues,rvColor,rvResidues_rProtein){
	//Properties
	this.Name = SelectionName;
	this.zIndex = rvDataSets[0].Selections.length;
	if (rvResidues) { 
		this.Residues = rvResidues;
	} else {
		this.Residues = [];
	}
	if (rvResidues_rProtein) { 
		this.Residues_rProtein = rvResidues_rProtein;
	} else {
		this.Residues_rProtein = [];
	}
	if (rvColor) {
		this.Color = rvColor;
	} else {
		this.Color = "#940B06";
	}
	this.Selected = false;
	
	//Methods
}
function rvDataSet(DataSetName) {
	//Properties
	this.Name = DataSetName;
	this.Layers = [];
    this.numDomains = 0; //This gets found later, defaults to 0
	this.HighlightLayer = [];
	this.Residues = [];
	this.ResidueList = [];
	this.SequenceList = "";
	this.rvTextLabels = [];
	this.rvLineLabels = [];
	this.BasePairs = [];
	this.CustomData = [];
	this.SpeciesEntry = [];
	this.Selections = [];
	this.LastLayer = -1;
	this.LayerTypes = ['circles', 'lines', 'labels', 'residues', 'contour', 'selected'];
	this.ConservationTable = [];
	this.DataDescriptions = [];
	this.ExtraPyMOLScript ='';
	this.ColorProteins = [];
	//Methods
	this.toJSON = function () {
		return {
			DataSetName: this.Name,
			Layers: this.Layers,
			//this.HighlightLayer = [];
			Residues: this.Residues,
			ResidueList: this.ResidueList,
			rvTextLabels: this.rvTextLabels,
			rvLineLabels: this.rvLineLabels,
			BasePairs: this.BasePairs,
			CustomData: this.CustomData,
			SpeciesEntry: this.SpeciesEntry,
			Selections: this.Selections,
			LastLayer: this.LastLayer,
			LayerTypes: this.LayerTypes,
			ConservationTable: this.ConservationTable,
			DataDescriptions: this.DataDescriptions
		};
	};
	this.fromJSON = function (json) {
		var data = JSON.parse(json);
		var e = new rvDataSet(DataSetName);
		e.Residues = data.Residues;
		e.ResidueList = data.ResidueList;
		e.rvTextLabels = data.rvTextLabels;
		e.rvLineLabels = data.rvLineLabels;
		e.BasePairs = data.BasePairs;
		e.CustomData = data.CustomData;
		e.SpeciesEntry = data.SpeciesEntry;
		e.Selections = data.Selections;
		e.LastLayer = data.LastLayer;
		e.ConservationTable = data.ConservationTable;
		e.DataDescriptions = data.DataDescriptions;
		e.addHighlightLayer("HighlightLayer", "HighlightLayer", [], false, 1.176, 'highlight');
		$.each(data.Layers, function (index, value) {
			e.Layers[index] = e.HighlightLayer.fromJSON(value);
		});
		return e;
	};
	this.addLayers = function (rvLayers) {
		this.Layers = rvLayers;
		this.LastLayer = this.Layers.length - 1;
	};
	this.addLayer = function (LayerName, CanvasName, Data, Filled, ScaleFactor, Type, Color) {
		var b = new RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type, Color);
		this.Layers[this.Layers.length] = b;
		this.LastLayer = this.Layers.length - 1;
	};
	this.addHighlightLayer = function (LayerName, CanvasName, Data, Filled, ScaleFactor, Type) {
		var b = new RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type);
		this.HighlightLayer = b;
	};
	this.addResidues = function (rvResidues) {
		this.Residues = rvResidues;
		this.ResidueList = makeResidueList(rvResidues);
		this.SequenceList = makeSequenceList(rvResidues);
        this.domainNames = findDomainNames(rvResidues);
        this.numDomains = this.domainNames.length; //just for convenience and clarity really.
	};
	this.addLabels = function (rvTextLabels, rvLineLabels, rvExtraLabels) {
		if (rvTextLabels !== undefined){
			this.rvTextLabels = rvTextLabels;
		}
		if (rvLineLabels !== undefined){
			this.rvLineLabels = rvLineLabels;
		}
		if (rvExtraLabels !== undefined){
			this.rvExtraLabels = rvExtraLabels;
		}
	};
	this.addBasePairs = function (BasePairs) {
		this.BasePairs = BasePairs;
	};
	/*
	this.addSelected = function (Selected) {
		this.Selected = Selected;
	};*/
	this.addCustomData = function (CustomData) {
		this.CustomData = CustomData;
	};
	this.addSpeciesEntry = function (SpeciesEntry) {
		this.SpeciesEntry = SpeciesEntry;
		this.SpeciesEntry.Molecule_Names = this.SpeciesEntry.Molecule_Names.split(":");
		this.SpeciesEntry.Molecule_Names_rProtein = this.SpeciesEntry.Molecule_Names_rProtein.split(":");
	};
	this.addSelection = function (Name, rvResidues, rvColor) {
		if (!Name) {
			Name = "Selection_" + (this.Selections.length + 1);
		}
		this.Selections.unshift(new RvSelection(Name,rvResidues,rvColor));
	};
	/*
	this.changeSelection = function (SeleName) {
		if (this.Selections[SeleName]) {
			targetSelection=rvDataSets[0].getSelection(SeleName);
			rvDataSets[0].Selected = targetSelection.Residues;
			rvDataSets[0].drawSelection("selected");
		}
	};*/
	this.sort = function () {
		this.Layers.sort(function (a, b) {
			return (Number(a.zIndex) - Number(b.zIndex));
		});
		$.each(this.Layers, function (key, value) {
			this.updateZIndex(key);
		});
	};
	this.SelectionsSort = function () {
		this.Selections.sort(function (a, b) {
			return (Number(a.zIndex) - Number(b.zIndex));
		});
		$.each(this.Selections, function (key, value) {
			this.zIndex=key;
		});
	};
	this.clearCanvas = function (layer) {
		//var LayerTypes=['circles','lines','labels','residues','contour','selected'];
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					value.clearCanvas();
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					value.clearCanvas();
				}
			});
		}
	};
	this.refreshResiduesExpanded = function (layer) {
		//this.clearCanvas(layer);
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					refreshLayer(value);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					refreshLayer(value);
				}
			});
		}
	};
	this.drawLabels = function (layer,drawExtra) {
		this.clearCanvas(layer);
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					
					drawLabels(value,drawExtra);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawLabels(value,drawExtra);
				}
			});
		}
	};
	this.clearData = function (layer) {
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					value.clearData();
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					value.clearData();
				}
			});
		}
	};
	this.drawResidues = function (layer, dataIndices, ColorArray, noClear) {
		//this.clearCanvas(layer);
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					drawResidues(value, dataIndices, ColorArray, noClear);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawResidues(value, dataIndices, ColorArray, noClear);
				}
			});
		}
	};
	this.drawSelection = function (layer,SeleName) {
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					drawSelection(value,SeleName);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawSelection(value,SeleName);
				}
			});
		}
	};
	this.drawDataCircles = function (layer, dataIndices, ColorArray, noClear) {
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					drawDataCircles(value, dataIndices, ColorArray, noClear);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawDataCircles(value, dataIndices, ColorArray, noClear);
				}
			});
		}
	};
	this.drawBasePairs = function (layer, colorLayer) {
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					drawBasePairs(value, colorLayer);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawBasePairs(value, colorLayer);
				}
			});
		}
	};
	this.getLayer = function (layer) {
		var ret = false;
		$.each(this.Layers, function (key, value) {
			if (value.LayerName === layer) {
				ret = value;
				return false;
			}
		});
		return ret;
	};
	this.getLayerByType = function (layer) {
		if (!$.isArray(layer)){
			layer=[layer];
		}
		var ret = [];
		$.each(this.Layers, function (key, value) {
			if ($.inArray(value.Type, layer) >=0) {
				ret.push(value);
			}
		});
		if (ret.length >0){
			return ret;
		}
		return false;
	};
	this.getSelectedLayer = function () {
		var ret = false;
		$.each(this.Layers, function (key, value) {
			if (value.Selected) {
				ret = value;
				return false;
			}
		});
		return ret;
	};
	this.getLinkedLayer = function () {
		var ret = false;
		$.each(this.Layers, function (key, value) {
			if (value.Linked) {
				ret = value;
				return false;
			}
		});
		return ret;
	};
	this.linkLayer = function (layer) {
		$.each(this.Layers, function (key, value) {
			if (value.LayerName === layer) {
				value.Linked = true;
			} else {
				value.Linked = false;
			}
		});
	};
	this.selectLayer = function (layer) {
		$.each(this.Layers, function (key, value) {
			if (value.LayerName === layer) {
				value.Selected = true;
			} else {
				value.Selected = false;
			}
		});
	};
	this.isUniqueLayer = function (layer) {
		var ret = true;
		$.each(this.Layers, function (key, value) {
			if (value.LayerName === layer) {
				ret = false;
				return false;
			}
		});
		return ret;
	}
	this.deleteLayer = function (layer) {
		$.each(this.Layers, function (key, value) {
			if (value.LayerName === layer) {
				value.deleteLayer();
				rvDataSets[0].Layers.splice(key, 1);
				return false;
			}
		});
		$.each(this.Layers, function (key, value) {
			if (value.LayerName === layer) {
				value.updateZIndex(key);
			}
		});
		this.LastLayer = this.Layers.length - 1;
	};
	this.getSelection = function (rvSelectionName) {
		var ret = false;
		$.each(this.Selections, function (key, value) {
			if (value.Name === rvSelectionName) {
				ret = value;
				return false;
			}
		});
		return ret;
	};
	this.deleteSelection = function (selection) {
		$.each(this.Selections, function (key, value) {
			if (value.Name === selection) {
				rvDataSets[0].Selections.splice(key, 1);
				return false;
			}
		});
	};
	this.isUniqueSelection = function (selection) {
		var ret = true;
		$.each(this.Selections, function (key, value) {
			if (value.Name === selection) {
				ret = false;
				return false;
			}
		});
		return ret;
	}
   
	// Private functions, kinda
	function makeResidueList(rvResidues) {
		var ResidueListLocal = [],j;
		for (j = 0; j < rvResidues.length; j++) {
			ResidueListLocal[j] = rvResidues[j].ChainID + "_" + rvResidues[j].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
		}
		return ResidueListLocal;
	}
	function makeSequenceList(rvResidues) {
        //This function takes the array rvResidues, which contains residue objects which in turn
        //contain a residue name field, and returns the string SequenceListLocal which is an ongoing
        //string of residue names.
		var SequenceListLocal = "",j;
		for (j = 0; j < rvResidues.length; j++) {
			SequenceListLocal = SequenceListLocal.concat(rvResidues[j].modResName);
		}
		return SequenceListLocal;
	}
    function findDomainNames(rvResidues) {
        //This function parses the rvResidues array and finds the largest domain number
        var domNames = rvResidues[0].Domain_RN + ","; //pulls domain name of first residue
        var curDomain;
        var numDomains = 0;
        for (var j = 1; j < rvResidues.length; j++) {
            curDomain = rvResidues[j].Domain_RN;
            if (!(stringContains(domNames,curDomain))) { //if the comma separated string doesn't contain this domain name.
                domNames += rvResidues[j].Domain_RN + ","; //add current domain name to string
                numDomains++; //add 1 domain
            }
        }
        var output = new Array(numDomains);
        var counter = 0;
        var start = 0; // used for clipping strings below
        for (var j = 0; j < domNames.length; j++) {
            if (domNames.charAt(j) == ",") { //if the character at point j is a comma
                output[counter] = domNames.slice(start,j); //snip the previous domain name and store it in the output
                start = j+1; //set start of next domain name
                counter++;
            }
        }
        return output; //returns an array of strings representing "Roman Numeral" domain names
        function stringContains(str, tok) { //private function to check if the string already contains this name
            var token = "";
            for (var j = 0; j < str.length; j++) { //this is essentially a rewrite of the java strTok function.
                if (str.charAt(j) != ",") { //if character is not a separation comma
                    token += str.charAt(j); //builds a domain name
                } else {
                    if (token == tok) {
                        return true; //checks if its the same as the input
                    }
                    token = ""; //resets the token
                }
            }
            return false;
        }
    }    
	function refreshLayer(targetLayer) {
		if (rvDataSets[0].Residues !== undefined && targetLayer.Type === "circles") {
			targetLayer.clearCanvas();
			var CircleSize = rvDataSets[0].SpeciesEntry.Circle_Radius;
			for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
				if (targetLayer.dataLayerColors[i] != undefined && targetLayer.dataLayerColors[i] != '#858585') {
					targetLayer.CanvasContext.beginPath();
					targetLayer.CanvasContext.arc(rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y, (targetLayer.ScaleFactor * CircleSize), 0, 2 * Math.PI, false);
					targetLayer.CanvasContext.closePath();
					targetLayer.CanvasContext.strokeStyle = targetLayer.dataLayerColors[i];
					targetLayer.CanvasContext.stroke();
					if (targetLayer.Filled) {
						targetLayer.CanvasContext.fillStyle = targetLayer.dataLayerColors[i];
						targetLayer.CanvasContext.fill();
					}
				}
			}
		}
	}
	function drawLabels(targetLayer,drawExtra) {
		if (!canvas2DSupported){return};
		targetLayer.CanvasContext.textAlign = 'left';
		//canvg(targetLayer.CanvasName, 'js/RiboVision/SC_28S_Struct_Dash_Lines_m.svg',{ ignoreMouse : false, ignoreClear : false, scaleWidth: 1, scaleHeight: 1});
		//canvg(targetLayer.CanvasName, 'js/RiboVision/SC_28S_Struct_Dash_Lines_m.svg', { ignoreMouse: false, ignoreClear: true, ignoreDimensions: true});
		
		if (rvDataSets[0].rvTextLabels != undefined) {
			var n = watermark(false);
			for (var i = 0; i < rvDataSets[0].rvTextLabels.length; i++) {
				targetLayer.CanvasContext.font = (0.70 * rvDataSets[0].rvTextLabels[i].FontSize) + 'pt "Myriad Pro", Calibri, Arial';
				targetLayer.CanvasContext.fillStyle = rvDataSets[0].rvTextLabels[i].Fill;
				targetLayer.CanvasContext.fillText(rvDataSets[0].rvTextLabels[i].LabelText, rvDataSets[0].rvTextLabels[i].X, rvDataSets[0].rvTextLabels[i].Y);
			}
			
			targetLayer.CanvasContext.strokeStyle = "rgba(35,31,32,32)";
			targetLayer.CanvasContext.lineWidth = .5;
			
			for (var i = 0; i < rvDataSets[0].rvLineLabels.length; i++) {
				targetLayer.CanvasContext.beginPath();
				targetLayer.CanvasContext.moveTo(rvDataSets[0].rvLineLabels[i].X1, rvDataSets[0].rvLineLabels[i].Y1);
				targetLayer.CanvasContext.lineTo(rvDataSets[0].rvLineLabels[i].X2, rvDataSets[0].rvLineLabels[i].Y2);
				targetLayer.CanvasContext.closePath();
				targetLayer.CanvasContext.stroke();
			}
		}
		/*
		var data = "data:image/svg+xml," + "<svg xmlns='http://www.w3.org/2000/svg' width='612' height='792'>" + "\n";
		for (var j = 0 ;  j < rvDataSets[0].rvExtraLabels.length ; j++){
			data +=	rvDataSets[0].rvExtraLabels[j].SVGLine;
		}
		data +="</svg>";
		//alert(data);
		var img = new Image();
		//img.src = data;
		img.src = "js/RiboVision/SC_28S_Struct_Dash_Lines_m.svg";
		img.onload = function() { targetLayer.CanvasContext.drawImage(img, 0, 0,612,792); };
		//targetLayer.CanvasContext.drawImage(img, 0, 0);
		*/
	}
	function drawResidues(targetLayer, dataIndices, ColorArray, noClear) {
		if (targetLayer.Type === "residues") {
			targetLayer.clearCanvas();
			
			if (!noClear) {
				//targetLayer.clearCanvas();
				//targetLayer.dataLayerColors = [];
			}
			if (rvDataSets[0].Residues && rvDataSets[0].Residues.length > 0) {
				if (dataIndices && ColorArray) {
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						if (ColorArray[dataIndices[i]]) {
							rvDataSets[0].Residues[i].color = ColorArray[dataIndices[i]];
							targetLayer.dataLayerColors[i] = ColorArray[dataIndices[i]];
						//} else if (dataIndices[i]!=undefined && isNaN(dataIndices[i])){ Do not remember why this was here. Try without.
						} else if (i in dataIndices){
							rvDataSets[0].Residues[i].color = "#000000";
							targetLayer.dataLayerColors[i] = "#000000";
						}
					}
				} else {
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						rvDataSets[0].Residues[i].color = targetLayer.dataLayerColors[i];
					}
				}
				targetLayer.CanvasContext.strokeStyle = "#000000";
				targetLayer.CanvasContext.textBaseline = "middle";
				targetLayer.CanvasContext.textAlign = "center";
				for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
					targetLayer.CanvasContext.fillStyle = (targetLayer.dataLayerColors[i] || "#000000");
					targetLayer.CanvasContext.font = rvDataSets[0].Residues[i]["font-weight"] + " " + rvDataSets[0].SpeciesEntry.Font_Size_Canvas + 'pt "Myriad Pro", Calibri, Arial';
					targetLayer.CanvasContext.fillText(rvDataSets[0].Residues[i].resName, rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y);
				}
			} else {
				welcomeScreen();
			}
		}
	}
	function drawSelection(targetLayer,SeleName) {
		var SelectionList =[];
		if (!SeleName){
			//SeleName = "Main";
			$('.checkBoxDIV-S').find(".visibilityCheckImg[value=visible]").parent().parent().each(function (index){SelectionList.push($(this).attr("name"))});
		} else {
			SelectionList[0]=SeleName;
		}
		var CircleSize = rvDataSets[0].SpeciesEntry.Circle_Radius;
		targetLayer.clearCanvas();
		targetLayer.Data = [];
		targetLayer.dataLayerColors = [];
		if (rvDataSets[0].Residues && rvDataSets[0].Residues.length > 0) {
			for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
				targetLayer.Data[i] = false;
				targetLayer.dataLayerColors[i] = "#858585";
			}
			for (var k = SelectionList.length - 1 ; k >= 0 ; k--){
				var targetSelection = rvDataSets[0].getSelection(SelectionList[k]);
				for (var j = targetSelection.Residues.length - 1; j >= 0; j--) {
					targetLayer.CanvasContext.beginPath();
					targetLayer.CanvasContext.arc(targetSelection.Residues[j].X, targetSelection.Residues[j].Y, (targetLayer.ScaleFactor * CircleSize), 0, 2 * Math.PI, false);
					targetLayer.CanvasContext.closePath();
					targetLayer.CanvasContext.strokeStyle = targetSelection.Color;
					targetLayer.CanvasContext.lineWidth = 0.5;
					targetLayer.CanvasContext.stroke();
					targetLayer.Data[targetSelection.Residues[j].map_Index - 1] = true;
					targetLayer.dataLayerColors[targetSelection.Residues[j].map_Index - 1] = targetSelection.Color;
				}
			}
			var linkedLayer = rvDataSets[0].getLinkedLayer();
			if (linkedLayer.Type == "selected") {
				update3Dcolors();
			}
		}
	}
	function drawDataCircles(targetLayer, dataIndices, ColorArray, noClear) {
		if (targetLayer.Type === "circles") {
			if (!noClear) {
				targetLayer.clearCanvas();
				targetLayer.dataLayerColors = [];
			}
			var CircleSize = rvDataSets[0].SpeciesEntry.Circle_Radius;
			if (rvDataSets[0].Residues != undefined) {
				for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
					if (dataIndices && ColorArray && ColorArray[dataIndices[i]] != undefined && ColorArray[dataIndices[i]] != '#858585') {
						targetLayer.CanvasContext.beginPath();
						targetLayer.CanvasContext.arc(rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y, (targetLayer.ScaleFactor * CircleSize), 0, 2 * Math.PI, false);
						targetLayer.CanvasContext.closePath();
						targetLayer.CanvasContext.strokeStyle = ColorArray[dataIndices[i]];
						targetLayer.CanvasContext.stroke();
						if (targetLayer.Filled) {
							targetLayer.CanvasContext.fillStyle = ColorArray[dataIndices[i]];
							targetLayer.CanvasContext.fill();
						}
						targetLayer.dataLayerColors[i] = ColorArray[dataIndices[i]];
					} else if (!dataIndices && !ColorArray && targetLayer.dataLayerColors[i] && targetLayer.dataLayerColors[i] != '#858585') {
						targetLayer.CanvasContext.beginPath();
						targetLayer.CanvasContext.arc(rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y, (targetLayer.ScaleFactor * CircleSize), 0, 2 * Math.PI, false);
						targetLayer.CanvasContext.closePath();
						targetLayer.CanvasContext.strokeStyle = targetLayer.dataLayerColors[i];
						targetLayer.CanvasContext.stroke();
						if (targetLayer.Filled) {
							targetLayer.CanvasContext.fillStyle = targetLayer.dataLayerColors[i];
							targetLayer.CanvasContext.fill();
						}
					}
				}
			}
		} else {
			return false;
		}
	};
	function drawBasePairs(targetLayer, colorLayer) {
		var color1,color2;
		var zoomEnabled = $('input[name="za"][value=on]').is(':checked');
		targetLayer.clearCanvas();
		if (!colorLayer) {
			var colorLayer = targetLayer.ColorLayer;
		} else {
			targetLayer.ColorLayer = colorLayer;
		}
		targetLayer.Data=rvDataSets[0].BasePairs;
		
		if (targetLayer.Data != undefined || targetLayer.Data == []) {
			if (targetLayer.ColorGradientMode == "Matched") {
				var grd_order = [0, 1];
			} else if (targetLayer.ColorGradientMode == "Opposite") {
				var grd_order = [1, 0];
			} else {
				alert("how did we get here?");
			}
			for (var i = 0; i < targetLayer.Data.length; i++) {
				var j = targetLayer.Data[i].resIndex1;
				var k = targetLayer.Data[i].resIndex2;
				//Come back and make zoom aware work correctly, with the same color and opacity as would be in other modes. 
				if (zoomEnabled) {
					var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) * (rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y) * (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
					
					if ((150 - rvViews[0].scale * 23) > jkdist) {
						targetLayer.Data[i]["color"] = "rgba(35,31,32," + targetLayer.Data[i].opacity + ")";
						continue;
					}
					if (((rvDataSets[0].Residues[j].X * rvViews[0].scale + rvViews[0].x < 0) || (rvDataSets[0].Residues[j].X * rvViews[0].scale + rvViews[0].x > rvViews[0].clientWidth) || (rvDataSets[0].Residues[j].Y * rvViews[0].scale + rvViews[0].y < 0) || (rvDataSets[0].Residues[j].Y * rvViews[0].scale + rvViews[0].y > rvViews[0].clientHeight))
						 && ((rvDataSets[0].Residues[k].X * rvViews[0].scale + rvViews[0].x < 0) || (rvDataSets[0].Residues[k].X * rvViews[0].scale + rvViews[0].x > rvViews[0].clientWidth) || (rvDataSets[0].Residues[k].Y * rvViews[0].scale + rvViews[0].y < 0) || (rvDataSets[0].Residues[k].Y * rvViews[0].scale + rvViews[0].y > rvViews[0].clientHeight))) {
						targetLayer.Data[i]["color"] = "rgba(35,31,32," + targetLayer.Data[i].opacity + ")";
						continue;
					}
				}
				if (j >= 0 && k >= 0) {
					switch (colorLayer.Type) {
					case undefined:
						if (colorLayer == "gray_lines") {
							var grd = rvDataSets[0].HighlightLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
							color1 = colorNameToHex("#231F20");
							color2 = colorNameToHex("#231F20");
							
							grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							
							targetLayer.Data[i]["color"] = grd;
							targetLayer.Data[i]["color_hex"] = color1;
						} else if (colorLayer == "manual_coloring") {
							var grd = rvDataSets[0].HighlightLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
							color1 = targetLayer.Data[i]["color_hex"];
							color2 = targetLayer.Data[i]["color_hex"];
							
							grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							
							targetLayer.Data[i]["color"] = grd;
							targetLayer.Data[i]["color_hex"] = color1;
						} else {
							alert("Invalid color mode");
						}
						break;
					case "residues":
						var grd = colorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
						if (rvDataSets[0].Residues[j].color && rvDataSets[0].Residues[k].color) {
							color1 = colorNameToHex(rvDataSets[0].Residues[j].color);
							color2 = colorNameToHex(rvDataSets[0].Residues[k].color);
							
							grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
						}
						//colorLayer.addLinearGradient(grd);
						targetLayer.Data[i]["color"] = grd;
						targetLayer.Data[i]["color_hex"] = color1;
						break;
					case "circles":
						var grd = colorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
						if (colorLayer.dataLayerColors[j] && colorLayer.dataLayerColors[k]) {
							color1 = colorNameToHex(colorLayer.dataLayerColors[j]);
							color2 = colorNameToHex(colorLayer.dataLayerColors[k]);
							
							grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
						}
						//colorLayer.addLinearGradient(grd);
						targetLayer.Data[i]["color"] = grd;
						targetLayer.Data[i]["color_hex"] = color1;
						break;
					case "selected":
						var grd = colorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
						if (colorLayer.Data[j] || colorLayer.Data[k]) {
							color1 = colorNameToHex(colorLayer.dataLayerColors[j]);
							color2 = colorNameToHex(colorLayer.dataLayerColors[k]);
							//color1 = colorNameToHex("#231F20");
							//color2 = colorNameToHex("#231F20");
							grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
							grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + "," + targetLayer.Data[i].opacity + ")");
						}
						//colorLayer.addLinearGradient(grd);
						targetLayer.Data[i]["color"] = grd;
						targetLayer.Data[i]["color_hex"] = color1;
						break;
					default:
						alert("this shouldn't be happening right now.");
					}
					//Regular Mode
					
					targetLayer.CanvasContext.beginPath();
					targetLayer.CanvasContext.moveTo(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y);
					targetLayer.CanvasContext.lineTo(rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
					targetLayer.CanvasContext.strokeStyle = targetLayer.Data[i]["color"];	
					targetLayer.CanvasContext.lineWidth = targetLayer.Data[i].lineWidth;					
					targetLayer.CanvasContext.stroke();
					targetLayer.CanvasContext.closePath();
					if (zoomEnabled && (rvViews[0].scale > 10)) {
						//draw the interaction type labels here
						var x1 = rvDataSets[0].Residues[j].X;
						var x2 = rvDataSets[0].Residues[k].X;
						var x12mid = x1 - ((x1 - x2) / 2);
						var xmid = rvDataSets[0].Residues[j].X - (rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) / 2;
						var ymid = rvDataSets[0].Residues[j].Y - (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y) / 2;
						targetLayer.CanvasContext.save();
						targetLayer.CanvasContext.lineWidth = 0.5;
						targetLayer.CanvasContext.fillStyle = "white";
						targetLayer.CanvasContext.fillRect(xmid - 2.4, ymid - .8, 4.7, 1.7);
						targetLayer.CanvasContext.strokeRect(xmid - 2.3, ymid - .7, 4.5, 1.5);
						targetLayer.CanvasContext.restore();
						targetLayer.CanvasContext.save();
						targetLayer.CanvasContext.font = ".5px Arial";
						targetLayer.CanvasContext.fillText(targetLayer.Data[i].bp_type, xmid - 2, ymid + .5);
						targetLayer.CanvasContext.restore();
						
					}
				}
			}
		}
	}
};

//Nucleotide object, used in the 1D panel for drawing and selection. The actual structure of any given domain in the 1D panel is a singly linked list.
function oneDimNucleotide(type, domain, number, xCoord, yCoord) {
    this.selected = false; //all nucleotides start off unselected
    this.type = type; //A,C,U,T,or G
    this.domain = domain; //domain number, used for sorting in 1D panel
    this.number = number; //overall nucleotide number in the total genetic sequence of the RNA piece
    this.next = false; //false is the same as no object in JavaScript. Go figure...
    this.x = xCoord;
    this.y = yCoord;
    this.drawnObject = null; //starting out there is no drawn object (nothing on the screen)
    this.setNext = function(nextNode) {
        next = nextNode;
    }
    this.draw = function(graphics) {
        this.drawnObject = graphics.append("text") // append text to panel
            .attr("x", this.x) //x position
            .attr("y", this.y) //y position
            .attr("text-anchor","left")
            .attr("color", this.getColor())
            .text(this.type);
    }
    this.setSelected = function(input) {
        if (input === true) {
            this.selected = input;
        } else if (input === false) {
            this.selected = input;
        } else {
            this.selected = false;
        }
        this.drawnObject.attr("fill", this.getColor());
    }
    this.getColor = function() {
        var output = "black";
        if (this.selected == true) {
            output = "blue";
        }
        return output;
    }
}
        

//One dimensional panel mouse listener. Used to draw selections and throw selection events.
function OneDPanelMouseListener(sequenceArray, coordArray, mLength, panel) {
    this.sequence = sequenceArray;
    this.maxDomLength = mLength;
    this.panel = panel;
    this.startCoords = new Array(2); //starting x/y on the page, starts undefined
    this.endCoords = new Array(2); //ending x/y
    this.mouseDown = false;
    this.cArr = coordArray; // [starting X, starting Y, Y incrament, X incrament] this is used to calculate which nucleotides are selected
    this.setMouseDown = function(input) {
        if (input === true) { //makes sure no javascript nonsense occurs. Only boolean true/false are accepted, no objects or nulls.
            this.mouseDown = true;
        } else if (input === false) {
            this.mouseDown = false;
        }
    }
    this.setStart = function(x, y) {
        this.startCoords[0] = x;
        this.startCoords[1] = y;
    }
    this.setStop = function(x, y) {
        this.endCoords[0] = x;
        this.endCoords[1] = y;
    }
    this.throwEvent = function() { //This function calculates the nucleotides selected, selects them, and then throws an event containing their numbers.
        if (this.mouseDown == true) { //don't throw events while mouseDown flag is up
            return
        }
        var xStart, xEnd, yStart, yEnd; //coordinates of the selection. Start is always smaller than end, defined below.
        if (this.startCoords[0] > this.endCoords[0]) { //case where the user clicks then drags up and to the left
            xStart = this.endCoords[0];
            xEnd = this.startCoords[0];
        } else if (this.startCoords[0] < this.endCoords[0]) { //case where the user clicks then drags down and to the right
            xStart = this.startCoords[0];
            xEnd = this.endCoords[0];
        } else { //case of a click without moving
            return //do nothing
        }
        if (this.startCoords[1] > this.endCoords[1]) { //case where the user clicks then drags up and to the left
            yStart = this.endCoords[1];
            yEnd = this.startCoords[1];
        } else if (this.startCoords[1] < this.endCoords[1]) { //case where the user clicks then drags down and to the right
            yStart = this.startCoords[1];
            yEnd = this.endCoords[1];
        } else { //case of a click without moving
            return //do nothing
        }
        if (xStart > this.maxDomLength * this.cArr[3] || xEnd < this.cArr[0] || yEnd < this.cArr[1] || yStart > (this.cArr[1] + this.cArr[2] * this.sequence.length)){
            return //if the user selects outside the range of any nucleotides don't do anything
        }
        var selection = ""; //selection is a comma separated string of the selected nucleotides numbers
        for (var i = 0; i < this.sequence.length; i++) {
            for (var j = 0; j < this.sequence[i].length; j++) {
                if ((this.sequence[i][j].x >= xStart) && (this.sequence[i][j].x <= xEnd) && (this.sequence[i][j].y >= yStart) && (this.sequence[i][j].y <= yEnd)) { //if within selection
                    this.sequence[i][j].setSelected(true); //selects nucleotide
                    selection += this.sequence[i][j].number + ",";
                } else {
                    this.sequence[i][j].setSelected(false); //deselects prior selections
                }
            }
        }
        if (selection.length < 1) {
            return; //no selection
        } else { //Chad, I couldn't figure out how you are doing your communication in this program, though it doesn't appear to use events.
        //at this point you have a comma separated string containing the selection. It should be relatively straighforward to integrate it into
        // your own panels from here. I was thinking of doing something like what I have below but you don't seem to use events so i'm not entirely
        // sure how you would want this integrated.
        //    var selectionEvent = new oneDSelection(selection);
        //    throw selectionEvent
        }
    }
}

function OneDimSelectionBox(graphics) {
//this object is a selection box for the 1D panel made of 4 individual line objects attached to a graphics panel
    this.g = graphics;
    this.lastPoint = [0,0];
    this.top = this.g.append("line")
                     .attr("x1", -5)
                     .attr("x2", 0)
                     .attr("y1", -5)
                     .attr("y2", 0)
                     .attr("stroke", "blue")
                     .attr("stroke-width", 1);
    this.bot = this.g.append("line")
                     .attr("x1", -5)
                     .attr("x2", 0)
                     .attr("y1", -5)
                     .attr("y2", 0)
                     .attr("stroke", "blue")
                     .attr("stroke-width", 1);
    this.left = this.g.append("line")
                     .attr("x1", -5)
                     .attr("x2", 0)
                     .attr("y1", -5)
                     .attr("y2", 0)
                     .attr("stroke", "blue")
                     .attr("stroke-width", 1);
    this.right = this.g.append("line")
                     .attr("x1", -5)
                     .attr("x2", 0)
                     .attr("y1", -5)
                     .attr("y2", 0)
                     .attr("stroke", "blue")
                     .attr("stroke-width", 1);
    this.setStart = function(xStart, yStart) {
    //This method is called when the user clicks the mouse down, it puts a small box under their cursor
        this.lastPoint[0] = xStart;
        this.lastPoint[1] = yStart;
        this.top.attr("x1", xStart);
        this.top.attr("y1", yStart);
        this.top.attr("y2", yStart);
        this.top.attr("x2", xStart + 1);
        this.left.attr("x1", xStart);
        this.left.attr("y1", yStart);
        this.left.attr("x2", xStart);
        this.left.attr("y2", yStart + 1);
        this.bot.attr("x1", xStart);
        this.bot.attr("y1", yStart + 1);
        this.bot.attr("x2", xStart + 1);
        this.bot.attr("y2", yStart + 1);
        this.right.attr("x1", xStart + 1);
        this.right.attr("x2", xStart + 1);
        this.right.attr("y1", yStart);
        this.right.attr("y2", yStart + 1);
    }
    this.moveBox = function(x,y) { //this method is called when the user moves the mouse with the button down
        this.lastPoint[0] = x;
        this.lastPoint[1] = y;
        this.top.attr("x2", x);
        this.left.attr("y2", y);
        this.bot.attr("y1", y);
        this.bot.attr("y2", y);
        this.bot.attr("x1", x);
        this.right.attr("x1", x);
        this.right.attr("x2", x);
        this.right.attr("y2", y);
    }
    this.reset = function() {//this method removes the box from the screen
        this.lastPoint[0] = 0;
        this.lastPoint[1] = 0;
        this.top.attr("x1", -1);
        this.top.attr("y1", -1);
        this.top.attr("y2", -1);
        this.top.attr("x2", -1);
        this.left.attr("x1", -1);
        this.left.attr("y1", -1);
        this.left.attr("x2", -1);
        this.left.attr("y2", -1);
        this.bot.attr("x1", -1);
        this.bot.attr("y1", -1);
        this.bot.attr("x2" -1);
        this.bot.attr("y2", -1);
        this.right.attr("x1", -1);
        this.right.attr("x2", -1);
        this.right.attr("y1", -1);
        this.right.attr("y2", -1);
    }
}

function rvView(x, y, scale) {
	//Properties
	this.x = x;
	this.y = y;
	this.scale = scale;
	this.lastX = [];
	this.lastY = [];
	this.startX = [];
	this.startY = [];
	this.width = [];
	this.height = [];
	this.clientWidth = [];
	this.clientHeight = [];
	this.slideValue = 20;
	
	//Methods
	this.zoom = function (event, delta) {
		if (($("#slider").slider("value") + delta) <= $("#slider").slider("option", "max") & ($("#slider").slider("value") + delta) >= $("#slider").slider("option", "min")) {
			zoom(event.clientX - $("#menu").outerWidth(), event.clientY - $("#topMenu").outerHeight(), Math.pow(1.1, delta), this);
			$("#slider").slider("value", $("#slider").slider("value") + delta);
			this.slideValue = $("#slider").slider("value") + delta;
		}
	}
	this.drag = function (event) {
		var targetSelection=rvDataSets[0].getSelection($('input:radio[name=selectedRadioS]').filter(':checked').parent().parent().attr('name'));
		//rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#ff0000";
		rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = targetSelection.Color;
		rvDataSets[0].HighlightLayer.CanvasContext.strokeRect(this.startX, this.startY, (event.clientX - $("#menu").outerWidth() - this.x) / this.scale - this.startX, (event.clientY - $("#topMenu").outerHeight() - this.y) / this.scale - this.startY);
	}
	this.restore = function () {
		$("#slider").slider("value",this.slideValue);
		rvDataSets[0].drawResidues("residues");
		rvDataSets[0].drawSelection("selected");
		rvDataSets[0].refreshResiduesExpanded("circles");
		rvDataSets[0].drawLabels("labels");
		rvDataSets[0].drawBasePairs("lines");
	}
	
	this.toJSON = function () {
		return {
			x: this.x,
			y: this.y, 
			scale: this.scale, 
			lastX: this.lastX,
			lastY: this.lastY,
			startX: this.startX,
			startY: this.startY,
			width: this.width,
			height: this.height,
			clientWidth: this.clientWidth,
			clientHeight: this.clientHeight,
			slideValue : this.slideValue
		};
	}
	
	this.fromJSON = function (json) {
		var data = JSON.parse(json);
		//var data = json;
		var e = new rvView(data.x, data.y, data.scale);
		e.lastX = data.lastX;
		e.lastY = data.lastY;
		e.startX = data.startX;
		e.startY = data.startY;
		e.width = data.width;
		e.height = data.height;
		e.clientWidth = data.clientWidth;
		e.clientHeight = data.clientHeight;
		e.slideValue = data.slideValue;
		return e;
	}
	
};
///////////////////////////////////////////////////////////////////////////////