

var svgWidth = 960;
var svgHeight = 620;


var margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//  adding  div for scatter plot
var chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

// adding svg to chart on html 
var svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);


var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//  default  axis to show
var chosenXAxis = 'ThreePointersPercentage';
var chosenYAxis = 'Wins';


// updates max and min for x and y axis, value by .08 and 1.2
function xScale(ballData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(ballData, d => d[chosenXAxis]) * 0.8,
        d3.max(ballData, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}

function yScale(ballData, chosenYAxis) {

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(ballData, d => d[chosenYAxis]) * 0.8,
      d3.max(ballData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
// updates scales transition speed
function showXaxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

function showYaxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

// updates circles  and text 
function createcircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr('cx', data => newXScale(data[chosenXAxis]))
      .attr('cy', data => newYScale(data[chosenYAxis]))

    return circlesGroup;
}


function showtext(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}
// tooltip text 
function styleX(value, chosenXAxis) {

    if (chosenXAxis === 'ThreePointersPercentage') {
        return `${value}%`;
    }

    else if (chosenXAxis === 'TwoPointersPercentage') {
        return `${value}%`;
    }
    else {
      return `${value}%`;
    }
}

// update
function tooltipUpdata(chosenXAxis, chosenYAxis, circlesGroup) {


    if (chosenXAxis === 'ThreePointersPercentage') {
      var xLabel = 'Three point:';
    }

    else if (chosenXAxis === 'TwoPointersPercentage'){
      var xLabel = 'Two pointer:';
    }

    else {
      var xLabel = 'Free Throws:';
    }

  if (chosenYAxis ==='Wins') {
    var yLabel = "Wins:"
  }
  else if(chosenYAxis === 'Possessions') {
    var yLabel = 'possesions:';
  }

  else{
    var yLabel = 'Losses:';
  }

// popup text position
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return (`${d.Name}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}

// pulling data and mapping final\basketball-website\front_end\assets\data\result.csv
d3.csv('./data/result.csv').then(function(ballData) {

    console.log(ballData);
    
// parse data to intergers
    ballData.forEach(function(data){
        data.Possessions = +data.Possessions;
        data.TwoPointersPercentage = +data.TwoPointersPercentage;
        data.Losses = +data.Losses;
        data.FreeThrowsPercentage = +data.FreeThrowsPercentage;
        data.Wins = +data.Wins;
        data.ThreePointersPercentage = +data.ThreePointersPercentage;
    });

// create scale 
    var xLinearScale = xScale(ballData, chosenXAxis);
    var yLinearScale = yScale(ballData, chosenYAxis);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// displaying x and y axis on html
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

// 
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)

      .call(leftAxis);
    
//  adding cirles to html 
    var circlesGroup = chartGroup.selectAll('circle')
      .data(ballData)
      .enter()
      .append('circle')
      .classed('teamcircle', true)
      .attr('cx', d => xLinearScale(d[chosenXAxis]))
      .attr('cy', d => yLinearScale(d[chosenYAxis]))
      .attr('r', 18)
      .attr('opacity', '.5');

// adds text in circles 
    var textGroup = chartGroup.selectAll('.teamtext')
      .data(ballData)
      .enter()
      .append('text')
      .classed('teamtext', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.Team});


    var xLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    // adds data point labels for user on html page
    var threepointLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'ThreePointersPercentage')
      .text('Three point Percent');
      
    var freethrowsLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'FreeThrowsPercentage')
      .text('Free Throws Percent');  

    var twopointerLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'TwoPointersPercentage')
      .text('Two Pointer Percentage')

    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var winsLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'Wins')
      .text('Number of Wins');
    
    var lossesLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'Losses')
      .text('Number of Losses');
    
    var possessionLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'Possessions')
      .text('Possession');
    
// updates tooltip
    var circlesGroup = tooltipUpdata(chosenXAxis, chosenYAxis, circlesGroup);

// x axis click lisener
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != chosenXAxis) {


          chosenXAxis = value; 

          // updates on on click
          xLinearScale = xScale(ballData, chosenXAxis);

          xAxis = showXaxis(xLinearScale, xAxis);

          circlesGroup = createcircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          textGroup = showtext(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


          circlesGroup = tooltipUpdata(chosenXAxis, chosenYAxis, circlesGroup);

          if (chosenXAxis === 'ThreePointersPercentage') {
            threepointLabel.classed('active', true).classed('inactive', false);
            freethrowsLabel.classed('active', false).classed('inactive', true);
            twopointerLabel.classed('active', false).classed('inactive', true);
          }
          else if (chosenXAxis === 'FreeThrowsPercentage') {
            threepointLabel.classed('active', false).classed('inactive', true);
            freethrowsLabel.classed('active', true).classed('inactive', false);
            twopointerLabel.classed('active', false).classed('inactive', true);
          }
          else {
            threepointLabel.classed('active', false).classed('inactive', true);
            freethrowsLabel.classed('active', false).classed('inactive', true);
            twopointerLabel.classed('active', true).classed('inactive', false);
          }
        }
      });

      // y axis click lisener 
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=chosenYAxis) {

            chosenYAxis = value;

            // updates on click
            yLinearScale = yScale(ballData, chosenYAxis);
            yAxis = showYaxis(yLinearScale, yAxis);
            circlesGroup = createcircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            textGroup = showtext(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            circlesGroup = tooltipUpdata(chosenXAxis, chosenYAxis, circlesGroup);

            if (chosenYAxis === 'Possessions') {
              possessionLabel.classed('active', true).classed('inactive', false);
              lossesLabel.classed('active', false).classed('inactive', true);
              winsLabel.classed('active', false).classed('inactive', true);
            }
            else if (chosenYAxis === 'Losses') {
              possessionLabel.classed('active', false).classed('inactive', true);
              lossesLabel.classed('active', true).classed('inactive', false);
              winsLabel.classed('active', false).classed('inactive', true);
            }
            else {
              possessionLabel.classed('active', false).classed('inactive', true);
              lossesLabel.classed('active', false).classed('inactive', true);
              winsLabel.classed('active', true).classed('inactive', false);
            }
          }
        });
});
