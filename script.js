


  // Get a reference to the database service

  var indoorTables = [
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
  var outdoorTables = [
    {
      tableNumber: "100",
      capacity: 5,
      reservations: []
    },
    {
      tableNumber: "102",
      capacity: 5,
      reservations: []
    },
    {
      tableNumber: "105",
      capacity: 5,
      reservations: []
    },
    {
      tableNumber: "106",
      capacity: 6,
      reservations: []
    }
  ]
  var partyNumber = 0;
  var selectedDate = undefined;
  var dayOfWeek;
  var time;
  var earliestResTime;
  var latestResTime;

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
  })

  //Saves party number to variable when party number button is clicked
  $(".partyNumberButton").on("click", function () {
    $(".partyNumberButton").each(function () {
      $(this).removeClass("active");
    })
    $(this).addClass("active");
    var partyButton = $(this).children();
    partyNumber = parseInt(partyButton.attr("id").split("-")[1]);

    //If date is already chosen, run checkAvailability() once party number is set
    if (selectedDate != undefined) {
      checkAvailability();
    }
  });

  //Saves date to selectedDate var and day of week (0-6) to dayOfWeek var
  $("#date").change(function () {
    console.log($(this).val());
    selectedDate = moment($(this).val(), "L");
    dayOfWeek = selectedDate.day();

    //If party number is already set, run checkAvailability() once day is chosen
    if (partyNumber > 0) {
      checkAvailability();
    }
  });

  function initializeTables(){

  }

  function checkAvailability() {


  }

  




  //Push element to a nested firestore array

  // cloud.doc("scheduleByDate/08102020/insideTables/1").update({
    
  //   reservations: 
  //   firebase.firestore.FieldValue.arrayUnion(
  //     {time: "20:00",
  //     firstName: "Betsy",
  //   secondName: "Sith",
  //   partyNumber: 1,
  //   phone: 999990234234,
  //   email: "betsyismyname@gmail.com",
  //   tableNumber: 1})
  // });


