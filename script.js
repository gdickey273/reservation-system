$(document).ready(function () {
  var database = firebase.database().ref();


  var indoorTables = [
    {
      name: "Table 1",
      capacity: 2,
      reservations: []
    },
    {
      name: "Table 2",
      capacity: 2,
      reservations: []
    },
    {
      name: "Table 3",
      capacity: 4,
      reservations: []
    },
    {
      name: "Table 4",
      capacity: 4,
      reservations: []
    },
    {
      name: "Table 5",
      capacity: 6,
      reservations: []
    },
    {
      name: "Table 6",
      capacity: 4,
      reservations: []
    },
    {
      name: "Table 7",
      capacity: 4,
      reservations: []
    },
    {
      name: "Table 8",
      capacity: 6,
      reservations: []
    }
  ]
  var outdoorTables = [
    {
      name: "Table 100",
      capacity: 5,
      reservations: []
    },
    {
      name: "Table 102",
      capacity: 5,
      reservations: []
    },
    {
      name: "Table 105",
      capacity: 5,
      reservations: []
    },
    {
      name: "Table 106",
      capacity: 6,
      reservations: []
    }
  ]
  var partyNumber = 0;
  var selectedDate = undefined;
  var dayOfWeek;
  var reservationStartTime;
  var reservationEndTime;


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

  function checkAvailability() {

  }

  database.child("Text").set("Some Value");

});