/**
 * Welcome to Pebble.js!
 *
 * This app tells you the noise level for your pebble. 
 * Monitors the Accelerometer in real time and stores the array.
 * The values are put into a single array and then compared while the pebble is not moving.
 * The noise values can be seen in the app log or in the app itself.
 * By Max Hunt - 609556
 * Date - 22/01/2015
 */

//include Accel Pebble Libary
var Accel = require('ui/accel');
//iniate acceleometer
Accel.init();
//include UI Pebble Libary
var UI = require('ui');
//get vector Pebble Libary
var Vector2 = require('vector2');
//Screen for real time results
var CountScreen = new UI.Window();
//Elements for AccelerometerScreen
var TitleText = new UI.Text({ position: new Vector2(0,0), size: new Vector2(144, 168) });
var CounterText = new UI.Text({ position: new Vector2(0,25), size: new Vector2(144, 168) });
//Text For end Screen
var NoiseXText = new UI.Text({ position: new Vector2(0,25), size: new Vector2(144, 168) });
var NoiseYText = new UI.Text({ position: new Vector2(0,50), size: new Vector2(144, 168) });
var NoiseZText = new UI.Text({ position: new Vector2(0,75), size: new Vector2(144, 168) });
var MinXText = new UI.Text({ position: new Vector2(0,100), size: new Vector2(144, 168) });
var MinYText = new UI.Text({ position: new Vector2(0,125), size: new Vector2(144, 168) });
var MinZText = new UI.Text({ position: new Vector2(0,150), size: new Vector2(144, 168) });
var MaxXText = new UI.Text({ position: new Vector2(0,200), size: new Vector2(144, 168) });
var MaxYText = new UI.Text({ position: new Vector2(0,225), size: new Vector2(144, 168) });
var MaxZText = new UI.Text({ position: new Vector2(0,250), size: new Vector2(144, 168) });
var AveXText = new UI.Text({ position: new Vector2(0,275), size: new Vector2(144, 168) });
var AveYText = new UI.Text({ position: new Vector2(0,300), size: new Vector2(144, 168) });
var AveZText = new UI.Text({ position: new Vector2(0,325), size: new Vector2(144, 168) });


//lower hertz Values
Accel.config({
   rate: 25,
   sample: 5,
   subscribe: false
});

var noOfTakenSamples = 25; //Number of sample taken inorder to reach Noise conclutson
var counter = 0;
var xAxisArray = [];
var yAxisArray = [];
var zAxisArray = [];

var inNoiseMon = false;

//start App screen
var main = new UI.Card({   
   icon: 'images/menu_icon.png',
   subtitle: 'Noise Calculator',
   body: 'Press the select button to start the Noise Monitor. The amount of smaples to be taken is ' + noOfTakenSamples +"." ,
   scrollable: true
});

//start APP
console.log("App started");
main.show();
main.on('click', 'select', onClick);


function onClick(e) {
   inNoiseMon = true;
   console.log('Entered Counter');
   TitleText.text('Counter Screen');
   CountScreen.insert(0,TitleText);
   console.log("Title text added");
   CountScreen.show();
   CountScreen.on('click','back',onAccelBack);   
   Accel.on('data', onPeek);         
}
//Close Screen and Stop loop
function onAccelBack(){
   console.log('Close Screen and Stop Loop');
   inNoiseMon = false;
   CountScreen.hide();   
}
//Get Values for Acelerometer
function onPeek(e){
   //check for number of samples taken
   if (counter<noOfTakenSamples){
      if (inNoiseMon === true){
         console.log('Taking Sample'); 
         xAxisArray.push = e.accel.x;
         yAxisArray.push = e.accel.y;
         zAxisArray.push = e.accel.z;
         console.log('SampleTaken');
         counter = counter++;
         insertCounterElements();       
      }
      else{
         console.log("Stopped Reading");
         CountScreen.hide();
         Accel.config({
            subscribe: false
         });
      
      }
   }
   else{
      //stop events
      Accel.config({
         subscribe: false
      }); 
      xAxisArray.sort();
      yAxisArray.sort();
      zAxisArray.sort();      
      insertEndScreenElements();
      //Return to Screen            
   }      
   
}

//Insert onto screen
function insertCounterElements() { 
   CounterText.text('Number of values taken: ' + counter);
   CountScreen.insert(1,CounterText);
   CountScreen.show();
}

//Insert onto screen
function insertEndScreenElements() { 
   var xNoise = [xAxisArray[0]]
   CounterText.text("Min X Value: " +xAxisArray[0],yAxisArray[0],zAxisArray[0]);
   CountScreen.insert(1,CounterText);
   CountScreen.show();
}