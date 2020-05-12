class Graph {
    constructor(id,data) {
        this.target = document.getElementById(id);
        this.graphData = data;

        this.poly = document.getElementById("polyStats");
        this.points = "";

        this.polySet = false;
        this.lieSet = false;
        this.agroSet = false;

        this.highlighted = false;
        this.highlightedTrait = "";

        this.highlightedSectors = false;
        this.highlightedSectorNums = [];
        this.highlightedSectorsColor = "";

        this.highlightedIssues = false;
        this.highlightedIssuesIds = [];

        this.lineTraits = ["extravert","spont","aggres","rigid","introvers","senzitiv","trevozhn","labil"];
        this.fullLinesPoints = [["999.5","119.5"],["1621.75","377.25"],["1879.5","999.5"],["1621.75","1621.75"],
                                ["999.5","1879.5"],["377.25","1621.75"],["119.5","999.5"],["377.25","377.25"]];
        this.pointLinesPoints = []; 

        document.getElementById("graph").style.opacity = "1";
        document.getElementById("traitsHolder").style.opacity = "1";
        document.querySelectorAll(".inputData").forEach((inputField) => {
            document.getElementById(inputField.id.concat("GradId")).style.width = (inputField.value * 40).toString().concat("px");
            setTimeout(function(){
                document.getElementById(inputField.id.concat("GradId")).style.transition = "width 0.1s ease";
            }, 1000);
        });
        this.buildPolygon();
        setTimeout(this.adjustLevels.bind(this), 700);
    }

    highlightSector(sectors, color) {
        var allSectors = this.target.getElementsByClassName("segment");
        if ( typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
            if (Array.isArray(sectors)) {
                this.dehighlightSectors();
                this.highlightedSectors = true;
                this.highlightedSectorNums = sectors;
                this.highlightedSectorsColor = color;
                for (const sector in sectors) {
                    if (sectors[sector] >= 1 && sectors[sector] <= 8) {
                        allSectors[sectors[sector]-1].style.fill = color;
                        allSectors[sectors[sector]-1].setAttribute("fill-opacity", "0.4");
                        
                        var firstPoint = this.pointLinesPoints[sectors[sector]-1];
                        
                        if (sectors[sector] == 8) {
                            var secondPoint = this.pointLinesPoints[0];
                        }
                        else {
                            var secondPoint = this.pointLinesPoints[sectors[sector]]; 
                        }
                        var innerPoints = "1000, 1000 ".concat(firstPoint[0].toString(),", ",firstPoint[1].toString()," ",secondPoint[0].toString(),", ",secondPoint[1].toString());

                        var someSector = document.getElementById(sectors[sector].toString());
                        anime({
                            targets: someSector,
                            points: [
                                {value: innerPoints}
                            ],
                            easing: 'easeInOutQuint',
                            duration: 300,
                        });
                        document.getElementById(sectors[sector].toString()).style.fill = color;
                        document.getElementById(sectors[sector].toString()).setAttribute("fill-opacity","0.5");
                    }
                    else {
                        console.log(sectors[sector], " is out of bounds")
                    }
                } 
            }
            else if (Number.isInteger(sectors) && sectors >= 1 && sectors <= 8) {
                this.highlightedSectors = true;
                this.highlightedSectorNums = sectors;
                this.highlightedSectorsColor = color;
                allSectors[sectors-1].style.fill = color;
                allSectors[sectors-1].setAttribute("fill-opacity", "0.5");
            }
            else {
                console.log("invalid sector num")
            }
        }
        else {
            console.log("invalid color input")
        }
    }
    dehighlightSectors() {
        var allSectors = this.target.getElementsByClassName("segment");
        for (var index = 0; index < 8; index++) {
            allSectors[index].style.fill = "none";
            document.getElementById((index+1).toString()).style.fill = "none";
        }
        this.highlightedSectors = false;
        this.highlightedSectorNums = [];
        this.highlightedSectorsColor = ""; 
    }

    adjustLevels() {
        var aggr = this.target.getElementsByClassName("agro");
        var lie = this.target.getElementsByClassName("lie");

        if (this.graphData.agro > 0 && this.graphData.agro <= 9) {
            var aggrLevel = (this.graphData.agro * 94.33).toString();
            if (this.agroSet) {
                anime({
                    targets: '.agro',
                    r: aggrLevel,
                    easing: 'easeInOutQuint',
                    duration: 200,
                    loop: false
                });
            }
            else {
                anime({
                    targets: '.agro',
                    r: aggrLevel,
                    easing: 'easeInOutCirc',
                    duration: 1000,
                    loop: false
                });
                this.agroSet = true;
            }

            aggr[0].setAttribute("stroke-width","10");

            var aggrDash = ((2 * Math.PI * aggrLevel)/40);
            aggr[0].setAttribute("stroke-dasharray", aggrDash.toString());

            var aggrOffset = aggrDash / 2 
            aggr[0].setAttribute("stroke-dashoffset", aggrOffset.toString());
        }
        else if (this.graphData.agro == 0) {
            aggr[0].setAttribute("r", "0");
        }

        if (this.graphData.lie > 0 && this.graphData.lie <= 9) {
            var lieLevel = (this.graphData.lie * 94.33).toString();
            if (this.lieSet) {
                anime({
                    targets: '.lie',
                    r: lieLevel,
                    easing: 'easeInOutQuint',
                    duration: 200,
                    loop: false
                });
            }
            else {
                anime({
                    targets: '.lie',
                    r: lieLevel,
                    easing: 'easeInOutCirc',
                    duration: 1000,
                    loop: false
                });
                this.lieSet = true;
            }


            lie[0].setAttribute("stroke-width","10");

            var lieDash= ((2 * Math.PI * lieLevel)/40).toString();
            lie[0].setAttribute("stroke-dasharray", lieDash);

            var lieOffset = lieDash / 2 
            lie[0].setAttribute("stroke-dashoffset", lieOffset.toString());
        }
        else if (this.graphData.lie == 0) {
            lie[0].setAttribute("r", "0");
        }
    }

    highlight(trait) {
        if (typeof trait === 'string') {
            var cases = ["lie","agro","extravert","spont","aggres","rigid","introvers","senzitiv","trevozhn","labil"]
            if (cases.includes(trait)) {
                this.adjustLevels();
                this.dehighlight();
                this.highlighted = true;
                this.highlightedTrait = trait;
                switch (trait) {
                    case cases[0]:
                        var lieLevel = (this.graphData.lie * 94.33).toString();
                        this.target.getElementsByClassName(cases[0])[0].setAttribute("stroke-dasharray",(3 * Math.PI * lieLevel).toString());
                        this.target.getElementsByClassName(cases[0])[0].setAttribute("stroke-width","16");
                        break;
                    case cases[1]:
                        var aggrLevel = (this.graphData.agro * 94.33 ).toString();
                        this.target.getElementsByClassName(cases[1])[0].setAttribute("stroke-dasharray",(3 * Math.PI * aggrLevel).toString());
                        this.target.getElementsByClassName(cases[1])[0].setAttribute("stroke-width","16");
                        break;
                    default:
                        document.getElementById("lineFull").setAttribute("stroke-width","20");
                        document.getElementById("lineFull").setAttribute("x2",this.fullLinesPoints[this.lineTraits.indexOf(trait)][0]);
                        document.getElementById("lineFull").setAttribute("y2",this.fullLinesPoints[this.lineTraits.indexOf(trait)][1]);

                        document.getElementById("linePoint").setAttribute("stroke-width","20");
                        document.getElementById("linePoint").setAttribute("x2",this.pointLinesPoints[this.lineTraits.indexOf(trait)][0]);
                        document.getElementById("linePoint").setAttribute("y2",this.pointLinesPoints[this.lineTraits.indexOf(trait)][1]);

                        anime({
                            targets: '.selLine',
                            strokeDashoffset: [anime.setDashoffset, 0],
                            easing: 'easeInOutQuint',
                            duration: 300,
                            direction: 'alternate',
                            loop: false
                          });
                }
            }
            else {
                console.log("this trait does not exist on this graph");
            }
        }
        else {
            console.log("input should be string")
        }
    }
    dehighlight() {
        if (this.highlightedTrait === "lie" || this.highlightedTrait === "agro") {
            this.adjustLevels();
            this.highlighted = false;
            this.highlightedTrait = "";
        }
        else if (this.highlightedTrait != "") {
            anime({
                targets: '.selLine',
                strokeDashoffset: [0, anime.setDashoffset],
                easing: 'easeInOutQuint',
                duration: 100,
                direction: 'alternate',
                loop: false
            });
            this.highlighted = false;
            this.highlightedTrait = "";
        }
        else {
            console.log("nothing is highlighted");
        }
    }
    highlightIssues() {
        this.dehighlightIssues();
        document.getElementById("outer").setAttribute("fill-opacity","1");
        this.highlightedIssues = true;
        for (var trait in this.lineTraits) {
            if (this.graphData[this.lineTraits[trait]] < 3 || this.graphData[this.lineTraits[trait]] > 6) {
                var traitIndex = this.lineTraits.indexOf(this.lineTraits[trait])+1;
                document.getElementById("circle".concat(traitIndex)).setAttribute("cx",this.pointLinesPoints[traitIndex-1][0]);
                document.getElementById("circle".concat(traitIndex)).setAttribute("cy",this.pointLinesPoints[traitIndex-1][1]);
                document.getElementById("circle".concat(traitIndex)).setAttribute("fill", "#EA3323");
                this.highlightedIssuesIds.push(traitIndex);
            }
        }
    }
    dehighlightIssues() {
        if (this.highlightedIssues) {
            this.highlightedIssues = false;
            document.getElementById("outer").setAttribute("fill-opacity","0");
            for (var id in this.highlightedIssuesIds) {
                document.getElementById("circle".concat(this.highlightedIssuesIds[id])).setAttribute("fill","none");
            }
            this.highlightedIssuesIds = [];
        }
        else {
            console.log("issues were not highlighted");
        }
    }
    buildPoints() {
        this.points = "";
        var traitIndex = 1;
        this.pointLinesPoints = [];
        for (const trait in this.lineTraits) {
            var side = this.graphData[this.lineTraits[trait]] * 94.33 * (Math.sqrt(2) / 2);
            var xpoint = 1000;
            var ypoint = 1000;
            switch(traitIndex) {
                case 1:
                    traitIndex++;
                    ypoint -= this.graphData[this.lineTraits[trait]] * 94.33;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                case 2:
                    traitIndex++; 
                    ypoint -= side;
                    xpoint += side;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                case 3:
                    traitIndex++;
                    xpoint += this.graphData[this.lineTraits[trait]] * 94.33;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;   
                case 4:
                    traitIndex++;
                    ypoint += side;
                    xpoint += side;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                case 5:
                    traitIndex++;
                    ypoint += this.graphData[this.lineTraits[trait]] * 94.33;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                case 6:
                    traitIndex++;
                    ypoint += side;
                    xpoint -= side;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                case 7:
                    traitIndex++;
                    xpoint -= this.graphData[this.lineTraits[trait]] * 94.33;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                case 8:
                    traitIndex++;
                    ypoint -= side;
                    xpoint -= side;
                    this.points = this.points.concat(xpoint.toString(),", ",ypoint.toString()," ");
                    this.pointLinesPoints.push([xpoint.toString(),ypoint.toString()]);
                    break;
                default: 
                    console.log("error wrong point");
            }
        }
    }
    buildPolygon() {
        this.buildPoints();
        document.getElementById("polyStatsGrad").setAttribute("fill","url(#polyGrad)");
        document.getElementById("polyStatsGrad").setAttribute("fill-opacity","0.8");
        this.poly.setAttribute("stroke", "#576B88");
        this.poly.setAttribute("stroke-width", "10");
        if (this.polySet) {
            anime({
                targets: ".polyMorph",
                points: [
                    {value: this.points}
                ],
                easing: 'easeOutCubic',
                duration: 200,
            });
        }
        else {
            anime({
                targets: ".polyMorph",
                points: [
                    {value: this.points}
                ],
                easing: 'easeInOutCirc',
                duration: 1500,
            });
            this.polySet = true;
        }

    }
    refreshPolygon() {
        this.buildPoints();
        this.adjustLevels();

        if (this.highlightedSectors) {
            this.highlightSector(this.highlightedSectorNums, this.highlightedSectorsColor)
        }
        if (this.highlighted) {
            this.highlight(this.highlightedTrait)
        }
        if (this.highlightedIssues) {
            this.highlightIssues()
        }

        anime({
            targets: ".polyMorph",
            points: [
                {value: this.points}
            ],
            easing: 'easeInOutQuint',
            duration: 200,
        });
    }
}


someData = {"lie":2,"agro":6,"extravert":2,"spont":6,"aggres":5,"rigid":6,"introvers":5,"senzitiv":4,"trevozhn":7,"labil":2};

setTimeout(function() {graph = new Graph("graph", someData);},500);

document.querySelectorAll(".inputData").forEach((inputField) => {
    inputField.addEventListener("input", function() {
        someData[inputField.id] = inputField.value;
        console.log(document.getElementById(inputField.id.concat("GradId")));
        document.getElementById(inputField.id.concat("GradId")).style.width = (inputField.value * 40).toString().concat("px");
        document.getElementById(inputField.id.concat("Vindicator")).innerHTML = inputField.value;
        graph.refreshPolygon();
    })
});

/*document.getElementById("btnHighlight").addEventListener("click", highlightAUX);
function highlightAUX() {
    graph.highlight(document.getElementById("highlight").value);
}
document.getElementById("deBtnHighlight").addEventListener("click", deHighlightAUX);
function deHighlightAUX() {
    graph.dehighlight();
}

document.getElementById("btnSector").addEventListener("click", sectorAUX);
function sectorAUX() {
    const inputNums = document.getElementById("highlightSectorNums").value.split(", ");
    const inputColor = document.getElementById("highlightSectorColor").value;
    graph.highlightSector(inputNums, inputColor);
}
document.getElementById("deBtnSector").addEventListener("click", deSectorAUX);
function deSectorAUX() {
    graph.dehighlightSectors();
}

document.getElementById("btnIssues").addEventListener("click", issuesAUX);
function issuesAUX() {
    graph.highlightIssues();
}
document.getElementById("deBtnIssues").addEventListener("click", deIssuesAUX);
function deIssuesAUX() {
    graph.dehighlightIssues();
}
*/