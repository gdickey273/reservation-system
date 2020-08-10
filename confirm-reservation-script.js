const reservationData = JSON.parse(localStorage.getItem("selectedReservation"));
const partyNumber = reservationData.partyNumber;
const time = moment(reservationData.time, "HHmm").format("h:mm A");
const date = reservationData.date;
const tableNumber = reservationData.tableNumber;
const isInside = tableNumber < 100;
let dayOfWeek = reservationData.dayOfWeek;

switch (dayOfWeek){
  case 0:
    dayOfWeek = "Sunday";
    break;
  case 1: 
    dayOfWeek = "Monday";
    break;
  case 2: 
    dayOfWeek = "Tuesday";
    break;
  case 3: 
    dayOfWeek = "Wednesday";
    break;
  case 4: 
    dayOfWeek = "Thursday";
    break;
  case 5: 
    dayOfWeek = "Friday";
    break;
  case 6: 
    dayOfWeek = "Saturday";
    break;

}

function updatePage(){
  $("#header").html("Please enter your information below to confirm your reservation for " + partyNumber + " on " + dayOfWeek + ", " + date +" at " + time);
}

function makeReservation(){
  
}

updatePage();

