$(document).ready(function() {
    
    $("#datepicker").datepicker({
        format: "mm/dd/yy",
        clearBtn: true
    });
    
    $(".color-sort").width($(".color-sort").height()/2);
    
    var margin = {top: 10, right: 40, bottom: 35, left: 40},
        width = Number.parseInt($("#svg-holder").width() - margin.left - margin.right),
        height = Number.parseInt(($("#svg-holder").width() * 2) / 4  - margin.top - margin.bottom);
    
    var tooltip = d3.select("body").append("div").attr("class", "bar-tooltip");
    var tooltipOffset = {x: 10, y: -20, height: 10, width: 50, flipped: false};
    
    var sortMethod = ["sort-down", "left"];
    
    var jsonData = null;
    var currData = null;
    
    var loadData = false;
    var defView = false;
    
    var inspecList = [];
    var defectCodes = [];
    var selectedDefCodes = [];
    
    var defectView = false;
    var trendView = false;
    
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        y1 = d3.scaleLinear().rangeRound([height, 0]),
        y2 = d3.scaleLinear().rangeRound([height, 0]),
        y3 = d3.scaleLinear().rangeRound([height, 0]),
        color = d3.scaleSequential(d3.interpolateViridis);
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    var trendLine = d3.line()
        .x(function(d) { return x(d.date) + x.bandwidth()/2; })
        .y(function(d) { 
            var totes = 0;
            defectCodes.forEach(function(cd) {
                totes += d.defcodeoccur[cd] 
            });
            return y2(totes);
        });
    
    $(".input-daterange").datepicker().on("changeDate", function(e) {
        sortGen();
    })
    
    $("#dropdownSelectSort").on("change", function(e) {
        sortGen();
    });
    
    $(".direction-radio-input").on('change', function(e) {
        sortMethod[0] = e.currentTarget.value;
        sortGen();
    });
    
    $(".color-radio-input").on('change', function(e) {
        sortMethod[1] = e.currentTarget.value;
        if(sortMethod[1] == "left") {
            $('#dropdownSelectSort option:nth-child(2)').text("% Defective");
        } else if (sortMethod[1] == "right") {
            $('#dropdownSelectSort option:nth-child(2)').text("Defect Total");  
        }
        
        sortGen();
    });
    
    $("#defectSwitch").on("click", function() {
        if (defectView == false) {
            defectView = true;
            $("#defectSwitch > button").html("Defect Code Overview");
            $("#barGraphToolbar").addClass("hidden");
            $("#defectToolbar").removeClass("hidden");
            
            $("#trendSwitch").removeClass("input-group-append");
            $("#defectSwitch").removeClass("input-group-prepend");
            $("#trendSwitch").addClass("hidden");
            
        } else {
            defectView = false;
            $("#defectSwitch > button").html("Defect Code Detailed");
            $("#barGraphToolbar").removeClass("hidden");
            $("#defectToolbar").addClass("hidden");
            
            $("#trendSwitch").addClass("input-group-append");
            $("#defectSwitch").addClass("input-group-prepend");
            $("#trendSwitch").removeClass("hidden");
        }
        
        sortGen();
    });
    
    $("#trendSwitch").on("click", function() {
        if (trendView == false) {
            trendView = true;
            $("#trendSwitch > button").html("Defect View Overview");
            $("#barGraphToolbar").addClass("hidden");
            
            $("#trendSwitch").removeClass("input-group-append");
            $("#defectSwitch").removeClass("input-group-prepend");
            $("#defectSwitch").addClass("hidden");
            
        } else {
            trendView = false;
            $("#trendSwitch > button").html("Trend View");
            $("#barGraphToolbar").removeClass("hidden");
            
            $("#trendSwitch").addClass("input-group-append");
            $("#defectSwitch").addClass("input-group-prepend");
            $("#defectSwitch").removeClass("hidden");
        }
        
        sortGen();
    });
    
    $(".selectpicker").on("changed.bs.select", function(e, i) {
        sortGen(); 
    });
    
    d3.json("js/jsonOutput.json", function(e, data) {
        if(e) throw e;
        jsonData = data;
        console.log(data);
        sortGen();
    });
    
    function sortGen() {
        var choice = $("#dropdownSelectSort").val();
        var startDate = $("#datepicker1").datepicker('getDate');
        var endDate = $("#datepicker2").datepicker('getDate');
        selectedDefCodes = $(".selectpicker").selectpicker("val");

        // - - - - - POPULATE CURRENT DATA - - - - -
        
        currData = [];
        jsonData.forEach(function(e) {
            var newEntry = $.extend(true, {}, e);
            if (startDate != null || endDate != null) {
                var eDate = getDate(newEntry.date);
                var withinDate = false;
                
                if(startDate != null && endDate != null) {
                    if (startDate <= eDate && eDate <= endDate) {
                        withinDate = true;
                    } 
                } else if (startDate != null && endDate == null) {
                    if (startDate <= eDate) {
                        withinDate = true;
                    }
                } else if (startDate == null && endDate != null) {
                    if (eDate <= endDate) {
                        withinDate = true;
                    }
                }
                
                if(!withinDate) return;
            }
            
            if(defectView) {
                for(var j in newEntry.defcodeoccur) {
                    if(selectedDefCodes.indexOf(j) < 0) {
                        delete newEntry[j];
                    }
                }
            }
            
            currData.push(newEntry);
        });
        
        // - - - - - SORT CURRENT DATA - - - - -
        
        currData.sort(function(a, b) {
            
            // Add inspectors as it sees them
            if(!inspecList.includes(a.inspector)) {
                inspecList.push(a.inspector);
                inspecList.sort();
            }
            
            // Inspector-based sorting
            if (choice == "In") {
                if(a.inspector.localeCompare(b.inspector) != 0) {
                    return (sortMethod[0] == "sort-down" ? a.inspector.localeCompare(b.inspector) : b.inspector.localeCompare(a.inspector));
                }
                
            // Defect-percentage-based sorting
            } else if (choice == "PD") {
                // Left bar dominant sorting
                if (sortMethod[1] == "left") {
                    if ((a.defects / a.total) < (b.defects / b.total)) {
                        return (sortMethod[0] == "sort-down" ? -1 : 1);
                    } else if ((a.defects / a.total) > (b.defects / b.total)) {
                        return (sortMethod[0] == "sort-down" ? 1 : -1);
                    }
                    
                // Right bar sorting dominant
                } else if (sortMethod[1] == "right") {
                    var atotes = 0;
                    var btotes = 0;
                    defectCodes.forEach(function(cd) {
                        atotes += a.defcodeoccur[cd];
                        btotes += b.defcodeoccur[cd];
                    });
                    if (atotes < btotes) {
                        return (sortMethod[0] == "sort-down" ? -1 : 1);
                    } else if (atotes > btotes) {
                        return (sortMethod[0] == "sort-down" ? 1 : -1);
                    }
                }
            }
            
            // Finally, sort by time
            var aDate = getDate(a.date);
            var bDate = getDate(b.date);
            if(aDate.getTime() < bDate.getTime()) {
                return (sortMethod[0] == "sort-down" ? -1 : 1);
            } else if (aDate.getTime() > bDate.getTime()) {
                return (sortMethod[0] == "sort-down" ? 1 : -1);
            } else {
                return 0;
            }
        });
        
        // Initialize some variables from initial data
        if (!loadData) {
            // Set calendar widget date range
            $(".input-daterange > input")
                .datepicker('setStartDate', jsonData[0].date)
                .datepicker('setEndDate', jsonData[jsonData.length-1].date);
            
            // Get defect codes
            defectCodes = Object.keys(jsonData[0].defcodeoccur);
            defectCodes.sort();
            
            // Populate defect code dropdown with defect codes
            var sel = $(".selectpicker");
            defectCodes.forEach(function(d) {
                sel.append($("<option></option>")
                            .attr("value", d)
                            .text(d)
                            .attr("selected", true));
            });
            
            // Refresh defect dropdown widget
            $(".selectpicker").selectpicker("refresh");
            $(".selectpicker").parent().find(".dropdown-menu > div > ul").children().each(function(i, e) {
                e.style="background-color:" + color(i/defectCodes.length);
                e.children[0].style="color:" + (i/defectCodes.length < 0.4 ? "white" : "black");
            });
            
            loadData = true;
        }
        
        // Create chart from currated data
        generateChart(currData);
    }
    
    // - - - - - CREATE CHARTS - - - - -
    
    function generateChart(data) {
        // Remove old svg
        d3.selectAll("#svg-holder > *").remove();
        
        // Create new svg
        var svg = d3.select("#svg-holder").append("svg")
            .attr("id", "barGraph")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
    
        // Create margins within svg
        svg.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        
        // Set x axis domain
        x.domain(data.map(function(d) { return d.date; }));
        
        // Grey bar dividers
        svg.selectAll(".bardiv")
                .data(data)
            .enter().append("path")
                .attr("d", function(d) {
                    if (data.indexOf(d) == data.length - 1) return;
                    var gap = x.step() - (x.step() * x.padding()/2);
                    var p = [{"x": x(d.date) + gap, "y": 0},
                             {"x": x(d.date) + gap, "y": height}];
                    return lineFunction(p);
                })
                .attr("stroke", "#bbb")
                .attr("stroke-width", 0.8)
                .attr("fill", "none");
        
        
        // - - - - - CREATE OVERVIEW GRAPH - - - - -
        
        if (!defectView && !trendView) {
            
            // Set left Y axis domain
            y1.domain([0, d3.max(data, function(d) { return (d.defects / d.total)*100})]);
            
            // Set right Y axis domain
            y2.domain([0, d3.max(data, function(d) {
                var totes = 0;
                defectCodes.forEach(function(cd) {
                    totes += d.defcodeoccur[cd] 
                });
                return totes;
            })]);
            
            // Create blue bars
            svg.selectAll(".defper")
                    .data(data)
                .enter().append("rect")
                    .attr("class", "defbar")
                    .attr("x", function(data) { return x(data.date); })
                    .attr("width", x.bandwidth()/2)
                    .attr("y", function(data) { return y1((data.defects / data.total)*100); })
                    .attr("height", function(data) { return height - y1((data.defects / data.total)*100); })
                    .attr("fill", "#007bff")
                    .on('mouseover', function(d) {
                        tooltip.attr("style", "background-color: #007bff;" +
                                              "color: white");
                        showTooltip("<strong>Defects: " + d.defects + "/" + d.total + "<br>Percentage: " + ((d.defects/d.total) * 100).toFixed(2) + "%</strong>");    
                    })
                    .on('mousemove', function(d) {
                        moveTooltip();
                    })
                    .on('mouseout', function(d) {
                        hideTooltip();
                    });

            // Create red bars
            svg.selectAll(".defcd")
                    .data(data)
                .enter().append("rect")
                    .attr("class", "defbar")
                    .attr("x", function(data) { return x(data.date) + x.bandwidth()/2; })
                    .attr("width", x.bandwidth()/2)
                    .attr("y", function(d) { 
                        var totes = 0;
                        defectCodes.forEach(function(cd) {
                            totes += d.defcodeoccur[cd] 
                        });
                        return y2(totes); 
                    })
                    .attr("height", function(d) { 
                        var totes = 0;
                        defectCodes.forEach(function(cd) {
                            totes += d.defcodeoccur[cd] 
                        });
                        return height - y2(totes); 
                    })
                    .attr("fill", "#dc3545")
                    .on('mouseover', function(d) {
                        tooltip.attr("style", "background-color: #dc3545;" +
                                              "color: white");
                        showTooltip("<strong>Defects: <br>" + prettyDefects(d.defcodeoccur) + "</strong>");    
                    })
                    .on('mousemove', function(d) {
                        moveTooltip();
                    })
                    .on('mouseout', function(d) {
                        hideTooltip();
                    });
            
            // Left Y Axis (Defect %)
            svg.append("g")
                .attr("class", "left-axis")
                .call(d3.axisLeft(y1));
            
            // Left Y Axis Text
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("font-weight", "bold")
                .attr("y", 0 - 25)
                .attr("x", 0 - height/2)
                .style("text-anchor", "middle")
                .text("% Defects");

            // Right Y Axis (Total Defects)
            svg.append("g")
                .attr("class", "right-axis")
                .attr("transform", "translate(" + width + ", 0)")
                .call(d3.axisRight(y2));

            // Right Y Axis Text
            svg.append("text")
                .attr("transform", "rotate(90)")
                .attr("font-weight", "bold")
                .attr("y", -(width + 25))
                .attr("x", height/2)
                .style("text-anchor", "middle")
                .text("Total Defects");
        } else if(defectView) {
            
            // - - - - - DEFECT VIEW GRAPH - - - - -
            
            // Set Left Y axis domain
            y3.domain([0, d3.max(data, function(d) { 
                var max = 0;
                selectedDefCodes.forEach(function(cd) {
                    if(max < d.defcodeoccur[cd]) max = d.defcodeoccur[cd];
                });
                return max;
            })]);
            
            // For each selected defect code, create bar
            for(var i = 0; i < selectedDefCodes.length; i++) {
                svg.selectAll(".defbar" + i)
                        .data(data)
                    .enter().append("rect")
                        .attr("x", function(data) {
                            var xpos = x(data.date) + ((x.bandwidth()/selectedDefCodes.length)*i);
                            return xpos; 
                        })
                        .attr("width", x.bandwidth()/selectedDefCodes.length)
                        .attr("y", function(d) {
                            return y3(d.defcodeoccur[selectedDefCodes[i]]); 
                        })
                        .attr("height", function(d) { 
                            return height - y3(d.defcodeoccur[selectedDefCodes[i]]); 
                        })
                        .attr("fill", color(defectCodes.indexOf(selectedDefCodes[i])/defectCodes.length))
                        .on('mouseover', function(d) {
                            tooltip.attr("style", "background-color: #fffd;");
                            showTooltip("<strong>Selected Defects: <br>" + prettyDefects(d.defcodeoccur) + "</strong>");
                        })
                        .on('mousemove', function(d) {
                            moveTooltip();
                        })
                        .on('mouseout', function(d) {
                            hideTooltip();
                        });
            }
            
            // Left Y Axis (Defect Amount)
            svg.append("g")
                .attr("class", "left-axis-black")
                .call(d3.axisLeft(y3).tickFormat(d3.format('d')));
            
            // Left Y Axis Text
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("font-weight", "bold")
                .attr("y", 0 - 25)
                .attr("x", 0 - height/2)
                .style("text-anchor", "middle")
                .text("Defect Total");
        } else if (trendView) {
            
            // - - - - - TREND VIEW GRAPH - - - - -
            
            svg.selectAll(".trendLine")
                    .data([data])
                .enter().append("path")
                    .attr("d", function(d) {
                        return trendLine(d);
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("fill", "none");
            
            // Left Y Axis (Total Defects)
            svg.append("g")
                .call(d3.axisLeft(y2));

            // Left Y Axis Text
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("font-weight", "bold")
                .attr("y", 0 - 25)
                .attr("x", 0 - height/2)
                .style("text-anchor", "middle")
                .text("Total Defects");
        }
        
        // X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // X Axis Text
        svg.append("text")
            .attr("transform", "translate(" + width/2 + ", " + (height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Date");
    }
    
    function showTooltip(data) {
        tooltip.html(data)
            .style("visibility","visible")
            .style('padding', '4px 8px')
            .style('width', 'auto');
            
        tooltipOffset.width = $(".bar-tooltip").width();
        moveTooltip();
    }
    
    function moveTooltip() {
        if (d3.event.pageX + tooltipOffset.width >= $("#svg-holder").offset().left + $("#svg-holder").width() - 5) {
            console.log("yes");
        } 
        if (d3.event.pageX + tooltipOffset.width < $("#svg-holder").offset().left + $("#svg-holder").width() && tooltipOffset.flipped){
            
        }
        tooltip.style("top",(d3.event.pageY + tooltipOffset.y)+ "px")
            .style("left",(d3.event.pageX + tooltipOffset.x)+ "px");
        // var calcleft = tooltip.attr("width")
        
    }
    
    function hideTooltip() {
        tooltip.style("visibility","hidden");
    }
    
    function prettyDefects(d) {
        var s = "";
        var totes = 0;
        
        defectCodes.forEach(function(cd) {
            if(d.hasOwnProperty(cd)) {
                if(defectView && selectedDefCodes.indexOf(cd) < 0) return;
                if(d[cd] != 0) {
                    s += '<span style="color: ' + (defectView ? color(defectCodes.indexOf(cd)/defectCodes.length) : 'white') + '">' + 
                        cd + ' : ' + d[cd] + '</span><br>';
                    totes += d[cd];
                }
            }
        });
        
        s += "Total: " + totes;
        return s
    }
    
    function getDate(s) {
        var aSplit = s.split('/');
        return new Date(aSplit[2], aSplit[0] - 1, aSplit[1]);
    }
});