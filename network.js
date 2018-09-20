
var lrate = 0.1; //the learning rate
var layers = [2,3,2]; //the number of layers is the length and the numbers are the number of neurons in that layer
var paddingx=20; //the padding of the displayed neural network from the edges along the x axis
var paddingy=20; //the padding of the displayed network along the y axis
/*var neuron = { 
    value:0,
    inputweight:[],
    y:0,
    layer:0,
    bias:0
};*/
var neurons = []; //the array with the neurons in it

var mse = function(actual, desired) {
    var hg=0; //just a random temp variable that will hold the squared error
    for(var i = 0; i <desired.length; i++) { //sum up everything in desired (does this work or is this bad javascript?
        hg+=pow((actual-desired[i]),2); //sum it up with the squared error
    }
    
    return(hg/desired.length); //turn it into mean squared error and then return it
}; //mean squared error function that I am pretty sure I got wrong. Do I need to sqrt it?
var train =function(actual,input, expected) {
    if(actual !== expected) {
        var sum = 0;
        var delta_output_some = 9;
        var e = Math.E;
        var error = 0;
        var weight_deltas = [];
        for(var l = 0; l < actual.length; l++) {
            sum=log(1/(1+actual[l]));
            error=expected[l]-actual[l];
            delta_output_some=error / (1 + pow(e,(sum))) * (1 - (1 / (1 + pow(e,(sum)))));
            for( var i = 0; i < layers[layers.length-1]; i++ ) {
                for(var j = 0; j < layers[layers.length-2]; j++) {
                    neurons[layers.length-1][i].inputweights[j] += lrate*delta_output_some/neurons[layers.length-2][j].value;
                    println(neurons[layers.length-2][j].value);
                }
            }
        }
    }
}; //train the neural network I am p-sure this one has so many problems it is not even funny !!!!!!!!!!!!!!!!!!!!!!! FIX
var sigmoid = function(qw) {
    return( 1/(1+(Math.E^(-qw))));
}; //the sigmoid function. Not much else to say
var z = [];
for( var i  = 0; i < layers.length; i++) { //this is to populate the neurons array
    neurons.push([]); //push a new layer
    for(var j = 0; j <layers[i]; j++) { //now populate that layer
        z = []; //this is for randomizing the input weights
            for( var k = 0; k < layers[i-1]; k++) {
                z.push(random(-10,10)); //push a random number between -10 and 10 !!!!!!! change this to be adjustable
            } 
        neurons[i].push({value:0, inputweights:z, y:j, layer:i, bias:0}); //push that neuron to the array
    }
} //populate the neural network
var doodle = function() {
    for(var i = 0; i < layers.length; i++) { // for every layer
        for(var j = 0; j < layers[i]; j++) { //for every neuron
            for(var k = 0; k < layers[i-1]; k++) { //for every heckin input weight
                strokeWeight(abs(neurons[i][j].inputweights[k])); //set the strokeweight to the applicable inputweight
                stroke(25, 0, 0,25); //set the stroke color
                if(neurons[i][j].inputweights[k] < 0) {
                    stroke(255,0,0,25);
                } else if(neurons[i][j].inputweights[k] > 0) {
                     stroke(0, 255, 0, 25);
                } else {
                    stroke(0,0,255,25);
                }
                line(paddingx+(neurons[i][j].layer+0.5)*(400-(paddingx*2))/layers.length,paddingy+(neurons[i][j].y+0.5)*(400-(paddingy*2))/layers[i],paddingx+((neurons[i-1][k].layer+0.5)*(400-(paddingx*2))/layers.length),paddingy+((neurons[i-1][k].y+0.5)*(400-(paddingy*2))/layers[i-1])); //draw the line (It's a horrifying equation I know)
            }
            //now it is time to draw the neuron's value! fun fun
            if(neurons[i][j].value < 0) {
                stroke(255, 0, 0);
            } else if (neurons[i][j].value > 0) {
                stroke(0, 255, 0);
            } else {
                strokeWeight(10000000000);
                stroke(0,0,255,25);
                point(200,200);
            }//this is telling me whether it is positive or negative
            strokeWeight(abs(neurons[i][j].value*10)); //set the strokeweight to the bias+5 (this maybe should be changed since I do not use the bias at all lol)
           // stroke(255, 0, 127.5+neurons[i][j].value*127.5); //set the stroke to be dependent on the value
            point(paddingx+(neurons[i][j].layer+0.5)*(400-(2*paddingx))/layers.length,paddingy+(0.5+neurons[i][j].y)*(400-(2*paddingy))/layers[i]); //draw the value point
            stroke(179, 89, 89); //I don't actually know why this is here
            if(neurons[i][j].bias < 0) {
                stroke(255, 0, 0, 25);
            } else if (neurons[i][j].bias > 0) {
                stroke(0, 255, 0, 25);
            } else {
                stroke(0, 0, 255, 25);
            } //tell me whether the bias is positive or negative
            strokeWeight(abs(neurons[i][j].bias)); //set the strokeweight to the bias
            point(paddingx+(neurons[i][j].layer+0.5)*(400-(2*paddingx))/layers.length,paddingy+(0.5+neurons[i][j].y)*(400-(2*paddingy))/layers[i]); //draw the point
            stroke(0, 0, 0,25); //I donut know why this is here either.
        }
    }
}; //draw the neural network
var run = function (input) {
    var returns=[]; //this is the return arraay, so the output
    for(var i = 0; i < layers[0]; i++) {
        neurons[0][i].value=input[i];
    } //set the input to the desired input
    //if( input < layers[0]  || input === layers[0] ) {
    for(var i = 1; i < layers.length; i++) { //for every layer
        for(var j = 0; j < layers[i]; j++) { //for every neuron in that layer
            var sum=0; //the sum for summation
            for(var k = 0; k < layers[i-1]; k++) {
                sum+=neurons[i-1][k].value*neurons[i][j].inputweights[k];
            } //this is just the summation of the neurons in the previous layers' value * input weights of this neuron for those neurons
            neurons[i][j].value=sigmoid(sum); //set the value of the neuron to the sigmoid of the sum
            if(i === layers.length-1) { //if this is the output layer
                returns.push(neurons[i][j].value); //add your value to the return array
            }
        }
    }
    //} else {
    //    throw("WHY?");
    //}
    return(returns); //return  returns
}; //run the neural network
var creature = {
    x:200,
    y:200
};
stroke(255, 0, 0);
fill(255, 0, 0);
var zinput = 0;
println(1);
var output=0;//run([(mouseX-200)/200])[0]; //dunno why this is here
var draw = function() {
    background(255,255,255); //reset
    zinput = [0,1];//[(mouseX-200)/200, (mouseY-200)/200];
    output=run(zinput); //set the output 
    text(output, 20, 20); //debugging
    ellipse(creature.x, creature.y, 10, 10);
    train(output,zinput,  [1,1]);
    creature.x += neurons[neurons.length-1][0];
    creature.y += neurons[neurons.length-1][1];
  //  text(200+(output[0]*200), 20, 40); //debugging
    //ellipse(mouseX, (200+neurons[neurons.length-1][0].value*200),10,10); //debugging
  //  text(neurons[1][3].value, 20, 60);
  //  ellipse(mouseX, mouseY, 10, 10); //debugging
    //text((mouseX-200)/200, 20, 30); //debugging
    doodle(); //draw the neural network
};
