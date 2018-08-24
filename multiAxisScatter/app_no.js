var svgWidth = 1000;
var svgHeight = 500;
var padding = {left:20, right:20};
var axis_length = svgWidth - padding.left - padding.right;


var margin = {
  top: 20,
  right: 40,
  bottom: 220,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "variety";
var chosenYAxis = "points";
var radius = "price"


// function used for updating x-scale var upon click on axis label
function xScale(wineData, chosenXAxis) {
  // create scales
  var xRange = d3.scalePoint()
  .domain(wineData.map(function(d) {
      return d[chosenXAxis]; }))
  .rangeRound([0, axis_length])
  .padding(40)
  .align(0.1);

return xRange;

}
function renderXAxes(newXScale, xAxis,  chosenXAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
  .duration(1000)
  .call(bottomAxis);

  return xAxis;
}

function yScale(wineData, chosenYAxis) {
   // Create y scale function
   var yLinearScale = d3.scaleLinear()
   .domain([d3.min(wineData, d => d[chosenYAxis]) -5, d3.max(wineData, d => d[chosenYAxis])])
   .range([height, 0])
   .nice();

return yLinearScale;

}




function renderYAxes(newYScale, yAxis,  chosenYAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  if (chosenYAxis === "price") {
   yAxis
  .transition()
  .duration(1000)
  .call(leftAxis)
  .tickformat("$" + function(d) {return d[chosenYAxis]});
  }
  else {
    yAxis
    .transition()
    .duration(1000)
    .call(leftAxis)

  }
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
// function renderCircles(circlesGroup, newXScale, newYScale, chosenYAxis, chosenXAxis, newRadius) {
function renderCircles(circlesGroup, newXScale, newYScale, chosenYAxis, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]))
    // .attr("r", d => newRadius(d[radius])/100);
  // console.log(radius)
  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "variety") {
    var xlabel = "Wine Varietal:";
  }
  else {
    var xlabel = "Wine Region:";
  }

  if (chosenYAxis === "points") {
    var ylabel = "Points Awarded:";
    var rlabel = "Price:"
   
  }
  else {
    var ylabel = "Price:";
    var rlabel = "Points Awarded:"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([120, -60])
    .html(function(d) {
      return (`<p>${d.title}<br>${xlabel} ${d[chosenXAxis]} <br> ${ylabel} ${d[chosenYAxis]} <br>${rlabel} $${d[radius]} </p>`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", toolTip.show)
    // onmouseout event
    .on("mouseout", toolTip.hide);

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
var file = "wine_clean.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}

function successHandle(wineData) {
  var variety = wineData.map(data => data.variety);
  var region_1 = wineData.map(data => data.region_1);
  // parse data
  winedata.sort((first, second) => second - first);
  wineData = wineData.slice(0,500)
  wineData.forEach(function(data) {
    // data.variety = +data.variety;
    data.points = +data.points;
    data.price = +data.price;
  });

  // console.log(chosenYAxis);

  // xPointScale function above csv import
  var xPointScale = xScale(wineData, chosenXAxis);
  var yLinearScale = yScale(wineData, chosenYAxis);

 

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xPointScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Axis = formatXAxis(wineData, chosenXAxis);
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)
    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
   

  // append y axis
  var yAxis = chartGroup.append("g")
    // .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(wineData)
    .enter()
    .append("circle")
    .attr("cx", d => xPointScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", d => yLinearScale(d[radius])/100)
    .attr("fill", "maroon")
    .attr("opacity", ".5");


  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
  var varietyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 150)
    .attr("value", "variety") // value to grab for event listener
    .classed("active", true)
    .text("Wine Varietals (Top 500)");

  var regionLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 170)
    .attr("value", "region_1") // value to grab for event listener
    .classed("inactive", true)
    .text("Wine Region (Top 500)");

   // Create group for  2 x- axis labels
var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");
   
 var pointsLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left +10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "points") // value to grab for event listener
    .classed("active", true)
    .text("Points Awarded");

 var priceLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "price") // value to grab for event listener
    .classed("inactive", true)
    .text("Price");

  // // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Points Awarded");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;

        // functions here found above csv import
        // updates x scale for new data
        xPointScale = xScale(wineData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xPointScale, xAxis);
        xAxis    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");


        // updates circles with new x values
        // circlesGroup = renderCircles(circlesGroup, xPointScale, yLinearScale, chosenYAxis, chosenXAxis, radius);
        circlesGroup = renderCircles(circlesGroup, xPointScale, yLinearScale, chosenYAxis, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "region_1") {
          regionLabel
            .classed("active", true)
            .classed("inactive", false);
          varietyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          regionLabel
            .classed("active", false)
            .classed("inactive", true);
          varietyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      if (yvalue !== chosenYAxis) {
          
        // replaces chosenYAxis with value
        chosenYAxis = yvalue;
         console.log(yvalue);
        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(wineData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xPointScale, yLinearScale, chosenYAxis, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "price") {
          priceLabel
            .classed("active", true)
            .classed("inactive", false);
          //  radius = "points";
          pointsLabel
            .classed("active", false)
            .classed("inactive", true);
            // radius = "price";
        }
        else {
          priceLabel
            .classed("active", false)
            .classed("inactive", true);
            // radius = "points";
          pointsLabel
            .classed("active", true)
            .classed("inactive", false);
            // radius = "price";
        }
      }
    });
}
