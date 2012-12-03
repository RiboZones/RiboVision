/* Ribovision 0.5 script library Ribovision.js 2:03 PM 10/01/2012 Chad R. Bernier


based on:
 *
 * Copyright (C) 2012  RiboEvo, Georgia Institute of Technology, apollo.chemistry.gatech.edu
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

/////////////////////////// Global Variable Declaration ///////////////////////
// Main Variables
var rvDataSets = [];
var SubunitNames = ['LSU', 'SSU'];
var rvViews = [];
var FileReaderFile;

var FullBasePairSet;

// Website Settings
var zoomEnabled = true;
var onebuttonmode;
var clickedNASA = 0;
var clickedRiboEvo = 0;
var CurrPrivacyCookie;
var AgreeFunction = function () {};
var drag;
var PanelDivide = 0.5;
var TopDivide = 0.12;

// Color Palettes, need to be consolidated
var OnionColors = ["#000000", "#ff0000", "#008000", "#0000ff", "#800080", "#ff8c00", "#ff8c00", "#ff8c00"];
var DomainColors = ["#ffd4a2", "#a999fb", "#3aa7ff", "#cc99cc", "#f0ff00", "#ff99cc", "#0ba34a", "#8ec640", "#B27643"];
var HelixColors = ["#000000", "#ed1c24", "#00a651", "#1c75bc", "#662d91"];
var ShapeColors = ["#808080", "#0000ff", "#008000", "#ffd700", "#ff0000"];
var BinaryColors = ["#509467", "#FF784F", "#FF0DE7"];
var RainBowColors = ["#00008f", "#00009f", "#0000af", "#0000bf", "#0000cf", "#0000df",
	"#0000ef", "#0000ff", "#0010ff", "#0020ff", "#0030ff", "#0040ff",
	"#0050ff", "#0060ff", "#0070ff", "#0080ff", "#008fff", "#009fff",
	"#00afff", "#00bfff", "#00cfff", "#00dfff", "#00efff", "#00ffff",
	"#10ffef", "#20ffdf", "#30ffcf", "#40ffbf", "#50ffaf", "#60ff9f",
	"#70ff8f", "#80ff80", "#8fff70", "#9fff60", "#afff50", "#bfff40",
	"#cfff30", "#dfff20", "#efff10", "#ffff00", "#ffef00", "#ffdf00",
	"#ffcf00", "#ffbf00", "#ffaf00", "#ff9f00", "#ff8f00", "#ff8000",
	"#ff7000", "#ff6000", "#ff5000", "#ff4000", "#ff3000", "#ff2000",
	"#ff1000", "#ff0000", "#ef0000", "#df0000", "#cf0000", "#bf0000",
	"#af0000", "#9f0000", "#8f0000", "#800000"];

var oCanvas1, oCanvas2, Lines;

var HighlightLayer;
///////////////////////////////////////////////////////////////////////////////


/////////////////////////// Classes ///////////////////////////////////////////
function RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type) {
	//Properties
	this.LayerName = LayerName;
	this.CanvasName = CanvasName;
	this.Canvas = document.getElementById(CanvasName);
	this.CanvasContext = this.Canvas.getContext("2d");
	this.Data = Data;
	this.dataLayerColors = [];
	this.Filled = Filled;
	this.ScaleFactor = ScaleFactor;
	this.LinearGradients = [];
	this.Type = Type;
	this.zIndex = this.Canvas.style.zIndex;
	this.Visible = true;
	this.Selected = false;
	this.Linked = false;
	this.ColorLayer = [];
	this.ColorGradientMode = "Matched";
	if (this.Type === "lines") {
		this.ColorLayer = "gray_lines";
		this.ColorGradientMode = "Matched";
	}
	//Methods
	this.clearCanvas = function () {
		this.CanvasContext.setTransform(1, 0, 0, 1, 0, 0);
		this.CanvasContext.clearRect(0, 0, HighlightLayer.width, HighlightLayer.height);
		this.CanvasContext.setTransform(rvViews[0].scale, 0, 0, rvViews[0].scale, rvViews[0].x, rvViews[0].y);
	};
	this.addLinearGradient = function (LinearGradient) {
		this.LinearGradients.push(LinearGradient);
	};
	this.deleteLayer = function () {
		$(this.Canvas).remove();
	};
	this.clearData = function () {
		this.dataLayerColors = new Array;
		for (var jj = 0; jj < rvDataSets[0].Residues.length; jj++) {
			this.dataLayerColors[jj] = undefined;
		}
	}
	this.setVisibility = function (visibility_prop){
		switch (visibility_prop) {
			case "hidden" : 
				$(this.Canvas).css("visibility", "hidden");
				this.Visible = false;
				break;
			case "visible" : 
				$(this.Canvas).css("visibility", "visible");
				this.Visible = true;
				break;
			default : 
				alert("this shouldn't happen");
		}
	}
}

function rvDataSet(DataSetName) {
	//Properties
	this.Name = DataSetName;
	this.Layers = [];
	this.HighlightLayer = [];
	this.Residues = [];
	this.ResidueList = [];
	this.rvTextLabels = [];
	this.rvLineLabels = [];
	this.BasePairs = [];
	this.Selected = [];
	this.CustomData = [];
	this.SpeciesEntry = [];
	this.Selections = [];
	this.LastLayer = 0;
	this.LayerTypes = ['circles', 'lines', 'labels', 'residues', 'contour', 'selected'];
	//Methods
	this.addLayers = function (rvLayers) {
		this.Layers = rvLayers;
		this.LastLayer = this.Layers.length - 1;
	};
	this.addLayer = function (LayerName, CanvasName, Data, Filled, ScaleFactor, Type) {
		var b = new RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type);
		this.Layers[b.zIndex] = b;
		this.LastLayer = this.Layers.length - 1;
	};
	this.addHighlightLayer = function (LayerName, CanvasName, Data, Filled, ScaleFactor, Type) {
		var b = new RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type);
		this.HighlightLayer = b;
	};
	this.addResidues = function (rvResidues) {
		this.Residues = rvResidues;
		this.ResidueList = makeResidueList(rvResidues);
	};
	this.addLabels = function (rvTextLabels, rvLineLabels) {
		this.rvTextLabels = rvTextLabels;
		this.rvLineLabels = rvLineLabels;
	};
	this.addBasePairs = function (BasePairs) {
		this.BasePairs = BasePairs;
	};
	this.addSelected = function (Selected) {
		this.Selected = Selected;
	};
	this.addCustomData = function (CustomData) {
		this.CustomData = CustomData;
	};
	this.addSpeciesEntry = function (SpeciesEntry) {
		this.SpeciesEntry = SpeciesEntry;
		this.SpeciesEntry.Molecule_Names = this.SpeciesEntry.Molecule_Names.split(":");
	};
	this.addSelection = function (Selection, Name) {
		if (!Name) {
			Name = "Sele" + (this.Selections.length + 1);
		}
		this.Selections[Name] = Selection;
	};
	this.sort = function () {
		this.Layers.sort(function (a, b) {
			return (Number(a.Canvas.style.zIndex) - Number(b.Canvas.style.zIndex));
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
	this.drawLabels = function (layer) {
		this.clearCanvas(layer);
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					
					drawLabels(value);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawLabels(value);
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
	this.drawSelection = function (layer) {
		var ind = $.inArray(layer, this.LayerTypes);
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					drawSelection(value);
				}
			});
		} else {
			$.each(this.Layers, function (key, value) {
				if (value.LayerName === layer) {
					drawSelection(value);
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
		var ind = $.inArray(layer, this.LayerTypes), ret = [];
		if (ind >= 0) {
			$.each(this.Layers, function (key, value) {
				if (value.Type === layer) {
					ret.push(value);
				}
			});
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
	this. isUnique = function (layer){
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
				value.Canvas.style.zIndex = key;
			}
		});
	};
	// Private functions, kinda
	function makeResidueList(rvResidues) {
		var ResidueListLocal = [], j;
		for (j = 0; j < rvResidues.length; j++) {
			ResidueListLocal[j] = rvResidues[j].ChainID + "_" + rvResidues[j].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
		}
		return ResidueListLocal;
	}
	function refreshLayer(targetLayer) {
		if (rvDataSets[0].Residues !== undefined && targetLayer.Type === "circles") {
			targetLayer.clearCanvas();
			for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
				if (targetLayer.dataLayerColors[i] != '#000000' && targetLayer.dataLayerColors[i] != undefined && targetLayer.dataLayerColors[i] != '#858585') {
					targetLayer.CanvasContext.beginPath();
					targetLayer.CanvasContext.arc(rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y, (targetLayer.ScaleFactor * 1.7), 0, 2 * Math.PI, false);
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
	function drawLabels(targetLayer) {
		targetLayer.CanvasContext.textAlign = 'left';
		
		if (rvDataSets[0].rvTextLabels != undefined) {
			var n = watermark(false);
			for (var i = 0; i < rvDataSets[0].rvTextLabels.length; i++) {
				targetLayer.CanvasContext.font = (0.75 * rvDataSets[0].rvTextLabels[i].FontSize) + "pt Calibri";
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
	}
	function drawResidues(targetLayer, dataIndices, ColorArray, noClear) {
		if (targetLayer.Type === "residues"){
			if (!noClear) {
				targetLayer.clearCanvas();
				//targetLayer.dataLayerColors = [];
			}
			if (rvDataSets[0].Residues && rvDataSets[0].Residues.length > 0) {
				if (dataIndices && ColorArray){
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						if (ColorArray[dataIndices[i]]) {
							rvDataSets[0].Residues[i].color = ColorArray[dataIndices[i]];
							targetLayer.dataLayerColors[i] = ColorArray[dataIndices[i]];
						}
					}		
				} else {
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						rvDataSets[0].Residues[i].color = targetLayer.dataLayerColors[i];
					}		
				}
				targetLayer.CanvasContext.strokeStyle = "#000000";
				targetLayer.CanvasContext.font = "3pt Arial";
				targetLayer.CanvasContext.textBaseline = "middle";
				targetLayer.CanvasContext.textAlign = "center";
				for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
					targetLayer.CanvasContext.fillStyle = (targetLayer.dataLayerColors[i] || "#000000");
					targetLayer.CanvasContext.fillText(rvDataSets[0].Residues[i].resName, rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y);
				}
			} else {
				welcomeScreen();
			}
		}
	}
	function drawSelection(targetLayer) {
		targetLayer.clearCanvas();
		if (rvDataSets[0].Residues.length > 0) {
			for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
				if (rvDataSets[0].Residues[i].selected) {
					targetLayer.CanvasContext.beginPath();
					targetLayer.CanvasContext.arc(rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y, (targetLayer.ScaleFactor * 1.7), 0, 2 * Math.PI, false);
					targetLayer.CanvasContext.closePath();
					targetLayer.CanvasContext.strokeStyle = "#940B06";
					targetLayer.CanvasContext.lineWidth = 0.5;
					targetLayer.CanvasContext.stroke();
				}
			}
		}
	}
	function drawDataCircles(targetLayer, dataIndices, ColorArray, noClear) {
		if (targetLayer.Type === "circles"){
			if (!noClear) {
				targetLayer.clearCanvas();
				targetLayer.dataLayerColors = [];
			}
			
			if (rvDataSets[0].Residues != undefined) {
				for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
					if (ColorArray[dataIndices[i]] != '#000000' && ColorArray[dataIndices[i]] != undefined && ColorArray[dataIndices[i]] != '#858585') {
						targetLayer.CanvasContext.beginPath();
						targetLayer.CanvasContext.arc(rvDataSets[0].Residues[i].X, rvDataSets[0].Residues[i].Y, (targetLayer.ScaleFactor * 1.7), 0, 2 * Math.PI, false);
						targetLayer.CanvasContext.closePath();
						targetLayer.CanvasContext.strokeStyle = ColorArray[dataIndices[i]];
						targetLayer.CanvasContext.stroke();
						if (targetLayer.Filled) {
							targetLayer.CanvasContext.fillStyle = ColorArray[dataIndices[i]];
							targetLayer.CanvasContext.fill();
						}
						targetLayer.dataLayerColors[i] = ColorArray[dataIndices[i]];
					}
				}
			}
		} else {
			return false;
		}
	};
	function drawBasePairs(targetLayer, colorLayer) {
		var color1,color2;
		targetLayer.clearCanvas();
		if (!colorLayer) {
			colorLayer = targetLayer.ColorLayer;
		} else {
			targetLayer.ColorLayer = colorLayer;
		}
		if (rvDataSets[0].BasePairs != undefined || rvDataSets[0].BasePairs == []) {
			if (targetLayer.ColorGradientMode == "Matched") {
				var grd_order = [0, 1];
			} else if (targetLayer.ColorGradientMode == "Opposite") {
				var grd_order = [1, 0];
			} else {
				alert("how did we get here?");
			}
			for (var i = 0; i < rvDataSets[0].BasePairs.length; i++) {
				var j = rvDataSets[0].BasePairs[i].resIndex1;
				var k = rvDataSets[0].BasePairs[i].resIndex2;
				if(zoomEnabled){
					var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X)*(rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)*(rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
					
					
					if((150 - rvViews[0].scale*23) > jkdist){
						continue;
					}
					if(( (rvDataSets[0].Residues[j].X*rvViews[0].scale+rvViews[0].x < 0) || (rvDataSets[0].Residues[j].X*rvViews[0].scale+rvViews[0].x > HighlightLayer.clientWidth) || (rvDataSets[0].Residues[j].Y*rvViews[0].scale+rvViews[0].y < 0) ||  (rvDataSets[0].Residues[j].Y*rvViews[0].scale+rvViews[0].y > HighlightLayer.clientHeight))
					&& ( (rvDataSets[0].Residues[k].X*rvViews[0].scale+rvViews[0].x < 0) || (rvDataSets[0].Residues[k].X*rvViews[0].scale+rvViews[0].x > HighlightLayer.clientWidth) || (rvDataSets[0].Residues[k].Y*rvViews[0].scale+rvViews[0].y < 0) ||  (rvDataSets[0].Residues[k].Y*rvViews[0].scale+rvViews[0].y > HighlightLayer.clientHeight)) )  {
					continue;
						}
						}
				if (j >=0 && k >=0){
					switch (colorLayer.Type) {
						case undefined:
							rvDataSets[0].BasePairs[i]["color"] = "rgba(35,31,32,.5)";
							break;
						case "residues":
							var grd = colorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
							if (rvDataSets[0].Residues[j].color && rvDataSets[0].Residues[k].color){
								color1 = colourNameToHex(rvDataSets[0].Residues[j].color);
								color2 = colourNameToHex(rvDataSets[0].Residues[k].color);
								
								grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + ",.5)");
								grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + ",.5)");
							}
							colorLayer.addLinearGradient(grd);
							rvDataSets[0].BasePairs[i]["color"] = grd;
							break;
						case "circles":
							var grd = colorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
							if (colorLayer.dataLayerColors[j] && colorLayer.dataLayerColors[k]){
								color1 = colourNameToHex(colorLayer.dataLayerColors[j]);
								color2 = colourNameToHex(colorLayer.dataLayerColors[k]);
								
								grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + ",.5)");
								grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + ",.5)");
							}
							colorLayer.addLinearGradient(grd);
							rvDataSets[0].BasePairs[i]["color"] = grd;
							break;
						default:
							alert("this shouldn't be happening right now.");
					}
					//Regular Mode
					
					targetLayer.CanvasContext.strokeStyle = rvDataSets[0].BasePairs[i]["color"];
					targetLayer.CanvasContext.beginPath();
					targetLayer.CanvasContext.moveTo(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y);
					targetLayer.CanvasContext.lineTo(rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
					targetLayer.CanvasContext.closePath();
					targetLayer.CanvasContext.stroke();
				if(zoomEnabled && (rvViews[0].scale> 10)){
					//draw the interaction type labels here
					var x1 = rvDataSets[0].Residues[j].X;
					var x2 = rvDataSets[0].Residues[k].X;
					var x12mid = x1 - ((x1-x2)/2); 
					var xmid =rvDataSets[0].Residues[j].X - (rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X)/2 ;
					var ymid =rvDataSets[0].Residues[j].Y - (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)/2;
					targetLayer.CanvasContext.save();
					targetLayer.CanvasContext.lineWidth = .2;
					targetLayer.CanvasContext.fillStyle = "white";
					targetLayer.CanvasContext.fillRect(xmid-2.4, ymid-.8, 4.7,1.7);
					targetLayer.CanvasContext.strokeRect(xmid-2.3, ymid-.7, 4.5,1.5);
					targetLayer.CanvasContext.restore();
					targetLayer.CanvasContext.save();
					targetLayer.CanvasContext.font = ".5px Arial";
					targetLayer.CanvasContext.fillText(rvDataSets[0].BasePairs[i].bp_type, xmid-2, ymid+.5);
					targetLayer.CanvasContext.restore();
					
				}
				}
			}
		}
	}
};

function rvView(x, y, scale) {
	//Properties
	this.x = x;
	this.y = y;
	this.scale = scale;
	this.lastX = [];
	this.lastY = [];
	this.startX = [];
	this.startY = [];
	
	//Methods
	this.zoom = function (event, delta) {
		if (($("#slider").slider("value") + delta) <= $("#slider").slider("option", "max") & ($("#slider").slider("value") + delta) >= $("#slider").slider("option", "min")) {
			zoom(event.clientX - $("#menu").outerWidth(), event.clientY - $("#topMenu").outerHeight(), Math.pow(1.1, delta), this);
			$("#slider").slider("value", $("#slider").slider("value") + delta);
		}
	}
	this.drag = function (event) {
		rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#ff0000";
		rvDataSets[0].HighlightLayer.CanvasContext.strokeRect(this.startX, this.startY, (event.clientX - $("#menu").outerWidth() - this.x) / this.scale - this.startX, (event.clientY - $("#topMenu").outerHeight() - this.y) / this.scale - this.startY);
	}
	
};
///////////////////////////////////////////////////////////////////////////////


////////////////////////// Initialize RiboVision //////////////////////////////
// Initialize Jmol
jmolInitialize("./jmol");



// Ready Function
$(document).ready(function () {
	// New Stuff Section, Layers, Selections Panels
	$.fx.speeds._default = 1000;
	$("#PanelTabs").tabs();
	
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
	
	$("#LayerPreferenceDialog").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 300
		},
		height : 200,
		width : 400,
		position : {
			my : "center",
			at : "center",
			of : $("#canvasDiv")
		}
	});

	$("#RiboVisionSettingsPanel").dialog({
		autoOpen : false,
		show : {
			effect : "blind",
			duration : 300
		},
		height : 300,
		position : {
			my : "left top",
			at : "left top",
			of : $("#SiteInfo")
		}
	});

	
	$("#openLayerBtn").click(function () {
		$("#LayerDialog").dialog("open");
		return false;
	});
	
	$("#openColorBtn").click(function () {
		$("#ColorDialog").dialog("open");
		return false;
	});

	$("#RiboVisionSettings").click(function () {
		$("#RiboVisionSettingsPanel").dialog("open");
		return false;
	});
	
	
	//////////////////////////////////////////////////
	
	///////////////////////////////////////////////////
	
	$('#slider').slider({
		min : 0,
		max : 70,
		value : 20,
		orientation : "vertical",
		slide : function (event, ui) {
			zoom(HighlightLayer.width / 2, HighlightLayer.height / 2, Math.pow(1.1, (ui.value - $(this).slider("value"))));
		}
	});
	
	$('.ui-slider-handle').height(21).width(21);
	$("#TemplateLink").button();
	$("#UserNameField").button().addClass('ui-textfield').keydown(function (event) {
		if (event.keyCode == 13) {
			$("#User-Name-Request").dialog("option", "buttons")['Ok'].apply($("#User-Name-Request"));
		}
	});
	$("#newLayerName").button().addClass('ui-textfield').keydown(function (event) {
		if (event.keyCode == 13) {
			$("#dialog-addLayer").dialog("option", "buttons")['Create New Layer'].apply($("#dialog-addLayer"));
		}
	});
		
	$("#saveSelection").button().click(function () {
		$("#User-Name-Request").dialog('open');
	})
	
	$("#savedSelections").multiselect({
		minWidth : 160,
		click : function (event, ui) {
			var array_of_checked_values = $("#savedSelections").multiselect("getChecked").map(function () {
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
			var array_of_checked_values = $("#savedSelections").multiselect("getChecked").map(function () {
					return this.value;
				});
			clearSelection();
			$.each(array_of_checked_values, function (i, val) {
				commandSelect(val.replace(/\,/g, ";"))
			});
		}
	});
	$("#savedSelections").multiselect().multiselectfilter();
	$("#dialog-addLayer").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Create New Layer" : function () {
				if (rvDataSets[0].isUnique($("#newLayerName").val())){
					$("#canvasDiv").append($('<canvas id="' + $("#newLayerName").val() + '" style="z-index:' + ( rvDataSets[0].LastLayer + 1 ) + ';"></canvas>')); 
					resizeElements();
					rvDataSets[0].addLayer($("#newLayerName").val(), $("#newLayerName").val(), [], true, 1.0, 'circles');
					LayerMenu(rvDataSets[0].getLayer($("#newLayerName").val()),(1000 + ( rvDataSets[0].LastLayer + 1 ) ));
					RefreshLayerMenu();
					$(this).dialog("close");
				} else {
					$( "#dialog-unique-layer-error" ).dialog("open");
				}
			},
			Cancel: function (){
				$(this).dialog("close");
			}
		},
		open : function () {
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
		}
	});
	$("#dialog-addLayer p").append("We currently are only supporting the addition of new circle type layers." + 
		" Future updates will let you add additional layers of any type." + 
		"<br><br>Please enter a name for the new layer.");
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
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
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
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
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
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
		}
	});
	$("#User-Name-Request").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Ok" : function () {
				$("#savedSelections").append(new Option($("#UserNameField").val(), $("#selectDiv").text().replace(/\s/g, "").replace(/\([^\)]*\)/g,"")));
				$("#savedSelections").multiselect("refresh");
				$(this).dialog("close");
			}
		},
		open : function () {
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
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
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
		}
	});
	$("#dialog-confirm-delete").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Delete the Layer" : function (event) {
				$("[name=" + rvDataSets[0].getSelectedLayer().LayerName + "]").remove();
				rvDataSets[0].deleteLayer(rvDataSets[0].getSelectedLayer().LayerName);
				$(this).dialog("close");
			},
			Cancel : function () {
				$(this).dialog("close");
			}
		},
		open : function (event) {
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
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
			$("#jmolApplet0").css("visibility", "hidden");
		},
		close : function () { 
			$("#jmolApplet0").css("visibility", "visible");
		}
	});
	
	$("#colorpicker").farbtastic("#color");
	$("#SideBarAccordian").accordion({
		fillSpace : true,
		autoHeight : false,
		activate : function (event, ui) {
			resetFileInput($('#files'));
			$('#files').on('change', function (event) {
				handleFileSelect(event);
			});
		}
	});
	
	$("#tabs").tabs();
	$("#ProtList").multiselect({
		minWidth : 160,
		selectedText : "# of # proteins selected",
		noneSelectedText : 'Select proteins',
		selectedList : 9,
	});
	
	$("#StructDataList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1
	});
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
	
	$("#alnList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1
	});
	$("#PrimaryInteractionList").multiselect({
		minWidth : 160,
		multiple : false,
		header : "Select a Data Set",
		noneSelectedText : "Select an Option",
		selectedList : 1,
		click : function (event){
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
					$("#dialog-generic-notice [name=replace]").text("You have selected Protein Interactions but the protein list is empty. Please select one or more proteins.");
					$("#dialog-generic-notice").dialog("open");
				}
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
		},
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
	
	$("#RiboVisionSettings").button({
		text : false,
		icons : {
			primary : "ui-icon-gear"
		}
	});
	
	$("#openManualBtn").button({
		text : false,
		icons : {
			primary : "ui-icon-help"
		}
	});
	
	$("#layerNameInput").keydown(function (event) {
		if (event.keyCode == 13) {
			changeCurrentLayerName();
		}
	});
	$("#buttonmode").buttonset();
	$("#colorLinesMode").buttonset();
	$("#colorLinesGradientMode").buttonset();
	$("[name=clearColor]").button();
	$("[name=selebutton]").button();
	$("[name=saveas]").button();	
	$("[name=savelayers]").button();
	$("#colorSelection").button();
	InitRibovision();
});

//in "Layer Preferfence" 
function changeCurrentLayerName() {
	//console.log("function changeCurrentLayerName is called!");
	//console.log("current layer name: " + $dblClickedLayerName);	
	//$($dblClickedLayer).innerHTML = document.getElementById("layerNameInput").value;
	//$newName = document.getElementById("layerNameInput").value;
	//$currentLayerName = $newName;
	//console.log("new layer name: " + $newName);	
	$($dblClickedLayer).parent().attr("name",$("#layerNameInput").val());
	$($dblClickedLayer).html($("#layerNameInput").val()).prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>');
	targetLayer = rvDataSets[0].getLayer($dblClickedLayerName);
	targetLayer.LayerName = $("#layerNameInput").val();
	RefreshLayerMenu();
}

function LayerMenu(Layer, key) {
	//console.log($count);
	$currentLayerName = Layer.LayerName;
	//console.log($currentLayerName);
	$('[name=TopLayerBar]').after(($("<div>").addClass("oneLayerGroup").attr({
			'name' : $currentLayerName
		})));
	//console.log("id:" + $('.oneLayerGroup').attr("name"));
	//$('.oneLayerGroup').append(("<div>").addClass("visibilityCheckbox"));
	//$('.visibilityCheckbox').append($("<input />").attr({type:'checkbox'}).addClass("layerVisiblity"))
	
	//This is necessary because if just use $('.oneLayerGroup'), then duplicated layers will be added to different groups
	$currentGroup = document.getElementsByName($currentLayerName);
	//console.log($currentGroup);
	
	//hide and show icon: eye 
	$visibleImgPath = "images/visible.png";
	$invisibleImgPath = "images/invisible.png";
	$($currentGroup)
	.append($("<div>").addClass("checkBoxDIV").css({
			'float' : 'left',
			'padding-top' : 5,
			'width' : 20
		}).append($("<img class='visibilityCheckImg' value='visible' title='visibility' src='./images/visible.png'/>").css({
			'width' : '24px', 
			'height': 'auto',
			'margin-top': 3
		}).click( function() {
			$type = this.getAttribute('value');
			if($type == 'visible'){
				this.setAttribute('value','invisible'); 
				this.setAttribute('src', $invisibleImgPath);
				targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
				targetLayer.setVisibility("hidden");
			}
			else if($type == 'invisible'){
				this.setAttribute('value','visible');
				this.setAttribute('src', $visibleImgPath);
				targetLayer=rvDataSets[0].getLayer(this.parentNode.parentNode.getAttribute("name"));
				targetLayer.setVisibility("visible");
			}
		}))		
	);
				
	//adding raido button for selection		
	$($currentGroup)
	.append($("<div>").addClass("radioDIV").css({
		'float' : 'left',
		'padding-top' : 5,
		'padding-left' : 5,
		'width' : 20
	}).append($("<input />").attr({
			type : 'radio',
			name : 'selectedRadio',
			title : 'select layer' 
		}).addClass("selectLayerRadioBtn").change ( function (event) {
			rvDataSets[0].selectLayer($(event.currentTarget).parent().parent().attr("name"));
			})));
	
	//raido button for telling 2D-3D mapping 
	$($currentGroup)
	.append($("<div>").addClass("radioDIV2").css({
		'float' : 'left',
		'padding-top' : 5,
		'padding-left' : 5,
		'width' : 20
	}).append($("<input />").attr({
			type : 'radio',
			name : 'mappingRadio',
			title : 'select which layer to map into 3D',
			disabled : 'disabled'
		}).addClass("mappingRadioBtn").change (function (event) {
			rvDataSets[0].linkLayer($(event.currentTarget).parent().parent().attr("name"));
			update3Dcolors();
			})));
	/*
	$selectBox = document.getElementsByClassName("checkBoxDIV");
	console.log("DivDialog' width: " + $("#LayerDialog").width());
	console.log("panelTabs' width: " + $("#PanelTabs").width());
	console.log("CBDiv width: " + $('.checkBoxDIV').width());
	console.log("checkbox width: " + $('.visibilityCheckBox').width());
	$accordionWidth = $("#PanelTabs").width() - $('.visibilityCheckBox').width();
	console.log("accordion width: " + $accordionWidth); //why 0??!!!
	 */
	
	//adding accordion
	$($currentGroup)
	.append($("<h3>").addClass("layerName").css({
			'margin-left' : 78
		}).append($currentLayerName)
	.dblclick(function() { //double click to open dialog to change layer name and set color
		//watch out! $currentLayerName != the layer you are clicking right now!
		//open a dialog window for changing layer names
		$("#LayerPreferenceDialog").dialog("open");

		//get the name of the layer that just got double clicked
		$dblClickedLayerName = this.innerHTML.substring(this.innerHTML.lastIndexOf("</span>")+7);
		$dblClickedLayer = this;
		document.getElementById("layerNameInput").value = "";
		document.getElementById("layerNameInput").placeholder = $dblClickedLayerName;			
		
		console.log(this.innerHTML);			
	}))
	.append($("<div>").addClass("layerContent").css({
			'margin-left' : 78
		}));	
		
	//$count++;
	
	switch (Layer.Type) {
		case "circles":
			$("#LayerPanel div").first().next().find(".layerContent").append($('<div id="' + 'pr-' + key + '">').text("Draw Circles as:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="filled' + key + '" id="' + 'pr-' + key + '-1' + '" value="filled" checked="checked"> <label for="' + 'pr-' + key + '-1' + ' ">filled</label>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="filled' + key + '" id="' + 'pr-' + key + '-2' + '" value="unfilled"> <label for="' + 'pr-' + key + '-2' + '">unfilled</label>'));
			//$('#' + 'pr-' + key).buttonset();
			if (Layer.Filled) {
				$('input[name="filled' + key + '"][value=filled]').attr("checked", true);
			} else {
				$('input[name="filled' + key + '"][value=unfilled]').attr("checked", true);
			}
			$('input[name="filled' + key + '"]').change(function (event) {
				if ($('input[name="filled' + key + '"][value=filled]').attr("checked")) {
					Layer.Filled = true;
				} else {
					Layer.Filled = false;
				}
				rvDataSets[0].refreshResiduesExpanded($(event.currentTarget).parent().parent().parent().attr("name"));
			});
			
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="' + 'prs-' + key + '">').text("Circle Size:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="size' + key + '" id="' + 'prs-' + key + '-1' + '" value="regular" checked="checked"> <label for="' + 'prs-' + key + '-1' + ' ">regular</label>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="size' + key + '" id="' + 'prs-' + key + '-2' + '" value="large"> <label for="' + 'prs-' + key + '-2' + '">large</label>'));
			//$('#' + 'pr-' + key).buttonset();
			if (Layer.ScaleFactor <= 1.0) {
				$('input[name="size' + key + '"][value=regular]').attr("checked", true);
			} else {
				$('input[name="size' + key + '"][value=large]').attr("checked", true);
			}
			
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').removeAttr("disabled");
		
			$('input[name="size' + key + '"]').change(function (event) {
				if ($('input[name="size' + key + '"][value=regular]').attr("checked")) {
					Layer.ScaleFactor = 1.0;
				} else {
					Layer.ScaleFactor = 1.2;
				}
				rvDataSets[0].refreshResiduesExpanded($(event.currentTarget).parent().parent().parent().attr("name"));
			});
			$(this);
			break;
		case "lines":
			$("#LayerPanel div").first().next().find(".layerContent").append($('<div id="' + 'llm-' + key + '">').text("Color lines like:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<select id="' + 'llm-' + key + 'lineselect' + '" name="' + 'llm-' + key + 'lineselect' + '" multiple="multiple"></select>'));
			$('#' + 'llm-' + key + 'lineselect').multiselect({
				minWidth : 160,
				multiple : false,
				header : "Select a layer",
				noneSelectedText : "Select an Option",
				selectedList : 1
			});
			$('#' + 'llm-' + key + 'lineselect').multiselect().multiselectfilter();
			//Fill Menu
			var llm = document.getElementById('llm-' + key + 'lineselect');
			//var SDList=rvDataSets[0].SpeciesEntry.StructDataMenu.split(";");
			//llm.options.length = 0;
			llm.options[0] = new Option("All Gray", "gray_lines");
			llm.options[0].setAttribute("selected", "selected");

			var rLayers = rvDataSets[0].getLayerByType("residues");
			var cLayers = rvDataSets[0].getLayerByType("circles");
			$.each(rLayers, function (key, value) {
				llm.options[llm.options.length] = new Option(value.LayerName, value.LayerName);
			});
			$.each(cLayers, function (key, value) {
				llm.options[llm.options.length] = new Option(value.LayerName, value.LayerName);
			});
			$('#' + 'llm-' + key + 'lineselect').multiselect("refresh");
			
			$('#' + 'llm-' + key + 'lineselect').change(function (event) {
				var array_of_checked_values = $('#' + 'llm-' + key + 'lineselect').multiselect("getChecked").map(function () {
						return this.value;
					});
				if (array_of_checked_values[0] === "gray_lines") {
					rvDataSets[0].drawBasePairs("lines", "gray_lines");
					$(event.currentTarget).parent().parent().find(':radio').attr('disabled','disabled');
				} else {
					rvDataSets[0].drawBasePairs("lines", rvDataSets[0].getLayer(array_of_checked_values[0]));
					$(event.currentTarget).parent().parent().find(':radio').removeAttr('disabled');
				}
			});
			
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<br>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().append($('<div id="' + 'llmg-' + key + '">').text("Line Gradient Direction:").append($("<br>")));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="color_lines_gradient' + key + '" id="' + 'llmg-' + key + '-1' + '" value="Matched" checked="checked"> <label for="' + 'llmg-' + key + '-1' + ' ">Matched</label>'));
			$("#LayerPanel div").first().next().find(".layerContent").first().find("div").last().append($('<input type="radio" name="color_lines_gradient' + key + '" id="' + 'llmg-' + key + '-2' + '" value="Opposite"> <label for="' + 'llmg-' + key + '-2' + '">Opposite</label>'));
			$('[name="color_lines_gradient' + key + '"]').attr('disabled', 'disabled');
			$('input[name="color_lines_gradient' + key + '"]').change(function (event) {
				targetLayer = rvDataSets[0].getLayer($('input[name="color_lines_gradient' + key + '"]' + ':checked').parent().parent().parent().find('h3').text());
				targetLayer.ColorGradientMode =  $(event.currentTarget).parent().parent().find('input:checked').val();
				rvDataSets[0].drawBasePairs("lines");
			});
			
			break;
		case "residues":
			$("#LayerPanel div").first().next().find(".selectLayerRadioBtn").attr("checked", "checked");
			rvDataSets[0].selectLayer($("#LayerPanel div").first().next().attr("name"));
			rvDataSets[0].linkLayer($("#LayerPanel div").first().next().attr("name"));
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').removeAttr("disabled");
			$("#LayerPanel div").first().next().find(".radioDIV2").find('input').attr("checked","checked");
		
			break;
		default:
			break;
	}
	$("#LayerPanel div").first().next().find(".visibilityCheckImg").attr("value", "visible");
}
// Refresh Menu
function RefreshLayerMenu(){
	//Assign function to check boxes
	/*
	$(".visibilityCheckImg").change(function (event) {
		console.log("visibilityCheckImg changed!");
		$(event.currentTarget).parent().parent().attr("name")
		if ($(event.currentTarget).attr("value") == "visible") {
			$(rvDataSets[0].getLayer($(event.currentTarget).parent().parent().attr("name")).Canvas).css("visibility", "visible")
		} else {
			$(rvDataSets[0].getLayer($(event.currentTarget).parent().parent().attr("name")).Canvas).css("visibility", "hidden")
		}
	});*/
	/*
	$(".selectLayerRadioBtn").change(function (event) {
		rvDataSets[0].selectLayer($(event.currentTarget).parent().parent().attr("name"));
	});
	$(".mappingRadioBtn").change(function (event) {
		alert($(event.currentTarget).parent().parent().attr("name"));
	});
	*/
	//Accordion that support multiple sections open
	$("#LayerPanel").multiAccordion();
	/*
	$("#LayerPanel").sortable({
		update : function (event, ui) {
			$("#LayerPanel .layerContent").each(function (e, f) {
				//$(this).find('p').text(rvDataSets[0].LastLayer - e - 1);
				$("#" + $(this).parent().find('h3').text()).css('zIndex', rvDataSets[0].LastLayer - e - 1)
				
			});
			rvDataSets[0].sort();
		},
		items : ".oneLayerGroup"
		
	});
	$("#LayerPanel").disableSelection();	
*/	
}

function InitRibovision() {
	set_cookie("MeaningOfLife", "42", 42);
	rvDataSets[0] = new rvDataSet("EmptyDataSet");
	rvViews[0] = new rvView(20, 20, 1.2);
	
	// Create rvLayers
	rvDataSets[0].addLayer("CircleLayer1", "CircleLayer1", [], true, 1.0, 'circles');
	rvDataSets[0].addLayer("CircleLayer2", "CircleLayer2", [], true, 1.0, 'circles');
	rvDataSets[0].addLayer("SelectedLayer", "SelectedLayer", [], false, 1.176, 'selected');
	rvDataSets[0].addLayer("ResidueLayer", "ResidueLayer", [], true, 1.0, 'residues');
	rvDataSets[0].addLayer("LabelLayer", "LabelLayer", [], true, 1.0, 'labels');
	rvDataSets[0].addLayer("MainLineLayer", "MainLineLayer", [], true, 1.0, 'lines');
	rvDataSets[0].addLayer("ContourLayer", "ContourLayer", [], true, 1.0, 'contour');
	rvDataSets[0].addHighlightLayer("HighlightLayer", "HighlightLayer", [], false, 1.176, 'highlight');
	
	HighlightLayer = rvDataSets[0].HighlightLayer.Canvas;
	
	// Sort rvLayers by zIndex for convience
	rvDataSets[0].sort();
	
	// Build Layer Menu
	
	// Put in Top Labels and ToolBar
	$("#LayerPanel").prepend($("<div id='tipBar'>").attr({
			'name' : 'TopLayerBar'
		}).html("&nbspV&nbsp&nbsp&nbsp&nbspS&nbsp&nbsp&nbsp&nbspL&nbsp&nbsp&nbsp&nbspLayerName&nbsp&nbsp"));
	$('[name=TopLayerBar]').append($('<button id="newLayer" class="toolBarBtn2" title="Create a new layer"></button>'));
	$('[name=TopLayerBar]').append($('<button id="deleteLayer" class="toolBarBtn2" title="Delete the selected layer"></button>'));
	$("#newLayer").button({
		text : false,
		icons : {
			primary : "ui-icon-document"
		}
	});
	$("#newLayer").css('height', $("#openLayerBtn").css('height'));
	$("#newLayer").css('width', $("#openLayerBtn").css('width'));
	$("#newLayer").click(function () {
		$("#dialog-addLayer").dialog("open");
	});
	$("#deleteLayer").button({
		text : false,
		icons : {
			primary : "ui-icon-trash"
		}
	});
	$("#deleteLayer").css('height', $("#openLayerBtn").css('height'));
	$("#deleteLayer").css('width', $("#openLayerBtn").css('width'));
	$("#deleteLayer").click(function (event) {
		$("#dialog-confirm-delete p").append("The " + rvDataSets[0].getSelectedLayer().LayerName + " layer will be permanently deleted and cannot be recovered.");
		$("#dialog-confirm-delete").dialog('open');
	});
	
	// Put in Layers
	$.each(rvDataSets[0].Layers, function (key, value){
		LayerMenu(value, key);
	});
	
	//Accordion that support multiple sections open
	$("#LayerPanel").multiAccordion();
	$("#LayerPanel").sortable({
		update : function (event, ui) {
			$("#LayerPanel .layerContent").each(function (e, f) {
				//$(this).find('p').text(rvDataSets[0].LastLayer - e - 1);
				$("#" + $(this).parent().find('h3').text()).css('zIndex', rvDataSets[0].LastLayer - e - 1)
				
			});
			rvDataSets[0].sort();
		},
		items : ".oneLayerGroup"
		
	});
	$("#LayerPanel").disableSelection();
	
	//RefreshLayerMenu();
		
	
	$("#ProtList").bind("multiselectclick", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(array_of_checked_values);
	});
	$("#ProtList").bind("multiselectopen", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(array_of_checked_values);
	});
	$("#ProtList").bind("multiselectcheckall", function (event, ui) {
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		colorMappingLoop(array_of_checked_values);
	});
	$("#ProtList").bind("multiselectuncheckall", function (event, ui) {
		resetColorState();
		targetLayer=rvDataSets[0].getSelectedLayer();
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
	});
	
	$.getJSON('getData.php', {
		FetchMapList : "42"
	}, function (MapList) {
		
		var SpeciesList = [];
		var SubUnits = [];
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
					$("<a>").attr('href', '#').append(
						SpeciesListU[i])))
			
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
											MapList[ii].MapType + ' Map')))
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
											MapList[iii].MapType + ' Map')))
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
		.bind('menuselect', function (event, ui) {
			var species = $(ui.item).find("a").attr('href');
			loadSpecies(species.substr(1));
			drawNavLine(1); //load navLine 
		});
		
		/*
		var ml = document.getElementById("speciesList");
		ml.options.length = 0;
		ml.options[0]=new Option("None","None");
		if (MapList[0]!=""){
		for (var i = 0; i < MapList.length; i++){
		ml.options[i+1] = new Option(MapList[i].Species_Name,MapList[i].SS_Table);
		}
		}
		$("#speciesList").multiselect("refresh");
		 */
	});
	
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
		$("#files").on('change', function (event) {
			handleFileSelect(event);
		});
		
		//document.getElementById('files').addEventListener('change',{$('#files').on('change', handleFileSelect);handleFileSelect}, false);
		//alert('File APIs are as good as Curiosity');
	} else {
		dd = document.getElementById('FileDiv');
		dd.innerHTML = "Your browser doesn't support file loading feature. IE does not support it until IE10+.";
	}
	
	modeSelect("move");
	
	$("#canvasDiv").bind("mousedown", mouseEventFunction);
	$("#canvasDiv").bind("mouseup", mouseEventFunction);
	$(window).bind("mouseup", function (event) {
		$("#canvasDiv").unbind("mousemove", dragHandle);
		return false;
	});
	
	$(window).bind("resize", resizeElements);
	
	$("#canvasDiv").bind('mousewheel', function (event, delta) {
		rvViews[0].zoom(event, delta);
		
		var sel = getSelected(event);
		rvDataSets[0].HighlightLayer.clearCanvas();
		
		if (sel == -1) {
			document.getElementById("currentDiv").innerHTML = "<br/>";
		} else {
			document.getElementById("currentDiv").innerHTML = rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[sel].ChainID)] + ":" + rvDataSets[0].Residues[sel].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
			
			rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
			rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, 2, 0, 2 * Math.PI, false);
			rvDataSets[0].HighlightLayer.CanvasContext.closePath();
			rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
			rvDataSets[0].HighlightLayer.CanvasContext.stroke();
		}
		if (drag) {
			rvViews[0].drag(event);
		}
		return false;
		
	});
	$("#canvasDiv").bind("mousemove", function (event) {
		var sel = getSelected(event);
		var selLine = getSelectedLine(event);
		rvDataSets[0].HighlightLayer.clearCanvas();
		
		if (sel == -1) {
			document.getElementById("currentDiv").innerHTML = "<br/>";
		} else {
			document.getElementById("currentDiv").innerHTML = rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[sel].ChainID)] + ":" + rvDataSets[0].Residues[sel].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + "(" + rvDataSets[0].Residues[sel].CurrentData + ")";
			if (rvDataSets[0].Residues[sel].resNum.replace(/[^:]*:/g, "") == 42) {
				document.getElementById("currentDiv").innerHTML = document.getElementById("currentDiv").innerHTML + ". You found the secret base! ";
			}
			
			rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
			rvDataSets[0].HighlightLayer.CanvasContext.arc(rvDataSets[0].Residues[sel].X, rvDataSets[0].Residues[sel].Y, 2, 0, 2 * Math.PI, false);
			rvDataSets[0].HighlightLayer.CanvasContext.closePath();
			rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
			rvDataSets[0].HighlightLayer.CanvasContext.stroke();
		}
		if (drag) {
			rvViews[0].drag(event);
		}
		
		if(selLine != -1){
			var j = rvDataSets[0].BasePairs[selLine].resIndex1;
			var k = rvDataSets[0].BasePairs[selLine].resIndex2;
				rvDataSets[0].HighlightLayer.CanvasContext.strokeStyle = "#6666ff";
				rvDataSets[0].HighlightLayer.CanvasContext.beginPath();
				rvDataSets[0].HighlightLayer.CanvasContext.moveTo(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y);
				rvDataSets[0].HighlightLayer.CanvasContext.lineTo(rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
				rvDataSets[0].HighlightLayer.CanvasContext.closePath();
				rvDataSets[0].HighlightLayer.CanvasContext.stroke();
			$("#currentDiv").html(rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[j].ChainID)] + ":" + rvDataSets[0].Residues[j].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + " - " + rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[k].ChainID)] + ":" + rvDataSets[0].Residues[k].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + " (" + rvDataSets[0].BasePairs[selLine].bp_type + ")");

		}
		
	});
	
	$("#canvasDiv").bind("mouseout", function (event) {
		$("#canvasDiv").trigger({
			type : 'mouseup',
			which : 1,
			clientX : event.clientX,
			clientY : event.clientY
		});
		rvDataSets[0].HighlightLayer.clearCanvas();
		
	});
	
	document.getElementById("moveMode").checked = true;
	document.getElementById("ProtList").selectedIndex = 0;
	document.getElementById("alnList").selectedIndex = 0;
	document.getElementById("PrimaryInteractionList").selectedIndex = 0;
	document.getElementById("speciesList").selectedIndex = 0;
	document.getElementById('commandline').value = "";
	resizeElements();
		
}
///////////////////////////////////////////////////////////////////////////////


///////////////////////// New Experimental Section  ???? //////////////////////
/*
function oCanvasDemo(){
var box  = oCanvas2.display.rectangle({
x: 50,
y: 150,
width: 50,
height: 50,
fill: "#000"
});
oCanvas2.addChild(box);

box.dragAndDrop();
Lines = new Array();
for (var i=0; i < 10; i++){
Lines[i] = oCanvas2.display.line({
start: { x: 500 * Math.random(), y: 500 * Math.random() },
end: { x: 500 * Math.random(), y: 500 * Math.random() },
stroke: "3px #123456",
cap: "round"
});

Lines[i].bind("click tap", function () {
this.stroke= "5px #654321";
oCanvas2.redraw();
//alert('You clicked a line');
});
oCanvas2.addChild(Lines[i]);
}
}


function getResidues(rvDataSet){
var array_of_checked_values = $("#speciesList").multiselect("getChecked").map(function(){
return this.value;
}).get();

$.getJSON('getData.php', {Residues:array_of_checked_values[0]}, function(data) {
$.each(data,function(i,item){
data[i]["color"] = "#000000";
data[i]["selected"] = false;
data[i]["CurrentData"] = data[i]["map_Index"];
});
rvDataSets[0].Residues=data;
rvDataSet.addResidues(rvDataSets[0].Residues);

});
}
 */

/////////////////////////// Label Functions ///////////////////////////////////
function initLabels(species) {
	/*
	var array_of_checked_values = $("#speciesList").multiselect("getChecked").map(function(){
	return this.value;
	}).get();
	var species=array_of_checked_values[0];
	 */
	rvDataSets[0].addLabels([], []);
	
	if (species != "None") {
		$.getJSON('getData.php', {
			TextLabels : rvDataSets[0].SpeciesEntry.TextLabels
		}, function (labelData2) {
			TextLabels = labelData2;
			$.getJSON('getData.php', {
				LineLabels : rvDataSets[0].SpeciesEntry.LineLabels
			}, function (labelLines2) {
				LineLabels = labelLines2;
				rvDataSets[0].clearCanvas("labels");
				rvDataSets[0].addLabels(TextLabels, LineLabels);
				rvDataSets[0].drawLabels("labels");
			});
		});
	} else {
		rvDataSets[0].clearCanvas("labels");
		rvDataSets[0].addLabels([], []);
	}
}

//function drawLabels(){}
///////////////////////////////////////////////////////////////////////////////


////////////////////////// Window Functions ///////////////////////////////////
function zoom(px, py, factor, rvViewObj) {
	if (rvViewObj == undefined) {
		rvViewObj = rvViews[0];
	}
	
	rvViewObj.x = (rvViewObj.x - px) * factor + px;
	rvViewObj.y = (rvViewObj.y - py) * factor + py;
	rvViewObj.scale *= factor;
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
}

function pan(dx, dy) {
	rvViews[0].x += dx;
	rvViews[0].y += dy;
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
}

function resizeElements() {
	var MajorBorderSize = 1;
	var width = $(window).width();
	var height = $(window).height();
	
	//TopMenu
	$("#topMenu").outerHeight(TopDivide * height);
	//ToolBar
	$("#toolBar").outerHeight((1-TopDivide) * height);
	$("#toolBar").css('top',$("#topMenu").outerHeight())+1;
	//Menu
	$("#menu").css('height', 0.9 * height);
	$("#menu").css('width', 0.16 * width);
	var xcorr = $("#menu").outerWidth();
	var ycorr = $("#topMenu").outerHeight();
	var toolBarWidth = $("#toolBar").width();
	var toolBarHeight = $("#toolBar").height();
	//console.log(toolBarWidth/width + "; " + toolBarHeight/height);
	//var t = (width - xcorr - toolBarWidth) / 2;
	var lp = (width - xcorr - toolBarWidth) * PanelDivide;
	var rp = (width - xcorr - toolBarWidth) - lp;
	var s = (height - ycorr);
	
	//Top Menu Section
	$("#topMenu").css('width', width - xcorr);
	$("#topMenu").css('left', xcorr - 1);
	$("#topMenu").css('top', 0);
	
	$("#tabs").css('width', $("#topMenu").css('width') - 10);
	//$("#tabs").css('height', $("#topMenu").css('height'));
	$("#tabs").css('left', 0);
	$("#tabs").css('top', 0);
	
	//SiteInfo
	$("#SiteInfo").css('width', xcorr);
	
	//NavDiv
	$("#NavDiv").css('width', xcorr);
	$("#NavDiv").css('top', parseFloat($("#SiteInfo").css('height')));
	
	//MainMenu
	$("#MainMenu").css('width', xcorr);
	$("#MainMenu").css('height', (0.9 * height) - parseFloat($("#SiteInfo").css('height')) - parseFloat($("#NavDiv").css('height')));
	$("#MainMenu").css('top', parseFloat($("#SiteInfo").css('height')) + parseFloat($("#NavDiv").css('height')));
	
	//SideBarAccordian
	$("#SideBarAccordian").accordion("resize");
	
	//Canvas Section
	$("#canvasDiv").css('height', s);
	$("#canvasDiv").css('width', lp);
	$("#canvasDiv").css('left', xcorr - 1);
	$("#canvasDiv").css('top', ycorr - 1);
	
	$("canvas").attr({
		width : lp - 2 * MajorBorderSize,
		height : s - 2 * MajorBorderSize
	});
	$("canvas").css('top', 0);
	$("canvas").css('left', 0);
	
	//Navigator Section
	//$("#navigator").css('height',0.4 * s);
	//$("#navigator").css('width',0.24 * t);
	$("#navigator").css('left', xcorr);
	$("#navigator").css('top', ycorr);
	
	//Jmol Section
	$("#jmolDiv").css('height', s);
	$("#jmolDiv").css('width', rp);
	$("#jmolDiv").css('left', xcorr + parseFloat($("#canvasDiv").css('width')) - 1);
	$("#jmolDiv").css('top', ycorr - 1);
	
	/*
	$("#JmolIframe").css('height',s);
	$("#JmolIframe").css('width',t);
	$("#JmolIframe").css('left',xcorr + parseFloat($("#canvasDiv").css('width')) - 1);
	$("#JmolIframe").css('top',ycorr - 1);
	 */
	
	$("#jmolApplet0").css('height', s - 2 * MajorBorderSize);
	$("#jmolApplet0").css('width', rp - 2 * MajorBorderSize);
	$("#jmolApplet0").css('top', 0);
	$("#jmolApplet0").css('left', 0);
	
	// Layer Panel
	$( "#LayerDialog" ).dialog( "option", "height", s - 2 * MajorBorderSize );	
	$( "#LayerDialog" ).dialog("widget").position({
		my: "right top",
		at: "right top",
		of: $( "#canvasDiv" )
	});
	// Color Panel
	$( "#ColorDialog" ).dialog( "option", "height", 0.75 * s - 2 * MajorBorderSize );	
	$( "#ColorDialog" ).dialog("widget").position({
		my: "right top",
		at: "right top",
		of: $( "#canvasDiv" )
	});
	// Settings Panel
	//$( "#RiboVisionSettingsPanel" ).dialog( "option", "height", 0.75 * s - 2 * MajorBorderSize );	
	/*$( "#RiboVisionSettingsPanel" ).dialog("widget").position({
		my: "right top",
		at: "right top",
		of: $( "#canvasDiv" )
	});*/
	
	//LogoDiv
	$("#LogoDiv").css('width', xcorr);
	$("#LogoDiv").css('height', 0.1 * height);
	$("#LogoDiv").css('top', $("#menu").css('height'));
	
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
}

function resetView() {
	rvViews[0].x = 20;
	rvViews[0].y = 20;
	rvViews[0].scale = 1.2;
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	rvDataSets[0].refreshResiduesExpanded("circles");
	rvDataSets[0].drawLabels("labels");
	rvDataSets[0].drawBasePairs("lines");
	
	$("#slider").slider("value", 20);
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////////// Selection Functions ///////////////////////////////
function dragHandle(event) {
	pan(event.clientX - rvViews[0].lastX, event.clientY - rvViews[0].lastY);
	rvViews[0].lastX = event.clientX;
	rvViews[0].lastY = event.clientY;
}

function getSelectedLine(event){
	var nx = (event.clientX - rvViews[0].x - $("#menu").width()) / rvViews[0].scale; //subtract 250 for the menu width
	var ny = (event.clientY - rvViews[0].y - $("#topMenu").height()) / rvViews[0].scale; //subtract 80 for the info height
	if(rvDataSets[0].BasePairs != undefined){
		for (var i = 0; i < rvDataSets[0].BasePairs.length; i++) {
			var j = rvDataSets[0].BasePairs[i].resIndex1;
			var k = rvDataSets[0].BasePairs[i].resIndex2;
			var jdist = Math.sqrt(((nx - rvDataSets[0].Residues[j].X)*(nx - rvDataSets[0].Residues[j].X) + (ny - rvDataSets[0].Residues[j].Y)*(ny - rvDataSets[0].Residues[j].Y)));
			var kdist = Math.sqrt(((nx - rvDataSets[0].Residues[k].X)*(nx - rvDataSets[0].Residues[k].X) + (ny - rvDataSets[0].Residues[k].Y)*(ny - rvDataSets[0].Residues[k].Y)));
			var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X)*(rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)*(rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
						
			
			if(zoomEnabled){
					var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X)*(rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)*(rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
					if((150 - rvViews[0].scale*23) > jkdist){
						continue;
					}
					if(( (rvDataSets[0].Residues[j].X*rvViews[0].scale+rvViews[0].x < 0) || (rvDataSets[0].Residues[j].X*rvViews[0].scale+rvViews[0].x > HighlightLayer.clientWidth) || (rvDataSets[0].Residues[j].Y*rvViews[0].scale+rvViews[0].y < 0) ||  (rvDataSets[0].Residues[j].Y*rvViews[0].scale+rvViews[0].y > HighlightLayer.clientHeight))
					&& ( (rvDataSets[0].Residues[k].X*rvViews[0].scale+rvViews[0].x < 0) || (rvDataSets[0].Residues[k].X*rvViews[0].scale+rvViews[0].x > HighlightLayer.clientWidth) || (rvDataSets[0].Residues[k].Y*rvViews[0].scale+rvViews[0].y < 0) ||  (rvDataSets[0].Residues[k].Y*rvViews[0].scale+rvViews[0].y > HighlightLayer.clientHeight)) )  {
					continue;
						}
						}
			if( (jdist+kdist - jkdist) < .03){
					return i;
				}
			
			}
	
	}
	return -1;
}

function getSelected(event) {
	var nx = (event.clientX - rvViews[0].x - $("#menu").width()) / rvViews[0].scale; //subtract 250 for the menu width
	var ny = (event.clientY - rvViews[0].y - $("#topMenu").height()) / rvViews[0].scale; //subtract 80 for the info height
	if (rvDataSets[0].Residues != undefined) {
		for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
			var res = rvDataSets[0].Residues[i];
			if (((nx > res.X) ? nx - res.X : res.X - nx) + ((ny > res.Y) ? ny - res.Y : res.Y - ny) < 2) {
				return i;
			}
		}
		return -1;
	} else {
		return -1;
	}
}

function expandSelection(command, SelectionName) {
	for (var i = 0; i < command.length; i++) {
		var com = command[i];
		var comsplit = com.split(":");
		if (comsplit.length > 1) {
			var index = comsplit[1].indexOf("-");
			if (index != -1) {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
				var start = chainID + "_" + comsplit[1].substring(1, index);
				var end = chainID + "_" + comsplit[1].substring(index + 1, comsplit[1].length - 1);
				
				if (start && end) {
					var start_ind = rvDataSets[0].ResidueList.indexOf(start);
					var end_ind = rvDataSets[0].ResidueList.indexOf(end);
					
					for (var j = start_ind; j <= end_ind; j++) {
						if (SelectionName) {
							rvDataSets[0].Selections[SelectionName].push(rvDataSets[0].Residues[j]);
						} else {
							rvDataSets[0].Residues[j].selected = true;
							rvDataSets[0].Selected.push(rvDataSets[0].Residues[j]);
						}
					}
				}
			} else {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
				//var aloneRes = chainID + "_" + comsplit[1].substring(1,comsplit[1].length-1);
				var aloneRes = chainID + "_" + comsplit[1];
				var alone_ind = rvDataSets[0].ResidueList.indexOf(aloneRes);
				if (SelectionName) {
					rvDataSets[0].Selections[SelectionName].push(rvDataSets[0].Residues[alone_ind]);
				} else {
					rvDataSets[0].Residues[alone_ind].selected = true;
					rvDataSets[0].Selected.push(rvDataSets[0].Residues[alone_ind]);
				}
			}
		} else if (comsplit[0] != "") {
			var index = comsplit[0].indexOf("-");
			if (index != -1) {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[0];
				var start = chainID + "_" + comsplit[0].substring(0, index);
				var end = chainID + "_" + comsplit[0].substring(index + 1, comsplit[0].length);
				
				if (start && end) {
					var start_ind = rvDataSets[0].ResidueList.indexOf(start);
					var end_ind = rvDataSets[0].ResidueList.indexOf(end);
					for (var j = start_ind; j <= end_ind; j++) {
						if (SelectionName) {
							rvDataSets[0].Selections[SelectionName].push(rvDataSets[0].Residues[j]);
						} else {
							rvDataSets[0].Residues[j].selected = true;
							rvDataSets[0].Selected.push(rvDataSets[0].Residues[j]);
						}
					}
				}
			} else {
				var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[0];
				var aloneRes = chainID + "_" + comsplit[0];
				var alone_ind = rvDataSets[0].ResidueList.indexOf(aloneRes);
				if (SelectionName) {
					rvDataSets[0].Selections[SelectionName].push(rvDataSets[0].Residues[alone_ind]);
				} else {
					rvDataSets[0].Residues[alone_ind].selected = true;
					rvDataSets[0].Selected.push(rvDataSets[0].Residues[alone_ind]);
				}
			}
		}
	}
}

function commandSelect(command) {
	if (!command) {
		var command = document.getElementById("commandline").value;
	}
	command = command.split(";");
	expandSelection(command);
	updateSelectionDiv();
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	console.log('selected Residue by command input');
}

function selectResidue(event) {
	
	if (drag) {
		var curX = (event.clientX - $("#menu").width() - rvViews[0].x) / rvViews[0].scale;
		var curY = (event.clientY - $("#topMenu").height() - rvViews[0].y) / rvViews[0].scale;
		if (rvDataSets[0].Residues != undefined) {
			for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
				if (rvViews[0].startX <= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X <= curX && rvViews[0].startY <= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y <= curY) {
					if (!rvDataSets[0].Residues[i].selected)
						rvDataSets[0].Residues[i].selected = true;
					rvDataSets[0].Selected.push(rvDataSets[0].Residues[i]);
				}
				if (rvViews[0].startX >= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X >= curX && rvViews[0].startY <= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y <= curY) {
					if (!rvDataSets[0].Residues[i].selected)
						rvDataSets[0].Residues[i].selected = true;
					rvDataSets[0].Selected.push(rvDataSets[0].Residues[i]);
				}
				if (rvViews[0].startX <= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X <= curX && rvViews[0].startY >= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y >= curY) {
					if (!rvDataSets[0].Residues[i].selected)
						rvDataSets[0].Residues[i].selected = true;
					rvDataSets[0].Selected.push(rvDataSets[0].Residues[i]);
				}
				if (rvViews[0].startX >= rvDataSets[0].Residues[i].X && rvDataSets[0].Residues[i].X >= curX && rvViews[0].startY >= rvDataSets[0].Residues[i].Y && rvDataSets[0].Residues[i].Y >= curY) {
					if (!rvDataSets[0].Residues[i].selected)
						rvDataSets[0].Residues[i].selected = true;
					rvDataSets[0].Selected.push(rvDataSets[0].Residues[i]);
				}
			}
			var sel = getSelected(event);
			if (sel != -1) {
				var res = rvDataSets[0].Residues[sel];
				if (res.selected) {
					res.selected = false;
					for (var i = 0; i < rvDataSets[0].Selected.length; i++) {
						if (rvDataSets[0].Selected.resNum.replace(/[^:]*:/g, "") == res.resNum.replace(/[^:]*:/g, "")) {
							rvDataSets[0].Selected.splice(i, 1);
						}
					}
				} else {
					res.selected = true;
					rvDataSets[0].Selected.push(res);
				}
			}
			rvDataSets[0].drawResidues("residues");
			rvDataSets[0].drawSelection("selected");
			
			//drawLabels();
			updateSelectionDiv();
			drag = false;
			//updateModel();
		} else {
			drag = false;
		}
	}
	$("#canvasDiv").unbind("mouseup", selectResidue);
	console.log('selected Residue by mouse' );
	drawNavLine(1);
}

function updateSelectionDiv() {
	var text = "";
	for (var i = 0; i < rvDataSets[0].Selected.length; i++) {
		res = rvDataSets[0].Selected[i];
		text = text + rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(res.ChainID)] + ":" + res.resNum.replace(/[^:]*:/g, "") + "( " + res.CurrentData + " ); ";
	}
	$("#selectDiv").html(text)
}

function clearSelection() {
	rvDataSets[0].Selected = []
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		rvDataSets[0].Residues[i].selected = false;
	}
	rvDataSets[0].drawResidues("residues");
	rvDataSets[0].drawSelection("selected");
	
	//drawLabels();
	updateSelectionDiv();
	updateModel();
}

function selectionBox(event) {
	rvViews[0].startX = (event.clientX - rvViews[0].x - $("#menu").width()) / rvViews[0].scale;
	rvViews[0].startY = (event.clientY - rvViews[0].y - $("#topMenu").height()) / rvViews[0].scale;
	drag = true;
}
///////////////////////////////////////////////////////////////////////////////


///////////////////////// Color Functions /////////////////////////////////////
function colorResidue(event) {
	var sel = getSelected(event);
	if (sel != -1) {
		var res = rvDataSets[0].Residues[sel];
		var color = $("#color").val();
		res.color = color;
		targetLayer=rvDataSets[0].getLayerByType("residues");
		targetLayer.dataCirclesColor[sel]=color;
		rvDataSets[0].drawResidues("residues");
		//drawLabels();
		update3Dcolors(); ;
	}
}

function clearColor(update3D) {
	targetLayer=rvDataSets[0].getLayerByType("residues");
	if (arguments.length < 1) {
		var update3D = true;
	}
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		rvDataSets[0].Residues[i].color = "#000000";
		targetLayer[0].dataLayerColors[i]= "#000000";
		targetLayer[0].Data[i] = rvDataSets[0].Residues[i].map_Index;
		
	}
	rvDataSets[0].drawResidues("residues");
	//drawLabels();
	
	if (update3D) {
		update3Dcolors();
		updateModel();
	}
	
}

function colorSelection() {
	//targetLayer=rvDataSets[0].getLayerByType("residues");
	var color = $("#color").val();
	for (var i = 0; i < rvDataSets[0].Selected.length; i++) {
		rvDataSets[0].Selected[i].color = color;		
		//targetLayer.dataCirclesColor[i]= "#000000";
	}
	rvDataSets[0].drawResidues("residues");
	//drawLabels();
	update3Dcolors();
}

function update3Dcolors() {
	var script = "set hideNotSelected false;";
	var r0,
	r1,
	curr_chain,
	curr_color,
	compare_color,
	n,
	m;
	//r0=rvDataSets[0].Residues[0].resNum.replace(/[^:]*:/g,"");
	r0 = rvDataSets[0].Residues[0].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
	curr_chain = rvDataSets[0].Residues[0].ChainID;
	targetLayer=rvDataSets[0].getLinkedLayer();
	rvDataSets[0].Residues[0].CurrentData=targetLayer.Data[0];

	curr_color = colourNameToHex(targetLayer.dataLayerColors[0]);
	
	if (!curr_color || curr_color === '#000000') {
		curr_color = '#858585';
	}
	for (var i = 1; i < rvDataSets[0].Residues.length; i++) {
		var residue = rvDataSets[0].Residues[i];
		var residueLast = rvDataSets[0].Residues[i - 1];
		var residueLastColor = targetLayer.dataLayerColors[i - 1];
		rvDataSets[0].Residues[i].CurrentData=targetLayer.Data[i];
		
		if (!residueLastColor){
			residueLastColor = '#858585';
		}
		if (residue.ChainID != "") {
			if (curr_chain == "") {
				curr_chain = residue.ChainID;
				curr_color = colourNameToHex(targetLayer.dataLayerColors[i]);
				if (!curr_color || curr_color === '#000000') {
					curr_color = '#858585';
				}
				r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
			} else if (residue.ChainID == null) {
				curr_chain = residue.ChainID;
				curr_color = colourNameToHex(targetLayer.dataLayerColors[i]);
				if (!curr_color || curr_color === '#000000') {
					curr_color = '#858585';
				}
				r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
			} else {
				if (!targetLayer.dataLayerColors[i]){
					compare_color = '#858585';
				} else {
					compare_color = colourNameToHex(targetLayer.dataLayerColors[i]);
				}
				if (((compare_color != colourNameToHex(residueLastColor)) || (curr_chain != residue.ChainID)) || (i == (rvDataSets[0].Residues.length - 1))) {
					r1 = residueLast.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
					n = r1.match(/[A-z]/g);
					if (n != undefined) {
						r1 = r1.replace(n, "^" + n);
					}
					if (colourNameToHex(residueLastColor).indexOf("#") == -1) {
						script += "select " + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1) + ".1 and :" + curr_chain + " and (" + r0 + " - " + r1 + "); color Cartoon opaque [x" + curr_color + "]; ";
					} else {
						script += "select " + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1) + ".1 and :" + curr_chain + " and (" + r0 + " - " + r1 + "); color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
					}
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, ""); ;
					m = r0.match(/[A-z]/g);
					if (m != undefined) {
						r0 = r0.replace(m, "^" + m);
					}
					if (residue.ChainID != "") {
						curr_chain = residue.ChainID;
					}
					curr_color = colourNameToHex(targetLayer.dataLayerColors[i]);
					if (!curr_color || curr_color === '#000000') {
						curr_color = '#858585';
					}
				}
			}
		}
	}
	if (colourNameToHex(residueLastColor).indexOf("#") == -1) {
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and :" + curr_chain + " and (" + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "); color Cartoon opaque [x" + curr_color + "]; ";
	} else {
		script += "select " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA) + ".1 and :" + curr_chain + " and (" + r0 + " - " + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, '') + "); color Cartoon opaque [" + curr_color.replace("#", "x") + "]; ";
	}
	updateSelectionDiv();
	jmolScript(script);
}

function colorProcess(data, indexMode, ChoiceList, colName) {
	var color_data = new Array();
	var DataPoints = 0;
	for (var ii = 0; ii < rvDataSets[0].Residues.length; ii++) {
		
		//var residue2 = rvDataSets[0].Residues[ii];
		
		if (data[ii] != undefined && data[ii] > 0) {
			color_data[DataPoints] = data[ii];
			DataPoints++;
		}
		
	}
	
	var min = Math.min.apply(Math, color_data);
	var max = Math.max.apply(Math, color_data);
	var range = max - min;
	
	var targetLayer = rvDataSets[0].getSelectedLayer();
	if (!targetLayer) {
		$("#dialog-selection-warning p").text("Please select a valid layer and try again.");
		$("#dialog-selection-warning").dialog("open");
		return;
	}
	switch (targetLayer.Type) {
	case "circles":
		targetLayer.Data = data;

		if (indexMode == "1") {
			//data.splice(0, 1);
			var dataIndices = data;
		} else {
			var dataIndices = new Array;
			for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
				dataIndices[i] = Math.round((data[i] - min) / range * (colors.length - 1));
			}
		}
		rvDataSets[0].drawDataCircles(targetLayer.LayerName, dataIndices, colors);
		break;
	case "residues":
		var dataIndices = new Array;
		targetLayer.Data = data;
		for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
			var residue = rvDataSets[0].Residues[i];
			//targetLayer.Data[i] = data[i];
			//var val = Math.round((residue.CurrentData - min) / range * (colors.length - 1));
			if (indexMode == "1") {
				dataIndices = data;
				/*
				if (colors[residue.CurrentData]){
					residue.color = colors[residue.CurrentData];
				} else {
					residue.color = "#000000";
				}*/
			} else {
				dataIndices[i] = Math.round((data[i] - min) / range * (colors.length - 1));
				/*
				if (residue.CurrentData > 0) {
					residue.color = (val < 0 || val >= colors.length) ? "#000000" : colors[val];
				} else {
					residue.color = "#000000";
				}*/
			}
		}
		//rvDataSets[0].drawResidues(targetLayer.LayerName);
		rvDataSets[0].drawResidues(targetLayer.LayerName, dataIndices, colors);
		update3Dcolors();
		break;
	default:
		$( "#dialog-layer-type-error" ).dialog("open")
	}

}

function colorMappingLoop(seleProt, OverRideColors) {
	if (arguments.length >= 2) {
		var colors2 = OverRideColors;
	} else {
		var colors2 = RainBowColors;
	}
	
	var targetLayer = rvDataSets[0].getSelectedLayer();
	if (targetLayer.Type === "circles"){
		targetLayer.clearCanvas();
		targetLayer.clearData();
	}
	if (targetLayer.Type === "residues"){
		//targetLayer.clearCanvas();
		clearColor(false);
		targetLayer.clearData();
	}
	var array_of_checked_values = $("#PrimaryInteractionList").multiselect("getChecked").map(function(){
	   return this.value;	
	}).get();
	var interactionchoice = array_of_checked_values[0];
	//var interactionchoice = $('#PrimaryInteractionList').val();
	var p = interactionchoice.indexOf("_NPN");
	if ( p >=0 ){
		rvDataSets[0].BasePairs = [];
		rvDataSets[0].clearCanvas("lines");
	}
	
	var Jscript = "display (selected), (" + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and (";
	var JscriptP = "set hideNotSelected false;";
	targetLayer.Data = new Array;
	for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
		targetLayer.Data[j] = " ";
	}
	for (var i = 0; i < seleProt.length; i++) {
		if (seleProt.length > 1) {
			var val = Math.round((i / (seleProt.length - 1)) * (colors2.length - 1));
		} else {
			var val = 0;
		}
		var newcolor = (val < 0 || val >= colors2.length) ? "#000000" : colors2[val];
		var dataIndices = new Array;
		for (var jj = 0; jj < rvDataSets[0].Residues.length; jj++) {
			if (rvDataSets[0].Residues[jj][seleProt[i]] && rvDataSets[0].Residues[jj][seleProt[i]] >0){
				dataIndices[jj] = rvDataSets[0].Residues[jj][seleProt[i]];
				targetLayer.Data[jj] = targetLayer.Data[jj] + seleProt[i] + " ";
			}
		}
		rvDataSets[0].drawDataCircles(targetLayer.LayerName, dataIndices, ["#000000", newcolor], true);
		rvDataSets[0].drawResidues(targetLayer.LayerName, dataIndices, ["#000000", newcolor], true);

		if (i === 0) {
			Jscript += ":" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])];
		} else {
			Jscript += " or :" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])];
		}
		JscriptP += "select (" + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])] + "); color Cartoon opaque [" + newcolor.replace("#", "x") + "];";
		if (p > 0) {
			appendBasePairs(interactionchoice, seleProt[i]);
		}
	}
	
	Jscript += "));";
	//JscriptP+="display " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA ) + ".1, " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein ) + ".1;" ;
	
	update3Dcolors();
	updateModel();
	jmolScript(Jscript);
	jmolScript(JscriptP);
}

function update3DProteins(seleProt, OverRideColors) {
	if (arguments.length >= 2) {
		var colors2 = OverRideColors;
	} else {
		var colors2 = RainBowColors;
	}
	
	var JscriptP = "set hideNotSelected false;";
	
	for (var i = 0; i < seleProt.length; i++) {
		if (seleProt.length > 1) {
			var val = Math.round((i / (seleProt.length - 1)) * (colors2.length - 1));
		} else {
			var val = 0;
		}
		var newcolor = (val < 0 || val >= colors2.length) ? "#000000" : colors2[val];
		
		JscriptP += "select (" + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein) + ".1 and :" + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][rvDataSets[0].SpeciesEntry.SubunitProtChains[2].indexOf(seleProt[i])] + "); color Cartoon opaque [" + newcolor.replace("#", "x") + "];";
	}
	//JscriptP+="display " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA ) + ".1, " + (rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rProtein ) + ".1;";
	jmolScript(JscriptP);
}

function colorMapping(ChoiceList, ManualCol, OverRideColors, indexMode, rePlaceData) {
	if (arguments.length == 1 || ManualCol == "42") {
		//var dd = document.getElementById(ChoiceList);
		var colName = $("#" + ChoiceList).val();
	}
	if (arguments.length >= 2 && ManualCol != "42") {
		var colName = ManualCol;
	}
	if (arguments.length >= 3) {
		colors = OverRideColors;
	} else {
		colors = RainBowColors;
	}
	
	var targetLayer = rvDataSets[0].getSelectedLayer()
		if (!targetLayer) {
			$("#dialog-selection-warning p").text("Please select a valid layer and try again.");
			$("#dialog-selection-warning").dialog("open");
			return;
		}
		switch (targetLayer.Type) {
		case "circles":
			if (colName != "clear_data") {
				var data = new Array;
				for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
					data[j] = rvDataSets[0].Residues[j][colName];
				}
				colorProcess(data, indexMode, ChoiceList, colName);
			} else {
				var data = new Array;
				targetLayer.clearCanvas();
				/*
				for(var j = 0; j < rvDataSets[0].Residues.length; j++){
				rvDataSets[0].Residues[j]["CurrentData"] = rvDataSets[0].Residues[j]["map_Index"];
				}
				resetColorState();*/
			}
			break;
		case "residues":
			//alert("how did this happen yet");
			if (colName != "clear_data") {
				var data = new Array;
				for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
					data[j] = rvDataSets[0].Residues[j][colName];
				}
				colorProcess(data, indexMode, ChoiceList, colName);
			} else {
				//var data = new Array;
				//targetLayer.clearCanvas();
				
				for (var j = 0; j < rvDataSets[0].Residues.length; j++) {
					targetLayer.Data[j] = rvDataSets[0].Residues[j]["map_Index"];
				}
				resetColorState();
			}
			break;
		default:
			$( "#dialog-layer-type-error" ).dialog("open")
		}
		
}

function colourNameToHex(colour) {
	var colours = {
		"aliceblue" : "#f0f8ff",
		"antiquewhite" : "#faebd7",
		"aqua" : "#00ffff",
		"aquamarine" : "#7fffd4",
		"azure" : "#f0ffff",
		"beige" : "#f5f5dc",
		"bisque" : "#ffe4c4",
		"black" : "#000000",
		"blanchedalmond" : "#ffebcd",
		"blue" : "#0000ff",
		"blueviolet" : "#8a2be2",
		"brown" : "#a52a2a",
		"burlywood" : "#deb887",
		"cadetblue" : "#5f9ea0",
		"chartreuse" : "#7fff00",
		"chocolate" : "#d2691e",
		"coral" : "#ff7f50",
		"cornflowerblue" : "#6495ed",
		"cornsilk" : "#fff8dc",
		"crimson" : "#dc143c",
		"cyan" : "#00ffff",
		"darkblue" : "#00008b",
		"darkcyan" : "#008b8b",
		"darkgoldenrod" : "#b8860b",
		"darkgray" : "#a9a9a9",
		"darkgreen" : "#006400",
		"darkkhaki" : "#bdb76b",
		"darkmagenta" : "#8b008b",
		"darkolivegreen" : "#556b2f",
		"darkorange" : "#ff8c00",
		"darkorchid" : "#9932cc",
		"darkred" : "#8b0000",
		"darksalmon" : "#e9967a",
		"darkseagreen" : "#8fbc8f",
		"darkslateblue" : "#483d8b",
		"darkslategray" : "#2f4f4f",
		"darkturquoise" : "#00ced1",
		"darkviolet" : "#9400d3",
		"deeppink" : "#ff1493",
		"deepskyblue" : "#00bfff",
		"dimgray" : "#696969",
		"dodgerblue" : "#1e90ff",
		"firebrick" : "#b22222",
		"floralwhite" : "#fffaf0",
		"forestgreen" : "#228b22",
		"fuchsia" : "#ff00ff",
		"gainsboro" : "#dcdcdc",
		"ghostwhite" : "#f8f8ff",
		"gold" : "#ffd700",
		"goldenrod" : "#daa520",
		"gray" : "#808080",
		"green" : "#008000",
		"greenyellow" : "#adff2f",
		"honeydew" : "#f0fff0",
		"hotpink" : "#ff69b4",
		"indianred " : "#cd5c5c",
		"indigo " : "#4b0082",
		"ivory" : "#fffff0",
		"khaki" : "#f0e68c",
		"lavender" : "#e6e6fa",
		"lavenderblush" : "#fff0f5",
		"lawngreen" : "#7cfc00",
		"lemonchiffon" : "#fffacd",
		"lightblue" : "#add8e6",
		"lightcoral" : "#f08080",
		"lightcyan" : "#e0ffff",
		"lightgoldenrodyellow" : "#fafad2",
		"lightgrey" : "#d3d3d3",
		"lightgreen" : "#90ee90",
		"lightpink" : "#ffb6c1",
		"lightsalmon" : "#ffa07a",
		"lightseagreen" : "#20b2aa",
		"lightskyblue" : "#87cefa",
		"lightslategray" : "#778899",
		"lightsteelblue" : "#b0c4de",
		"lightyellow" : "#ffffe0",
		"lime" : "#00ff00",
		"limegreen" : "#32cd32",
		"linen" : "#faf0e6",
		"magenta" : "#ff00ff",
		"maroon" : "#800000",
		"mediumaquamarine" : "#66cdaa",
		"mediumblue" : "#0000cd",
		"mediumorchid" : "#ba55d3",
		"mediumpurple" : "#9370d8",
		"mediumseagreen" : "#3cb371",
		"mediumslateblue" : "#7b68ee",
		"mediumspringgreen" : "#00fa9a",
		"mediumturquoise" : "#48d1cc",
		"mediumvioletred" : "#c71585",
		"midnightblue" : "#191970",
		"mintcream" : "#f5fffa",
		"mistyrose" : "#ffe4e1",
		"moccasin" : "#ffe4b5",
		"navajowhite" : "#ffdead",
		"navy" : "#000080",
		"oldlace" : "#fdf5e6",
		"olive" : "#808000",
		"olivedrab" : "#6b8e23",
		"orange" : "#ffa500",
		"orangered" : "#ff4500",
		"orchid" : "#da70d6",
		"palegoldenrod" : "#eee8aa",
		"palegreen" : "#98fb98",
		"paleturquoise" : "#afeeee",
		"palevioletred" : "#d87093",
		"papayawhip" : "#ffefd5",
		"peachpuff" : "#ffdab9",
		"peru" : "#cd853f",
		"pink" : "#ffc0cb",
		"plum" : "#dda0dd",
		"powderblue" : "#b0e0e6",
		"purple" : "#800080",
		"red" : "#ff0000",
		"rosybrown" : "#bc8f8f",
		"royalblue" : "#4169e1",
		"saddlebrown" : "#8b4513",
		"salmon" : "#fa8072",
		"sandybrown" : "#f4a460",
		"seagreen" : "#2e8b57",
		"seashell" : "#fff5ee",
		"sienna" : "#a0522d",
		"silver" : "#c0c0c0",
		"skyblue" : "#87ceeb",
		"slateblue" : "#6a5acd",
		"slategray" : "#708090",
		"snow" : "#fffafa",
		"springgreen" : "#00ff7f",
		"steelblue" : "#4682b4",
		"tan" : "#d2b48c",
		"teal" : "#008080",
		"thistle" : "#d8bfd8",
		"tomato" : "#ff6347",
		"turquoise" : "#40e0d0",
		"violet" : "#ee82ee",
		"wheat" : "#f5deb3",
		"white" : "#ffffff",
		"whitesmoke" : "#f5f5f5",
		"yellow" : "#ffff00",
		"yellowgreen" : "#9acd32"
	};
	if (colour && colour.indexOf("#") >= 0) {
		return colour;
	} else if (colour && typeof colours[colour.toLowerCase()] != 'undefined') {
		return colours[colour.toLowerCase()];
	} else {
		return false;
	}
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////// Residue Functions /////////////////////////////////////
//function refreshResiduesExpanded(targetLayer){}

//function drawResiduesExpanded(targetLayer,dataIndices,ColorArray){}

//function drawResidues(){}
///////////////////////////////////////////////////////////////////////////////


//////////////////////// Interaction Functions ////////////////////////////////
//function drawBasePairs(){}

function appendBasePairs(BasePairTable, colName) {
	var p = BasePairTable.indexOf("_NPN");
	if (p < 0) {
		$.getJSON('getData.php', {
			BasePairs : BasePairTable
		}, function (basePairs2) {
			rvDataSets[0].BasePairs = rvDataSets[0].BasePairs.concat(basePairs2);
			rvDataSets[0].drawBasePairs("lines");
		});
	} else {
		//var dd = document.getElementById("ProtList");
		//var colName = dd.options[dd.selectedIndex].value;
		$.getJSON('getData.php', {
			ProtBasePairs : BasePairTable,
			ProtChain : colName
		}, function (basePairs2) {
			rvDataSets[0].BasePairs = rvDataSets[0].BasePairs.concat(basePairs2);
			rvDataSets[0].drawBasePairs("lines");
		});
	}
}

function refreshBasePairs(BasePairTable) {
	
	if (BasePairTable != "clear_lines") {
		var p = BasePairTable.indexOf("_NPN");
		if (p < 0) {
			$.getJSON('getData.php', {
				BasePairs : BasePairTable
			}, function (basePairs2) {
				rvDataSets[0].BasePairs = basePairs2;
				rvDataSets[0].drawBasePairs("lines");
				// Set interaction submenu to allow for subsets of these basepairs to be displayed. 
				// For now, let's set a global variable to store the whole table, so that it doesn't have to be refetched everytime a subset is chosen. 
				// This will get better when I revamp who BasePair interactions work
	
				FullBasePairSet = rvDataSets[0].BasePairs;
				var BP_Type = [];	
				$.each(rvDataSets[0].BasePairs, function (ind, item) {
					BP_Type.push(item.bp_type);
				});
				BP_TypeU = $.grep(BP_Type, function (v, k) {
					return $.inArray(v, BP_Type) === k;
				});
							
				var ims = document.getElementById("SecondaryInteractionList");
				ims.options.length = 0;
				$.each(BP_TypeU, function (ind, item) {
					ims.options[ind] = new Option(item, item);
					ims.options[ind].setAttribute("selected", "selected");
				});	
				$("#SecondaryInteractionList").multiselect("refresh");
			});
		} else {
			var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
					return this.value;
				}).get();
			colorMappingLoop(array_of_checked_values);
			
		}
		
	} else {
		rvDataSets[0].BasePairs = [];
		rvDataSets[0].clearCanvas("lines");
	}
	
	
}

function filterBasePairs(FullBasePairSet,IncludeTypes){
	rvDataSets[0].BasePairs=[];
	$.each(FullBasePairSet, function (index, value){
		if ($.inArray(value.bp_type,IncludeTypes) >= 0){
			rvDataSets[0].BasePairs.push(value);
		}
	});
	rvDataSets[0].drawBasePairs("lines");
}
///////////////////////////////////////////////////////////////////////////////


//////////////////////////// Mouse Functions //////////////////////////////////
function mouseEventFunction(event) {
	if (event.handleObj.origType == "mousedown") {
		if (onebuttonmode == "select" || event.which == 3 || (event.which == 1 && event.shiftKey == true)) {
			$("#canvasDiv").unbind("mousemove", dragHandle);
			selectionBox(event);
			$("#canvasDiv").bind("mouseup", selectResidue);
			
		} else if (onebuttonmode == "color" || event.which == 2 || (event.which == 1 && event.ctrlKey == true)) {
			$("#canvasDiv").unbind("mousemove", dragHandle);
			colorResidue(event);
		} else {
			rvViews[0].lastX = event.clientX;
			rvViews[0].lastY = event.clientY;
			$("#canvasDiv").bind("mousemove", dragHandle);
		}
	}
	if (event.handleObj.origType == "mouseup") {
		$("#canvasDiv").unbind("mousemove", dragHandle);
	}
}
///////////////////////////////////////////////////////////////////////////////


// Misc Functions
/*function secretBox(event) {
	if (event == "nasa") {
		alert("Hey, don't click me there!");
		clickedNASA = clickedNASA + 1;
	}
	
	if (event == "riboevo") {
		if (clickedNASA > 0) {
			alert("Hey, you clicked on NASA. Don't you love me too?");
		}
	}
	
}*/

function modeSelect(mode) {
	onebuttonmode = mode;
}

function updateStructData(value) {
	var newargs = value.split(",");
	for (var i = 0; i < newargs.length; i++) {
		if (newargs[i].indexOf("\'") > -1) {
			newargs[i] = newargs[i].slice(2, newargs[i].length - 2);
		} else {
			newargs[i] = window[newargs[i]];
		}
	}
	newargs.unshift('42');
	console.log(newargs);
	if (newargs[1]=='Domains_Color'){
		drawNavLine(2); 
	}
	else if (newargs[1]=='mean_tempFactor'){
		drawNavLine(1); 
	}
	else if (newargs[1]=='Onion'){
		drawNavLine(3); 
	}
	else if (newargs[1]=='Helix_Color'){
		drawNavLine(4); 
	}
	else if (newargs[1]=='Mg_ions_24'){
		drawNavLine(5); 
	}
	else if (newargs[1]=='Mg_ions_26'){
		drawNavLine(6); 
	}
	else if (newargs[1]=='Mg_ions_60'){
		drawNavLine(7); 
	}
		
	colorMapping.apply(this, newargs);
	//eval("colorMapping('42'," + value + ")");
}

function handleFileSelect(event) {
	var PrivacyStatus = get_cookie("privacy_status_data");
	var PrivacyString = "This feature does not currently upload any data to our server. We don't have a privacy policy at this time"
		 + " because one isn't needed. We can not see these data you are about to graph. Click \"I agree\" to acknowledge acceptance of our policy.";
	var NewData;
	var command;
	var ColorList=[];
	var ColorListU;
	var DataList=[];
	var DataListU;
	var ColorGrad=[];
	
	FileReaderFile = event.target.files; // FileList object
	
	AgreeFunction = function (event) {
		//clearColor(true);
		
		for (var i = 0; i < FileReaderFile.length; i++) {
			reader = new FileReader();
			reader.readAsText(FileReaderFile[i]);
			reader.onload = function () {
				rvDataSets[0].addCustomData($.csv.toObjects(reader.result));
				NewData = [];
				var targetLayer = rvDataSets[0].getSelectedLayer();
				targetLayer.clearData();
				var customkeys = Object.keys(rvDataSets[0].CustomData[0]);
				for (var ii = 0; ii < rvDataSets[0].CustomData.length; ii++) {
					if (rvDataSets[0].CustomData[ii][customkeys[0]].indexOf("(") > 0) {
						rvDataSets[0].Selections["temp"] = [];
						command = rvDataSets[0].CustomData[ii][customkeys[0]].split(";");
						expandSelection(command, "temp");
						for (var iii = 0; iii < rvDataSets[0].Selections["temp"].length; iii++) {
							if (rvDataSets[0].Selections["temp"][iii].resNum.indexOf(":") >= 0) {
								alert("didn't do this yet");
							} else {
								var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[0];
								var ResName = chainID + "_" + rvDataSets[0].Selections["temp"][iii].resNum;
							}
							var k = rvDataSets[0].ResidueList.indexOf(ResName);
							
							if ($.inArray("DataCol", customkeys) >= 0) {
								//rvDataSets[0].Residues[k]["CustomData1"] = parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]);
								NewData[k] = parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]);
							}
							if ($.inArray("ColorCol", customkeys) >= 0) {
								targetLayer.dataLayerColors[k] = rvDataSets[0].CustomData[ii]["ColorCol"];
							}
							
						}
					} else {
						var comsplit = rvDataSets[0].CustomData[ii][customkeys[0]].split(":");
						if (comsplit.length > 1) {
							var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[rvDataSets[0].SpeciesEntry.Molecule_Names.indexOf(comsplit[0])];
							var ResName = chainID + "_" + comsplit[1];
						} else {
							var chainID = rvDataSets[0].SpeciesEntry.PDB_chains[0];
							var ResName = chainID + "_" + comsplit[0];
						}
						
						var k = rvDataSets[0].ResidueList.indexOf(ResName);
						if ($.inArray("DataCol", customkeys) >= 0) {
							//rvDataSets[0].Residues[k]["CustomData1"] = parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]);
							NewData[k] = parseFloat(rvDataSets[0].CustomData[ii]["DataCol"]);
							//rvDataSets[0].Residues[k].CurrentData = NewData[k];
						}
						if ($.inArray("ColorCol", customkeys) >= 0) {
							targetLayer.dataLayerColors[k] = rvDataSets[0].CustomData[ii]["ColorCol"];
						}
					}
					
					//ColorList[ii]=rvDataSets[0].CustomData[ii]["ColorCol"];
					//DataList[ii]=rvDataSets[0].CustomData[ii]["DataCol"];

				}
				targetLayer.Data = NewData;

				if ($.inArray("ColorCol", customkeys) >= 0) {
					rvDataSets[0].drawResidues("residues");
					rvDataSets[0].refreshResiduesExpanded(targetLayer.LayerName);
					update3Dcolors();
					/*
					ColorListU = $.grep(ColorList, function (v, k) {
						return $.inArray(v, ColorList) === k;
					});
					
					DataListU = $.grep(DataList, function (v, k) {
						return $.inArray(v, DataList) === k;
					});
					// Hack. Assume positive consecutive integers for now. 
					var a = Math.min.apply(Math, DataListU);
					$.each(DataListU, function (key, value){
						ColorGrad[value - a] = ColorListU[key];
					});
					colors = ColorGrad;
					colorProcess(NewData,true);
					*/
				} else if ($.inArray("DataCol", customkeys) >= 0) {
					colors = RainBowColors;
					colorProcess(NewData);
				} else {
					alert("No recognized colomns found. Please check input.");
				}
				
			};
		}
	};
	
	if (PrivacyStatus != "Agreed") {
		$("#Privacy-confirm").text(PrivacyString);
		CurrPrivacyCookie = "privacy_status_data";
		$("#Privacy-confirm").dialog('open');
	} else {
		AgreeFunction(event);
	}
	
}

function resetFileInput($element) {
	var clone = $element.clone(false, false);
	$element.replaceWith(clone);
}
///////////////////////////////////////////////////////////////////////////////


////////////////////////////// Cookie Functions ///////////////////////////////
function set_cookie(cookie_name, cookie_value, lifespan_in_days, valid_domain) {
	// http://www.thesitewizard.com/javascripts/cookies.shtml
	var domain_string = valid_domain ? ("; domain=" + valid_domain) : '';
	document.cookie = cookie_name +
		"=" + encodeURIComponent(cookie_value) +
		"; max-age=" + 60 * 60 *
		24 * lifespan_in_days +
		"; path=/" + domain_string;
}

function get_cookie(cookie_name) {
	// http://www.thesitewizard.com/javascripts/cookies.shtml
	var cookie_string = document.cookie;
	if (cookie_string.length != 0) {
		var pattern = cookie_name + "=[^;]*";
		var patt = new RegExp(pattern, "g");
		var cookie_value = cookie_string.match(patt);
		if (cookie_value == null) {
			return "";
		} else {
			var p = cookie_value[0].split("=");
			return decodeURIComponent(p[1]);
		}
	}
}

function checkSavePrivacyStatus() {
	var PrivacyStatus = get_cookie("privacy_status_text");
	var PrivacyString = "This feature requires uploading data to our server. Our privacy policy at this time is to not look at these files without permission."
		 + " We will set up autodelete for these files soon. Click \"I agree\" to acknowledge acceptance of our policy.";
	
	if (PrivacyStatus != "Agreed") {
		$("#Privacy-confirm").text(PrivacyString);
		CurrPrivacyCookie = "privacy_status_text";
		$("#Privacy-confirm").dialog('open');
	} else {
		AgreeFunction();
	}
}
///////////////////////////////////////////////////////////////////////////////


//////////////////////////////// Save Functions ///////////////////////////////
function savePNG() {
	AgreeFunction = function () {
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "savePNG.php");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", canvasToSVG());
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function saveSVG() {
	AgreeFunction = function () {
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "saveSVG.php");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", canvasToSVG());
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function savePDF() {
	AgreeFunction = function () {
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "savePDF.php");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", canvasToSVG());
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function savePML() {
	AgreeFunction = function () {
		var script = "";
		var PyMOL_obj = [];
		var PDB_Obj_Names = [];
		
		var PDB_files = [rvDataSets[0].SpeciesEntry.PDB_File_rRNA, rvDataSets[0].SpeciesEntry.PDB_File_rProtein];
		
		if (PDB_files[1] === PDB_files[0]) {
			PDB_Obj_Names[0] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Subunit + "_Full";
			PDB_Obj_Names[1] = PDB_Obj_Names[0];
			script += "load " + PDB_files[0] + ", " + PDB_Obj_Names[0] + "\n";
		} else {
			PDB_Obj_Names[0] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Subunit + "_rRNA";
			PDB_Obj_Names[1] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Subunit + "_rProtein"
				script += "load " + PDB_files[0] + ", " + PDB_Obj_Names[0] + "\n";
			script += "load " + PDB_files[1] + ", " + PDB_Obj_Names[1] + "\n";
		}
		
		for (var j = 0; j < rvDataSets[0].SpeciesEntry.Molecule_Names.length; j++) {
			PyMOL_obj[j] = rvDataSets[0].SpeciesEntry.Species_Abr + "_" + rvDataSets[0].SpeciesEntry.Molecule_Names[j];
			script += "create " + PyMOL_obj[j] + ", " + PDB_Obj_Names[0] + " and chain " + rvDataSets[0].SpeciesEntry.PDB_chains[j] + "\n";
			script += "enable " + PyMOL_obj[j] + "\n";
		}
		script += "\n";
		var r0,
		r1,
		curr_chain,
		curr_color,
		n,
		m;
		r0 = rvDataSets[0].Residues[0].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
		curr_chain = rvDataSets[0].Residues[0].ChainID;
		curr_color = rvDataSets[0].Residues[0].color;
		
		for (var i = 1; i < rvDataSets[0].Residues.length; i++) {
			var residue = rvDataSets[0].Residues[i];
			var residueLast = rvDataSets[0].Residues[i - 1];
			
			if (residue.ChainID != "") {
				if (curr_chain == "") {
					curr_chain = residue.ChainID;
					curr_color = residue.color;
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
				} else if (residue.ChainID == null) {
					curr_chain = residue.ChainID;
					curr_color = residue.color;
					r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
				} else {
					
					if (((residue.color != residueLast.color) || (curr_chain != residue.ChainID)) || (i == (rvDataSets[0].Residues.length))) {
						r1 = residueLast.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
						if (residueLast.color.indexOf("#") == -1) {
							script += "color 0x" + curr_color + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + r1 + "\n";
						} else {
							script += "color " + curr_color.replace("#", "0x") + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + r1 + "\n";
						}
						r0 = residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
						if (residue.ChainID != "") {
							curr_chain = residue.ChainID;
						}
						curr_color = residue.color;
					}
				}
			}
		}
		if (residueLast.color.indexOf("#") == -1) {
			script += "color 0x" + curr_color + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + "\n";
		} else {
			script += "color " + curr_color.replace("#", "0x") + ", " + PyMOL_obj[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(curr_chain)] + " and resi " + r0 + "-" + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + "\n";
		}
		script += "\n";
		
		// Protein Section
		for (var jj = 0; jj < rvDataSets[0].SpeciesEntry.SubunitProtChains[0].length; jj++) {
			script += "create " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][jj] + "," + PDB_Obj_Names[1] + " and chain " + rvDataSets[0].SpeciesEntry.SubunitProtChains[1][jj] + "\n";
		}
		script += "\ndisable *rp*\n";
		script += "color blue, *rp*\n";
		
		var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function () {
				return this.value;
			}).get();
		
		//var dd = document.getElementById("ProtList");
		//var colName = dd.options[dd.selectedIndex].value;
		//var colName = array_of_checked_values[0];
		for (jjj = 0; jjj < array_of_checked_values.length; jjj++) {
			var h = rvDataSets[0].SpeciesEntry.SubunitProtChains[0].indexOf(array_of_checked_values[jjj]);
			if (h >= 0) {
				script += "enable " + rvDataSets[0].SpeciesEntry.Species_Abr + "_" + "rp" + rvDataSets[0].SpeciesEntry.SubunitProtChains[0][h] + "\n";
			}
		}
		script += "\nzoom all\n";
		if (rvDataSets[0].Selected.length > 0) {
			var SeleScript = "create RiboVisionSele," + rvDataSets[0].SpeciesEntry.Jmol_Script.substring(0, rvDataSets[0].SpeciesEntry.Jmol_Script.indexOf("_state")) + " and ((resi " + rvDataSets[0].Selected[0].resNum.replace(/[^:]*:/g, "") + " and chain " + rvDataSets[0].Selected[0].ChainID + ")";
			// Selected Section
			for (var ii = 1; ii < rvDataSets[0].Selected.length; ii++) {
				if (rvDataSets[0].Selected[ii].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") != null) {
					r1 = rvDataSets[0].Selected[ii].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
					SeleScript += " or (resi " + r1 + " and chain " + rvDataSets[0].Selected[ii].ChainID + ")";
				}
			}
			SeleScript += ")\n";
			
			script += "\n" + SeleScript;
		}
		
		//Form Submit;
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "savePML.php");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "content");
		hiddenField.setAttribute("value", script);
		form.appendChild(hiddenField);
		
		PDB_filesU = $.grep(PDB_files, function (v, k) {
			return $.inArray(v, PDB_files) === k;
		});
		var hiddenField2 = document.createElement("input");
		hiddenField2.setAttribute("type", "hidden");
		hiddenField2.setAttribute("name", "pdbfiles");
		hiddenField2.setAttribute("value", PDB_filesU);
		form.appendChild(hiddenField2);
		
		document.body.appendChild(form);
		form.submit();
	}
	checkSavePrivacyStatus();
}

function canvasToSVG() {
	var SupportesLayerTypes = ["lines", "labels", "residues", "circles", "selected"];
	var ChosenSide;
	
	var AllMode = $('input[name="savelayers"][value=all]').attr("checked");
	
	
	if (rvDataSets[0].SpeciesEntry.MapType.indexOf("Structural") >= 0) {
		var mapsize = "612 792";
		var mapsize2 = 'width="612px" height="792px" ';
	} else {
		var mapsize = "792 612";
		var mapsize2 = 'width="792px" height="612px" ';
	}
	output = "<?xml version='1.0' encoding='UTF-8'?>\n" +
		'<svg version="1.1" baseProfile="basic" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" ' +
		mapsize2 + 'viewBox="0 0 ' + mapsize + '" xml:space="preserve">\n';
	
	$.each(rvDataSets[0].Layers, function (index, value) {
		if (AllMode || value.Visible){
			switch (value.Type) {
				case "lines":
					output = output + '<g id="' + value.LayerName + '">\n';
					if (value.ColorLayer === "gray_lines"){
						for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
							var BasePair = rvDataSets[0].BasePairs[j];
							output = output + '<line fill="none" stroke="' + '#231F20' + '" stroke-opacity="' + 0.5 + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
						}
					} else {
						if (value.ColorLayer.ColorGradientMode == "Matched") {
							//var grd_order = [0, 1];
							ChosenSide="resIndex1";
						} else if (value.ColorLayer.ColorGradientMode == "Opposite") {
							//var grd_order = [1, 0];
							ChosenSide="resIndex2";
						} else {
							alert("how did we get here? 34");
						}
						switch  (value.ColorLayer.Type){
							case "residues" : 
								//var grd = value.ColorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
								/*
								if (rvDataSets[0].Residues[j].color && rvDataSets[0].Residues[k].color){
									color1 = colourNameToHex(rvDataSets[0].Residues[j].color);
									color2 = colourNameToHex(rvDataSets[0].Residues[k].color);
									
									grd.addColorStop(grd_order[0], "rgba(" + h2d(color1.slice(1, 3)) + "," + h2d(color1.slice(3, 5)) + "," + h2d(color1.slice(5)) + ",.5)");
									grd.addColorStop(grd_order[1], "rgba(" + h2d(color2.slice(1, 3)) + "," + h2d(color2.slice(3, 5)) + "," + h2d(color2.slice(5)) + ",.5)");
								}
								value.ColorLayer.addLinearGradient(grd);
								rvDataSets[0].BasePairs[i]["color"] = grd;
								*/
								for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
									var BasePair = rvDataSets[0].BasePairs[j];
									output = output + '<line fill="none" stroke="' + rvDataSets[0].Residues[BasePair[ChosenSide]].color + '" stroke-opacity="' + 0.5 + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
								}
								break;
							case "circles" : 
								for (var j = 0; j < rvDataSets[0].BasePairs.length; j++) {
									var BasePair = rvDataSets[0].BasePairs[j];
									output = output + '<line fill="none" stroke="' + value.ColorLayer.dataLayerColors[BasePair[ChosenSide]] + '" stroke-opacity="' + 0.5 + '" stroke-width="0.5" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].X).toFixed(3) + '" y1="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex1].Y).toFixed(3) + '" x2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].X).toFixed(3) + '" y2="' + parseFloat(rvDataSets[0].Residues[BasePair.resIndex2].Y).toFixed(3) + '"/>\n';
								}
								break;
							default :
								alert("this shouldn't be happening right now 54.");
							
						}
					}
					output = output + '</g>\n';
					break;
				case "labels":
					output = output + '<g id="' + value.LayerName + '_Lines">\n';
					for (var iii = 0; iii < rvDataSets[0].rvLineLabels.length; iii++) {
						var LabelLine = rvDataSets[0].rvLineLabels[iii];
						output = output + '<line fill="none" stroke="#211E1F" stroke-width="0.25" stroke-linejoin="round" stroke-miterlimit="10" x1="' + parseFloat(LabelLine.X1).toFixed(3) + '" y1="' + parseFloat(LabelLine.Y1).toFixed(3) + '" x2="' + parseFloat(LabelLine.X2).toFixed(3) + '" y2="' + parseFloat(LabelLine.Y2).toFixed(3) + '"/>\n';
					}
					output = output + '</g>\n';
					
					output = output + '<g id="' + value.LayerName + '_Text">\n';
					for (var ii = 0; ii < rvDataSets[0].rvTextLabels.length; ii++) {
						var LabelData = rvDataSets[0].rvTextLabels[ii];
						output = output + '<text transform="matrix(1 0 0 1 ' + parseFloat(LabelData.X).toFixed(3) + ' ' + parseFloat(LabelData.Y).toFixed(3) + ')" fill="' + LabelData.Fill + '" font-family="Myriad Pro" font-size="' + LabelData.FontSize + '">' + LabelData.LabelText + '</text>\n';
					}
					output = output + '</g>\n';
					break;
				case "residues":
					output = output + '<g id="' + value.LayerName + '">\n';
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						var residue = rvDataSets[0].Residues[i];
						output = output + '<text id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" transform="matrix(1 0 0 1 ' + (parseFloat(residue.X) - 1.262).toFixed(3) + ' ' + (parseFloat(residue.Y) + 1.145).toFixed(3) + ')" fill="' + residue.color + '" font-family="Myriad Pro" font-size="3.9">' + residue.resName + '</text>\n';
					}
					output = output + '</g>\n';
					break;
				case "circles":
					output = output + '<g id="' + value.LayerName + '">\n';
					var radius = 1.7 * value.ScaleFactor;
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						var residue = rvDataSets[0].Residues[i];
						if (residue && value.dataLayerColors[i]) {
							if (value.Filled) {
								output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" fill="' + value.dataLayerColors[i] + '" stroke="' + value.dataLayerColors[i] + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) + '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="' + radius + '"/>\n';
							} else {
								output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" fill="' + 'none' + '" stroke="' + value.dataLayerColors[i] + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) + '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="' + radius + '"/>\n';
							}
						}
					}
					output = output + '</g>\n';
					break;
				case "selected":
					output = output + '<g id="' + value.LayerName + '">\n';
					var radius = 1.7 * value.ScaleFactor;
					for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
						var residue = rvDataSets[0].Residues[i];
						if (residue && residue.selected) {
							output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") + '" fill="' + 'none' + '" stroke="' + '#940B06' + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) + '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="' + radius + '"/>\n';
						}
					}
					output = output + '</g>\n';
					break;
					
				default:
					break;
			}
		}
	});
	
	/*
	output = output + '<g id="LinkedDataLayer">\n';
	for(var i = 0; i < rvDataSets[0].Residues.length; i++){
	var residue = rvDataSets[0].Residues[i];
	if (residue && residue.color != '#000000' && residue.color != '#858585'){
	output = output + '<circle id="' + residue.resNum.replace(/[^:]*:/g,"").replace(/[^:]*:/g,"") + '" fill="' + residue.color + '" stroke="' + residue.color + '" stroke-width="0.5" stroke-miterlimit="10" cx="' + parseFloat(residue.X).toFixed(3) +  '" cy="' + parseFloat(residue.Y).toFixed(3) + '" r="1.7"/>\n';
	}
	}
	
	output = output + '</g>\n';
	
	 */
	output = output + watermark(true);
	output = output + '</svg>';
	return output;
}
///////////////////////////////////////////////////////////////////////////////


//////////////////////////////// Jmol Functions ////////////////////////////////
function updateModel() {
	var n;
	var script = "set hideNotSelected true;select (" + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1) + ".1 and (";
	for (var i = 0; i < rvDataSets[0].Selected.length; i++) {
		if (rvDataSets[0].Selected[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "") != null) {
			if (script != "set hideNotSelected true;select (" + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1) + ".1 and (") {
				script += " or ";
			};
			n = rvDataSets[0].Selected[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "").match(/[A-z]/g);
			if (n != null) {
				r1 = rvDataSets[0].Selected[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "").replace(n, "^" + n);
			} else {
				r1 = rvDataSets[0].Selected[i].resNum.replace(/[^:]*:/g, "").replace(/[^:]*:/g, "");
			}
			script += r1 + ":" + rvDataSets[0].Selected[i].ChainID;
		}
	}
	if (script == "set hideNotSelected true;select (" + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1) + ".1 and (") {
		for (var ii = 0; ii < rvDataSets[0].SpeciesEntry.PDB_chains.length; ii++) {
			script += ":" + rvDataSets[0].SpeciesEntry.PDB_chains[ii];
			if (ii < (rvDataSets[0].SpeciesEntry.PDB_chains.length - 1)) {
				script += " or ";
			}
		}
		script += ")); center selected;";
		
	} else {
		script += ")); center selected;";
	}
	jmolScript(script);
	/*
	var array_of_checked_values = $("#ProtList").multiselect("getChecked").map(function(){
	return this.value;
	}).get();
	update3DProteins(array_of_checked_values);*/
}

function resetColorState() {
	clearColor(false);
	jmolScript("script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
	//var jscript = "frame " + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1 ) + ".1" ;
	var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
	
	jmolScript(jscript);
	commandSelect();
	updateModel();
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////////////// Load Data Functions ///////////////////////////
function populateDomainHelixMenu() {
	$("#selectByDomainHelix").find('option').remove().end();
	
	// Do the Domains
	var DomainList_AN = new Array;
	var DomainList_RN = new Array;
	var DomainSelections = new Array;
	
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		DomainList_AN[i] = rvDataSets[0].Residues[i].Domain_AN;
		DomainList_RN[i] = rvDataSets[0].Residues[i].Domain_RN;
		if (!DomainSelections[DomainList_AN[i]]) {
			DomainSelections[DomainList_AN[i]] = new Array;
		}
		if (rvDataSets[0].Residues[i].resNum.indexOf(":") >= 0) {
			DomainSelections[DomainList_AN[i]].push(rvDataSets[0].Residues[i].resNum);
		} else {
			DomainSelections[DomainList_AN[i]].push(rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[i].ChainID)] + ":" + rvDataSets[0].Residues[i].resNum);
		}
	}
	
	DomainList_ANU = $.grep(DomainList_AN, function (v, k) {
		return $.inArray(v, DomainList_AN) === k;
	});
	DomainList_RNU = $.grep(DomainList_RN, function (v, k) {
			return $.inArray(v, DomainList_RN) === k;
		});
	
	$('#selectByDomainHelix').append('<optgroup label="Domains" id="domainsList" />');
	$.each(DomainList_ANU, function (i, val) {
		if (DomainList_RNU[i].indexOf("S") >= 0) {
			$('#domainsList').append(new Option(DomainList_RNU[i], DomainSelections[val]));
		} else {
			$('#domainsList').append(new Option("Domain " + DomainList_RNU[i], DomainSelections[val]));
		}
		//console.log(DomainSelections[val]);
	});
	
	// Do the Helices
	var HelixList = new Array;
	var HelixSelections = new Array;
	
	for (var i = 0; i < rvDataSets[0].Residues.length; i++) {
		HelixList[i] = rvDataSets[0].Residues[i].Helix_Num;
		if (!HelixSelections[HelixList[i]]) {
			HelixSelections[HelixList[i]] = new Array;
		}
		if (rvDataSets[0].Residues[i].resNum.indexOf(":") >= 0) {
			HelixSelections[HelixList[i]].push(rvDataSets[0].Residues[i].resNum);
		} else {
			HelixSelections[HelixList[i]].push(rvDataSets[0].SpeciesEntry.Molecule_Names[rvDataSets[0].SpeciesEntry.PDB_chains.indexOf(rvDataSets[0].Residues[i].ChainID)] + ":" + rvDataSets[0].Residues[i].resNum);
		}
	}
	
	HelixListU = $.grep(HelixList, function (v, k) {
			return $.inArray(v, HelixList) === k;
		});
	
	$('#selectByDomainHelix').append('<optgroup label="Helices" id="helciesList" />');
	
	$.each(HelixListU, function (i, val) {
		$('#helciesList').append(new Option("Helix " + val, HelixSelections[val]));
	});
	
	// Refresh Menu
	$("#selectByDomainHelix").multiselect("refresh");
	
}

function loadSpecies(species) {
	
	for (i in rvDataSets[0].Layers) {
		rvDataSets[0].Layers[i].clearCanvas();
	}
	
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
				
				
				jmolScript("script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
				//var jscript = "frame " + (SubunitNames.indexOf(rvDataSets[0].SpeciesEntry.Subunit) + 1 ) ;
				var jscript = "display " + rvDataSets[0].SpeciesEntry.Jmol_Model_Num_rRNA + ".1";
				
				jmolScript(jscript);
				
				clearSelection();
				rvDataSets[0].drawResidues("residues");
				rvDataSets[0].drawLabels("labels");
				
				$("#TemplateLink").attr("href", "./Templates/" + species + "_UserDataTemplate.csv")
				
			});
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
		jmolScript("script states/" + rvDataSets[0].SpeciesEntry.Jmol_Script);
		clearSelection();
		//console.log("Nothing to see here, move along now, and 42!");
		welcomeScreen();
	}
	document.getElementById("ProtList").selectedIndex = 0;
	document.getElementById("alnList").selectedIndex = 0;
	document.getElementById("PrimaryInteractionList").selectedIndex = 0;
	rvDataSets[0].BasePairs = [];
}
///////////////////////////////////////////////////////////////////////////////


////////////////////////////////// Canvas Functions ///////////////////////////
function watermark(usetime) {
	if (rvDataSets[0].SpeciesEntry.MapType && rvDataSets[0].SpeciesEntry.MapType != "None") {
		var h = (rvDataSets[0].SpeciesEntry.MapType == "Structural") ? 762 : 612;
		var d = new Date();
		var df;
		
		var x = 10;
		var y = h - 20;
		var Message = "A " + rvDataSets[0].SpeciesEntry.MapType + " Map: Brought to you by RiboEvo @ Geogia Tech.";
		df = d.toLocaleString().indexOf("G");
		var LabelLayers = rvDataSets[0].getLayerByType("labels");
		targetLayer = LabelLayers[0];
		targetLayer.CanvasContext.textAlign = 'left';
		targetLayer.CanvasContext.font = "10pt Calibri";
		targetLayer.CanvasContext.fillStyle = "#f6a828";
		targetLayer.CanvasContext.fillText(Message, x, y);
		
		var output = '<g id="WaterMark">\n';
		output = output + '<text id="WaterMark" transform="matrix(1 0 0 1 ' + (parseFloat(x) - 1.262).toFixed(3) + ' ' + (parseFloat(y) + 1.145).toFixed(3) + ')" fill="#f6a828" font-family="Myriad Pro" font-size="10">' + Message + '</text>\n';
		if (usetime) {
			targetLayer.CanvasContext.fillText("Saved on " + d.toLocaleString().slice(0, df - 1), x + 75, y + 15);
			output = output + '<text id="Date" transform="matrix(1 0 0 1 ' + (parseFloat(x) - 1.262 + 75).toFixed(3) + ' ' + (parseFloat(y) + 15 + 1.145).toFixed(3) + ')" fill="#f6a828" font-family="Myriad Pro" font-size="8">' + "Saved on " + d.toLocaleString().slice(0, df - 1) + '</text>\n';
		}
		output = output + '</g>\n';
		return output;
	}
}

function canvas_arrow(fromx, fromy, tox, toy) {
	
	//rvDataSets[0].Layers[rvDataSets[0].LastLayer].CanvasContext = ResidueLayer.getContext("2d");
	
	var headlen = 10; // length of head in pixels
	var angle = Math.atan2(toy - fromy, tox - fromx);
	rvDataSets[0].Layers[0].CanvasContext.moveTo(fromx, fromy);
	rvDataSets[0].Layers[0].CanvasContext.lineTo(tox, toy);
	rvDataSets[0].Layers[0].CanvasContext.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
	rvDataSets[0].Layers[0].CanvasContext.moveTo(tox, toy);
	rvDataSets[0].Layers[0].CanvasContext.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function welcomeScreen() {
	var scale_factor = parseFloat($("#canvasDiv").css('width')) / 733;
	var line_unit = 25;
	rvDataSets[0].Layers[0].clearCanvas();
	rvDataSets[0].Layers[0].CanvasContext.strokeStyle = "#000000";
	rvDataSets[0].Layers[0].CanvasContext.font = (36 * scale_factor) + "pt Arial";
	rvDataSets[0].Layers[0].CanvasContext.textBaseline = "middle";
	rvDataSets[0].Layers[0].CanvasContext.textAlign = "center";
	rvDataSets[0].Layers[0].CanvasContext.fillStyle = "OrangeRed";
	rvDataSets[0].Layers[0].CanvasContext.fillText('Hello, Astrobiologist!', HighlightLayer.width / 2 / rvViews[0].scale - rvViews[0].x, HighlightLayer.height / 2 / rvViews[0].scale - rvViews[0].y - (3 * scale_factor * line_unit));
	rvDataSets[0].Layers[0].CanvasContext.fillText('Welcome to Ribovision.', HighlightLayer.width / 2 / rvViews[0].scale - rvViews[0].x, HighlightLayer.height / 2 / rvViews[0].scale - rvViews[0].y - (1 * scale_factor * line_unit));
	rvDataSets[0].Layers[0].CanvasContext.fillText('Please select a molecule', HighlightLayer.width / 2 / rvViews[0].scale - rvViews[0].x, HighlightLayer.height / 2 / rvViews[0].scale - rvViews[0].y + (3 * scale_factor * line_unit));
	rvDataSets[0].Layers[0].CanvasContext.fillText('to get started.', HighlightLayer.width / 2 / rvViews[0].scale - rvViews[0].x, HighlightLayer.height / 2 / rvViews[0].scale - rvViews[0].y + (5 * scale_factor * line_unit));
	
	//canvas_arrow(HighlightLayer.width / 2 / rvViews[0].scale - rvViews[0].x, HighlightLayer.height / 2 / rvViews[0].scale - rvViews[0].y - 25, 50, 50);
	
}
///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////// Math //////////////////////////////////
function d2h(d) {
	return d.toString(16);
};
function h2d(h) {
	return parseInt(h, 16);
};
///////////////////////////////////////////////////////////////////////////////

//using slider to change views size
$(function() {
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
	$( "#topPorportionSlider" ).slider({
		min : 50,
		max : 90,
		value : 88,
		orientation : "vertical",
		slide : function (event, ui) {
			TopDivide = (100 - ui.value) / 100;
			resizeElements();
			//views_proportion_change($(this).slider("value"), 100-$(this).slider("value"));
		}
	});
})

function views_proportion_change(leftPercentage, rightPercentage){
	//console.log("event triggered! l: " + leftPercentage + " r: " + rightPercentage);	

	$newLeftWidth = leftPercentage*0.82 + "%";
	$newRightWidth = rightPercentage*0.82 + "%";
	$borderPos = (100-rightPercentage*0.82-2) + "%";	
	//console.log("l: " + $newLeftWidth + " r: " + $newRightWidth + " border: " + $borderPos);
	$("#canvasDiv").css({"width": $newLeftWidth});
	$("#jmolDiv").css({"width": $newRightWidth, "left": $borderPos});
	$("#jmolApplet0").css({"width": "100%"});
}	

////////////////Nav Line ///////

/*
 for (var i =0; i<rvDataSets[0].Selected.length;i++){
				var newNumber = rvDataSets[0].Selected[i].mean_tempFactor;
        		data = data.concat(newNumber);
		}
		console.log(data);
		
		for (var i =0; i<rvDataSets[0].Selected.length;i++){
				var newNumber = rvDataSets[0].Selected[i].CurrentData-1;
        		dataX = dataX.concat(newNumber);
		}
		console.log(dataX);
 * */

function drawNavLine(selectedParam){
		$('#NavLineDiv').empty(); //clean div before draw new graph
		
		var linename = '';
		var data = [];
	
		for (var i =0; i<rvDataSets[0].Residues.length;i++){
			if (selectedParam ==1){
				var newNumber = rvDataSets[0].Residues[i].mean_tempFactor;
				linename = 'B-Factors';
				}
			else if (selectedParam ==2){
				var newNumber = rvDataSets[0].Residues[i].Domains_Color;
				linename = 'Domains';
			}		
			
			else if (selectedParam ==3){
				var newNumber = rvDataSets[0].Residues[i].Onion;
				linename = 'Onion';
			}
			else if (selectedParam ==4){
				var newNumber = rvDataSets[0].Residues[i].Helix_Color;
				linename = 'Helices';
			}
			else if (selectedParam ==5){
				var newNumber = rvDataSets[0].Residues[i].Mg_ions_24; 
				linename = 'Mg ions 2.4A';
			}
			else if (selectedParam ==6){
				var newNumber = rvDataSets[0].Residues[i].Mg_ions_26;
				linename = 'Mg ions 2.6A';
			}
			else if (selectedParam ==7){
				var newNumber = rvDataSets[0].Residues[i].Mg_ions_60;
				linename = 'Mg ions 6.0A';
			}
        data = data.concat(newNumber);
		}
		//console.log(data);
		
		var	w = $('#NavLineDiv').width();
		var h = 300,
			margin = 20,
			y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]),
			x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin])

			var vis = d3.select("#NavLineDiv")
			    .append("svg:svg")
			    .attr("width", w)
			    .attr("height", h)

			var g = vis.append("svg:g")
			    .attr("transform", "translate(0, 290)");
			
			var line = d3.svg.line()
			    .x(function(d,i) { return x(i); })
			    .y(function(d) { return -1 * y(d); })
			
			g.append("svg:path").attr("d", line(data));
			
			////////draw selected residue on navlines/////
			if(rvDataSets[0].Selected.length>0){
				//drawSelectedNavLine();
				var selectedDataX=[]
				var selectedDataY=[]
				
				for (var i =0; i<rvDataSets[0].Selected.length;i++){
					var newNumber = rvDataSets[0].Selected[i].mean_tempFactor;
	        		selectedDataY = selectedDataY.concat(newNumber);
				}
				console.log("selectedDataY"+selectedDataY );
				
				for (var i =0; i<rvDataSets[0].Selected.length;i++){
						var newNumber = rvDataSets[0].Selected[i].map_Index;
		        		selectedDataX = selectedDataX.concat(newNumber);
				}
				console.log('selectedDataX'+selectedDataX);
				
			//y = d3.scale.linear().domain([0, d3.max(selectedDataY)]).range([0 + margin, h - margin]),
			//x = d3.scale.linear().domain([0, d3.max(selectedDataX)]).range([0 + margin, w - margin]);
			var x = d3.scale.linear().range([0 + margin, w - margin]),
    		y = d3.scale.linear().range([0 + margin, h - margin]);
			
			var selectedResidueLine = d3.svg.line()
			    .x(function(d) {return x(selectedDataX);})
			    .y(function(d) {return -1*y(selectedDataY);});	
			    
			g.append("svg:path").attr("d", selectedResidueLine)
								.style("stroke", '#e377c2');
								
								
								/**
								 *var line = d3.svg.line()
			    .x(function(d,i) { return x(i); })
			    .y(function(d) { return -1 * y(d); })
								 *  */
			}
		
			//////////////////////////////
			
			g.append("svg:line")
			    .attr("x1", x(0))
			    .attr("y1", -1 * y(0))
			    .attr("x2", $('#NavLineDiv').width())
			    .attr("y2", -1 * y(0));

			g.append("svg:line")
			    .attr("x1", x(0))
			    .attr("y1", -1 * y(0))
			    .attr("x2", x(0))
			    .attr("y2", -1 * y(d3.max(data)*1.2)); //to make the axis 1.2*longth
			
			g.selectAll(".xLabel")
			    .data(x.ticks(10))
			    .enter().append("svg:text")
			    .attr("class", "xLabel")
			    .text(String)
			    .attr("x", function(d) { return x(d) })
			    .attr("y", 0)
			    .attr("text-anchor", "middle");

			g.selectAll(".yLabel")
			    .data(y.ticks(6))
			    .enter().append("svg:text")
			    .attr("class", "yLabel")
			    .text(String)
			    .attr("x", 0)
			    .attr("y", function(d) { return -1 * y(d) })
			    .attr("text-anchor", "right")
			    .attr("dy", 4);
			
			g.selectAll(".xTicks")
			    .data(x.ticks(10))
			    .enter().append("svg:line")
			    .attr("class", "xTicks")
			    .attr("x1", function(d) { return x(d); })
			    .attr("y1", -1 * y(0))
			    .attr("x2", function(d) { return x(d); })
			    .attr("y2", -1 * y(-0.2));

			g.selectAll(".yTicks")
			    .data(y.ticks(6))
			    .enter().append("svg:line")
			    .attr("class", "yTicks")
			    .attr("y1", function(d) { return -1 * y(d); })
			    .attr("x1", x(-0.3))
			    .attr("y2", function(d) { return -1 * y(d); })
			    .attr("x2", x(0));
			    
			//add legend to the navline 
			 g.append("text")
		      .attr("x", w-90)
		      .attr("y", "-30")
		      .text(linename);	
}

function drawSelectedNavLine(){
	
}

//////////End of navline functions////
