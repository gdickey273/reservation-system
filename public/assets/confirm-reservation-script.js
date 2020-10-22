let reservationData = JSON.parse(localStorage.getItem("selectedReservation"));
const partyNumber = reservationData.partyNumber;
const time = moment(reservationData.time, "HHmm");
const date = reservationData.date;
var formattedDate = date.replace("/", "").replace("/", "");
const tableNumber = reservationData.tableNumber;
const isInside = tableNumber < 100;
let insideOutside;
let dayOfWeek = reservationData.dayOfWeek;
let firstName;
let lastName;
let phoneNumber;
let emailAddress;

var cloud = firebase.firestore();

if (isInside){
  insideOutside = "insideTables";
} else insideOutside = "outsideTables";


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
  let str;
  if (isInside){
    str = "Please enter your information below to confirm your reservation for " + partyNumber + " on " + dayOfWeek + ", " + date +" at " + time.format("h:mm A");
  } else {
    str = "Please enter your information below to confirm your patio seating reservation for " + partyNumber + " on " + dayOfWeek + ", " + date +" at " + time.format("h:mm A")+"*";
    let outsideSeatingDisclaimer = $("<p>").html("*Please note that we cannot guarantee we'll have room to move you inside in case of rain or other foul weather!")
    outsideSeatingDisclaimer.addClass("disclaimer");
    $("#reservation-data-form").append(outsideSeatingDisclaimer);
  }
  $("#header").html(str);
  

  var path = "scheduleByDate/" + formattedDate + "/" + insideOutside + "/" + tableNumber;
  var ref = cloud.doc(path); //.doc(formattedDate);
  ref.get().then(function(snapshot){
    console.log("--------snapshot!-----", snapshot);
    if (snapshot.exists){
      console.log("-----already exists! No sweat bby------");

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

      var ref103 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("103");
      batch.set(ref103, {reservations : []});

      var ref105 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("105");
      batch.set(ref105, {reservations : []});

      var ref106 = cloud.collection("scheduleByDate").doc(formattedDate).collection("outsideTables").doc("106");
      batch.set(ref106, {reservations : []});
      
      batch.commit();
    }
  })

}


function checkInputValidity(){
  let isValid = true;
  let firstNameInputVal = $("#first-name").val().toUpperCase();
  let lastNameInputVal = $("#last-name").val().toUpperCase();
  let phoneNumberInputVal = $("#phone").val().replace("(", "").replace(")", "").replace("-", "").split(" ").join("");
  let emailAddressInputVal = $("#email").val();
  notes = $("#notes").val();
  console.log(phoneNumberInputVal);
  console.log(phoneNumberInputVal.length);

  let validNameChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let validNumberChars = "0123456789";

  $(".error-message").empty();


  //Checks for empty inputs
  $("form#reservation-data-form :input").each(function(input){
    if($(this).val() === ""){
      var id = "#" + $(this).attr("id")+"-error-message";
      $(id).html("Field cannot be left blank!");
      isValid = false;
      console.log("empty input! isValid: " + isValid);
    }
  });


  for (let char of firstNameInputVal){
    if (validNameChars.indexOf(char) === -1){
      isValid = false;
      $("#first-name-error-message").html('Invalid character. Please use only letters a-z');
      break;
    }
  }
  
  validNameChars += "-";
  for (let char of lastNameInputVal){
    if (validNameChars.indexOf(char) === -1){
      isValid = false;
      $("#last-name-error-message").html('Invalid character. Please use only letters a-z (or "-" in case of a hyphonated last name)');
      break;
    }
  }

  for(let char of phoneNumberInputVal){
    if (validNumberChars.indexOf(char) === -1){
      isValid = false;
      $("#phone-error-message").html('Invalid character. Please use only numbers 0-9, "()", and "-" ')
      break;
    }
  }


  switch (phoneNumberInputVal.length){
    case 7:
      isValid = false;
      $("#phone-error-message").html("Please enter your area code as well.");
      break;
    case 10:
      isValid = true;
      break;
    default:
      isValid = false;
      $("#phone-error-message").html("Invalid number! Please enter a 10 digit phone number");
  }
  

  if (isValid){
    firstName = firstNameInputVal;
    lastName = lastNameInputVal;
    phoneNumber = phoneNumberInputVal;
    emailAddress = emailAddressInputVal;
  } 

  return isValid;

}

function makeReservation(){
  console.log("----making reservation!----");
  var path = "scheduleByDate/" + formattedDate + "/" + insideOutside + "/" + tableNumber;
  reservationData = {time: parseInt(time.format("HHmm")),
  firstName,
lastName,
partyNumber,
phoneNumber,
emailAddress,
tableNumber,
notes};

  cloud.doc(path).update({

    reservations: 
    firebase.firestore.FieldValue.arrayUnion(reservationData)
  }).then(() => {
    reservationData.dayOfWeek = dayOfWeek;
    reservationData.date = date;
    localStorage.setItem("confirmedReservation", JSON.stringify(reservationData));
    
    cloud.collection('mail').add({
      to: emailAddress,
      message: {
        subject: `The Eddy Pub Reservation Confirmation`,
        html: `<img src='./images/eddy-logo-transparent.png' alt='The Eddy Logo'><br>
        <h2>Thank you for booking a reservation with us at the Eddy Pub! We've got you down for ${partyNumber} ${partyNumber > 1 ? "people" : "person"} on 
        ${dayOfWeek}, ${reservationData.date} at ${time.format("h:mm A")} under the name ${firstName} ${lastName}. 
        We'll see you then!</h2>`
      }
    }).then(() => window.location.href = "confirmation.html");
  });



}


$("#submit-btn").on("click", function(event){
  event.preventDefault();
  if (checkInputValidity()){
    makeReservation();
  }

  
});

$("#notes").on("keyup", function(event){
  console.log("Press!");
  if ($("#notes").val().length === 500){
    $("#notes-error-message").text("Please keep your notes below 500 characters");
  } else $("#notes-error-message").empty();
})
updatePage();


