var colorPlay = null;

$(document).ready(function() {
    colorPlay = new ColorPlay();
});

/**
 * ColorPlay Class - Emulates various Color related methods offered by SASS.
 */
var ColorPlay = function() {
    this.contentList = ["content1", "content2"];
    this.baseColorList = [];
    this.pctStep = 2;
    this.initialize();
} 

/**
 * initialize() - Initialize colors and display Color rows.
 */
ColorPlay.prototype.initialize = function () {
    this.loadBaseColors();
    for (var i=0; i < 101; i+=this.pctStep) {
        this.addRow(i);
    }
};

/**
 * Load the Base Colors (Hex Values)
 */
ColorPlay.prototype.loadBaseColors = function() {
    this.baseColorList.push("000000");  // Black
    this.baseColorList.push("FFFFFF");  // White
    this.baseColorList.push("FF0000");  // Red
    this.baseColorList.push("FFA500");  // Orange
    this.baseColorList.push("FFFF00");  // Yellow
    this.baseColorList.push("00FF00");  // Green
    this.baseColorList.push("0000FF");  // Blue
    this.baseColorList.push("800080");  // Purple
};

/**
 * addRow() - Add a row of Color swatches.
 * @param {number} changePct - Percentage change from Base Color.
 */
ColorPlay.prototype.addRow = function(changePct) {
    this.contentList.forEach(content => {
        this.baseColorList.forEach(color => {
            var div = $("<div>");
            var color = (content ==="content1") ? this.lighten(color, changePct) : this.darken(color, changePct)
            div.text(color);
            div.css("background-color", "#" + color);
            if (this.useLightColor(color))  {
                div.css("color", "white");
            }
            $("#" + content).append(div);
        });
    });
};

/**
 * lighten() - Lightens the given color by a given percentage. 
 * @param {string} color - Color String (with or without "#")
 * @param {number} changePct - Percentage to lighten the color
 * @returns {string} - New Color Code.  If "#" was provided in the input, it will be in the output.
 */
ColorPlay.prototype.lighten = function(color, changePct) {
    var usePound = (color[0] === "#")
    var colorStr = (usePound) ? color.slice(1, 6) : color;
    var changeVal = Math.ceil((changePct * 255)/100)
    var rNewStr = this.computeNewColorStr(colorStr.substring(0, 2), changeVal, "add");
    var gNewStr = this.computeNewColorStr(colorStr.substring(2, 4), changeVal, "add");
    var bNewStr = this.computeNewColorStr(colorStr.substring(4, 6), changeVal, "add");
    return ((usePound) ? "#": "") + rNewStr + gNewStr + bNewStr;
};

/**
 * darken() - Darkens the given color by a given percentage. 
 * @param {string} color - Color String (with or without "#")
 * @param {number} changePct - Percentage to darken the color
 * @returns {string} - New Color Code.  If "#" was provided in the input, it will be in the output.
 */
ColorPlay.prototype.darken = function(color, changePct) {
    var usePound = (color[0] === "#")
    var colorStr = (usePound) ? color.slice(1, 6) : color;
    var changeVal = Math.ceil((changePct * 255)/100)
    var rNewStr = this.computeNewColorStr(colorStr.substring(0, 2), changeVal, "sub");
    var gNewStr = this.computeNewColorStr(colorStr.substring(2, 4), changeVal, "sub");
    var bNewStr = this.computeNewColorStr(colorStr.substring(4, 6), changeVal, "sub");
    return ((usePound) ? "#": "") + rNewStr + gNewStr + bNewStr;
};

/**
 * computeNewColorStr() - Computes a new Hex x00 to xFF color value based on the supplied
 * parameters.
 * @param {string} color - Hex value (x00 to xFF) to change.
 * @param {number} changeVal - Amount to change color value.
 * @param {string} dir - Direction ("add" or "sub").
 * @return {string} - Hex value (x00 to xFF) of updated color.
 */
ColorPlay.prototype.computeNewColorStr = function(color, changeVal, dir) {
    var colorVal = parseInt(color, 16);

    if (dir === "add") {
        colorVal += changeVal;
        if (colorVal > 255) { colorVal = 255; }
    }
    else {
        colorVal -= changeVal;
        if (colorVal < 0) { colorVal = 0; }
    }

    var colorStr = colorVal.toString(16);
    if (colorStr.length < 2) { colorStr = "0" + colorStr; }
    return colorStr;
}

/**
 * useLightColor() - Determines is light foreground color should be used.
 * @param {string} - Background color code (with or without "#").
 * @return {boolean} - True if light foreground color should be used.
 */
ColorPlay.prototype.useLightColor = function(color) {
    var colorStr = (color[0] === "#") ? color.slice(1, 6) : color;
    var rVal = parseInt(colorStr.substring(0, 2), 16);
    var gVal = parseInt(colorStr.substring(2, 4), 16);
    var bVal = parseInt(colorStr.substring(4, 6), 16);
    var sum = 0;

    // High Green values should force dark colors.
    if (gVal > 170) {
        return false;
    }

    sum += (rVal > 170) ? 1 : 0;
    sum += (bVal > 170) ? 1 : 0;
    sum -= (rVal < 86) ? 1 : 0;
    sum -= (gVal < 86) ? 1 : 0;
    sum -= (bVal < 86) ? 1 : 0;

    return (sum < 0);
};
