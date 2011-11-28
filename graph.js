var w = 960,
    h = 500,
    fill = d3.scale.category20();

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);
var svg = vis[0][0];
(function(d){
    var nodes = d.getElementsByClassName('nodes'),
        nodesLn = nodes.length, i;
    for (i=0; i<nodesLn; i++) {
        nodes[i].addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log(svg);
            while (svg.lastChild) {
                svg.removeChild(svg.lastChild);
            }
            d3.json(event.target.getAttribute('src'), function(json) {
                var force = d3.layout.force()
                    .charge(-120)
                    .linkDistance(30)
                    .nodes(json.nodes)
                    .links(json.links)
                    .size([w, h])
                    .start();

                var link = vis.selectAll("line.link")
                    .data(json.links)
                    .enter().append("svg:line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                var node = vis.selectAll("circle.node")
                    .data(json.nodes)
                    .enter().append("svg:circle")
                    .attr("class", "node")
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .attr("r", 5)
                    .style("fill", function(d) { return fill(d.group); })
                    .call(force.drag);

                node.append("svg:title")
                    .text(function(d) { return d.name; });

                force.on("tick", function() {
                    link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                });
            });
        });
    }
}(document));
