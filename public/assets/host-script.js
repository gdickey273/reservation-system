let hostDateTracker;
let currentDropdown;
async function initializeSchedule() {
  await initializeTables();
  let isReservation = false;
  let isAvailable = false;
  let resButtonDropdown = `<div class= "dropdown-content">
  <button class="reschedule-button">Reschedule</button>
  <button class="delete-button">Delete Reservation</button>
  </div>
   `;
  let availableButtonDropdown = `<div class= "dropdown-content">
  <button class="schedule-reservation-button">Schedule Reservation</button>
  </div>
   `;

  function buildDivHTML() {
    return `<div class=dropdown>
    <button class="schedule-button ${isReservation ? "res-button" : isAvailable ? "available-button" : "unavailable-button"}"></button>
    ${isReservation ? resButtonDropdown : isAvailable ? availableButtonDropdown : ""}
    </div>`;
  };

  console.log("initializing schedule!");

  for (let table of insideTables) {

    let timeIterator = moment(earliestResTime, "HHmm");
    let tableClass = `.table-${table.tableNumber}`;
    if (table.reservations.length === 0) {
      while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;


        // let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
        // button.addClass("schedule-button");
        $(rowClass).find(tableClass).html(buildDivHTML());


        timeIterator.add(15, "m");
      }
    }

    for (let [i, res] of table.reservations.entries()) {
      while (timeIterator.isBefore(res.time)) {
        isReservation = false;
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        // let button = $("<button>").addClass("schedule-button");
        if (res.time.diff(timeIterator, "m") < 90) {
          // button.addClass("unavailable-button");
          isAvailable = false;
        } else if (resCount[timeIterator.format("HHmm")] >= 3) {
          //button.addClass("unavailable-button");
          isAvailable = false;
        } else isAvailable = true; //button.addClass("available-button");

        $(rowClass).find(tableClass).html(buildDivHTML());
        timeIterator.add(15, "m");
      }

      if (timeIterator.isSame(res.time)) {
        console.log("``````````````````````tableclass!", tableClass);

        //let button = $("<button>").addClass("schedule-button res-button");
        isReservation = true;
        for (let i = 0; i < 6; i++) {
          $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).html(buildDivHTML);
          timeIterator.add(15, "m");
        }

      }
      console.log("--------------i=", i);
      console.log("table.reservations.length", table.reservations.length);
      if (i === table.reservations.length - 1) {
        isReservation = false;
        while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
          console.log("***************in while loop after reservations");
          let rowClass = `.row-${timeIterator.format("HHmm")}`;
          isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;

          // let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
          //button.addClass("schedule-button");
          $(rowClass).find(tableClass).html(buildDivHTML);


          timeIterator.add(15, "m");
        }
      }

    }


    //Listen for schedule button clicks
    // $(".dropdown").click(function (event) {
    //   event.stopPropagation();
    //   event.stopImmediatePropagation();
    //   console.log($(this));
    //   if (currentDropdown) {
    //     currentDropdown.css("display", "none");
    //   }
    //   currentDropdown = $(this).find(".dropdown-content");
    //   currentDropdown.css("display", "block");
    //   //If its an available or res button, add dropdown
    //   if ($(this).hasClass("available-button")) {
    //     console.log($(this));
    //   } else if ($(this).hasClass("res-button")) {
    //     console.log("wanna edit or delete this res?");
    //   }
    // });
  }

  for (let table of outsideTables) {
    console.log("Looking at outside tables!");


    let timeIterator = moment(earliestResTime, "HHmm");
    let tableClass = `.table-${table.tableNumber}`;
    if (table.reservations.length === 0) {
      console.log(`Table ${table.tableNumber} has no reservations!`);
      while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;

        // let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
        // button.addClass("schedule-button");
        $(rowClass).find(tableClass).html(buildDivHTML());


        timeIterator.add(15, "m");
      }
    }

    for (let [i, res] of table.reservations.entries()) {
      console.log("-----------------time iterator: ", timeIterator.format("HHmm") + " res.time: " + res.time.format("HHmm"));
      while (timeIterator.isBefore(res.time)) {
        isReservation = false;
        let rowClass = `.row-${timeIterator.format("HHmm")}`;
        // let button = $("<button>").addClass("schedule-button");
        if (res.time.diff(timeIterator, "m") < 90) {
         // button.addClass("unavailable-button");
         isAvailable = false;
        } else if (resCount[timeIterator.format("HHmm")] >= 3) {
          //button.addClass("unavailable-button");
          isAvailable = false;
        } else isAvailable = true; //button.addClass("available-button");

        $(rowClass).find(tableClass).html(buildDivHTML());
        timeIterator.add(15, "m");
      }

      // console.log("-----------------time iterator: ", timeIterator.format("HHmm") + " res.time: " + res.time.format("HHmm"));
      if (timeIterator.isSame(res.time)) {
        //let button = $("<button>").addClass("schedule-button res-button");
        isReservation = true;
        for (let i = 0; i < 6; i++) {
          $(`.row-${timeIterator.format("HHmm")}`).find(tableClass).html(buildDivHTML);
          timeIterator.add(15, "m");
        }

    

      }
      console.log("--------------i=", i);
      console.log("table.reservations.length", table.reservations.length);
      if (i === table.reservations.length - 1) {
        isReservation = false;
        while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
          console.log("***************in while loop after reservations");
          let rowClass = `.row-${timeIterator.format("HHmm")}`;
          isAvailable = resCount[timeIterator.format("HHmm")] < 3 ? true : false;

          // let button = $("<button>").addClass(isAvailable ? "available-button" : "unavailable-button");
          // button.addClass("schedule-button");
          $(rowClass).find(tableClass).html(buildDivHTML);


          timeIterator.add(15, "m");
        }
      }

    }
  }

  $(".dropdown").click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log($(this));
    if (currentDropdown) {
      currentDropdown.css("display", "none");
    }
    currentDropdown = $(this).find(".dropdown-content");
    currentDropdown.css("display", "block");
    //If its an available or res button, add dropdown
    if ($(this).hasClass("available-button")) {
      console.log($(this));
    } else if ($(this).hasClass("res-button")) {
      console.log("wanna edit or delete this res?");
    }
  });
}

$("#date").change(function () {

  if (hostDateTracker === $(this).val()) {
    return;
  }
  hostDateTracker = $(this).val();

  console.log(hostDateTracker);
  // resCount[1600] = 3;
  // resCount[1800] = 3;

  buildScheduleGrid();
    initializeSchedule();
  // window.setTimeout(function () {
    
  // }, 1000)


})

function buildScheduleGrid() {
  $("#time-rows").empty();
  console.log("building schedule grid!");
  $("#schedule-table").html(`<tr id="header-row">
  <th></th>
  <th class="table-1">Table 1</th>
  <th class="table-2">Table 2</th>
  <th class="table-3">Table 3</th>
  <th class="table-4">Table 4</th>
  <th class="table-5">Table 5</th>
  <th class="table-6">Table 6</th>
  <th class="table-7">Table 7</th>
  <th class="table-8">Table 8</th>
  <th class="table-100">Table 100</th>
  <th class="table-102">Table 102</th>
  <th class="table-105">Table 105</th>
  <th class="table-106">Table 106</th>
</tr>`);
  let timeIterator = moment(earliestResTime, "HHmm");
  while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
    console.log("----------in the while loop!--------");
    let timeRowHTML = `
      <th>${timeIterator.format("h:mm")}</th>
      <td class="table-1"></td>
      <td class="table-2"></td>
      <td class="table-3"></td>
      <td class="table-4"></td>
      <td class="table-5"></td>
      <td class="table-6"></td>
      <td class="table-7"></td>
      <td class="table-8"></td>
      <td class="table-100"></td>
      <td class="table-102"></td>
      <td class="table-105"></td>
      <td class="table-106"></td>`
    
    let timeRow = $("<tr>").addClass(`row-${timeIterator.format("HHmm")} time-row`)
    timeRow.html(timeRowHTML);
    $("#schedule-table").append(timeRow);
    timeIterator.add(15, "m");
  }



}



function scheduleReservation(res) {
  localStorage.setItem("selectedReservation", JSON.stringify(res));
  window.location.href = "confirmreservation.html";
}

$(window).click(function (event) {
  console.log("click!");
  console.log($(this));
  if (currentDropdown) {
    currentDropdown.css("display", "none");
    currentDropdown = undefined;
  }
});