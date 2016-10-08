(function() {
	var margin = { top: 30, left: 30, right: 30, bottom: 30},
	height = 800 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right;

	var svg = d3.select("#heatmap")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xPositionScale = d3.scalePoint().range([0, width]).padding(1);
	var yPositionScale = d3.scalePoint().range([height, 0]).padding(1);

	var colorScale = d3.scaleLinear().range(['#fffcf7', 'red'])


	d3.queue()
		.defer(d3.csv, "conf_matrix_melt_10.6.csv")
		.await(ready);

	function ready(error, datapoints) {

		var maxfreq = d3.max(datapoints, function(d) {return d.Frequency});
		colorScale.domain([0,maxfreq])

		var xUnique = d3.map(datapoints, function(d) {return d.Predicted_Product}).keys();
		xPositionScale.domain(xUnique)

		var yUnique = d3.map(datapoints, function(d) {return d.Popular_Product}).keys();
		yPositionScale.domain(yUnique)

		svg.selectAll("rect")
			.data(datapoints)
			.enter().append("rect")
			.attr("x", function(d) {return xPositionScale(d.Predicted_Product)})
			.attr("y", function(d) {return yPositionScale(d.Popular_Product)})
			.attr("width", 16)
			.attr("height", 16)
			.attr("fill", function(d) {
				return colorScale(d.Frequency)
			})
			.attr("stroke", "black")
			.attr("stroke-width", function(d) {
				if (d.Predicted_Product == d.Popular_Product) {
					return "1.5px"
				}
				else {return "0.5px"}
			})

		// svg.selectAll("text")
		// 	.data(datapoints)
		// 	.enter().append("text")
		// 	.text(function(d) {return d.Country})
		// 	.attr("x", function(d) {return xPositionScale(d.Year)})
		// 	.attr("y", function(d) {return yPositionScale(d.Value)})
		// 	.attr("dx", 8)
		// 	.attr("dy", 5)
		// 	.attr("fill", function(d) {
		// 		if (d.Year == 2014 && d.Country == "Norway") {return("blue")}
		// 		else {return "none"}
		// 	})
		// 	.attr("font-size", "12px")

		// Add your axes
		var xAxis = d3.axisBottom(xPositionScale)
		var xAxisHeight = height-5;
		var xLabelHeight = xAxisHeight-5;
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(8," + xAxisHeight + ")")
      .call(xAxis);

		svg.append('g')
			.attr("class", "label")
			.attr("text-anchor", "middle")
			.attr('x', 10)
			.attr('y', xLabelHeight)
			.text("Predicted Product");

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
			.attr("transform", "translate(20,8)")
      .call(yAxis);

		svg.append('g')
			.attr("class", "label")
			.attr("text-anchor", "middle")
			.attr('x', 10)
			.attr('y', 10)
			.attr("transform", "rotate(-90)")
			.text("Most Popular Product");
  }
})();
