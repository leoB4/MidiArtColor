let cubes = [];
let rColor = 255;
let gColor = 255;
let bColor = 255;
let cWidth;
let cHeight;
let cDepth;
let addCube;
let alpha;
let isPainting = false;
let osc;
let freq = 60;
let amp = 1;

function setup() {
    let canvas = createCanvas(innerWidth, innerHeight, WEBGL);  
    
    WebMidi.enable(function (err) { //check if WebMidi.js is enabled

        if (err) {
            console.log("WebMidi could not be enabled.", err);
        } else {
            console.log("WebMidi enabled!");
        }

        console.log("---");
        console.log("Inputs Ports: ");
        for(i = 0; i< WebMidi.inputs.length; i++){
        console.log(i + ": " + WebMidi.inputs[i].name);
        }

        console.log("---");
        console.log("Output Ports: ");
        for(i = 0; i< WebMidi.outputs.length; i++){
                console.log(i + ": " + WebMidi.outputs[i].name);
            
        }  
        
        //Choose an input port
        inputSoftware = WebMidi.inputs[0];
        //The 0 value is the first value in the array
        //Meaning that we are going to use the first MIDI input we see
        //This can be changed to a different number,
        //or given a string to select a specific port
        
        ///
        //listen to all incoming "note on" input events
        inputSoftware.addListener('noteon', "all",
            function (e) {
                    //Show what we are receiving
                console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ") "+ e.note.number +".");
                // displayText = "Received 'noteon' message (" + e.note.name + e.note.octave + ") "+ e.note.number +".";
                
                //Or use the MIDI note number instead
                if(e.note.number===48){
                    
                    let c = new Cube(50,50,50);
                    cubes.push(c);
                    highOscillator();
                }

                if(e.note.number===51){
                    isPainting ? isPainting = false : isPainting = true;
                }

                if(e.note.number===49){
                    cubes.pop();
                    lowOscillator();
                }
            }
        );
        

        inputSoftware.addListener('controlchange', 1,
            function (e) {

                // Change colors
                // RED
                if(e.data[1] === 1){
                    rColor = (e.data[2]*2);
                };

                // Green
                if(e.data[1] === 2){
                    gColor = (e.data[2]*2);
                };

                // Blue
                if(e.data[1] === 3){
                    bColor = (e.data[2]*2);
                };

                // frequence
                if(e.data[1] === 4){
                    freq = (e.data[2]*7);
                };
                // frequence
                if(e.data[1] === 5){
                    amp = (e.data[2]/100);
                };

                // Size
                // Width
                if(e.data[1] === 6){
                    cWidth = (e.data[2]*3);
                };

                //Height
                if(e.data[1] === 7){
                    cHeight = (e.data[2]*3);
                };

                // Depth
                if(e.data[1] === 8){
                    cDepth = (e.data[2]*3);
                };
                
            }
        );
        //
        //end of MIDI setup
        //
        });

        for(i = 0; i < 2; i++){
            let c = new Cube(50,50,50);
            cubes.push(c);
        }
}

function draw(){
    if(isPainting){
        for (let j = 0; j < cubes.length; j++) {
            translate(cos(j*0.5)*sqrt(j*2000), sin(j*0.5)*sqrt(j*2000), sin(j*0.5)*sqrt(j*2000))
            rotateZ(frameCount * -0.001);
            rotateX(frameCount * 0.001);
            rotateY(frameCount * -0.001);
            noStroke();
            cubes[j].show()
        }
    } else {
        background(45);
        for (let j = 0; j < cubes.length; j++) {
            translate(cos(j*0.5)*sqrt(j*2000), sin(j*0.5)*sqrt(j*2000), sin(j*0.5)*sqrt(j*2000))
            rotateZ(frameCount * -0.001);
            rotateX(frameCount * 0.001);
            rotateY(frameCount * -0.001);
            stroke(0,0,0);
            cubes[j].show()
        }
    }

   
}

function highOscillator() {
    osc.start();
    osc.amp(amp);
    // start at 700Hz
    osc.freq(freq);
    // ramp to 60Hz over 0.7 seconds
    osc.freq(400, 1);
    osc.amp(0, 0.1, 0.7);
}

function lowOscillator() {
    osc.start();
    osc.amp(amp);
    // start at 700Hz
    osc.freq(freq);
    // ramp to 60Hz over 0.7 seconds
    osc.freq(60, 1);
    osc.amp(0, 0.1, 0.7);
}

function enableSound(){
    userStartAudio();
    osc = new p5.Oscillator(700);
}
class Cube {
    constructor(wdth,hght,dpth){
      this.wdth = wdth;
      this.hght = hght;
      this.dpth = dpth;
      
    }
  
    show(){
        push();
        let m = pow(150,2);
        translate(cos(i*0.5)*sqrt(i*m), sin(i*0.5)*sqrt(i*m));
        // noStroke();
        fill(rColor, gColor, bColor )
        rotateZ(frameCount * -0.01);
        rotateX(frameCount * +0.01);
        rotateY(frameCount * -0.01);
        box(cWidth, cHeight, cDepth);
        pop();
    }
  }