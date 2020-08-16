
let hostDateTracker;
function initializeSchedule() {
  $(".table-col").empty();
  console.log("initializing schedule!");

  for (let table of insideTables) {

    let timeIterator = moment(earliestResTime, "HHmm");
    let tableId = `#table${table.tableNumber}`;
    console.log("----tableID------", tableId);
    if (table.reservations.length === 0) {
      while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {

        isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;

        let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
        button.addClass("schedule-button");
        $(tableId).append(button).append($("<br>"));

        timeIterator.add(15, "m");
      }
    }
  }
}

$("#date").change(function () {
 
  if (hostDateTracker === $(this).val()) {
    return;
  } 
  hostDateTracker = $(this).val();

    console.log("-------------", $(this).val());
  console.log(hostDateTracker);
  resCount[1600] = 3;
  resCount[1800] = 3;
  
  initializeSchedule();
  
})

