// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var $ = require('jquery');
const d3 = require("d3");

var commaFormat = d3.format(',');

if($('#countyTrendGraphic').length >0 ){
  var conWidth = $("#barChart").width();

  var conHeight = (conWidth > 700) ? 500 : 300;




 var margin = {top: 30, right: 10, bottom: 40, left: 80},
     width = conWidth - margin.left - margin.right,
     height = conHeight - margin.top - margin.bottom;

 var x0 = d3.scaleBand().range([0, width]).padding(.05);

 var x1 = d3.scaleBand().padding(.05);

 var y = d3.scaleLinear()
     .range([height, 0]);

 var xAxis = d3.axisBottom()
     .scale(x0);

 var yAxis = d3.axisLeft()
     .scale(y)
     .tickFormat(function(d) {return "$" + d/1000000000 + " billion"});

     xAxis.tickSizeOuter(0);




 var svg = d3.select("#barChart").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("class","mainG")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var yBegin;

 // var innerColumns = {
 //   "column1" : ["Adams","Asotin","Benton","Chelan","Clallam","Clark","Columbia","Cowlitz","Douglas","Ferry","Franklin","Garfield","Grant","Grays_Harbor","Island","Jefferson","King","Kitsap","Kittitas","Klickitat","Lewis","Lincoln","Mason","Okanogan","Pacific","Pend_Oreille","Pierce","San_Juan","Skagit","Skamania","Snohomish","Spokane","Stevens","Thurston","Wahkiakum","Walla_Walla","Whatcom","Whitman","Yakima","Unassigned"],
 // }

 var innerColumns = {
  "State" : ["StateFunds"],
  "Tuition" : ["Tuition"]
}


 const colorSet = ["rgb(208, 141, 68)","rgb(12, 88, 125)","goldenrod"];


 // $('#date').empty().text(dateNew);


var myFunction = function(updateData, idClicked) {

  d3.csv(updateData).then(
    function(data) {



      var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Year"; });


      data.forEach(function(d) {
        var yColumn = new Array();
        d.columnDetails = columnHeaders.map(function(name) {
          for (ic in innerColumns) {
            if($.inArray(name, innerColumns[ic]) >= 0){
              if (!yColumn[ic]){
                yColumn[ic] = 0;
              }
              yBegin = yColumn[ic];
              yColumn[ic] += +d[name];
              return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
            }
          }
        });
        d.total = d3.max(d.columnDetails, function(d) {
          return d.yEnd;
        });
      });

      x0.domain(data.map(function(d) { return d.Year; }));
      x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);

      y.domain([0, d3.max(data, function(d) {
        return d.total;
      })]);

      var trythis = svg.selectAll(".line")
      .data(data.filter(function(d){return d.Year == "2011";}))
      .enter()
      .append('rect')
      .attr("class","firstRect")
      .attr("width", "50%")
      .attr("height", function(d) {
        return conHeight - margin.bottom;
      })
      // .style("fill", "none")
      .attr("x", function(d) {
          return x1(d.Year);
      })
      .attr("y", -30);

      var trythis = svg.selectAll(".line2")
      .data(data.filter(function(d){return d.Year == "2011";}))
      .enter()
      .append('rect')
      .attr("class","secondRect")
      .attr("width","50%")
      .attr("height", function(d) {
        return conHeight - margin.bottom;
      })
      // .style("fill", "#ccc")
      .attr("transform", function(d) {
         return "translate(" + x0(d.Year) + "," + 0 + ")";
      })
      .attr("y", -30);

      svg.selectAll(".axis").remove();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".7em")
          .style("text-anchor", "end")
          .text("");


      svg.selectAll(".g").remove();



      var project_stackedbar = svg.selectAll(".project_stackedbar")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; })
          .style("cursor","pointer");

      var bars = project_stackedbar.selectAll("rect")
          .exit()
          .remove()
          .data(function(d) {
            return d.columnDetails;
          })
          .enter().append("rect")
          .attr("width", x1.bandwidth())
          .transition()
          .duration(600)
          .attr("class", function(d) {
            return (d.column);
          })
          .attr("x", function(d) {
            return x1(d.column);
             })
          .attr("y", function(d) {
            return y(d.yEnd);
          })
          .attr("height", function(d) {
            return y(d.yBegin) - y(d.yEnd);
          })
          .attr("opacity", function(d) {
            if (d.column === "State") {
              return 1;
            } else { return 0; }
          })
          .style("fill", function(d) {
            if (d.column === "State") {
              return colorSet[0];
            } else if (d.column === "Tuition") {
              return colorSet[1];
            } else { return colorSet[2]; }
          });


          svg.append("g")
            .attr("class", "textLabel")
            .style("opacity",0)
          .append("text")
            .attr("x", 90)
            .attr("y", -15)
            .attr("width", "50%")
            .attr("dy", ".7em")
            .style("text-anchor", "middle")
            .text("Majority state funds");


          svg.append("g")
            .attr("class", "textLabel")
            .style("opacity",0)
          .append("text")
            .data(data.filter(function(d){return d.Year == "2011";}))
            .attr("x", 90)
            .attr("y", -15)
            .attr("transform", function(d) {
               return "translate(" + x0(d.Year) + "," + 0 + ")";
            })
            .attr("dy", ".7em")
            .style("text-anchor", "middle")
            .text("Majority tuition funds");




           //  var recession =  (d3.select(this).text() == 2008);
           //
           //
           //
           // svg.insert("text", recession)
           //    .attr("class", "recLabel")
           //    .attr("fill", "red")
           //    .style("text-anchor", "middle")
           //    .text("U.S. Recession");

           d3.selectAll("text")
            .filter(function(){
              return d3.select(this).text() == 2008
            })
            .style("font-weight", "bold");

           svg.append("g")
             .attr("class", "recLabel")
           .append("text")
             .data(data.filter(function(d){return d.Year == "2008";}))
             .attr("x", 0)
             .attr("y", conHeight - margin.bottom)
             .attr("transform", function(d) {
                return "translate(" + x0(d.Year) + "," + -6 + ")";
             })
             .attr("dy", ".7em")
             .style("font-size","14px")
             .style("text-anchor", "start")
             .style("font-weight","bold")
             .text("U.S. Recession");









  });

}

    myFunction(`assets/noAid.csv`, "casesCounty2");



$('*[data-slide="1"]').show();


 $( ".icon i" ).click(function() {
   var currentNum = $('.stepper').find(".slide:visible").attr("data-slide");

   console.log(currentNum);


   if ( $( this ).hasClass( "fa-caret-right" ) ) {
     $('.fa-caret-right').css("opacity",1);
     $('.fa-caret-left').css("opacity",0.5);
     mightySwitch( (parseInt(currentNum) + 1) );
   } else {
     $('.fa-caret-right').css("opacity",0.5);
     $('.fa-caret-left').css("opacity",1);
     mightySwitch( (parseInt(currentNum) - 1) );
   }

 });


 var mightySwitch = function(num) {

            console.log(num);

            switch(num) {
              case 1:
                // $('.fa-caret-right').css("opacity",1);
                // $('.fa-caret-left').css("visibility","hidden");
                $('*[data-slide="1"]').show();
                $('*[data-slide="2"]').hide();

                $('.State').fadeTo( "slow", 1 );
                $('.Tuition').fadeTo( "slow", 0 );
                // $('.FinAid').fadeTo( "slow", 0 );


                break;
              case 2:

                // myFunction(`assets/data0520.csv`, "casesCounty2");

                // $('.fa-caret-left').css("visibility","inherit");
                // $('.fa-caret-right').css("visibility","inherit");

                $('.State').fadeTo( "slow", 0.1 );
                $('.Tuition').fadeTo( "slow", 1 );
                // $('.FinAid').fadeTo( "slow", 0 );

                $('.firstRect').removeClass("filled");
                $('.secondRect').removeClass("filled");
                $('.textLabel').fadeTo( "slow", 0 );




                $('*[data-slide="1"]').hide();
                $('*[data-slide="3"]').hide();
                $('*[data-slide="2"]').show();

                break;
              case 3:

                $('.State').fadeTo( "slow", 1 );
                $('.Tuition').fadeTo( "slow", 1 );
                // $('.FinAid').fadeTo( "slow", 1 );

                $('.textLabel').fadeTo( "slow", 1 );
                $('.firstRect').addClass("filled");
                $('.secondRect').addClass("filled");



                $('*[data-slide="2"]').hide();
                $('*[data-slide="3"]').show();

                // $('.fa-caret-left').css("opacity",1);
                // $('.fa-caret-right').css("visibility","hidden");

                break;
              default:
                console.log('I default');
            }

          }


} else {}

if($('#pieGraphic').length >0 ){

  var el_id = 'treeChart';
        var obj = document.getElementById(el_id);
        var divWidth = obj.offsetWidth;
        var margin = {top: 30, right: 0, bottom: 20, left: 0},
            width = divWidth -25,
            height = 600 - margin.top - margin.bottom,
            formatNumber = d3.format(","),
            transitioning;
        // sets x and y scale to determine size of visible boxes
        var x = d3.scaleLinear()
            .domain([0, width])
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, height])
            .range([0, height]);
        var treemap = d3.treemap()
                .size([width, height])
                .paddingInner(0)
                .round(false);
        var svg = d3.select('#'+el_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .style("margin-left", -margin.left + "px")
            .style("margin.right", -margin.right + "px")
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("shape-rendering", "crispEdges");
        var grandparent = svg.append("g")
                .attr("class", "grandparent");
            grandparent.append("rect")
                .attr("y", -margin.top)
                .attr("width", width)
                .attr("height", margin.top)
                .attr("fill", '#bbbbbb');
            grandparent.append("text")
                .attr("x", 6)
                .attr("y", 6 - margin.top)
                .attr("dy", ".75em");


        d3.json("assets/flare-2.json").then(
          function(data) {
        // d3.json("assets/flare-2.json", function(data) {
            var root = d3.hierarchy(data);
            console.log(root);
            treemap(root
                .sum(function (d) {
                    return d.value;
                })
                .sort(function (a, b) {
                    return b.height - a.height || b.value - a.value
                })
            );
            display(root);
            function display(d) {
                // write text into grandparent
                // and activate click's handler
                grandparent
                    .datum(d.parent)
                    .on("click", transition)
                    .select("text")
                    .text(name(d));
                // grandparent color
                grandparent
                    .datum(d.parent)
                    .select("rect")
                    .attr("fill", function () {
                        return '#bbbbbb'
                    });
                var g1 = svg.insert("g", ".grandparent")
                    .datum(d)
                    .attr("class", "depth");
                var g = g1.selectAll("g")
                    .data(d.children)
                    .enter().
                    append("g");
                // add class and click handler to all g's with children
                g.filter(function (d) {
                    return d.children;
                })
                    .classed("children", true)
                    .on("click", transition);
                g.selectAll(".child")
                    .data(function (d) {
                        return d.children || [d];
                    })
                    .enter().append("rect")
                    .attr("class", "child")
                    .call(rect);
                // add title to parents
                g.append("rect")
                    .attr("class", "parent")
                    .call(rect)
                    .append("title")
                    .text(function (d){
                        return d.data.name;
                    });
                /* Adding a foreign object instead of a text object, allows for text wrapping */
                g.append("foreignObject")
                    .call(rect)
                    .attr("class", "foreignobj")
                    .append("xhtml:div")
                    .attr("dy", ".75em")
                    .html(function (d) {
                        return '' +
                            '<p class="title"> ' + d.data.name + '</p>' +
                            '<p>' + "$" + formatNumber(d.value) + '</p>'
                        ;
                    })
                    .attr("class", "textdiv"); //textdiv class allows us to style the text easily with CSS
                function transition(d) {
                    if (transitioning || !d) return;
                    transitioning = true;
                    var g2 = display(d),
                        t1 = g1.transition().duration(650),
                        t2 = g2.transition().duration(650);
                    // Update the domain only after entering new elements.
                    x.domain([d.x0, d.x1]);
                    y.domain([d.y0, d.y1]);
                    // Enable anti-aliasing during the transition.
                    svg.style("shape-rendering", null);
                    // Draw child nodes on top of parent nodes.
                    svg.selectAll(".depth").sort(function (a, b) {
                        return a.depth - b.depth;
                    });
                    // Fade-in entering text.
                    g2.selectAll("text").style("fill-opacity", 0);
                    g2.selectAll("foreignObject div").style("display", "none");
                    /*added*/
                    // Transition to the new view.
                    t1.selectAll("text").call(text).style("fill-opacity", 0);
                    t2.selectAll("text").call(text).style("fill-opacity", 1);
                    t1.selectAll("rect").call(rect);
                    t2.selectAll("rect").call(rect);
                    /* Foreign object */
                    t1.selectAll(".textdiv").style("display", "none");
                    /* added */
                    t1.selectAll(".foreignobj").call(foreign);
                    /* added */
                    t2.selectAll(".textdiv").style("display", "block");
                    /* added */
                    t2.selectAll(".foreignobj").call(foreign);
                    /* added */
                    // Remove the old node when the transition is finished.
                    t1.on("end.remove", function(){
                        this.remove();
                        transitioning = false;
                    });
                }
                return g;
            }
            function text(text) {
                text.attr("x", function (d) {
                    return x(d.x) + 6;
                })
                    .attr("y", function (d) {
                        return y(d.y) + 6;
                    });
            }
            function rect(rect) {
                rect
                    .attr("x", function (d) {
                        return x(d.x0);
                    })
                    .attr("y", function (d) {
                        return y(d.y0);
                    })
                    .attr("width", function (d) {
                        return x(d.x1) - x(d.x0);
                    })
                    .attr("height", function (d) {
                        return y(d.y1) - y(d.y0);
                    })
                    .attr("fill", function (d) {
                        if (d.data.special) {
                          return (d.data.special);
                        } else { return '#bbbbbb'; }

                    });
            }
            function foreign(foreign) { /* added */
                foreign
                    .attr("x", function (d) {
                        return x(d.x0);
                    })
                    .attr("y", function (d) {
                        return y(d.y0);
                    })
                    .attr("width", function (d) {
                        return x(d.x1) - x(d.x0);
                    })
                    .attr("height", function (d) {
                        return y(d.y1) - y(d.y0);
                    });
            }
            function name(d) {
                return breadcrumbs(d) +
                    (d.parent
                    ? " -  Click to zoom out"
                    : " - Click inside green squares to zoom in");
            }
            function breadcrumbs(d) {
                var res = "";
                var sep = " > ";
                d.ancestors().reverse().forEach(function(i){
                    res += i.data.name + sep;
                });
                return res
                    .split(sep)
                    .filter(function(i){
                        return i!== "";
                    })
                    .join(sep);
            }
        });

} else {}
