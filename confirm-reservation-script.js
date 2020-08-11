const reservationData = JSON.parse(localStorage.getItem("selectedReservation"));
const partyNumber = reservationData.partyNumber;
const time = moment(reservationData.time, "HHmm").format("h:mm A");
const date = reservationData.date;
const tableNumber = reservationData.tableNumber;
const isInside = tableNumber < 100;
let dayOfWeek = reservationData.dayOfWeek;
let firstName;
let lastName;
let phoneNumber;
let emailAddress;

var cloud = firebase.firestore();



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
  var formattedDate = date.replace("/", "").replace("/", "");
  var ref = cloud.collection("scheduleByDate").doc(formattedDate);
  ref.get().then(function(snapshot){
    if (snapshot.exists){

    } else {
      console.log("------starting batch------");
      var batch = cloud.batch();

      for (var i = 1; i <= 8; i++){
        var ref = cloud.collection("scheduleByDate").doc(formattedDate).collection("insideTables").doc("" + i);
        batch.set(ref, {reservations : []})
      }

      var ref100 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("100");
      batch.set(ref100, {reservations : []});

      var ref102 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("102");
      batch.set(ref102, {reservations : []});

      var ref105 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("105");
      batch.set(ref105, {reservations : []});

      var ref106 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("106");
      batch.set(ref106, {reservations : []});
      
      batch.commit();
    }
  })

}



function makeReservation(){

}

updatePage();

