google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

document.addEventListener("DOMContentLoaded", main);
var subList = [];
var showData = [['Task', 'Percentage']];

function main(){
  while(document.getElementById("showLALA") !== null) {
    var show = document.getElementById("showLALA").innerHTML;
    var stat = document.getElementById("statLALA").innerHTML;
    document.getElementById("showLALA").remove();
    document.getElementById("statLALA").remove();
    if (show !== null && stat !== null){
      console.log("SHOWWW: " + show);
      console.log("STATTT: " + stat);
      subList.push(show);
      subList.push(stat);
      showData.push(subList);
      subList = [];
      console.log("sublist" + subList);
      console.log("showdata" + showData);
    }
    else {
      console.log("says that the info is null");
    }
  }
  drawChart();
}
function drawChart() {
  console.log("showdata: " + showData);
  var data = google.visualization.arrayToDataTable(showData);
  var options = {
    width: 1300,
    height: 720,
    fontName: 'Roboto',
    legend:'left',
    colors: ['#EF2030', '#EE3C4A', '#EF737C', '#EF8A91', '#F0ADB2'],
    pieHole: 0.4,
    pieSliceTextStyle: {
      color: 'black',
    }
  };
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
