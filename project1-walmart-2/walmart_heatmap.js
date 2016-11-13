(function() {
	var margin = { top: 0, left: 30, right: 30, bottom: 30},
	height = 750 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right;

	var svg = d3.select("#heatmap")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xPositionScale = d3.scalePoint().range([10, width]).padding(1);
	var yPositionScale = d3.scalePoint().range([0, height-10]).padding(1);
	var colorScale = d3.scaleLinear().range(['#fffcf7', '#f7eda3', 'red'])
	// var colorScale = d3.scaleLinear().range(['#efefed', 'white', 'red'])

	d3.queue()
		// .defer(d3.csv, "conf_matrix_melt_10.6.csv")
		.defer(d3.csv, "conf_matrix_melt_10.25.csv", function(d) {
			d.Frequency = +d.Frequency
			return d
		})
		.await(ready);

	function ready(error, datapoints) {

		var maxfreq = d3.max(datapoints, function(d) {return d.Frequency});
		colorScale.domain([0,1,maxfreq])

		console.log(maxfreq)

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
			.on('mouseover', function(d) {
				 d3.select(this)
				 	d3.selectAll('#predicted-product')
				 		.transition(500)
				 		.text(d.Predicted_Product)
				 		.style('color', 'black')
				 	d3.selectAll('#popular-product')
				 		.transition(500)
				 		.text(d.Popular_Product)
				 		.style('color', 'black')
				 	d3.selectAll('#frequency')
				 		.transition(500)
				 		.text(d.Frequency)
				 		.style('color', 'black')
			})
			.on('mouseout', function(d) {
				d3.select(this)
				d3.selectAll('#predicted-product')
					// .transition(800)
					// .style('display', 'none')
					// .text('00')
					.style('color', 'white')
				d3.selectAll('#popular-product')
					// .transition(800)
					// .style('display', 'none')
					// .text('00')
					.style('color', 'white')
				d3.selectAll('#frequency')
					.style('color', 'white')
			})

		var xAxis = d3.axisBottom(xPositionScale)
		var xAxisHeight = height-15;
		var xLabelHeight = height+25;
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(8," + xAxisHeight + ")")
      .call(xAxis);

		svg.append('text')
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + width/2 + "," + xLabelHeight + ")")
			.text("Predicted Product");

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
			.attr("transform", "translate(30,8)")
      .call(yAxis);

		svg.append('text')
			.attr("text-anchor", "middle")
			.attr("transform", "translate(0," + height/2 + ")rotate(-90)")
			.text("Most Popular Product");
  }
})();
