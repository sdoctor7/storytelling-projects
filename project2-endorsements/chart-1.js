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

  var radiusScale = d3.scaleSqrt().range([3,20])

  var defs = svg.append('defs')

  var fillScale = d3.scaleOrdinal()
    .domain(['Democrat', 'Democrat/Republican', 'None', 'None/Democrat', 'Republican', 'Unknown', 'Unknown/Democrat', 'Unknown/None', 'Unknown/Republican', 'Other', 'Democrat/Other'])
    .range(['dem', 'dem-rep', 'none', 'none-dem', 'rep', 'unk', 'unk-dem', 'unk-none', 'unk-rep', 'oth', 'dem-oth'])
    
  d3.json('us-states.json', function(json) {
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "gray")
      .style("stroke-width", '1px')
      .style('fill', 'none')
  })

  d3.queue()
    .defer(d3.csv, "endorsements.csv", function (d) {
      d.Latitude = +d.Latitude
      d.Longitude = +d.Longitude
      d.Circulation = d.Circulation.replace (/,/g, "")
      d.Circulation = +d.Circulation
      return d
    })
    .await(ready)

  function ready(error, datapoints) {

    radiusScale.domain([0,d3.max(datapoints, function(d) {return d.Circulation})])

    var sorted = datapoints.sort(function(a, b) { 
      return b.Circulation - a.Circulation; 
    });

    defs.append('pattern').attr('id', 'dem')
      .attr('height', '100%').attr('width', '100%')
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('rect').attr('width', 12).attr('height', 12).attr('fill', 'blue')
      .attr('preserveAspectRatio', 'none')

    var demrep = defs.append('linearGradient').attr('id', 'dem-rep')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    demrep.append('stop').attr('offset', '0%').attr('stop-color', 'blue').attr('stop-opacity', 1)
    demrep.append('stop').attr('offset', '50%').attr('stop-color', 'blue').attr('stop-opacity', 1)
    demrep.append('stop').attr('offset', '50%').attr('stop-color', 'red').attr('stop-opacity', 1)
    demrep.append('stop').attr('offset', '100%').attr('stop-color', 'red').attr('stop-opacity', 1)

    defs.append('pattern').attr('id', 'none')
      .attr('height', '100%').attr('width', '100%')
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('rect').attr('width', 12).attr('height', 12).attr('fill', 'white')

    var nonedem = defs.append('linearGradient').attr('id', 'none-dem')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    nonedem.append('stop').attr('offset', '0%').attr('stop-color', 'white').attr('stop-opacity', 1)
    nonedem.append('stop').attr('offset', '50%').attr('stop-color', 'white').attr('stop-opacity', 1)
    nonedem.append('stop').attr('offset', '50%').attr('stop-color', 'blue').attr('stop-opacity', 1)
    nonedem.append('stop').attr('offset', '100%').attr('stop-color', 'blue').attr('stop-opacity', 1)

    defs.append('pattern').attr('id', 'rep')
      .attr('height', '100%').attr('width', '100%')
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('rect').attr('width', 12).attr('height', 12).attr('fill', 'red')

    defs.append('pattern').attr('id', 'unk')
      .attr('height', '100%').attr('width', '100%')
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('rect').attr('width', 12).attr('height', 12).attr('fill', 'gray')

    var unkdem = defs.append('linearGradient').attr('id', 'unk-dem')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    unkdem.append('stop').attr('offset', '0%').attr('stop-color', 'gray').attr('stop-opacity', 1)
    unkdem.append('stop').attr('offset', '50%').attr('stop-color', 'gray').attr('stop-opacity', 1)
    unkdem.append('stop').attr('offset', '50%').attr('stop-color', 'blue').attr('stop-opacity', 1)
    unkdem.append('stop').attr('offset', '100%').attr('stop-color', 'blue').attr('stop-opacity', 1)

    var unknone = defs.append('linearGradient').attr('id', 'unk-none')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    unknone.append('stop').attr('offset', '0%').attr('stop-color', 'gray').attr('stop-opacity', 1)
    unknone.append('stop').attr('offset', '50%').attr('stop-color', 'gray').attr('stop-opacity', 1)
    unknone.append('stop').attr('offset', '50%').attr('stop-color', 'white').attr('stop-opacity', 1)
    unknone.append('stop').attr('offset', '100%').attr('stop-color', 'white').attr('stop-opacity', 1)

    var unkrep = defs.append('linearGradient').attr('id', 'unk-rep')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    unkrep.append('stop').attr('offset', '0%').attr('stop-color', 'gray').attr('stop-opacity', 1)
    unkrep.append('stop').attr('offset', '50%').attr('stop-color', 'gray').attr('stop-opacity', 1)
    unkrep.append('stop').attr('offset', '50%').attr('stop-color', 'red').attr('stop-opacity', 1)
    unkrep.append('stop').attr('offset', '100%').attr('stop-color', 'red').attr('stop-opacity', 1)

    defs.append('pattern').attr('id', 'oth')
      .attr('height', '100%').attr('width', '100%')
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('rect').attr('width', 6).attr('height', 12).attr('fill', 'yellow')

    var demoth = defs.append('linearGradient').attr('id', 'dem-oth')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
    demoth.append('stop').attr('offset', '0%').attr('stop-color', 'blue').attr('stop-opacity', 1)
    demoth.append('stop').attr('offset', '50%').attr('stop-color', 'blue').attr('stop-opacity', 1)
    demoth.append('stop').attr('offset', '50%').attr('stop-color', 'yellow').attr('stop-opacity', 1)
    demoth.append('stop').attr('offset', '100%').attr('stop-color', 'yellow').attr('stop-opacity', 1)

    svg.selectAll('.endorsement-circle')
      .data(sorted)
      .enter().append('circle')
      .attr('class', 'endorsement-circle')
      .attr('r', function(d) {
        return radiusScale(d.Circulation)
      })
      .attr('fill', function(d) {
        return 'url(#' + fillScale(d.Party) + ')'
      })
      .attr('cx', function(d) {return projection([d.Longitude, d.Latitude])[0]})
      .attr('cy', function(d) {return projection([d.Longitude, d.Latitude])[1]})
      .attr('stroke', 'black')
      .attr('stroke-width', '0.5px')
      .attr('opacity', function(d) {
        if (+d.year == 1980) {return 1}
        else {return 0}
      })

    var mySlider = $("#slider").slider({
      ticks: [1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016],
      ticks_labels: ["1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"],
      ticks_snap_bounds: 4
    });

    mySlider.on('slide', function(d){
      var value = mySlider.slider('getValue');
      svg.selectAll(".endorsement-circle")
        .attr('opacity', function(d) {
          if (+d.year == +value) {return 1}
          else {return 0}
        })
    });

  }

})();
