(function() {
    /**
     * Autouzupełnianie
     */
    function findValue(li) {
        if( li == null ) return alert("No match!");
        // if coming from an AJAX call, let's use the CityId as the value
        if( !!li.extra ) var sValue = li.extra[0];
        // otherwise, let's just display the value in the text box
        else var sValue = li.selectValue;
        //alert("The value you selected was: " + sValue);
    }

    function selectItem(li) {
        findValue(li);
    }

    function formatItem(row) {
        return row[0] + " (id: " + row[1] + ")";
    }

    function lookupAjax(){
        var oSuggest = $("#CityAjax")[0].autocompleter;
        oSuggest.findValue();
        return false;
    }

    function lookupLocal(){
        var oSuggest = $("#CityLocal")[0].autocompleter;
        oSuggest.findValue();
        return false;
    }
  
    $("#form-search-input").autocomplete(
        "/ajax/list/", {
        //"http://wikiwizir.yum.pl/ajax/list/", {
            delay:10,
            minChars:2,
            matchSubset:1,
            matchContains:1,
            onItemSelect:selectItem,
            onFindValue:findValue,
            formatItem:formatItem,
            mustMatch: true,
            autoFill:true,
            width: 230,
            max: 50
        }
    ).result(function(event, data) {
        $('#form-search-id').val(data[1]);
    });

    // Obłsuga cofnij - przegladarka
    $(window).bind('hashchange', function() {
        generateGraph(window.location.hash.substr(1));
    });

    /**
     * Wysyłanie formularza z wybranym nodem
     */
    var w,
        h,
        charge,
        linkDistance,
        fill = d3.scale.category20();
    var vis = d3.select("#chart")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);
    var svg = vis[0][0];
    var generateGraph = function(id) {
        if (id.length == 0) {
            $("#element-name").text("O programie");
            $("#instructions").show();
            return
        }
        $("#instructions").hide();
        $('#loader').show();
        window.location.hash = id;
        d3.json('/ajax/nodes/' + id, function(json) {
        //d3.json('json.html?' + id, function(json) {
            vis.selectAll('*').remove();
            var force = d3.layout.force()
                .charge(charge)
                .linkDistance(linkDistance)
                .nodes(json.nodes)
                .links(json.links)
                .size([w, h])
                .start();

            var link = vis.selectAll("line.link")
                .data(json.links)
                .enter()
                .append("svg:line")
                .attr("class", function(d) { return "link n-" + d.source.nodeid + " n-" + d.target.nodeid;})
                .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            // uzupelnianie wszyskich inputow i listy
            $('#form-search-input').val(json.nodes[0].name);
            $('#form-search-id').val(json.nodes[0].nodeid);
            $('#element-name').text(json.nodes[0].name);
            $('#element-children').children().each(function(key, data) {
                this.parentNode.removeChild(this);
            });
            $(json.nodes).each(function(key, data) {
                if (0 == key) {
                    return;
                }
                $('#element-children').append('<li><a class="nodeLink" data-id="'+data.nodeid+'" href="#' + data.nodeid + '">'+data.name+'</a><a class="wiki" href="//en.wikipedia.org/wiki/'+data.name+'">wiki &raquo;</a></li>');
            });

            var node = vis.selectAll("circle.node")
                .data(json.nodes)
                .enter().append("svg:circle")
                .attr("class", "node")
                .attr("id", function(d) { return "n-" + d.nodeid; })
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("nid", function(d) { return d.nodeid; })
                .attr("r", 5)
                .style("fill", function(d) { return fill(d.group); });

            node.append("svg:title")
                .text(function(d) { return d.name; });

            var i = 0;
            force.on("tick", function(alpha) {
                if (alpha.alpha < 0.008) {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });
                    node.attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                    force.stop();
                    $('#loader').hide();
                }
            });
            $('circle.node').click(function(event) {
                force.stop();
                generateGraph($(this).attr('nid'));
            });
            $('circle.node').mouseover(function() {
                $("#chart").addClass("node-hover");
                vis.selectAll('line.n-'+$(this).attr('nid')).classed('hover', true);
                $('a[data-id='+$(this).attr('nid')+']').addClass('mark');
                $(this).attr('class', 'node selected');
            });
            $('circle.node').mouseout(function() {
                $("#chart").removeClass("node-hover");
                vis.selectAll('line.n-'+$(this).attr('nid')).classed('hover', false);
                $('a[data-id='+$(this).attr('nid')+']').removeClass('mark');
                $(this).attr('class', 'node');
            });

            $('#element-children a.nodeLink').mouseover(function() {
                $('#n-'+$(this).data('id')).attr('class', 'node selected');
                vis.selectAll('line.n-'+$(this).data('id')).classed('hover', true);
            });
            $('#element-children a.nodeLink').mouseout(function() {
                $('#n-'+$(this).data('id')).attr('class', 'node');
                vis.selectAll('line.n-'+$(this).data('id')).classed('hover', false);
            });
        });
    };
    $('#form-search').submit(function(event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('#form-search-id').val().length == 0) {
            return;
        }
        generateGraph($('#form-search-id').val());
    });

    $(window).resize(function(){
        w = $("#chart").width();
        h = $("#chart").height();
    }).resize();



    $('#settings').modal({
        backdrop: true,
        closeOnEscape: true,
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
        charge = $(this).val();
    }).change();
    
    $("#link-distance").change(function() {
        linkDistance = $(this).val();
    }).change();


    generateGraph(window.location.hash.substr(1));


}());
