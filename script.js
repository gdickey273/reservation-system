
var dateTracker;

// Get a reference to the database service

var insideTables = [
  {
    tableNumber: "1",
    capacity: 2,
    reservations: []
  },
  {
    tableNumber: "2",
    capacity: 2,
    reservations: []
  },
  {
    tableNumber: "3",
    capacity: 4,
    reservations: []
  }
  ,
  {
    tableNumber: "4",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "6",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "7",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "5",
    capacity: 6,
    reservations: []
  },
  {
    tableNumber: "8",
    capacity: 6,
    reservations: []
  }

];

var outsideTables = [
  {
    tableNumber: "100",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "102",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "105",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "106",
    capacity: 6,
    reservations: []
  }
];

var lowTopTables = [];

//var for testing
var tableRes;

var resCount = {};



//party number and time initialized for ease of testing
var partyNumber = 1;
var selectedDate = undefined;
var dayOfWeek;
var dayOfWeekName;
var time;
var earliestResTime = "";
var latestResTime = "";
var dataObj;
var reservationOptions = {};
var targetIsAvailableInside = false;
var alternativeIsAvalableInside = false;
var targetIsAvailableOutside = false;
var alternativeIsAvailableOutside = false;
var targetIsAvailableHighTop = false;
var alternativeIsAvailableHighTop = false;

var cloud = firebase.firestore();



//Something to do with the calendar widget
$(document).ready(function () {
  var input = $('#refresh');

  var date_input = $('input[name="date"]'); //our date input has the name "date"
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  date_input.datepicker({
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  })

  $('.timepicker').wickedpicker();
});

document.addEventListener("DOMContentLoaded", function () {
  var refresh = $("#refresh");
  if (refresh.val() === "yes") {
    location.reload(true);
  } else {
    refresh.val("yes");
  }
});

//Looks at the dayOfWeek variable and updates earliest and latest reservation time to match that day's business hours
function updateOperatingHours() {
  switch (dayOfWeek) {
    case 0:
      earliestResTime = moment("1000", "HHmm");
      latestResTime = moment("2000", "HHmm");
      dayOfWeekName = "Sunday";
      break;
    case 1:
      dayOfWeekName = "Monday";
      break;
    case 2:
      dayOfWeekName = "Tuesday";
      earliestResTime = moment("1600", "HHmm");
      latestResTime = moment("1930", "HHmm");
      break;
    case 3:
      dayOfWeekName = "Wednesday";
      earliestResTime = moment("1600", "HHmm");
      latestResTime = moment("1930", "HHmm");
      break;
    case 4:
      dayOfWeekName = "Thursday";
      earliestResTime = moment("1600", "HHmm");
      latestResTime = moment("1930", "HHmm");
      break;
    case 5:
      dayOfWeekName = "Friday";
      earliestResTime = moment("1600", "HHmm");
      latestResTime = moment("1930", "HHmm");
      break;
    case 6:
      earliestResTime = moment("1000", "HHmm");
      latestResTime = moment("2000", "HHmm");
      dayOfWeekName = "Saturday";
      break;

  }


  var timeIterator = moment(earliestResTime);
  while (timeIterator.isBefore(latestResTime) || timeIterator.isSame(latestResTime)) {
    resCount[timeIterator.format("HHmm")] = 0;
    timeIterator.add(15, "minutes");
  }
}

//Returns true if chosen time is within the day's operating hours and false otherwise
function isValidTime() {
  if (dayOfWeek === 1) {
    return false;
  }
  if (time.isAfter(earliestResTime) || time.isSame(earliestResTime)) {
    if (time.isBefore(latestResTime) || time.isSame(latestResTime)) {
      return true;
    }
  }

  return false;
}



//Saves date to selectedDate var and day of week (0-6) to dayOfWeek var
$("#date").change(function () {
  if (dateTracker === $(this).val()) {
    return;
  }
  dateTracker = $(this).val();
  selectedDate = moment($(this).val().replace(/\//g, ""), "L");
  dateCopy = moment($(this).val().replace(/\//g, ""), "L");
  dayOfWeek = selectedDate.day();
  updateOperatingHours();

  initializeTables();
console.log("++++++++++++++++++++++++++running again!");
});

//Saves time to time var when time field is changed
$(".timepicker").change(function () {
  // var strArray = $(this).val().split(" ");
  // var isPM = strArray[3] === "PM";
  // var hour = strArray[0];
  // if (isPM && hour < 12) {
  //   hour = parseInt(hour) + 12;
  // }
  // var minute = strArray[2];
  // time = moment(hour + minute, "HHmm");
  time = moment($(this).val(), "h:mm A");
});

//Saves party number to variable when party number button is clicked
$(".partyNumberButton").on("click", function () {
  $("#party-number-error").empty();
  $(".partyNumberButton").each(function () {
    $(this).removeClass("active");
  })
  $(this).addClass("active");
  var partyButton = $(this).children();
  if (partyButton.attr("id") === "partyOf-7") {
    $("#party-number-error").html("Because of our corona-virus policies, we ask that you please call us at (336) 525-2010 to make a reservation for parties of 7 or more.")
  }

  partyNumber = parseInt(partyButton.attr("id").split("-")[1]);

  console.log("party number in listener------", partyNumber);
});

$("#submit-button").click(function (event) {
  event.preventDefault();
  $(".error-message").empty();
  $("#reservation-selection-div").css("display", "none");
  if (isValidTime() && partyNumber < 7) {
    checkAvailability();
  } else if (dayOfWeek === 1) {
    console.log("should be changing text!");
    $("#date-error-message").text("We're closed on Mondays! Please choose another day");
  } else if (time.isBefore(earliestResTime)) {
    $("#time-error-message").text("We don't open until " + earliestResTime.format("h:mm A") + " on " + dayOfWeekName + "'s. Please choose another time");
  } else if (time.isAfter(latestResTime)) {
    $("#time-error-message").text("We stop taking reservations at " + latestResTime.format("h:mm A") + " on " + dayOfWeekName + "'s. Please choose another time");
  } else if (partyNumber === 7) {
    $("#party-number-error").html("Because of our corona-virus policies, we ask that you please call us at (336) 525-2010 to make a reservation for parties of 7 or more.")
  }

});

//For each table object in inside/outside table array, pull reservation data from cloud and push to table object's reservation array
async function initializeTables() {
  var docPath = "scheduleByDate/" + selectedDate._i + "/";
  // var cloudInsideTables = await cloud.collection("scheduleByDate").get();
  // cloudInsideTables.forEach(function(doc){
  //   console.log("...............", doc.data());
  // });



  await cloud.collection(docPath + "insideTables").get().then(function (querySnapshot) {
    for (let doc of querySnapshot.docs){
      let cloudReservations = _.sortBy(doc.data().reservations, "time");
      if (cloudReservations.length > 0){
        let tableIndex = insideTables.findIndex(x => x.tableNumber === cloudReservations[0].tableNumber);
        for (let res of cloudReservations){
          res.time = moment(res.time, "HHmm");
          insideTables[tableIndex].reservations.push(res)
        }
      }
      

    }
  });

  await cloud.collection(docPath + "outsideTables").get().then(function (querySnapshot) {
    for (let doc of querySnapshot.docs){
      let cloudReservations = _.sortBy(doc.data().reservations, "time");
      if (cloudReservations.length > 0){
        let tableIndex = outsideTables.findIndex(x => x.tableNumber === cloudReservations[0].tableNumber);
        for (let res of cloudReservations){
          res.time = moment(res.time, "HHmm");
          outsideTables[tableIndex].reservations.push(res)
        }
      }
      

    }
  });
  // insideTables.forEach(function (table) {
  //   deferred = cloud.doc(docPath + "insideTables/" + table.tableNumber).get().then(function (doc) {
  //     var data = doc.data();
  //     table.reservations = [];
  //     if (data != undefined && data.reservations != undefined) {
  //       var orderedResArray = _.sortBy(data.reservations, "time");

  //       orderedResArray.forEach(function (resObj) {
  //         resCount[resObj.time]++;
  //         resObj.time = moment(resObj.time, "HHmm");
  //         console.log("-------resTime-------", resObj.time.format("h:mm A"));
  //         console.log("-----same time, different format-----", resObj.time.format("HHmm"));
  //         table.reservations.push(resObj);

  //       })
  //     }

  //   });
    
  // });




  // outsideTables.forEach(function (table) {
  //   deferred = cloud.doc(docPath + "outsideTables/" + table.tableNumber).get().then(function (doc) {
  //     var data = doc.data();

  //     if (data != undefined && data.reservations != undefined) {
  //       var orderedResArray = _.sortBy(data.reservations, "time");

  //       orderedResArray.forEach(function (resObj) {
  //         resObj.time = moment(resObj.time, "HHmm");
  //         table.reservations.push(resObj);
  //       })
  //     }

  //   });
  //   deferredArray.push(deferred);

  // });

  lowTopTables = _.clone(insideTables);
  lowTopTables.pop();
}

function findTable(tableArray, time) {
  var emptySeats;
  var deadTime = 999;
  var bestOption = { deadTime: deadTime };

  if (resCount[time.format("HHmm")] === 3) {
    return undefined;
  }

  for (let table of tableArray) {
    var bestTableOption = { deadTime: 999 };
    var isConflictingRes = false;
    tableRes = table.reservations;
    emptySeats = table.capacity - partyNumber;

    //Dont consider 6 tops for 1 or 2 people. Return bestOption so far if it exists, otherwise return undefined to look for a different time
    if (emptySeats > 3) {
      if (bestOption.tableNumber === undefined) {
        console.log("--------emptySeats > 3 and no best option yet. return undefined------");
        return undefined;
      } else {
        console.log("----Starting to look at tables too large for party! Return: best option-----");
        return bestOption;
      }
    }




    //If a table doesn't have any reservations update bestOption and return it
    if (table.reservations.length === 0 && emptySeats >= 0) {
      bestOption = {
        tableNumber: table.tableNumber,
        time: time.format("HHmm"),
        deadTime: time.diff(earliestResTime, "minutes"),
        emptySeats,
        partyNumber,
        date: selectedDate.format("MM/DD/YYYY"),
        dayOfWeek
      };
      console.log("----no reservations at table! Return: best option-----");
      return bestOption;
    } else {

      //for each reservation in table
      for (let [i, reservation] of table.reservations.entries()) {
        console.log("........we're looking at table: " + table.tableNumber + "........");
        var resTime = moment(reservation.time, "h:mm A");
        console.log(time.format("HHmm") + "++++++++++++++++++" + resTime.format("HHmm"));



        //If target time is before existing res time, make sure there's 90 minute buffer. If not break and don't consider that table.
        //If theres more than 90 minutes buffer set dead time to difference - 90
        if (time.isBefore(reservation.time)) {
          if (reservation.time.diff(time, "minutes") < 90) {
            isConflictingRes = true;
            break;
          } else {
            deadTime = reservation.time.diff(time, "minutes") - 90;
            console.log("Dead time: " + deadTime);
            if (deadTime < bestTableOption.deadTime) {
              bestTableOption = {
                tableNumber: table.tableNumber,
                time: time.format("HHmm"),
                deadTime,
                emptySeats,
                partyNumber,
                date: selectedDate.format("MM/DD/YYYY"),
                dayOfWeek
              };

            }
            // if (bestOption.deadTime === 0 && i === table.reservations.length - 1) {
            //   console.log("----dead time = 0! Return: best option----- resTime: ", reservation.time);
            //   return bestOption;
            // }

          }

          //if target time is after existing res time, make sure theres 90 minute buffer. If not, look at next table. If 90 minutes buffer, set dead time and look at next reservation to ensure theres enough buffer there.
        } else if (time.isSame(reservation.time)) {
          isConflictingRes = true;
          console.log("time is same as current res time! break------- table number: ", table.tableNumber);
          break;

        } else if (time.isAfter(reservation.time)) {
          if (time.diff(reservation.time, "minutes") >= 90) {
            deadTime = time.diff(reservation.time, "minutes") - 90;
            console.log("----------table number--------", table.tableNumber)
            console.log("Dead time: " + deadTime);
            console.log("------best option dead time-----" + bestTableOption.deadTime);
            if (deadTime < bestTableOption.deadTime) {

              bestTableOption =
              {
                tableNumber: table.tableNumber,
                time: time.format("HHmm"),
                deadTime,
                emptySeats,
                partyNumber,
                date: selectedDate.format("MM/DD/YYYY"),
                dayOfWeek
              };

              // if (deadTime === 0 && i === table.reservations.length - 1) {
              //   console.log("----no dead time at table and is last res at table! Return: best option-----");
              //   return bestOption;
              // }
            }
          } else {
            isConflictingRes = true;
            break;
          }
        }
      }
    }
    if (!isConflictingRes && bestTableOption.deadTime < bestOption.deadTime) {
      bestOption = bestTableOption;
    }
  };
  console.log("-------end of the line!------");
  if (bestOption.deadTime === 999) {
    console.log("-----return undefined------");
    return undefined;
  } else {
    console.log("-----return best option-----");
    return bestOption;
  }
  //  return undefined;
}

function findTableBefore(tableArray, time) {
  var bestOptionBefore = undefined;
  var timeIterator = moment(time);
  timeIterator.subtract(15, "minutes");

  while (!timeIterator.isBefore(earliestResTime)) {
    console.log("------bestOptionBefore: " + JSON.stringify(bestOptionBefore));

    bestOptionBefore = findTable(tableArray, timeIterator);
    console.log("-----now we're after findTable()--------");

    if (bestOptionBefore != undefined) {
      console.log("returning bestOptionBefore!!!!!!!!", bestOptionBefore.tableNumber, bestOptionBefore.time);
      return bestOptionBefore;
    }

    console.log(timeIterator.format("HHmm"));
    timeIterator.subtract(15, "minutes");

    // if (timeIterator.isBefore(earliestResTime)) {
    //   return bestOptionBefore;
    // }
  }

  return bestOptionBefore;
}

function findTableAfter(tableArray, time) {
  var bestOptionAfter = undefined;
  var timeIterator = moment(time);
  timeIterator.add(15, "minutes");

  while (bestOptionAfter === undefined) {
    bestOptionAfter = findTable(tableArray, timeIterator);
    timeIterator.add(15, "minutes");
    if (timeIterator.isAfter(latestResTime)) {
      return bestOptionAfter;
    }
  }

  return bestOptionAfter;
}

function checkAvailability() {
  targetIsAvailableInside = false;
  alternativeIsAvalableInside = false;
  targetIsAvailableOutside = false;
  alternativeIsAvailableOutside = false;
  targetIsAvailableHighTop = false;
  alternativeIsAvailableHighTop = false;
  reservationOptions = {};
  $("#reservation-selection-div").css("display", "block");

  


    //If resCount[time] < 3, look for inside table at target time
    var targetTimeOption = undefined;
    if (resCount[time.format("HHmm")] < 3) {
      targetTimeOption = findTable(insideTables, time);
    }


    //If there are no tables availabe inside at target time, find available time before and after
    if (targetTimeOption === undefined) {

      //find before and store if found
      var insideBefore = findTableBefore(insideTables, time);

      if (insideBefore !== undefined) {

        //if table found is table 8 save option as h + time in reservationOptions[] and look for inside lowtop table
        if (insideBefore.tableNumber === "8") {
          alternativeIsAvailableHighTop = true;
          reservationOptions["h" + insideBefore.time] = insideBefore;
          var lowTopBefore = findTableBefore(lowTopTables, time);
          if (lowTopBefore !== undefined) {
            alternativeIsAvalableInside = true;
            reservationOptions["i" + lowTopBefore.time] = lowTopBefore;
          }

        } else {
          alternativeIsAvalableInside = true;
          reservationOptions["i" + insideBefore.time] = insideBefore;
        }

      }

      //find after and store if found
      var insideAfter = findTableAfter(insideTables, time);

      if (insideAfter !== undefined) {
        if (insideAfter.tableNumber === "8") {
          alternativeIsAvailableHighTop = true;
          reservationOptions["h" + insideAfter.time] = insideAfter;
          var lowTopAfter = findTableAfter(lowTopTables, time);
          if (lowTopAfter !== undefined) {
            alternativeIsAvalableInside = true;
            reservationOptions["i" + lowTopAfter.time] = lowTopAfter;
          }

        } else {
          alternativeIsAvalableInside = true;
          reservationOptions["i" + insideAfter.time] = insideAfter;
        }

      }

      //if table is available at target time, set targetAvailableInside = true
    } else {
      if (targetTimeOption.tableNumber === "8") {
        targetIsAvailableHighTop = true;
        reservationOptions["h" + time.format("HHmm")] = targetTimeOption;
        var lowTopTarget = findTable(lowTopTables, time);
        if (lowTopTarget !== undefined) {
          targetIsAvailableInside = true;
          reservationOptions["i" + time.format("HHmm")] = lowTopTarget;
        } else {
          var lowTopBefore = findTableBefore(lowTopTables, time);
          if (lowTopBefore !== undefined) {
            alternativeIsAvalableInside = true;
            reservationOptions["i" + lowTopBefore.time] = lowTopBefore;
          }

          var lowTopAfter = findTableAfter(lowTopTables, time);
          if (lowTopAfter !== undefined) {
            alternativeIsAvalableInside = true;
            reservationOptions["i" + lowTopAfter.time] = lowTopAfter;
          }

        }
      } else {
        targetIsAvailableInside = true;
        reservationOptions["i" + time.format("HHmm")] = targetTimeOption;
      }

      // var insideResultsHeader = $("<p>").html("We have an available table inside that meets your request! <br> Click below to continue.");
      // var resButton = $(".reservation-option-btn").html(time.format("h:mm A")).attr("data-location-time", "i" + time.format("HHmm"));
      // $("#inside-results").prepend(insideResultsHeader, resButton);
    }




    //look for table outside at target time
    targetTimeOption = undefined;
    if (resCount[time.format("HHmm")] < 3) {
      targetTimeOption = findTable(insideTables, time);
    }

    //if no table available at target time, look for available table before and after
    if (targetTimeOption === undefined) {
      var outsideBefore = findTableBefore(outsideTables, time);
      if (outsideBefore !== undefined) {
        alternativeIsAvailableOutside = true;
        reservationOptions["o" + outsideBefore.time] = outsideBefore;
      }

      var outsideAfter = findTableAfter(outsideTables, time);
      if (outsideAfter !== undefined) {
        alternativeIsAvailableOutside = true;
        reservationOptions["o" + outsideAfter.time] = outsideAfter;
      }


    } else {
      targetIsAvailableOutside = true;
      reservationOptions["o" + time.format("HHmm")] = targetTimeOption;
    }

    function buildResSelectionDiv() {
      var resDiv = $("#reservation-selection-div");
      $("#results-header").empty();
      var resultsHeader = $("<h5>").attr("id", "results-header");
      var insideHeader = $("<p>").html("Inside");
      var outsideHeader = $("<p>").html("Outside");
      var outsideSeatingDisclaimer = $("<p>").addClass("disclaimer").attr("id", "outside-seating-disclaimer");
      var highTopHeader = $("<p>").html("High-Top Table with Barstools");



      $("#inside-results").empty().append(insideHeader);
      $("#outside-results").empty().append(outsideHeader);
      $("#high-top-results").empty().append(highTopHeader);
      if (alternativeIsAvailableHighTop || targetIsAvailableHighTop) {
        $("#high-top-results").css("display", "block");
      } else $("#high-top-results").css("display", "none");



      if (targetIsAvailableInside) {
        if (targetIsAvailableOutside) {
          resultsHeader.html("We found tables that meet your request! Please choose below whether you'd like to be inside or outside.")
        } else if (alternativeIsAvailableOutside) {
          resultsHeader.html("We found a table that meets your request inside! We don't have that time available outside but we've listed some other options. Please select an option below to continue.");
        } else {
          resultsHeader.html("we found a table that meets your request inside! We're all booked outside on " + selectedDate.format("MM/DD/YYYY") + " but feel free to try another day or click continue below to confirm your reservation inside")
        }
      } else if (alternativeIsAvalableInside) {
        if (targetIsAvailableOutside) {
          resultsHeader.html("We found a table that meets your request Outside! We don't have that time available inside but we've listed some other options. Please select an option below to continue.");
        }
        if (alternativeIsAvailableOutside) {
          resultsHeader.html("We don't have any tables available at " + time.format("h:mm A") + " but we've listed some options for other available times in case any of them work for you!");
        }
        else {
          resultsHeader.html("Alternative inside, outside Booked");
        }
      } else {
        if (targetIsAvailableOutside) {
          resultsHeader.html("booked inside, target available outside");
        }
        else if (alternativeIsAvailableOutside) {
          resultsHeader.html("booked inside, alternative available outside");
        }
        else resultsHeader.html("Entire restaurant booked that day");

      }

      resDiv.prepend(resultsHeader);

      for (let [key, reservation] of Object.entries(reservationOptions)) {
        console.log("--------inside let loop to build buttons-------");
        console.log("-------key------", key);
        console.log("-------key[0]------", key[0]);
        var resButton = $("#res-btn-template").clone().removeAttr("id").html(moment(reservation.time, "HHmm").format("h:mm A"));
        resButton.attr("data-location-time", key);
        if (key[0] === "i") {
          $("#inside-results").append(resButton);
        } else if (key[0] === "o") {
          $("#outside-results").append(resButton);
        } else {
          $("#high-top-results").append(resButton);
        }
      }
      if (targetIsAvailableOutside || alternativeIsAvailableOutside) {
        $("#outside-results").append(outsideSeatingDisclaimer);
        $("#outside-seating-disclaimer").html("Please note that we cannot guarantee we'll have room to move you inside in case of rain or other foul weather!")
      }

    }

    buildResSelectionDiv();

    $(".reservation-option-btn").on("click", function (event) {
      $(".reservation-option-btn").removeClass("active");
      $(this).addClass("active");
      var key = event.target.dataset.locationTime;
      localStorage.setItem("selectedReservation", JSON.stringify(reservationOptions[key]));
    });


    $("#reservation-select-confirm-btn").on("click", function (event) {
      window.location.href = "confirmreservation.html";
    });

  

}