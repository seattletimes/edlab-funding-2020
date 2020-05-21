// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var $ = require('jquery');
const d3 = require("d3");

var commaFormat = d3.format(',');

if($('#countyTrendGraphic').length >0 ){
  var conWidth = $("#barChart").width();

  var conHeight = (conWidth > 700) ? 500 : 300;




 var margin = {top: 20, right: 10, bottom: 30, left: 100},
     width = conWidth - margin.left - margin.right,
     height = conHeight - margin.top - margin.bottom;

 var x0 = d3.scaleBand().range([0, width]).padding(.05);

 var x1 = d3.scaleBand().padding(.05);

 var y = d3.scaleLinear()
     .range([height, 0]);

 var xAxis = d3.axisBottom()
     .scale(x0);

 var yAxis = d3.axisLeft()
     .scale(y);

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
  // "FinAid" : ["FinancialAid"]

 // var caseColors = ["#F3C882", "#E98729", "#B75317", "#7b2003", "#360d01", '#aaa'];
 // var deathColors = ['#f6cac1', '#db8f87', '#ae5c5c', '#7c2f38', "#330107", '#aaa'];

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
        return conHeight;
      })
      // .style("fill", "none")
      .attr("x", function(d) {
          return x1(d.Year);
      })
      .attr("y", 0);

      var trythis = svg.selectAll(".line2")
      .data(data.filter(function(d){return d.Year == "2011";}))
      .enter()
      .append('rect')
      .attr("class","secondRect")
      .attr("width","50%")
      .attr("height", function(d) {
        return conHeight;
      })
      // .style("fill", "#ccc")
      .attr("transform", function(d) {
         return "translate(" + x0(d.Year) + "," + 0 + ")";
      })
      .attr("y", 0);

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
            if (d.column === "Tuition") {
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
            .attr("x", 100)
            .attr("y", 20)
            .attr("width", "50%")
            .attr("dy", ".7em")
            .style("text-anchor", "middle")
            .text("Majority state funds");


          svg.append("g")
            .attr("class", "textLabel")
            .style("opacity",0)
          .append("text")
            .data(data.filter(function(d){return d.Year == "2011";}))
            .attr("x", 100)
            .attr("y", 20)
            .attr("transform", function(d) {
               return "translate(" + x0(d.Year) + "," + 0 + ")";
            })
            .attr("dy", ".7em")
            .style("text-anchor", "middle")
            .text("Majority tuition funds");



          // var project_stackedbar = svg.selectAll(".line")
          //     .data(data)
          //   .enter().append("rect")
          //     .attr("class", "line")
          //     .attr("transform", function(d) {
          //
          //       if (d.Year === "2011") {
          //         return "translate(" + x0(d.Year) + ",0)";
          //       }
          //
          //     })
          //     .style("cursor","pointer");


          // var trythis = svg.selectAll(".line")
          // .data(data.filter(function(d){return d.Year == "2011";}))
          // .enter()
          // .append('line')
          // .style("stroke", "lightgreen")
          // .style("stroke-width", 5)
          // .attr("x1", function(d) {
          //     return x0(d.Year);
          // })
          // .attr("y1", 0)
          // .attr("x2", function(d) {
          //     return x0(d.Year);
          // })
          // .attr("y2", 470);









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
                $('.fa-caret-right').css("opacity",1);
                $('.fa-caret-left').css("visibility","hidden");
                $('*[data-slide="1"]').show();
                $('*[data-slide="2"]').hide();

                $('.State').fadeTo( "slow", 0 );
                $('.Tuition').fadeTo( "slow", 1 );
                // $('.FinAid').fadeTo( "slow", 0 );


                break;
              case 2:

                // myFunction(`assets/data0520.csv`, "casesCounty2");

                $('.fa-caret-left').css("visibility","inherit");
                $('.fa-caret-right').css("visibility","inherit");

                $('.State').fadeTo( "slow", 1 );
                $('.Tuition').fadeTo( "slow", 0.1 );
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

                $('.fa-caret-left').css("opacity",1);
                $('.fa-caret-right').css("visibility","hidden");

                break;
              default:
                console.log('I default');
            }

          }


} else {}
