// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(IncomeData) {


    IncomeData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

   //create scales
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(IncomeData, d => d.poverty)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(IncomeData, d => d.healthcare)])
      .range([chartHeight, 0]);

    //create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //create scatter
    var circlesGroup = chartGroup.selectAll("circle")
    .data(IncomeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".9")
    //.attr("text", d => `${d.abbr}`);

   // create tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .html(function(d) {
        return (`${d.state}<br>% Lacking Healthcare: ${d.healthcare}<br>Poverty Rate: ${d.poverty}<br>Avg Age: ${d.age}Avg Income: ${d.income}`);
      });

   //call tooltip
    chartGroup.call(toolTip);

    //event listener for hovertext
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    //create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Lacking Healthcare");

    // chartGroup.append("text")
    // .data(IncomeData)
    // .enter()
    // .append("text")
    // .text(function(d) {
    //     return d.abbr;
    // })

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate");
  }).catch(function(error) {
    console.log(error);
  });
