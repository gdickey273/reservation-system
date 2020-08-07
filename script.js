
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
  },
  {
    tableNumber: "4",
    capacity: 4,
    reservations: []
  },
  {
    tableNumber: "5",
    capacity: 6,
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
    tableNumber: "8",
    capacity: 6,
    reservations: []
  }
]
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
]

//var for testing
var tableRes; 



//party number and time initialized for ease of testing
var partyNumber = 1;
var selectedDate = undefined;
var dayOfWeek;
var time;
var earliestResTime = "";
var latestResTime = "";
var dataObj;
var deferredArray = [];
var deferred;

var cloud = firebase.firestore();



//Something to do with the calendar widget
$(document).ready(function () {
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

//Looks at the dayOfWeek variable and updates earliest and latest reservation time to match that day's business hours
function updateOperatingHours() {
  switch (dayOfWeek) {
    case 0:
    case 6:
      earliestResTime = moment("10:00", "HH:mm");
      latestResTime = moment("20:00", "HH:mm");
      break;

    case 2:
    case 3:
    case 4:
    case 5:
      earliestResTime = moment("16:00", "HH:mm");
      latestResTime = moment("19:30", "HH:mm");
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


  //If party number is already set, run checkAvailability() once day is chosen
  // if (partyNumber > 0 && isValidTime()) {
  //   checkAvailability();
  // }
});

//Saves time to time var when time field is changed
$(".timepicker").change(function () {
  // var strArray = $(this).val().split(" ");
  // var isPM = strArray[3] === "PM";
  // var hour = strArray[0];
  // if (isPM && hour < 12){
  //   hour = "" + parseInt(hour) + 12;
  // }
  // var minute = strArray[2];
  // time = moment().set("hour", hour).set("minute", minute).set("second", 0);
  time = moment($(this).val(), "h:mm A");
});

//Saves party number to variable when party number button is clicked
$(".partyNumberButton").on("click", function () {
  $(".partyNumberButton").each(function () {
    $(this).removeClass("active");
  })
  $(this).addClass("active");
  var partyButton = $(this).children();
  partyNumber = parseInt(partyButton.attr("id").split("-")[1]);


  console.log("party number in listener------",partyNumber);
});

$("#submit-button").click(function(event){
  event.preventDefault();
  checkAvailability();
});

//For each table object in inside/outside table array, pull reservation data from cloud and push to table object's reservation array
function initializeTables() {
  var docPath = "scheduleByDate/" + selectedDate._i + "/";

  

    insideTables.forEach(function (table) {
      deferred = cloud.doc(docPath + "insideTables/" + table.tableNumber).get().then(function (doc) {
        var data = doc.data();
  
        if (data != undefined && data.reservations != undefined) {
  
          data.reservations.forEach(function (resObj) {
            resObj.time = moment(resObj.time, "h:mm A");
            table.reservations.push(resObj);
          })
        }
      
      });
      //deferredArray.push(deferred);
    });
  
  
  
  
    outsideTables.forEach(function (table) {
    deferred = cloud.doc(docPath + "outsideTables/" + table.tableNumber).get().then(function (doc) {
        var data = doc.data();
  
        if (data != undefined && data.reservations != undefined) {
  
          data.reservations.forEach(function (resObj) {
            table.reservations.push(resObj);
          })
        }
        
      });
      deferredArray.push(deferred);
    
  });

  
}

function findTable(tableArray, time){
  console.log("party number find table------",partyNumber);
  var emptySeats;
  var deadTime = 999;
  var bestOption = {deadTime: deadTime};

  for(let table of tableArray){
    console.log("-----next table------");
    console.log("table: ",table);
    console.log("table reservations: ", table.reservations);

    
   tableRes = table.reservations;
    emptySeats = table.capacity - partyNumber;

    //Dont consider 6 tops for 1 or 2 people. Return bestOption so far if it exists, otherwise return undefined to look for a different time
    if(emptySeats > 3){
      if(bestOption.tableNumber === undefined){
        return undefined;
      } else{
        console.log("----Starting to look at tables too large for party! Return: best option-----");
        return bestOption;
      }  
    }


    //If a table doesn't have any reservations update bestOption and return it
    if(table.reservations.length === 0 && emptySeats >= 0){
      bestOption = {tableNumber : table.tableNumber,
        time: time.format("hhmm"),
        deadTime: time.diff( earliestResTime, "minutes"),
        emptySeats};
        console.log("----no reservations at table! Return: best option-----");
      return bestOption; 
    } else{

      //for each reservation in table
      for (let reservation of table.reservations){
        console.log("-----next reseravtion-----")
        //if table isnt big enough for party, skip to next table
        if(emptySeats < 0){
          break;
        }


        //If target time is before existing res time, make sure there's 90 minute buffer. If not break and don't consider that table.
        //If theres more than 90 minutes buffer set dead time to difference - 90
        if(time.isBefore(reservation.time)){
          if(reservation.time.diff(time, "minutes") < 90){
            break;
          } else {
            deadTime = reservation.time.diff(time, "minutes") - 90;
            console.log("Dead time: " + deadTime);
            if(deadTime < bestOption.deadTime){
              bestOption = {tableNumber : table.tableNumber,
                time: time.format("hhmm"),
                deadTime,
                emptySeats};
              
            }
            if(bestOption.deadTime === 0){
              console.log("----dead time = 0! Return: best option-----");
              return bestOption;
            }
          
          }

          //if target time is after existing res time, make sure theres 90 minute buffer. If not, look at next table. If 90 minutes buffer, set dead time and look at next reservation to ensure theres enough buffer there.
        } else if (time.isAfter(reservation.time)){
          if (time.diff(reservation.time, "minutes") >= 90){
            deadTime = time.diff(reservation.time, "minutes") - 90;
            console.log("Dead time: " + deadTime);
            if(deadTime < bestOption.deadTime){
              bestOption = 
              {tableNumber : table.tableNumber,
                time: time.format("hhmm"),
                deadTime,
                emptySeats};

              // if(deadTime === 0){
              //   console.log("----no dead time at table! Return: best option-----");
              //   return bestOption;
              // }
            }
          } else {
            break;
          } 
        }
      }
    } 
    
  };

  return undefined;
}

// function findOutsideTable(time){
  
//   var emptySeats;
//   var deadTime = 999;
//   var bestOption = {deadTime: deadTime};

//   for(let table of outsideTables){
//     console.log("-----next table------");
//     console.log("table: ",table);
//     console.log("table reservations: ", table.reservations);

    
//    tableRes = table.reservations;
//     emptySeats = table.capacity - partyNumber;

//    //Dont consider 6 tops for 1 or 2 people. Return bestOption so far if it exists, otherwise return undefined to look for a different time
//    if(emptySeats > 3){
//     if(bestOption.tableNumber === undefined){
//       return undefined;
//     } else{
//       console.log("----Starting to look at tables too large for party! Return: best option-----");
//       return bestOption;
//     }  
//   }


//     //If a table doesn't have any reservations update bestOption and return it
//     if(table.reservations.length === 0 && emptySeats >= 0){
//       bestOption = {tableNumber : table.tableNumber,
//         time: time.format("h:mm A"),
//         deadTime: time.diff( earliestResTime, "minutes"),
//         emptySeats};
//         console.log("----no reservations at table! Return: best option-----");
//       return bestOption; 
//     } else{

//       //for each reservation in table
//       for (let reservation of table.reservations){
//         console.log("-----next reseravtion-----")
//         //if table isnt big enough for party, skip to next table
//         if(emptySeats < 0){
//           break;
//         }


//         //If target time is before existing res time, make sure there's 90 minute buffer. If not break and don't consider that table.
//         //If theres more than 90 minutes buffer set dead time to difference - 90
//         if(time.isBefore(reservation.time)){
//           if(reservation.time.diff(time, "minutes") < 90){
//             break;
//           } else {
//             deadTime = reservation.time.diff(time, "minutes") - 90;
//             console.log("Dead time: " + deadTime);
//             if(deadTime < bestOption.deadTime){
//               bestOption = {tableNumber : table.tableNumber,
//                 time: time.format("h:mm A"),
//                 deadTime,
//                 emptySeats};
              
//             }
//             if(bestOption.deadTime === 0){
//               console.log("----no reservations before target time and dead time = 0! Return: best option-----");
//               return bestOption;
//             }
          
//           }

//           //if target time is after existing res time, make sure theres 90 minute buffer. If not, look at next table. If 90 minutes buffer, set dead time and look at next reservation to ensure theres enough buffer there.
//         } else if (time.isAfter(reservation.time)){
//           if (time.diff(reservation.time, "minutes") >= 90){
//             deadTime = time.diff(reservation.time, "minutes") - 90;
//             console.log("Dead time: " + deadTime);
//             if(deadTime < bestOption.deadTime){
//               bestOption = 
//               {tableNumber : table.tableNumber,
//                 time: time.format("h:mm A"),
//                 deadTime,
//                 emptySeats};

//               // if(deadTime === 0){
//               //   console.log("----no dead time at table! Return: best option-----");
//               //   return bestOption;
//               // }
//             }
//           } else {
//             break;
//           } 
//         }
//       }
//     } 
    
//   };

//   return undefined;
// }

//TIME.SUBTRACT ISNT WORKING PROPERLY
function findTableBefore(tableArray, time){
  var bestOptionBefore = undefined;
  var timeIterator = time.subtract(15, "minutes");

  while(bestOptionBefore === undefined){
    bestOptionBefore = findTable(tableArray, timeIterator);
    timeIterator = timeIterator.subtract(15, "minutes");
    if (timeIterator.isBefore(earliestResTime)){
      return undefined;
    }
  }

  return bestOptionBefore;
}

function findTableAfter(tableArray, time){
  var bestOptionAfter = undefined;
  var timeIterator = time.add(15, "minutes");

  while(bestOptionAfter === undefined){
    bestOptionAfter = findTable(tableArray, timeIterator);
    timeIterator = timeIterator.add(15, "minutes");
    if (timeIterator.isAfter(latestResTime)){
      return undefined;
    }
  }

  return bestOptionAfter;
}

// function findOutsideTableBefore(time){
//   var bestOptionOutsideBefore = undefined;
//   var timeIterator = time.subtract(15, "minutes");

//   while(bestOptionOutsideBefore === undefined){
//     bestOptionOutsideBefore = findOutsideTable(timeIterator);
//     timeIterator = timeIterator.subtract(15, "minutes");
//     if (timeIterator.isBefore(earliestResTime)){
//       return undefined;
//     }
//   }

//   return bestOptionOutsideBefore;
// }

// function findOutsideTableAfter(time){
//   var bestOptionOutsideAfter = undefined;
//   var timeIterator = time.add(15, "minutes");

//   while(bestOptionOutsideAfter === undefined){
//     bestOptionOutsideAfter = findOutsideTable(timeIterator);
//     timeIterator = timeIterator.add(15, "minutes");
//     if (timeIterator.isAfter(latestResTime)){
//       return undefined;
//     }
//   }

//   return bestOptionOutsideAfter;
// }

function checkAvailability() {
  $("#reservation-selection-div").css("display", "block");
$.when.apply($, deferredArray).done(function(){
  var reservationOptions = {};
  reservationOptions["i" + time.format("hhmm")] = findTable(insideTables, time);
   

  if (reservationOptions["i" + time.format("hhmm")] === undefined){
    var insideBefore = findTableBefore(insideTables, time);
    if (insideBefore !== undefined){
      reservationOptions["i" + insideBefore.time] = insideBefore;
    }

    var insideAfter = findTableAfter(insideTables, time);
    if(insideAfter !== undefined){
      reservationOptions["i" + insideAfter.time] = insideAfter;
    }

  } else{
    var insideResultsHeader = $("<p>").html("We have an available table inside that meets your request! <br> Click below to continue.");
    $(".reservation-option-btn").html(time.format("h:mm A")).attr("data-location-time", "i" + time.format("hhmm"));
    
    $("#inside-results").prepend(insideResultsHeader, resButton);
  }
  
 




  reservationOptions["o" + time.format("hhmm")] = findTable(outsideTables, time);

  if (reservationOptions["o" + time.format("hhmm")] === undefined){
    var outsideBefore = findTableBefore(outsideTables, time);
    if (outsideBefore !== undefined){
      reservationOptions["o" + outsideBefore.time] = outsideBefore;
    }

    var outsideAfter = findTableAfter(outsideTables, time);
    if(outsideAfter !== undefined){
      reservationOptions["o" + outsideAfter.time] = outsideAfter;
    }

    
  } else{
    var outsideResultsHeader = $("<p>").html("We have an available table outside that meets your request! <br> Click below to continue.");
    var resButton = $(".reservation-option-btn").clone().html(time.format("h:mm A"));
    resButton.attr("data-location-time", "i" + time.format("hhmm"));
    $("#outside-results").append(outsideResultsHeader, resButton);
  }



});

}





//push to existing nexted array
  // cloud.doc("scheduleByDate/08112020/insideTables/3").update({

  //   reservations: 
  //   firebase.firestore.FieldValue.arrayUnion(
  //     {time: "6:30:00pm",
  //     firstName: "Betsy",
  //   secondName: "Sith",
  //   partyNumber: 1,
  //   phone: 999990234234,
  //   email: "betsyismyname@gmail.com",
  //   tableNumber: 3})
  // });

 


