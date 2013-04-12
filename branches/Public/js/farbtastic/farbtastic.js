/**
 * Farbtastic Color Picker 1.2
 * © 2008 Steven Wittens
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

jQuery.fn.farbtastic = function (callback) {
  $.farbtastic(this, callback);
  return this;
};

jQuery.farbtastic = function (container, callback) {
  var container = $(container).get(0);
  return container.farbtastic || (container.farbtastic = new jQuery._farbtastic(container, callback));
}

jQuery._farbtastic = function (container, callback) {
  // Store farbtastic object
  var fb = this;

  // Insert markup
  $(container).html('<div class="farbtastic"><div class="color"></div><div class="wheel"></div><div class="overlay"></div><div class="h-marker marker"></div><div class="sl-marker marker"></div></div>');
  var e = $('.farbtastic', container);
  fb.wheel = $('.wheel', container).get(0);
  // Dimensions
  fb.radius = 84;
  fb.square = 100;
  fb.width = 194;

  // Fix background PNGs in IE6
  if (navigator.appVersion.match(/MSIE [0-6]\./)) {
    $('*', e).each(function () {
      if (this.currentStyle.backgroundImage != 'none') {
        var image = this.currentStyle.backgroundImage;
        image = this.currentStyle.backgroundImage.substring(5, image.length - 2);
        $(this).css({
          'backgroundImage': 'none',
          'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
        });
      }
    });
  }

  /**
   * Link to the given element(s) or callback.
   */
  fb.linkTo = function (callback) {
    // Unbind previous nodes
    if (typeof fb.callback == 'object') {
      $(fb.callback).unbind('keyup', fb.updateValue);
    }

    // Reset color
    fb.color = null;

    // Bind callback or elements
    if (typeof callback == 'function') {
      fb.callback = callback;
    }
    else if (typeof callback == 'object' || typeof callback == 'string') {
      fb.callback = $(callback);
      fb.callback.bind('keyup', fb.updateValue);
      if (fb.callback.get(0).value) {
        fb.setColor(fb.callback.get(0).value);
      }
    }
    return this;
  }
  fb.updateValue = function (event) {
    if (this.value && this.value != fb.color) {
      fb.setColor(this.value);
    }
  }

  /**
   * Change color with HTML syntax #123456
   */
  fb.setColor = function (color) {
    var unpack = fb.unpack(color);
    if (fb.color != color && unpack) {
      fb.color = color;
      fb.rgb = unpack;
      fb.hsl = fb.RGBToHSL(fb.rgb);
      fb.updateDisplay();
    }
    return this;
  }

  /**
   * Change color with HSL triplet [0..1, 0..1, 0..1]
   */
  fb.setHSL = function (hsl) {
    fb.hsl = hsl;
    fb.rgb = fb.HSLToRGB(hsl);
    fb.color = fb.pack(fb.rgb);
    fb.updateDisplay();
    return this;
  }

  /////////////////////////////////////////////////////

  /**
   * Retrieve the coordinates of the given event relative to the center
   * of the widget.
   */
  fb.widgetCoords = function (event) {
    var x, y;
    var el = event.target || event.srcElement;
    var reference = fb.wheel;

    if (typeof event.offsetX != 'undefined') {
      // Use offset coordinates and find common offsetParent
      var pos = { x: event.offsetX, y: event.offsetY };

      // Send the coordinates upwards through the offsetParent chain.
      var e = el;
      while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Look for the coordinates starting from the wheel widget.
      var e = reference;
      var offset = { x: 0, y: 0 }
      while (e) {
        if (typeof e.mouseX != 'undefined') {
          x = e.mouseX - offset.x;
          y = e.mouseY - offset.y;
          break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Reset stored coordinates
      e = el;
      while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
      }
    }
    else {
      // Use absolute coordinates
      var pos = fb.absolutePosition(reference);
      x = (event.pageX || 0*(event.clientX + $('html').get(0).scrollLeft)) - pos.x;
      y = (event.pageY || 0*(event.clientY + $('html').get(0).scrollTop)) - pos.y;
    }
    // Subtract distance to middle
    return { x: x - fb.width / 2, y: y - fb.width / 2 };
  }

  /**
   * Mousedown handler
   */
  fb.mousedown = function (event) {
    // Capture mouse
    if (!document.dragging) {
      $(document).bind('mousemove', fb.mousemove).bind('mouseup', fb.mouseup);
      document.dragging = true;
    }

    // Check which area is being dragged
    var pos = fb.widgetCoords(event);
    fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > fb.square;

    // Process
    fb.mousemove(event);
    return false;
  }

  /**
   * Mousemove handler
   */
  fb.mousemove = function (event) {
    // Get coordinates relative to color picker center
    var pos = fb.widgetCoords(event);

    // Set new HSL parameters
    if (fb.circleDrag) {
      var hue = Math.atan2(pos.x, -pos.y) / 6.28;
      if (hue < 0) hue += 1;
      fb.setHSL([hue, fb.hsl[1], fb.hsl[2]]);
    }
    else {
      var sat = Math.max(0, Math.min(1, -(pos.x / fb.square) + .5));
      var lum = Math.max(0, Math.min(1, -(pos.y / fb.square) + .5));
      fb.setHSL([fb.hsl[0], sat, lum]);
    }
    return false;
  }

  /**
   * Mouseup handler
   */
  fb.mouseup = function () {
    // Uncapture mouse
    $(document).unbind('mousemove', fb.mousemove);
    $(document).unbind('mouseup', fb.mouseup);
    document.dragging = false;
  }

  /**
   * Update the markers and styles
   */
  fb.updateDisplay = function () {
    // Markers
    var angle = fb.hsl[0] * 6.28;
    $('.h-marker', e).css({
      left: Math.round(Math.sin(angle) * fb.radius + fb.width / 2) + 'px',
      top: Math.round(-Math.cos(angle) * fb.radius + fb.width / 2) + 'px'
    });

    $('.sl-marker', e).css({
      left: Math.round(fb.square * (.5 - fb.hsl[1]) + fb.width / 2) + 'px',
      top: Math.round(fb.square * (.5 - fb.hsl[2]) + fb.width / 2) + 'px'
    });

    // Saturation/Luminance gradient
    $('.color', e).css('backgroundColor', fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));

    // Linked elements or callback
    if (typeof fb.callback == 'object') {
      // Set background/foreground color
      $(fb.callback).css({
        backgroundColor: fb.color,
        color: fb.hsl[2] > 0.5 ? '#000' : '#fff'
      });

      // Change linked value
      $(fb.callback).each(function() {
        if (this.value && this.value != fb.color) {
          this.value = colorHexToName(fb.color);
        }
      });
    }
    else if (typeof fb.callback == 'function') {
      fb.callback.call(fb, fb.color);
    }
  }

  /**
   * Get absolute position of element
   */
  fb.absolutePosition = function (el) {
    var r = { x: el.offsetLeft, y: el.offsetTop };
    // Resolve relative to offsetParent
    if (el.offsetParent) {
      var tmp = fb.absolutePosition(el.offsetParent);
      r.x += tmp.x;
      r.y += tmp.y;
    }
    return r;
  };

  /* Various color utility functions */
  fb.pack = function (rgb) {
    var r = Math.round(rgb[0] * 255);
    var g = Math.round(rgb[1] * 255);
    var b = Math.round(rgb[2] * 255);
    return '#' + (r < 16 ? '0' : '') + r.toString(16) +
           (g < 16 ? '0' : '') + g.toString(16) +
           (b < 16 ? '0' : '') + b.toString(16);
  }

  fb.unpack = function (color) {
    if (color.length == 7) {
      return [parseInt('0x' + color.substring(1, 3)) / 255,
        parseInt('0x' + color.substring(3, 5)) / 255,
        parseInt('0x' + color.substring(5, 7)) / 255];
    }
    else if (color.length == 4) {
      return [parseInt('0x' + color.substring(1, 2)) / 15,
        parseInt('0x' + color.substring(2, 3)) / 15,
        parseInt('0x' + color.substring(3, 4)) / 15];
    }
  }

  fb.HSLToRGB = function (hsl) {
    var m1, m2, r, g, b;
    var h = hsl[0], s = hsl[1], l = hsl[2];
    m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
    m1 = l * 2 - m2;
    return [this.hueToRGB(m1, m2, h+0.33333),
        this.hueToRGB(m1, m2, h),
        this.hueToRGB(m1, m2, h-0.33333)];
  }

  fb.hueToRGB = function (m1, m2, h) {
    h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
    return m1;
  }

  fb.RGBToHSL = function (rgb) {
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];
    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;
    s = 0;
    if (l > 0 && l < 1) {
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
    }
    h = 0;
    if (delta > 0) {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += (2 + (b - r) / delta);
      if (max == b && max != r) h += (4 + (r - g) / delta);
      h /= 6;
    }
    return [h, s, l];
  }

  // Install mousedown handler (the others are set on the document on-demand)
  $('*', e).mousedown(fb.mousedown);

    // Init color
  fb.setColor('#000000');

  // Set linked elements/callback
  if (callback) {
    fb.linkTo(callback);
  }
}

function colorHexToName(color) {
	var colors = { 
		 "#f0f8ff" : "aliceblue",
		 "#faebd7" : "antiquewhite",
		 "#00ffff" : "aqua",
		 "#7fffd4" : "aquamarine",
		 "#f0ffff" : "azure",
		 "#f5f5dc" : "beige",
		 "#ffe4c4" : "bisque",
		 "#000000" : "black",
		 "#ffebcd" : "blanchedalmond",
		 "#0000ff" : "blue",
		 "#8a2be2" : "blueviolet",
		 "#a52a2a" : "brown",
		 "#deb887" : "burlywood",
		 "#5f9ea0" : "cadetblue",
		 "#7fff00" : "chartreuse",
		 "#d2691e" : "chocolate",
		 "#ff7f50" : "coral",
		 "#6495ed" : "cornflowerblue",
		 "#fff8dc" : "cornsilk",
		 "#dc143c" : "crimson",
		 "#00ffff" : "cyan",
		 "#00008b" : "darkblue",
		 "#008b8b" : "darkcyan",
		 "#b8860b" : "darkgoldenrod",
		 "#a9a9a9" : "darkgray",
		 "#006400" : "darkgreen",
		 "#bdb76b" : "darkkhaki",
		 "#8b008b" : "darkmagenta",
		 "#556b2f" : "darkolivegreen",
		 "#ff8c00" : "darkorange",
		 "#9932cc" : "darkorchid",
		 "#8b0000" : "darkred",
		 "#e9967a" : "darksalmon",
		 "#8fbc8f" : "darkseagreen",
		 "#483d8b" : "darkslateblue",
		 "#2f4f4f" : "darkslategray",
		 "#00ced1" : "darkturquoise",
		 "#9400d3" : "darkviolet",
		 "#ff1493" : "deeppink",
		 "#00bfff" : "deepskyblue",
		 "#696969" : "dimgray",
		 "#1e90ff" : "dodgerblue",
		 "#b22222" : "firebrick",
		 "#fffaf0" : "floralwhite",
		 "#228b22" : "forestgreen",
		 "#ff00ff" : "fuchsia",
		 "#dcdcdc" : "gainsboro",
		 "#f8f8ff" : "ghostwhite",
		 "#ffd700" : "gold",
		 "#daa520" : "goldenrod",
		 "#808080" : "gray",
		 "#008000" : "green",
		 "#adff2f" : "greenyellow",
		 "#f0fff0" : "honeydew",
		 "#ff69b4" : "hotpink",
		 "#cd5c5c" : "indianred ",
		 "#4b0082" : "indigo ",
		 "#fffff0" : "ivory",
		 "#f0e68c" : "khaki",
		 "#e6e6fa" : "lavender",
		 "#fff0f5" : "lavenderblush",
		 "#7cfc00" : "lawngreen",
		 "#fffacd" : "lemonchiffon",
		 "#add8e6" : "lightblue",
		 "#f08080" : "lightcoral",
		 "#e0ffff" : "lightcyan",
		 "#fafad2" : "lightgoldenrodyellow",
		 "#d3d3d3" : "lightgrey",
		 "#90ee90" : "lightgreen",
		 "#ffb6c1" : "lightpink",
		 "#ffa07a" : "lightsalmon",
		 "#20b2aa" : "lightseagreen",
		 "#87cefa" : "lightskyblue",
		 "#778899" : "lightslategray",
		 "#b0c4de" : "lightsteelblue",
		 "#ffffe0" : "lightyellow",
		 "#00ff00" : "lime",
		 "#32cd32" : "limegreen",
		 "#faf0e6" : "linen",
		 "#ff00ff" : "magenta",
		 "#800000" : "maroon",
		 "#66cdaa" : "mediumaquamarine",
		 "#0000cd" : "mediumblue",
		 "#ba55d3" : "mediumorchid",
		 "#9370d8" : "mediumpurple",
		 "#3cb371" : "mediumseagreen",
		 "#7b68ee" : "mediumslateblue",
		 "#00fa9a" : "mediumspringgreen",
		 "#48d1cc" : "mediumturquoise",
		 "#c71585" : "mediumvioletred",
		 "#191970" : "midnightblue",
		 "#f5fffa" : "mintcream",
		 "#ffe4e1" : "mistyrose",
		 "#ffe4b5" : "moccasin",
		 "#ffdead" : "navajowhite",
		 "#000080" : "navy",
		 "#fdf5e6" : "oldlace",
		 "#808000" : "olive",
		 "#6b8e23" : "olivedrab",
		 "#ffa500" : "orange",
		 "#ff4500" : "orangered",
		 "#da70d6" : "orchid",
		 "#eee8aa" : "palegoldenrod",
		 "#98fb98" : "palegreen",
		 "#afeeee" : "paleturquoise",
		 "#d87093" : "palevioletred",
		 "#ffefd5" : "papayawhip",
		 "#ffdab9" : "peachpuff",
		 "#cd853f" : "peru",
		 "#ffc0cb" : "pink",
		 "#dda0dd" : "plum",
		 "#b0e0e6" : "powderblue",
		 "#800080" : "purple",
		 "#ff0000" : "red",
		 "#bc8f8f" : "rosybrown",
		 "#4169e1" : "royalblue",
		 "#8b4513" : "saddlebrown",
		 "#fa8072" : "salmon",
		 "#f4a460" : "sandybrown",
		 "#2e8b57" : "seagreen",
		 "#fff5ee" : "seashell",
		 "#a0522d" : "sienna",
		 "#c0c0c0" : "silver",
		 "#87ceeb" : "skyblue",
		 "#6a5acd" : "slateblue",
		 "#708090" : "slategray",
		 "#fffafa" : "snow",
		 "#00ff7f" : "springgreen",
		 "#4682b4" : "steelblue",
		 "#d2b48c" : "tan",
		 "#008080" : "teal",
		 "#d8bfd8" : "thistle",
		 "#ff6347" : "tomato",
		 "#40e0d0" : "turquoise",
		 "#ee82ee" : "violet",
		 "#f5deb3" : "wheat",
		 "#ffffff" : "white",
		 "#f5f5f5" : "whitesmoke",
		 "#ffff00" : "yellow",
		 "#9acd32" : "yellowgreen",
		 "#a9a9a9" : "darkgrey",
		 "#2f4f4f" : "darkslategrey",
		 "#696969" : "dimgrey",
		 "#808080" : "grey",
		 "#d3d3d3" : "lightgray",
		 "#778899" : "lightslategrey",
		 "slategrey": "#708090"
	 };

	if (color) {
		var newcolorH = color.match(/#[\dABCDEFabcdef]{6,6}$/);
		if ((newcolorH  !=null) && newcolorH[0].length === 7){
			if (typeof colors[color.toLowerCase()] != 'undefined'){
				return colors[color.toLowerCase()];
			} else {
				return newcolorH[0];
			}
		} else {
			return false;
			//It shouldn't be able to get here in this version
		}
	} else {
		return false;
		//It shouldn't be able to get here in this version
	}
}