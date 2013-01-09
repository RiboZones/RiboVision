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


/////////////////////////// Classes ///////////////////////////////////////////
function RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type, Color) {
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
	this.DataLabel = "empty data";
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
	this.ConservationTable = [];
	this.DataDescriptions = [];
	//Methods
	this.addLayers = function (rvLayers) {
		this.Layers = rvLayers;
		this.LastLayer = this.Layers.length - 1;
	};
	this.addLayer = function (LayerName, CanvasName, Data, Filled, ScaleFactor, Type, Color) {
		var b = new RvLayer(LayerName, CanvasName, Data, Filled, ScaleFactor, Type, Color);
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
	this.changeSelection = function (SeleName) {
		if (this.Selections[SeleName]) {
			//alert("He does exist!");
			rvDataSets[0].Selected = this.Selections[SeleName];
			rvDataSets[0].drawSelection("selected");
			//} else {
			//alert("He doesn't exist.");
		}
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
		var ind = $.inArray(layer, this.LayerTypes),
		ret = [];
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
	this.isUnique = function (layer) {
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
		var ResidueListLocal = [],
		j;
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
		targetLayer.Data = [];
		targetLayer.dataLayerColors = [];
		if (rvDataSets[0].Residues && rvDataSets[0].Residues.length > 0) {
			for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
				targetLayer.Data[i] = false;
				targetLayer.dataLayerColors[i] = "#858585";
			}
			for (var j = rvDataSets[0].Selected.length - 1; j >= 0; j--) {
				targetLayer.CanvasContext.beginPath();
				targetLayer.CanvasContext.arc(rvDataSets[0].Selected[j].X, rvDataSets[0].Selected[j].Y, (targetLayer.ScaleFactor * 1.7), 0, 2 * Math.PI, false);
				targetLayer.CanvasContext.closePath();
				targetLayer.CanvasContext.strokeStyle = "#940B06";
				targetLayer.CanvasContext.lineWidth = 0.5;
				targetLayer.CanvasContext.stroke();
				targetLayer.Data[i] = true;
				targetLayer.dataLayerColors[i] = "#940B06";
			}
		}
		var linkedLayer = rvDataSets[0].getLinkedLayer();
		if (linkedLayer.Type == "selected") {
			update3Dcolors();
		}
	}
	function drawDataCircles(targetLayer, dataIndices, ColorArray, noClear) {
		if (targetLayer.Type === "circles") {
			if (!noClear) {
				targetLayer.clearCanvas();
				targetLayer.dataLayerColors = [];
			}
			
			if (rvDataSets[0].Residues != undefined) {
				for (var i = rvDataSets[0].Residues.length - 1; i >= 0; i--) {
					if (dataIndices && ColorArray && ColorArray[dataIndices[i]] != '#000000' && ColorArray[dataIndices[i]] != undefined && ColorArray[dataIndices[i]] != '#858585') {
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
					} else if (!dataIndices && !ColorArray && targetLayer.dataLayerColors[i] && targetLayer.dataLayerColors[i] != '#000000' && targetLayer.dataLayerColors[i] != '#858585') {
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
		} else {
			return false;
		}
	};
	function drawBasePairs(targetLayer, colorLayer) {
		var color1,
		color2;
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
				if (zoomEnabled) {
					var jkdist = Math.sqrt(((rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) * (rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) + (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y) * (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y)));
					
					if ((150 - rvViews[0].scale * 23) > jkdist) {
						continue;
					}
					if (((rvDataSets[0].Residues[j].X * rvViews[0].scale + rvViews[0].x < 0) || (rvDataSets[0].Residues[j].X * rvViews[0].scale + rvViews[0].x > HighlightLayer.clientWidth) || (rvDataSets[0].Residues[j].Y * rvViews[0].scale + rvViews[0].y < 0) || (rvDataSets[0].Residues[j].Y * rvViews[0].scale + rvViews[0].y > HighlightLayer.clientHeight))
						 && ((rvDataSets[0].Residues[k].X * rvViews[0].scale + rvViews[0].x < 0) || (rvDataSets[0].Residues[k].X * rvViews[0].scale + rvViews[0].x > HighlightLayer.clientWidth) || (rvDataSets[0].Residues[k].Y * rvViews[0].scale + rvViews[0].y < 0) || (rvDataSets[0].Residues[k].Y * rvViews[0].scale + rvViews[0].y > HighlightLayer.clientHeight))) {
						continue;
					}
				}
				if (j >= 0 && k >= 0) {
					switch (colorLayer.Type) {
					case undefined:
						rvDataSets[0].BasePairs[i]["color"] = "rgba(35,31,32,.5)";
						break;
					case "residues":
						var grd = colorLayer.CanvasContext.createLinearGradient(rvDataSets[0].Residues[j].X, rvDataSets[0].Residues[j].Y, rvDataSets[0].Residues[k].X, rvDataSets[0].Residues[k].Y);
						if (rvDataSets[0].Residues[j].color && rvDataSets[0].Residues[k].color) {
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
						if (colorLayer.dataLayerColors[j] && colorLayer.dataLayerColors[k]) {
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
					if (zoomEnabled && (rvViews[0].scale > 10)) {
						//draw the interaction type labels here
						var x1 = rvDataSets[0].Residues[j].X;
						var x2 = rvDataSets[0].Residues[k].X;
						var x12mid = x1 - ((x1 - x2) / 2);
						var xmid = rvDataSets[0].Residues[j].X - (rvDataSets[0].Residues[j].X - rvDataSets[0].Residues[k].X) / 2;
						var ymid = rvDataSets[0].Residues[j].Y - (rvDataSets[0].Residues[j].Y - rvDataSets[0].Residues[k].Y) / 2;
						targetLayer.CanvasContext.save();
						targetLayer.CanvasContext.lineWidth = .2;
						targetLayer.CanvasContext.fillStyle = "white";
						targetLayer.CanvasContext.fillRect(xmid - 2.4, ymid - .8, 4.7, 1.7);
						targetLayer.CanvasContext.strokeRect(xmid - 2.3, ymid - .7, 4.5, 1.5);
						targetLayer.CanvasContext.restore();
						targetLayer.CanvasContext.save();
						targetLayer.CanvasContext.font = ".5px Arial";
						targetLayer.CanvasContext.fillText(rvDataSets[0].BasePairs[i].bp_type, xmid - 2, ymid + .5);
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