document.addEventListener("DOMContentLoaded", main);

var subList = [];
var showData = [['Task', 'Percentage']];
var saveShowData;
var temp;

function main(){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  while(document.getElementById("showLALA") !== null) {
    var show = String(document.getElementById("showLALA").innerHTML);
    var stat = parseInt(document.getElementById("statLALA").innerHTML);
    document.getElementById("showLALA").remove();
    document.getElementById("statLALA").remove();
    if (show !== null && stat !== null){
      subList.push(show);
      subList.push(stat);
      showData.push(subList);
      subList = [];
    }
    else {
      console.log("Info is null?");
    }
  }
  //check the the values are at or near 100 for debugging!
  function numbersOnly(value) {
    value.splice(0, 1);
    return value;
  }

  /*------------------------------------------------------------------------------------
    DEEP COPY CODE FROM STACK OVERFLOW
http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
-------------------------------------------------------------------------------------*/
  function clone(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
  /*------------------------------------------------------------------------------------
    (end) DEEP COPY CODE FROM STACK OVERFLOW
    -------------------------------------------------------------------------------------*/
  saveShowData = clone(showData).splice(1,showData.length);
  var filtered = saveShowData.filter(numbersOnly);
  var total = filtered.reduce(function(a, b) {
    return parseInt(a) + parseInt(b);
  });
  console.log("TOTAL: " + total);

  function drawChart() {
    var data = google.visualization.arrayToDataTable(showData);
    var options = {
      width: 1300,
      height: 720,
      fontName: 'Roboto',
      legend:'left',
      colors: ['#9C0712', '#EF2030', '#EE3C4A', '#EF737C', '#EF8A91', '#F0ADB2', '#9E3038'],
      pieHole: 0.4,
      pieSliceTextStyle: {
        color: 'black',
      }
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
  }
}
function listRandom() {
  //random show suggestion
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      //add each of the shows to an array
      var arrayOfShows = (request.responseText).split(',');
      console.log(arrayOfShows);
      //pick an index at random
      var randomIndex = Math.floor(Math.random() * arrayOfShows.length);
      console.log(randomIndex);
      document.getElementById("random").innerHTML = "<h7>" + arrayOfShows[randomIndex] + "</h7>";
    }
  };
  request.open("GET", "/js/shows.txt", true);
  request.send();
}
