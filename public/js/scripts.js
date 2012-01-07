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
            delay:10,
            minChars:2,
            matchSubset:1,
            matchContains:1,
            cacheLength:10,
            onItemSelect:selectItem,
            onFindValue:findValue,
            formatItem:formatItem,
            mustMatch: true,
            autoFill:true,
            width: 230
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
    var w = 960,
        h = 500,
        fill = d3.scale.category20();
    var vis = d3.select("#chart")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);
    var svg = vis[0][0];
    var generateGraph = function(id) {
        window.location.hash = id;
        d3.json('/ajax/nodes/' + id, function(json) {
            vis.selectAll('*').remove();
            var force = d3.layout.force()
                .charge(-120)
                .linkDistance(30)
                .nodes(json.nodes)
                .links(json.links)
                .size([w, h])
                .start();

            var link = vis.selectAll("line.link")
                .data(json.links)
                .enter()
                .append("svg:line")
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
                .attr("nid", function(d) { return d.nodeid; })
                .attr("r", 5)
                .style("fill", function(d) { return fill(d.group); });

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
            $('circle.node').click(function(event) {
                generateGraph($(this).attr('nid'));
                $('#form-search-input').val($(this).find('title').text());
            })
        });
    }
    $('#form-search').submit(function(event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('#form-search-id').val().length == 0) {
            return;
        }
        generateGraph($('#form-search-id').val());
    });
}());
