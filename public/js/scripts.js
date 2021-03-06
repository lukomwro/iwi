(function(w, d) {

    var GraphSettings = {
        charge: 300,
        linkDistance: -120,
        width: 0,
        height: 0,
        generateGraph: null
    };

    /**
     * Setting up auto complete
     */
    $("#form-search-input").autocomplete(
        //"http://wikiwizir.yum.pl/ajax/list/", {
        "/ajax/list/", {
            delay:10,
            minChars:2,
            matchSubset:1,
            matchContains:1,
            formatItem: function(row) { return row[0]; },
            mustMatch: true,
            autoFill:true,
            width: 230,
            max: 50
        }
    ).result(function(event, data) {
        $('#form-search-id').val(data[1]);
    });

    /**
     * Window events
     */
    $(w).bind('hashchange', function() {
        GraphSettings.generateGraph(window.location.hash.substr(1));

    });
    $(w).resize(function(){
        GraphSettings.width = $("#chart").width();
        GraphSettings.height = $("#chart").height();
    }).resize();

    /**
     * Settings
     */
    $('#settings').modal({
        backdrop: true,
        modal: true
    });

    $("#settings-btn").click(function() {
        $('#settings').modal("show");
        return false;
    });
    $("#settings-form").submit(function() {
        $('#settings').modal("hide");
        return false;
    });

    $("#charge").change(function() {
        GraphSettings.charge = $(this).val();
    }).change();

    $("#link-distance").change(function() {
        GraphSettings.linkDistance = $(this).val();
    }).change();

    /**
     * Help
     */
    $('#help-btn').click(function() {
       $('#help').fadeIn(300, function() {
           $('#help .popover').fadeIn(500);
       });
       return false;
    });

    $('#help').click(function() {
        $('#help').fadeOut(500, function() {
            $('#help .popover').hide();
        });
        return false;
    });

    /**
     * Wiki browser
     */
    $('#wiki-browser').modal({
        backdrop: true,
        modal: true
    });

    /**
     * Submit event
     */
    $('#form-search').submit(function(event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('#form-search-id').val().length == 0) {
            return;
        }
        GraphSettings.generateGraph($('#form-search-id').val());
    });

    (function() {
        var vis = d3.select("#chart").append("svg:svg"),
            fill = d3.scale.category20();

        GraphSettings.generateGraph = function(id) {
            if (!id.length) {
                return;
            }
            var force, link, node;
            w.location.hash = id;
            $('#loader').fadeIn(100);
            //d3.json('json.html?'+id, function(json) {
            d3.json('/ajax/nodes/'+id, function(json) {
                vis.selectAll('*').remove();
                force = d3.layout.force()
                    .charge(GraphSettings.charge)
                    .linkDistance(GraphSettings.linkDistance)
                    .nodes(json.nodes)
                    .links(json.links)
                    .size([GraphSettings.width, GraphSettings.height])
                    .start();

                link = vis.selectAll("line.link")
                    .data(json.links)
                    .enter()
                    .append("svg:line")
                    .attr("class", function(d) { return "link n-" + d.source.nodeid + " n-" + d.target.nodeid;})
                    .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                $('#form-search-input').val(json.nodes[0].name);
                $('#form-search-id').val(json.nodes[0].nodeid);
                $('#element-name').text(json.nodes[0].name);
                $('#element-children').children().each(function() {
                    this.parentNode.removeChild(this);
                });
                $(json.nodes).each(function(key, data) {
                    if (0 == key) {
                        return;
                    }
                    $('#element-children').append('<li><a class="nodeLink" data-id="'+data.nodeid+'" href="#' + data.nodeid + '">'+data.name+'</a><a class="wiki" href="//en.wikipedia.org/wiki/'+data.name+'">wiki</a></li>');
                });

                node = vis.selectAll("circle.node")
                    .data(json.nodes)
                    .enter().append("svg:circle")
                    .attr("class", "node")
                    .attr("id", function(d) { return "n-" + d.nodeid; })
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .attr("nid", function(d) { return d.nodeid; })
                    .attr("r", 5)
                    .style("fill", function(d) { return fill(d.group); })
                    .on("click", function(d) {
                        GraphSettings.generateGraph(d.nodeid);
                    })
                    .on('mouseover', function(d) {
                        $("#chart").addClass("node-hover");
                        vis.selectAll('line.n-'+d.nodeid).classed('hover', true);
                        $('a[data-id='+d.nodeid+']').addClass('mark');
                        $(this).attr('class', 'node selected');
                    })
                    .on('mouseout', function(d) {
                        $("#chart").removeClass("node-hover");
                        vis.selectAll('line.n-'+d.nodeid).classed('hover', false);
                        $('a[data-id='+d.nodeid+']').removeClass('mark');
                        $(this).attr('class', 'node');
                    });

                node.append('svg:title')
                    .text(function(d) { return d.name; });

                force.on("tick", function(alpha) {
                    if (alpha.alpha <= 0.0065) {
                        link.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });
                        node.attr("cx", function(d) { return d.x; })
                            .attr("cy", function(d) { return d.y; });
                        force.stop();
                        $('#loader').fadeOut(500);
                    }
                });

                $('#element-children li').mouseover(function() {
                    $('#n-'+$(this).find('.nodeLink').data('id')).attr('class', 'node selected');
                    vis.selectAll('line.n-'+$(this).find('.nodeLink').data('id')).classed('hover', true);
                });

                $('#element-children li').mouseout(function() {
                    $('#n-'+$(this).find('.nodeLink').data('id')).attr('class', 'node');
                    vis.selectAll('line.n-'+$(this).find('.nodeLink').data('id')).classed('hover', false);
                });

                $('#element-children a.wiki').click(function() {
                    $('#wiki-browser').find('h3 a')
                        .text($(this).prev().text())
                        .attr('href', $(this).attr("href"));
                    $('#wiki-browser').find('iframe').attr("src", $(this).attr("href"));
                    $('#wiki-browser').modal("show");
                    return false;
                });
            });
        };
    }());


    $(d).ready(function(){
        var hash = w.location.hash.substr(1);
        GraphSettings.generateGraph(hash);


        if ($.cookie('first') != '1') {
            $('#help-btn').click();
            $.cookie('first', '1', { expires: 60 });
        }

    });
}(window, document));
