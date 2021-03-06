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
//global setting for webview
var settings = require('settings');
settings.option('Number of Samples', 25);
//include Accel Pebble Libary
var Accel = require('ui/accel');
//iniate acceleometer
Accel.init();
//include UI Pebble Libary
var UI = require('ui');
//get vector Pebble Libary
var Vector2 = require('vector2');
//Screen for real time results
var CountScreen = new UI.Window({scrollable: true});
//Elements for AccelerometerScreen
var TitleText = new UI.Text({ position: new Vector2(0,0), size: new Vector2(144, 168) });
var CounterText = new UI.Text({ position: new Vector2(0,25), size: new Vector2(144, 168) });
//Text For end Screen
var NoiseXText = new UI.Text({ position: new Vector2(0,25), size: new Vector2(144, 168) });
var NoiseYText = new UI.Text({ position: new Vector2(0,50), size: new Vector2(144, 168) });
var NoiseZText = new UI.Text({ position: new Vector2(0,75), size: new Vector2(144, 168) });
var MinXText = new UI.Text({ position: new Vector2(0,110), size: new Vector2(144, 168) });
var MinYText = new UI.Text({ position: new Vector2(0,135), size: new Vector2(144, 168) });
var MinZText = new UI.Text({ position: new Vector2(0,160), size: new Vector2(144, 168) });
var MaxXText = new UI.Text({ position: new Vector2(0,195), size: new Vector2(144, 168) });
var MaxYText = new UI.Text({ position: new Vector2(0,220), size: new Vector2(144, 168) });
var MaxZText = new UI.Text({ position: new Vector2(0,245), size: new Vector2(144, 168) });
var AveXText = new UI.Text({ position: new Vector2(0,280), size: new Vector2(144, 168) });
var AveYText = new UI.Text({ position: new Vector2(0,305), size: new Vector2(144, 168) });
var AveZText = new UI.Text({ position: new Vector2(0,330), size: new Vector2(144, 168) });


//lower hertz Values
Accel.config({
   rate: 25,
   sample: 5,
   subscribe: false
});

var noOfTakenSamples = settings.option('Number of Samples'); //Number of sample taken inorder to reach Noise conclutson
var counter = 0;
var xAxisArray = [];
var yAxisArray = [];
var zAxisArray = [];
var inNoiseMon = false;

//start App screen
var main = new UI.Card({   
   icon: 'images/menu_icon.png',
   subtitle: 'Noise Calculator',
   body: 'Press the select button to start the Noise Monitor. The amount of smaples to be taken is ' + 
          noOfTakenSamples +
         '. Once pressed you have 3 seconds before the meseaurment starts to place the pebble on a stable surface.'  ,
   scrollable: true
});

//start APP

console.log("App started");
CountScreen.hide();
main.show();
main.on('click', 'select', onClick);


function onClick(e) {   
   CountScreen.on('click','back',onAccelBack);
   CountScreen.on('click','select',onAccelBack);
   try{
   //if the app is being used over and over, remove previous awsners
   CountScreen.hide();
   CountScreen.remove(NoiseXText);
   CountScreen.remove(NoiseYText);
   CountScreen.remove(NoiseZText);
   CountScreen.remove(MinXText);
   CountScreen.remove(MinYText);
   CountScreen.remove(MinZText);
   CountScreen.remove(MaxXText);
   CountScreen.remove(MaxYText);
   CountScreen.remove(MaxZText);
   CountScreen.remove(AveXText);
   CountScreen.remove(AveYText);
   CountScreen.remove(AveZText);
   }
   catch(arg){
      console.log(arg);
   }  
   inNoiseMon = true;
   console.log("Waiting");
   TitleText.text('3 seconds until measure. Please place Pebble on a flat surface.');
   CountScreen.insert(0,TitleText);
   console.log("Title text added");
   CountScreen.show();
   setTimeout(function (){
      CountScreen.remove(TitleText);
      TitleText.text('2 seconds until measure. Please place Pebble on a flat surface.');
      CountScreen.insert(0,TitleText);
      console.log("Title text added");
      setTimeout(function (){
         CountScreen.remove(TitleText);
         TitleText.text('1 seconds until measure. Please place Pebble on a flat surface.');
         CountScreen.insert(0,TitleText);
         console.log('Title text added');         
         setTimeout(function () {
            console.log('Entered Counter');
            CountScreen.remove(TitleText);
            TitleText.text('Measuring');
            CountScreen.insert(0,TitleText);
            Accel.on('data', onPeek);      
         }, 1000);
      }, 1000);
   }, 1000);
}

//Close Screen and Stop loop
function onAccelBack(){
   console.log('Close Screen and Stop Loop');
   inNoiseMon = false;
   CountScreen.hide();
   main.hide();
}
//Get Values for Acelerometer
function onPeek(e){
   //check for number of samples taken
   if (counter<noOfTakenSamples){
      if (inNoiseMon === true){
         console.log('Taking Sample'); 
         xAxisArray.push(e.accel.x);
         yAxisArray.push(e.accel.y);
         zAxisArray.push(e.accel.z);
         console.log('SampleTaken');
         var deadlock = false;
         if (deadlock === false){
            deadlock = true;
            counter++;
            console.log(counter);
            insertCounterElements(); 
            deadlock = false;
         }
         else{
         }               
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
   //change title
   TitleText.text('Result Screen');
   CountScreen.insert(0,TitleText);
   //calculate noise of calculation
   var xNoise = Math.abs((xAxisArray[(noOfTakenSamples-1)])-xAxisArray[0]);
   var yNoise = Math.abs((yAxisArray[(noOfTakenSamples-1)])-yAxisArray[0]);
   var zNoise = Math.abs((zAxisArray[(noOfTakenSamples-1)])-zAxisArray[0]);
   //Calculate Averages
   var sumx= 0;
   var sumy= 0;
   var sumz= 0;
   for( var i = 0; i < xAxisArray.length; i++ ){
      sumx += xAxisArray[i];
      sumy += yAxisArray[i];
      sumz += zAxisArray[i];
   }
   //X Results
   NoiseXText.text("Noise X Value: " +xNoise);
   MinXText.text('Min X Value: ' +xAxisArray[0]);
   MaxXText.text('Max X Value: ' +xAxisArray[(noOfTakenSamples-1)]);
   AveXText.text('Ave X Value: ' +(sumx/xAxisArray.length));
   //Y Results
   NoiseYText.text("Noise Y Value: " +yNoise);
   MinYText.text("Min Y Value: " +yAxisArray[0]);
   MaxYText.text("Max Y Value: " +yAxisArray[(noOfTakenSamples-1)]);
   AveYText.text('Ave Y Value: ' +(sumy/yAxisArray.length));
   //Z Results
   NoiseZText.text("Noise Z Value: " +zNoise);
   MinZText.text("Min Z Value: " +zAxisArray[0]);
   MaxZText.text("Max Z Value: " +zAxisArray[(noOfTakenSamples-1)]);
   AveZText.text('Ave Z Value: ' +(sumz/zAxisArray.length));
   //Remove the text from the Card
   CountScreen.remove(CounterText);
   //zero values for next time
   counter = 0;
   xAxisArray = [];
   yAxisArray = [];
   zAxisArray = [];
   //Insert new elements
   CountScreen.insert(1,NoiseXText);
   CountScreen.insert(2,NoiseYText);
   CountScreen.insert(3,NoiseZText);
   CountScreen.insert(4,MinXText);
   CountScreen.insert(5,MinYText);
   CountScreen.insert(6,MinZText);
   CountScreen.insert(7,MaxXText);
   CountScreen.insert(8,MaxYText);
   CountScreen.insert(9,MaxZText);
   CountScreen.insert(10,AveXText);
   CountScreen.insert(11,AveYText);
   CountScreen.insert(12,AveZText);
   CountScreen.show();
}