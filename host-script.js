
let hostDateTracker;
function initializeSchedule() {
  console.log("initializing schedule!");

  for (let table of insideTables) {

    let timeIterator = moment(earliestResTime, "HHmm");
    let tableClass = `.table-${table.tableNumber}`;
    if (table.reservations.length === 0) {
      while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;
       
        let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
        button.addClass("schedule-button");
        $(rowClass).find(tableClass).html(button);
      

        timeIterator.add(15, "m");
      }
    }

    for (let [i, res] of table.reservations.entries()){
      while(timeIterator.isBefore(res.time)){
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        let button = $("<button>").addClass("schedule-button");
        if (res.time.diff(timeIterator, "m") < 90){
           button.addClass("unavailable-button"); 
        } else if (resCount[timeIterator.format("HHmm")] >= 3){
          button.addClass("unavailable-button");
        } else button.addClass("available-button");

        $(rowClass).find(tableClass).html(button);
        timeIterator.add(15, "m");
      }

      if(timeIterator.isSame(res.time)){
        let button = $("<button>").addClass("schedule-button res-button");
        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).html(button);
        timeIterator.add(90, "m");
      }
      console.log("--------------i=", i);
      console.log("table.reservations.length", table.reservations.length);
      if(i === table.reservations.length -1){
        while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
          console.log("***************in while loop after reservations");
          let rowClass = `.row-${timeIterator.format("HHmm")}`;
          isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;
         
          let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
          button.addClass("schedule-button");
          $(rowClass).find(tableClass).html(button);
        
  
          timeIterator.add(15, "m");
        }
      }
      
    }
  }

  for (let table of outsideTables) {

    let timeIterator = moment(earliestResTime, "HHmm");
    let tableClass = `.table-${table.tableNumber}`;
    if (table.reservations.length === 0) {
      while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;
       
        let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
        button.addClass("schedule-button");
        $(rowClass).find(tableClass).html(button);
      

        timeIterator.add(15, "m");
      }
    }

    for (let [i, res] of table.reservations.entries()){
      while(timeIterator.isBefore(res.time)){
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        let button = $("<button>").addClass("schedule-button");
        if (res.time.diff(timeIterator, "m") < 90){
           button.addClass("unavailable-button"); 
        } else if (resCount[timeIterator.format("HHmm")] >= 3){
          button.addClass("unavailable-button");
        } else button.addClass("available-button");

        $(rowClass).find(tableClass).html(button);
        timeIterator.add(15, "m");
      }

      if(timeIterator.isSame(res.time)){
        let button = $("<button>").addClass("schedule-button res-button");
        $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).html(button);
        timeIterator.add(90, "m");
      }
      console.log("--------------i=", i);
      console.log("table.reservations.length", table.reservations.length);
      if(i === table.reservations.length -1){
        while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
          console.log("***************in while loop after reservations");
          let rowClass = `.row-${timeIterator.format("HHmm")}`;
          isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;
         
          let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
          button.addClass("schedule-button");
          $(rowClass).find(tableClass).html(button);
        
  
          timeIterator.add(15, "m");
        }
      }
      
    }
  }
}

$("#date").change(function () {

  if (hostDateTracker === $(this).val()) {
    return;
  }
  hostDateTracker = $(this).val();

  console.log(hostDateTracker);
  // resCount[1600] = 3;
  // resCount[1800] = 3;

  window.setTimeout(function(){
    buildScheduleGrid();
    initializeSchedule();
  }, 1000)

  
})

function buildScheduleGrid() {
  $("#time-rows").empty();
  console.log("building schedule grid!");
  
  let timeIterator = moment(earliestResTime, "HHmm");
  while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
    console.log("----------in the while loop!--------");
    let timeRowHTML = `
  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 time-header">
    ${timeIterator.format("h:mm")}
  </div>

  <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11">
    <div class="row">
      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
        <div class="row">
          <div class="col-lg col-md col-sm col-xs table-1">
          </div>
          <div class="col-lg col-md col-sm col-xs table-2">
          </div>
          <div class="col-lg col-md col-sm col-xs table-3">
          </div>
          <div class="col-lg col-md col-sm col-xs table-4">
          </div>
          <div class="col-lg col-md col-sm col-xs table-5">
          </div>
          <div class="col-lg col-md col-sm col-xs table-6">
          </div>
          <div class="col-lg col-md col-sm col-xs table-7">
          </div>
          <div class="col-lg col-md col-sm col-xs table-8">
            
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
        <div class="row">
          <div class="col-lg col-md col-sm col-xs table-100">
          </div>
          <div class="col-lg col-md col-sm col-xs table-102">
          </div>
          <div class="col-lg col-md col-sm col-xs table-105">
          </div>
          <div class="col-lg col-md col-sm col-xs table-106">
          </div>
        </div>
      </div>
    </div>
  </div>`;
    let timeRow = $("<div>").addClass(`row row-${timeIterator.format("HHmm")} time-row`)
    timeRow.html(timeRowHTML);
    $("#time-rows").append(timeRow);
    timeIterator.add(15, "m");
  }
}

