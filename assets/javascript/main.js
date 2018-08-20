
// TTS javascript
var audioClip;
var alarm;

var queryUrl ="http://api.voicerss.org/?key=0a7914a1376346ce8cee9c5045328467&hl=en-us&b64=true&src=hello world";
  $.ajax({
    url:queryUrl,
    method:"get",
    
  }).then(function(response) {
      audioClip = document.createElement("audio");
      audioClip.setAttribute("src", response);


  });

  $("#add-info").on("click",function(){
    
    console.log(then);

  });


// Initialize Firebase
var config = {
    apiKey: "AIzaSyAsMpacVJ5ctV3xuIrprApLxsnM1KEfa8Y",
    authDomain: "alert-it.firebaseapp.com",
    databaseURL: "https://alert-it.firebaseio.com",
    projectId: "alert-it",
    storageBucket: "alert-it.appspot.com",
    messagingSenderId: "28982527602"
  };

// Call TTS API
// var audioClip;
// var queryUrl ="http://api.voicerss.org/?key=0a7914a1376346ce8cee9c5045328467&hl=en-us&b64=true&src=hello world";
// var api= "0a7914a1376346ce8cee9c5045328467&hl=en-us&b64=true&";
// var setWord= "src=" + [alertIt];
//         $.ajax({
//         url:queryUrl,
//         method:"get",
    
//   }).then(function(response) {
//       audioClip = document.createElement("audio");
//       audioClip.setAttribute("src", response);
      
// });
// console.log(setWord);

  firebase.initializeApp(config);


    var database = firebase.database();
    
    var name = "empty";
    var inTime = "empty";
    var mode = "empty";
    var frequency = "empty";

    var startName = "empty";
    var startAddress = "empty";
    var startCity = "empty";
    var startState = "empty";
    var startZip = "empty";

    var endName = "empty";
    var endAddress = "empty";
    var endCity = "empty";
    var endState = "empty";
    var endZip = "empty";

    var inTime; //the user input directly from the type="time" button on setup
    var farrTime; // a formatted version of arrTime that will work in the moment syntax
    var arrTime; //supplied by use in set up on.click
    var timeToGo; //this is the total time from start of app to the arrival time
    var timeOuttheDoor= 0;  // this is the timeToGo minus travel time
    var timeStarted; //the actual time user started the countdown
    var timeTravel = 0;  //this is the travel time received from the map api
    var timeSinceStart = 0;  //this is the time the app was started, used to time frequence of messages
    var IntervalID;
    var clockRunning = false;
    var lastText = 0;  //used in alertIt.count to make sure don't generate the message more than once
    var textToVoice = "I have nothing to say right now.";
    var arrTextFill = [ 
                    {ontime: "Hey ",                 close:"Getting Close ",           late: "Oh no! "},
                    {ontime: "Well ",                close:"Don't dilly dally ",       late: "Uh oh! "},
                    {ontime: "Lookin good ",         close:"Time's getting close ",    late: "Too Late! "},
                    {ontime: "Nice day ",            close:"Don't panic, but ",         late: "Now were'r in trouble! "},
                    {ontime: "Hows it going ",       close:"Time to get with it ",     late: "This is not good! "},
                    {ontime: "So ",                  close:"Not much time ",           late: "I hate to tell you this! "}
                ];

    var getInput;
    var IntervalPeriod = (10 * 1000); //sets the time interval for checking status again 
    var setUpComplete = false;

$(document).ready(function(){
    var audioClip;
var queryUrl ="http://api.voicerss.org/?key=";
var api= "0a7914a1376346ce8cee9c5045328467&hl=en-us&b64=true&";
var setWord= "src=" + getInput ;
var speekNow= queryUrl + api + setWord;
        $.ajax({
        url:queryUrl,
        method:"get",
    
  }).then(function(response) {
      audioClip = document.createElement("audio");
      audioClip.setAttribute("src", response);
      
});
console.log(speekNow);
   
var alertIt = {

    setUp: function() {

        $("#add-info").on("click", function(event){
            event.preventDefault();
        
            // get user input values
           setUpComplete = false; 

        var getInput = {

                name: $("#name_input").val().trim(),
                inTime: $("#arrive_time").val().trim(),
                mode: $('input:radio[name="modeOption"]:checked').val(),
                frequency: parseInt($("#frequency_input").val().trim()),

                startName: $("#start_name_input").val().trim(),
                startAddress: $("#start_address_input").val().trim(),
                startCity: $("#start_city_input").val().trim(),
                startState: $("#start_state_input").val().trim(),
                startZip: $("#start_zip_input").val().trim(),

                endName: $("#end_name_input").val().trim(),
                endAddress: $("#end_address_input").val().trim(),
                endCity: $("#end_city_input").val().trim(),
                endState: $("#end_state_input").val().trim(),
                endZip: $("#end_zip_input").val().trim()
            };


           
            

    //*********** check to see that the input form has been completed before allowing start-aler button to be pushed

                //if (name = "empty")

            setUpComplete = true;

            //note a radio button must be checked for mode or it will crash the page
            // can also get the id value of the radio buttons this way:
            //var selValue = $('input[name=rbnNumber]:checked').attr('id');


            
        // start the countdown!
        
        $("#start-alert").on("click", function(event){
            event.preventDefault();

            if (setUpComplete) { 
                alertIt.start();
            } else {
                alert("Please complete all parts of the set up form and submit it.");
                alertIt.setUp();
            }

             
        });
        
        // this is the end of the add-info click event
        });
    },

    calcTimes: function() {
        arrTime = moment().hour(parseInt(getInput.inTime.charAt(0) + getInput.inTime.charAt(1))).minute(parseInt(getInput.inTime.charAt(3) + getInput.inTime.charAt(4)));
        farrTime = arrTime.format("HH:mm");
        timeToGo = arrTime.diff(moment(),"minutes");
        timeTravel = alertIt.getTimeTravel();
        timeOuttheDoor = timeToGo - timeTravel;  //timeTravle not found yet  from map api
        timeSinceStart = moment().diff(timeStarted, "minutes");

    },

    start: function() {
        
        timeStarted = moment();

    //start the countdown!
        if (!clockRunning) {
          intervalId = setInterval(alertIt.count, IntervalPeriod);  //this can be once every 30 or 60 seconds once it all works
          clockRunning = true;
        }
      },

    count: function() {
            alertIt.calcTimes();

    // Check to see if it is time to generate a reminder
        if (timeSinceStart > 0 && timeSinceStart % getInput.frequency == 0 && timeSinceStart != lastText) {
            alertIt.generateMessage();
        } 

        lastText = moment().diff(timeStarted, "minutes");

            alertIt.updateUI();

       },

    updateUI: function(){

        $("#current_time_display").text("The current time is: " + moment().format("hh:mm A"));
        $("#arrival_time_display").text("Your planned arrival time at " + getInput.endName + " is: " + farrTime);
        $("#travel_time_display").text("Travel time by " + getInput.mode + " today is " + timeTravel + " minutes.");
        $("#leave_minutes_display").text("You need to leave in " + timeOuttheDoor + " minutes."); 
       },

    generateMessage: function() {

        textToVoice = "";
        var lng = arrTextFill.length;

        if (timeOuttheDoor < 0){   //they are too late now

            var greetText = arrTextFill[Math.floor(Math.random() * lng)].late;
            var nameText = getInput.name  + ", ";
            var midText = " you should have been out the door ";
            var endText = " minutes ago. Let's try it again tomorrow!";
                timeOuttheDoor = Math.abs(timeOuttheDoor);
            clearInterval(intervalId);

        } else if (timeOuttheDoor < 15) {  // it's getting real close

            var greetText = arrTextFill[Math.floor(Math.random() * lng)].close;
            var nameText = getInput.name + ", ";
            var midText = " you only have ";
            var endText = " minutes until you need to be out the door!";

        } else {   //still plenty of time

            var greetText = arrTextFill[Math.floor(Math.random() * lng)].ontime;
            var nameText = getInput.name + ", ";
            var midText = " you still have ";
            var endText = " minutes until you need to be out the door.";
        }

            textToVoice = greetText + nameText + midText + timeOuttheDoor + endText;

            $("#alert_display").text(textToVoice);
            console.log(textToVoice);
       },
       makeVoice: function(textToVoice){
        var audioClip;
        var queryUrl ="http://api.voicerss.org/?key=6d2a15e828bf429d94e8584c50d4accd&hl=en-us&b64=true&";
      


        
        var setWord= "src=" + textToVoice;
        console.log("======: ", queryUrl);
        console.log("======: ", setWord);
        var speekNow= queryUrl + setWord;
                $.ajax({
                url:speekNow,
                method:"get",
            
          }).then(function(response) {
              audioClip = document.createElement("audio");
              audioClip.setAttribute("src", response);
              audioClip.play();
              
        });
        console.log(textToVoice);
        console.log(speekNow);
        console.log(setWord);
       },


       getTimeTravel: function() {
        //input from the map api goes here  

        if (getInput.mode == "drive") {
            timeTravel = 25;
        } else if (getInput.mode == "bus") {
            timeTravel = 45;
        } else {
            timeTravel = 75;
        }

        return timeTravel;  //a placeholder

       }
 //alertIt
};
 
alertIt.setUp();

//doc ready
});
