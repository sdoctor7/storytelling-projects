(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 600 - margin.top - margin.bottom,
    width = 960 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])
    .scale([1000]);

  var path = d3.geoPath()
    .projection(projection);

  var x = d3.scaleLinear()
    .domain([1980, 2016])
    .range([0, (width-margin.right)])
    .clamp(true); //??????

  svg.append('defs').append('clipPath').attr('id', 'circle-clip').append('circle').attr('r', 6).attr('transform', 'translate(6,6)')

  demDef = svg.selectAll('defs').append("g").attr("id","dem")
  demDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'blue').attr('clip-path', 'url(#circle-clip)')
  demDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  demRepDef = svg.selectAll('defs').append("g").attr("id","dem-rep").attr('clip-path', 'url(#circle-clip)')
  demRepDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'blue')
  demRepDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'red').attr('transform', 'translate(6,0)')
  demRepDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  noneDef = svg.selectAll('defs').append("g").attr("id","none")
  noneDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'white').attr('clip-path', 'url(#circle-clip)')
  noneDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  noneDemDef = svg.selectAll('defs').append("g").attr("id","none-dem").attr('clip-path', 'url(#circle-clip)')
  noneDemDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'white')
  noneDemDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'blue')
  noneDemDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  repDef = svg.selectAll('defs').append("g").attr("id","rep")
  repDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'red').attr('clip-path', 'url(#circle-clip)')
  repDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  unkDef = svg.selectAll('defs').append("g").attr("id","unk")
  unkDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'gray').attr('clip-path', 'url(#circle-clip)')
  unkDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  unkDemDef = svg.selectAll('defs').append("g").attr("id","unk-dem").attr('clip-path', 'url(#circle-clip)')
  unkDemDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'gray')
  unkDemDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'blue')
  unkDemDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  unkNoneDef = svg.selectAll('defs').append("g").attr("id","unk-none").attr('clip-path', 'url(#circle-clip)')
  unkNoneDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'gray')
  unkNoneDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'white')
  unkNoneDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  unkRepDef = svg.selectAll('defs').append("g").attr("id","unk-rep").attr('clip-path', 'url(#circle-clip)')
  unkRepDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'gray')
  unkRepDef.append('rect').attr('width', 6).attr('height', 12).attr('fill', 'red')
  unkRepDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  othDef = svg.selectAll('defs').append("g").attr("id","oth")
  othDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'yellow').attr('clip-path', 'url(#circle-clip)')
  othDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  demOthDef = svg.selectAll('defs').append("g").attr("id","dem-oth").attr('clip-path', 'url(#circle-clip)')
  demOthDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'blue')
  demOthDef.append('rect').attr('width', 12).attr('height', 12).attr('fill', 'yellow')
  demOthDef.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('transform', 'translate(6,6)')

  var fillScale = d3.scaleOrdinal()
    .domain(['Democrat', 'Democrat/Republican', 'None', 'None/Democrat', 'Republican', 'Unknown', 'Unknown/Democrat', 'Unknown/None', 'Unknown/Republican', 'Other', 'Democrat/Other'])
    .range(['#dem', '#dem-rep', '#none', '#none-dem', '#rep', '#unk', '#unk-dem', '#unk-none', '#unk-rep', '#oth', '#dem-oth'])
    
  d3.json('us-states.json', function(json) {
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "gray")
      .style("stroke-width", '1px')
      .style('fill', 'white')
  })

  d3.queue()
    .defer(d3.csv, "endorsements.csv", function (d) {
      d.Latitude = +d.Latitude
      d.Longitude = +d.Longitude
      return d
    })
    .await(ready)

  function ready(error, datapoints) {

    svg.selectAll('use')
      .data(datapoints)
      .enter().append('use')
      .attr('xlink:href', function(d) {return fillScale(d.Party)})
      .attr("x", function(d) {return projection([d.Longitude, d.Latitude])[0]})
      .attr("y", function(d) {return projection([d.Longitude, d.Latitude])[1];})
      .attr('transform', 'translate(-6,-6)')

    // svg.selectAll('circle').data(datapoints).enter().append('circle')
    //   .attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px').attr('r', 6)
    //   .attr("cx", function(d) {return projection([d.Longitude, d.Latitude])[0];})
    //   .attr("cy", function(d) {return projection([d.Longitude, d.Latitude])[1];})

    var mySlider = $("#slider").slider({
      ticks: [1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016],
      ticks_labels: ["1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"],
      ticks_snap_bounds: 4
    });

    // var value = mySlider.slider('getValue');

    // d3.select('#slider').on('input', function() {update(+this.value)})

    // $('#slider').slider()
      mySlider.on('slide', function(d){
        var value = mySlider.slider('getValue');
        svg.selectAll("use")
          // .transition(250) 
          .attr('opacity', function(d) {
            if (+d.year == +value) {return 1}
            else {return 0}
          })
      });

    // function update(year) {
    //   d3.select("#slider-value").text(year);
    //   d3.select("#slider").property("value", year);
    //   svg.selectAll("use")
    //     .transition(250) 
    //     .attr('opacity', function(d) {
    //     if (+d.year == +d3.select('#slider').property('value')) {return 1}
    //     else {return 0}
    //     })
    // }


  }

})();
