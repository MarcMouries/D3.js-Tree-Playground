<script>
    function(t){
        function e(e){
            t.select(this.ownerSVGElement)
                .classed("g--hover",!0),
                e.point.ancestor.classed("g-node--hover",!0),
                e.point.ancestorLink.classed("g-link--hover",!0).each(a)}
            
            function n(e){t.select(this.ownerSVGElement).classed("g--hover",!1),e.point.ancestor.classed("g-node--hover",!1),e.point.ancestorLink.classed("g-link--hover",!1)}function a(){this.parentNode.appendChild(this)}function r(){var e=Math.min(s?1/0:720,i.node().parentNode.clientWidth-h.left-h.right);if(e!==u){u=e;var n=Math.floor(u/(s?5:4));f.each(function(e){d.nodeSize([s?60:120,n]).nodes(e),e.nodes.forEach(function(t){t.x=Math.round(t.x)}),e.extent=[[t.min(e.nodes,function(t){return t.y}),t.min(e.nodes,function(t){return t.x})],[t.max(e.nodes,function(t){return t.y}),t.max(e.nodes,function(t){return t.x})]]}),g.attr("width",u+h.left+h.right).attr("height",function(t){return t.extent[1][1]-t.extent[0][1]+h.top+h.bottom}),k.attr("transform",function(t){return"translate("+h.left+","+Math.round(h.top-t.extent[0][1])+")"}),O.data(function(t){return m.clipExtent([[t.extent[0][0],t.extent[0][1]-h.top],[t.extent[1][0]+120,t.extent[1][1]+h.bottom]])(t.leaves)}).attr("d",function(t){return"M"+t.join("L")+"Z"}),A.attr("transform",function(t){return"translate("+t.y+","+t.x+")"}),w.attr("d",p),x.attr("transform",function(t,e){return"translate("+(e+1)*n+",0)"}),v.attr("y2",function(t){return t.root.extent[1][1]-t.root.extent[0][1]+h.top+h.bottom})}}var o="index-29c17565",i=t.select(".g-"+o),s=!1;location.search.slice(1).split("&").some(function(t){var e=t.split("=");e.length>1&&"ties"===e[0].toLowerCase()&&(s=!!e[1])});var u,l=t.nest().key(function(t){return t.id}).rollup(function(t){return t[0]}).map(t.tsv.parse(i.select(".g-teams-data").text()),t.map),c=t.nest().key(function(t){return t.homeId+"-"+t.awayId+"-"+t.week}).rollup(function(t){return t[0]}).map(t.tsv.parse(i.select(".g-games-data").text()),t.map),d=t.layout.tree(),p=t.svg.diagonal().projection(function(t){return[t.y,t.x+.5]}),m=t.geom.voronoi().x(function(t){return t.y}).y(function(t){return t.x}),h={top:80,right:10,bottom:40,left:0},f=i.selectAll(".g-team").datum(function(){var t=JSON.parse(this.querySelector(".g-team-data-"+(s?"with":"without")+"-ties").textContent),e=d.nodes(t);return t.team=l.get(this.getAttribute("data-id")),t.nodes=e,t.links=d.links(e),t.games.forEach(function(e){e.homeOutcome=c.get(e.home+"-"+e.away+"-17").homeOutcome,e.homeTeam=l.get(e.home),e.awayTeam=l.get(e.away),e.root=t,delete e.home,delete e.away}),e.forEach(function(e){if(e.root=t,n=e.parent){var n,a=e.team=l.get(e.name),r=n.game;e.truth=n.truth===!1?!1:"win"===r.homeOutcome?a===r.homeTeam:"loss"===r.homeOutcome?a===r.awayTeam:"tie"===r.homeOutcome?"tie"===e.name:void 0}e.children&&(e.game=t.games[e.depth])}),t.leaves=e.filter(function(t){return!t.children&&(null==t.truth||t.truth)}),t}),g=f.select("svg");g.filter(function(t){return!t.games.length}).style("margin-top",0).selectAll(".g-level-intro").remove();var x=g.selectAll(".g-level").data(function(t){return t.games}).enter().append("g").attr("class","g-level"),y=x.append("text").attr("y",12);y.append("tspan").text(function(t){return t.awayTeam.name}),y.append("tspan").attr("x",0).attr("dy","1.2em").text(function(t){return" at "+t.homeTeam.name});var v=x.append("line").attr("x1",.5).attr("x2",.5).attr("y1",32),k=g.append("g").attr("class","g-nodes").attr("transform","translate("+h.left+","+h.top+")"),w=k.append("g").attr("class","g-links").selectAll(".g-link").data(function(t){return t.links}).enter().append("path").attr("class",function(t){return"g-link g-link--"+t.target.truth}).each(function(t){return t.target.linkElement=this}),A=k.selectAll(".g-node").data(function(t){return t.nodes}).enter().append("g").attr("class",function(t){return"g-node g-node--"+t.truth}).each(function(t){return t.element=this}),E=A.filter(function(t){return t.parent&&t.team});E.append("rect").attr("class","g-node-halo").attr("y",-40).attr("x",-25).attr("width",50).attr("height",60),E.append("image").attr("class","g-node-logo g-node-logo--color").attr("x",-20).attr("y",-15).attr("width",40).attr("height",30).attr("xlink:href",function(t){return"https://static01.nyt.com/newsgraphics/2014/12/23/nfl-playoffs/assets/"+t.team.id+".png"}),E.append("image").attr("class","g-node-logo g-node-logo--gray").attr("x",-20).attr("y",-15).attr("width",40).attr("height",30).attr("xlink:href",function(t){return"https://static01.nyt.com/newsgraphics/2014/12/23/nfl-playoffs/assets/"+t.team.id+"-gray.png"});var T=E.append("text").attr("class","g-node-name").attr("y",-8).attr("dy","-1.2em");T.append("tspan").text(function(t){return t.parent.parent?"and the ":"if the "}),T.append("tspan").style("font-weight",700).text(function(t){return t.team?t.team.name:"TIE"}),T.append("tspan").text(function(t){return t.children?" win,":" win:"});var b=A.filter(function(t){return t.parent&&!t.team}).append("text").attr("class","g-node-name").attr("y",-8).attr("dy","-1.2em");b.append("tspan").text(function(t){return t.parent.parent?"and the ":"if the "}),b.append("tspan").text(function(t){return t.parent.game.awayTeam.name}),b.append("tspan").text(" and ").attr("x",0).attr("dy","1em"),b.append("tspan").text(function(t){return t.parent.game.homeTeam.name}),b.append("tspan").text(function(t){return t.children?" tie,":" tie:"});A.filter(function(t){return!t.children}).append("text").attr("class",function(t){return"g-outcome g-outcome--"+(t.rank<6?t.rank+1:"x")}).attr("dy",".35em").attr("x",function(t){return t.parent?25:0}).text(function(t){return t.rank<6?"#"+(t.rank+1)+(t.rank<2?" BYE":t.rank<4?" DIV. CHAMP":" WILD CARD"):"✗ OUT"});A.filter(function(t){return!t.parent}).append("text").attr("y",-8).attr("dy","-.2em").attr("x",-h.left).attr("class","g-node-intro").text(function(t){return"The "+t.team.name+"’ seed"+(t.children?"...":":")});var O=k.append("g").attr("class","g-voronoi").selectAll("path").data(function(t){return t.leaves}).enter().append("path").each(function(e){for(var n=e,a=[n.element],r=[n.linkElement];n=n.parent;)a.push(n.element),r.push(n.linkElement);e.ancestor=t.selectAll(a),e.ancestorLink=t.selectAll(r)}).on("mouseover",e).on("mouseout",n);t.select(window).on("resize."+o,r).each(r)});};

    </script>