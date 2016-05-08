document.addEventListener("DOMContentLoaded", main);

var subList = [];
var showData = [['Task', 'Percentage']];

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
      console.log("showdata: " + showData);
    }
    else {
      console.log("Info is null?");
    }
  }
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

function deletelol(value){
  delete value;
}
