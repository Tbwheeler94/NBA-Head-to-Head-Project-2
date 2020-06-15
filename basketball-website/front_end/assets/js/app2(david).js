//Setting up graph
var width = parseInt(d3.select("#scatter").style("width")); 

// Designate the height of the graph
var height = width - width / 3.9;  
// Margin spacing for graph
var margin = 20;
// space for placing words
var labelArea = 110;
// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;
// Create the actual canvas for the graph
var svg = d3
  .select("#scatter") //being selected from the d3 library, creates the scatter plot you see on the html webpage 
  .append("svg") //adds a SVG to the selected scatterplot from d3 
  .attr("width", width) //attributes to our SVG we added in from above
  .attr("height", height)
  .attr("class", "chart");

  //setting up circles on the graph
  var Radius; //This is "hoisting", or declaring the variable with a function beneath it. As you can see 'radius' is in our Get()
  function Get() {
    if (width <= 530) {
      Radius = 5;
    }
    else {
      Radius = 10;
    }
  }
  Get();

// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText"); 

// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xRefresh() {  
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xRefresh();


// Now we use xText to append three text SVG files, with y coordinates specified to space out the values.
//These are all the xtext data binding for the x-axis
// 1. Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "TwoPointersPercentage")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Two Pointers % Per team");
// 2. Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "FieldGoalsPercentage")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Field Goals % Per Team");
// 3. Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "ThreePointersPercentage")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Three Point % Per team");
// B) Left Axis
// ============
// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;
// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");
// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");
// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();
// Now we append the text.
// 1. Wins
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "TwoPointersAttempted")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Two pointers Attempted Per Team");
// 2. 
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "FieldGoalsAttempted")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Field Goals Attempted");
// 3. Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "ThreePointersAttempted")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Three Pointers Attempted");
// 2. Import our .csv file.
// ========================
// This data file includes state-by-state demographic data from the US Census
// and measurements from health risks obtained
// by the Behavioral Risk Factor Surveillance System.
// Import our CSV data with d3's .csv import method.
d3.csv("result.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});
// 3. Create our visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on the data.
function visualize(theData) {
  // PART 1: Essential Local Variables and Functions
  // =================================
  // curX and curY will determine what data gets represented in each axis.
  // We designate our defaults here, which carry the same names
  // as the headings in their matching .csv data file.
  var curX = "TwoPointersPercentage";
  var curY = "TwoPointersAttempted";
  // We also save empty variables for our the min and max values of x and y.
  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  // This function allows us to set up tooltip rules (see d3-tip.js).
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // x key
      var theX;
      // Grab the state name.
      var theTeam = "<div>" + d.Team + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "</div>";
      // If the x key is poverty
      if (curX === "TwoPointersAttempted") {
        // Grab the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "</div>";
      }
      else {
        // Otherwise
        // Grab the x key and a version of the value formatted to include commas after every third digit.
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theTeam + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);
  // PART 2: D.R.Y!
  // ==============
  // These functions remove some repitition from later code.
  // This will be more obvious in parts 3 and 4.
  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }
  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }
  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.
  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();
  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);
  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);
  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();
  // We append the axes in group elements. By calling them, we includ3
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");
  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();
  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", Radius)
    .attr("class", function(d) {
      return "TwoPointersAttemptedCircle " + d.Team;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });
  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.Team;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + Radius / 2.5;
    })
    .attr("font-size", Radius)
    .attr("class", "TeamText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.Team).style("stroke", "#0000FF");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.Team).style("stroke", "#e3e3e3");
    });
  // Part 4: Make the Graph Dynamic
  // ==========================
  // This section will allow the user to click on any label
  // and display the data it references.
  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // Make sure we save a selection of the clicked text,
    // so we can reference it without typing out the invoker each time.
    var self = d3.select(this);
    // We only want to run this on inactive labels.
    // It's a waste of the processor to execute the function
    // if the data is already displayed on the graph.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");
      // When x is the saved axis, execute this:
      if (axis === "x") {
        // Make curX the same as the data name.
        curX = name;
        // Change the min and max of the x-axis
        xMinMax();
        // Update the domain of x.
        xScale.domain([xMin, xMax]);
        // Now use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(300).call(xAxis);
        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });
        // We need change the location of the state texts, too.
        d3.selectAll(".TeamText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });
        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        // Make curY the same as the data name.
        curY = name;
        // Change the min and max of the y-axis.
        yMinMax();
        // Update the domain of y.
        yScale.domain([yMin, yMax]);
        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);
        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });
        // We need change the location of the state texts, too.
        d3.selectAll(".TeamText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + Radius / 3;
            })
            .duration(300);
        });
        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });
  // Part 5: Mobile Responsive
  // =========================
  // With d3, we can call a resize function whenever the window dimensions change.
  // This make's it possible to add true mobile-responsiveness to our charts.
  d3.select(window).on("resize", resize);
  // One caveat: we need to specify what specific parts of the chart need size and position changes.
  function resize() {
    // Redefine the width, height and leftTextY (the three variables dependent on the width of the window).
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;
    // Apply the width and height to the svg canvas.
    svg.attr("width", width).attr("height", height);
    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);
    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg.select(".yAxis").call(yAxis);
    // Update the ticks on each axis.
    tickCount();
    // Update the labels.
    xRefresh();
    yTextRefresh();
    // Update the radius of each dot.
    Get();
    // With the axis changed, let's update the location and radius of the state circles.
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return Radius;
      });
    // We need change the location and size of the state texts, too.
    d3
      .selectAll(".TeamText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + Radius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", Radius / 3);
    }
  }
  












