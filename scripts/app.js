require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/administrator/Development/_study/spikes/simplecpu/assets/lib/gates.js":[function(require,module,exports){
var ctx;

//main(only) library file
var lamps = exports.lamps  = new Array();
var levers = exports.levers = new Array(); 
var gates = exports.gates  = new Array();
var joins = exports.joins  = new Array();
var wires = exports.wires  = new Array();

var NAND = exports.NAND = 0;
var AND = exports.AND  = 1;
var OR = exports.OR   = 2;
var XOR = exports.XOR  = 3;
var tNAND = exports.tNAND = 4;//slightly grey-colored NAND

exports.setCtx = function(value) {
	ctx = value;
}

//start of objects
var Join = exports.Join = function(x,y,wire1,wire2){
	//a Join connects two wires together
	this.x = x;
	this.y = y;
	this.wire1 = wire1;
	this.wire2 = wire2;
}

var Wire = exports.Wire = function(){
	//one value and an array of entities the wire is connected to.
	this.value = false;
	this.connections = new Array();
}	
var Lever = exports.Lever = function(x,y,wire){ 
	this.x = x;	
	this.y = y;	
	this.r = 0;
	this.s = 1;
	this.wire = wire;//wire index; not actually a wire
}

var Gate = exports.Gate = function(kind,x,y,a,b,out){
	this.kind = kind;
	this.x = x;
	this.y = y;
	this.r = 0;
	this.s = 1;
	//a,b, and out are all input and output wires; they are the index 
	//location of the wire.
	this.a = a;
	this.b = b;
	this.out = out;
}

var Lamp = exports.Lamp = function(x,y,wire){
	this.x = x;	
	this.y = y;	
	this.r = 0;
	this.s = 1;
	this.wire = wire;//wire index; not actually a wire
}
//start of action functions
var mapWires = exports.mapWires = function(){
	//reads through array of all elements, and maps locations to the wire
	//array
	//only called once after the arrays of elements are mapped
	for(i=0;i<gates.length;i++){
		switch(gates[i].kind){
		case tNAND:
		case NAND:
			j = wires[gates[i].a].connections.length;
			p = {x:gates[i].x,y:gates[i].y - 15};
			wires[gates[i].a].connections[j] = p;

			j = wires[gates[i].b].connections.length;
			p = {x:gates[i].x,y:gates[i].y + 15};
			wires[gates[i].b].connections[j] = p; 

			j = wires[gates[i].out].connections.length;
			p = {x:gates[i].x + 43,y:gates[i].y};
			wires[gates[i].out].connections[j] = p;
			break;
		case AND://AND
			j = wires[gates[i].a].connections.length;
			p = {x:gates[i].x-15,y:gates[i].y};
			wires[gates[i].a].connections[j] = p;

			j = wires[gates[i].b].connections.length;
			p = {x:gates[i].x+15,y:gates[i].y};
			wires[gates[i].b].connections[j] = p; 

			j = wires[gates[i].out].connections.length;
			p = {x:gates[i].x,y:gates[i].y+60};
			wires[gates[i].out].connections[j] = p;
			break;
		case OR://OR
			j = wires[gates[i].a].connections.length;
			p = {x:gates[i].x-15,y:gates[i].y + 25};
			wires[gates[i].a].connections[j] = p;

			j = wires[gates[i].b].connections.length;
			p = {x:gates[i].x+15,y:gates[i].y + 25};
			wires[gates[i].b].connections[j] = p; 

			j = wires[gates[i].out].connections.length;
			p = {x:gates[i].x,y:gates[i].y+60};
			wires[gates[i].out].connections[j] = p;
			break;
		case XOR://XOR
			j = wires[gates[i].a].connections.length;
			p = {x:gates[i].x + 10,y:gates[i].y - 15};
			wires[gates[i].a].connections[j] = p;

			j = wires[gates[i].b].connections.length;
			p = {x:gates[i].x + 10,y:gates[i].y + 15};
			wires[gates[i].b].connections[j] = p; 

			j = wires[gates[i].out].connections.length;
			p = {x:gates[i].x + 60,y:gates[i].y};
			wires[gates[i].out].connections[j] = p;
			break;
		}
	}
	for(i=0;i<levers.length;i++){
		l = levers[i].wire;
		j = wires[l].connections.length;
		p = {x:levers[i].x+15,y:levers[i].y+30};
		wires[l].connections[j] = p;
	}
	for(i=0;i<lamps.length;i++){
		l = lamps[i].wire;
		j = wires[l].connections.length;
		p = {x:lamps[i].x+10,y:lamps[i].y};
		wires[l].connections[j] = p;
	}
	for(i=0;i<joins.length;i++){
		l = joins[i].wire1;
		j = wires[l].connections.length;
		p = {x:joins[i].x,y:joins[i].y};
		wires[l].connections[j] = p;
		l = joins[i].wire2;
		j = wires[l].connections.length;
		wires[l].connections[j] = p;
	}
}

var checkAt = exports.checkAt = function(x,y){
	for(i=0;i<levers.length;i++){
		if(x > levers[i].x && x < (levers[i].x + 30)){
		 if(y > levers[i].y && y < (levers[i].y + 60)){
		  wires[levers[i].wire].value = !wires[levers[i].wire].value;
		 }
		}
	}
}

var gateStep = exports.gateStep = function(){
	//calculate gate logic
	for(i=0;i<gates.length;i++){
		switch(gates[i].kind){
		case tNAND:
		case NAND:
			wires[gates[i].out].value = 
	 	 	 !(wires[gates[i].a].value && wires[gates[i].b].value);
			break;
		case AND:
			wires[gates[i].out].value = 
	 	 	 (wires[gates[i].a].value && wires[gates[i].b].value);
			break;
		case OR:
			wires[gates[i].out].value = 
	 	 	 (wires[gates[i].a].value || wires[gates[i].b].value);
			break;
		case XOR:
			wires[gates[i].out].value = 
	 	 	 (wires[gates[i].a].value != wires[gates[i].b].value);
			break;
		}
	}
}

var joinStep = exports.joinStep = function(){
	for(i=0;i<joins.length;i++){
		a = joins[i].wire1;
		b = joins[i].wire2;
		wires[b].value = wires[a].value 
	}
}

var update = exports.update = function(){
	gateStep();
	//joinStep has to be last
	joinStep();
}
//start of drawing fucntions
var drawLamp = exports.drawLamp = function(l){
	ctx.beginPath();
	ctx.setTransform(l.s,0,0,l.s,l.x,l.y - 10);	
	if(wires[l.wire].value){
		grd = ctx.createRadialGradient(10,10,0,10,10,20);
		grd.addColorStop(0,"rgba(100,255,100,1.0)");
		grd.addColorStop(1,"rgba(100,255,100,0.0)");
		ctx.fillStyle = grd;
		ctx.fillRect(-10,-10,40,40);
		ctx.fillStyle = "rgba(255,255,255,1.0)";
		ctx.fillRect(0,0,20,20);
		ctx.fillStyle = "#88FF88";
		ctx.fillText("on",0,15);
	}else{
		ctx.fillStyle = "#BBBBBB";
		ctx.fillRect(0,0,20,20);
		ctx.fillStyle = "#888888";
		ctx.fillText("off",0,15);	
	}	
	ctx.stroke();
	ctx.fillStyle = "#000000";
}

var drawLever = exports.drawLever = function(l){
	ctx.beginPath();
	ctx.setTransform(l.s,0,0,l.s,l.x,l.y);	
	ctx.rotate(l.r*(Math.PI/180));
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,30,60);
	if(wires[l.wire].value){
		ctx.fillStyle = "#AAFFAA";
		ctx.fillRect(0,30,30,30);
		ctx.fillStyle = "#000000";
		ctx.fillText("on",4,50);	
	}else{
		ctx.fillStyle = "#FFAAAA";
		ctx.fillRect(0,0,30,30);
		ctx.fillStyle = "#000000";
		ctx.fillText("off",4,20);	
	}
}

var drawGate = exports.drawGate = function(n){
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.setTransform(1,0,0,1,n.x,n.y);	
	switch(n.kind){
	case tNAND:
		ctx.strokeStyle = "#BBBBBB";
	case NAND:
		ctx.rotate(n.r*(Math.PI/180));
		ctx.arc(0,0,30,0-(Math.PI/2),Math.PI/2);
		ctx.closePath();
		ctx.moveTo(45,0);
		ctx.arc(37,0,7,0,Math.PI*2);
		break;
	case AND:
		ctx.lineTo(30,0);	
		ctx.arc(0,30,30,0,Math.PI);
		ctx.lineTo(-30,0);	
		ctx.closePath();
		break;
	case OR:
		ctx.arc(0,0,30,0,Math.PI);
		ctx.moveTo(30,0);	
		ctx.arc(0,30,30,0,Math.PI);
		ctx.lineTo(-30,0);	
		break;
	case XOR:
		ctx.arc(0,0,30,0-(Math.PI/2),Math.PI/2);
		ctx.moveTo(30,-30);
		ctx.lineTo(0,-30);
		ctx.arc(30,0,30,0-(Math.PI/2),Math.PI/2);
		ctx.moveTo(30,30);
		ctx.lineTo(0,30);
		ctx.moveTo(-6,-30);
		ctx.arc(-15,0,30,0-(Math.PI/2)+0.3,Math.PI/2-0.3);
		break;
	}
	ctx.stroke();
}

var drawWire = exports.drawWire = function(w){
	//for simplicities sake, it only draws one line, 
	//however, the wire may be connected to more,
	//this is usefull in the case of joins in the middle of a wire.
	if(w.value){
		ctx.strokeStyle = "#00AA00";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.setTransform(1,0,0,1,0,0);
		ctx.moveTo(w.connections[0].x,w.connections[0].y);
		ctx.lineTo(w.connections[1].x,w.connections[1].y);
		ctx.stroke();
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.setTransform(1,0,0,1,0,0);
		ctx.moveTo(w.connections[0].x,w.connections[0].y);
		ctx.lineTo(w.connections[1].x,w.connections[1].y);
		ctx.stroke();
		ctx.lineWidth = 1;
	}else{
		ctx.strokeStyle = "#FF0000";
	}
	ctx.beginPath();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.moveTo(w.connections[0].x,w.connections[0].y);
	ctx.lineTo(w.connections[1].x,w.connections[1].y);
	ctx.stroke();
	ctx.strokeStyle = "#000000";
}

var drawJoin = exports.drawJoin = function(j){
	ctx.beginPath();
	ctx.setTransform(1,0,0,1,j.x-2,j.y-2);	
	if(wires[j.wire1].value){
		ctx.fillStyle = "#00AA00";
		ctx.fillRect(-1,-1,6,6);
		ctx.fillStyle = "#FFFFFF";
	}else{
		ctx.fillStyle = "#FF0000";
	}
	ctx.fillRect(0,0,4,4);
	ctx.fillStyle = "#000000";
}

var drawFrame = exports.drawFrame = function(){
	ctx.setTransform(1,0,0,1,0,0);	
	ctx.clearRect(0,0,1000,1000);
	//draws everything onto the canvas 
	for(i = 0;i<=wires.length-1;i++){
		drawWire(wires[i]);
	}
	for(i = 0;i<=lamps.length-1;i++){
		drawLamp(lamps[i]);
	}
	for(i = 0;i<=levers.length-1;i++){
		drawLever(levers[i]);
	}
	for(i = 0;i<=gates.length-1;i++){
		drawGate(gates[i]);
	}
	for(i = 0;i<=joins.length-1;i++){
		drawJoin(joins[i]);
	}
	drawComments();
}

},{}],"NAND":[function(require,module,exports){
var gatesLib = require('./lib/gates')
  , c = null
  , ctx = null;

function clicker(e){
	 gatesLib.checkAt(e.pageX-ctx.canvas.offsetLeft,e.pageY-ctx.canvas.offsetTop);
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.drawFrame();
}

window.drawComments = function(){
}

function setup(){
	//standard setup
	c = document.getElementById("gates");
	c.onselectstart = function(){return false;}
	ctx = c.getContext("2d");
	ctx.font = "16px Arial";
	gatesLib.setCtx(ctx);

	c.addEventListener('click',clicker,false);
	//page unique setup
	for(i=0;i<3;i++) {
		gatesLib.wires[i] = new gatesLib.Wire();
	}

	gatesLib.levers[0] = new gatesLib.Lever(8,10,0);
	gatesLib.levers[1] = new gatesLib.Lever(8,95,1);
	gatesLib.gates[0] = new gatesLib.Gate(gatesLib.NAND,100,80,0,1,2);

	gatesLib.lamps[0]= new gatesLib.Lamp(200,80,2);

	gatesLib.mapWires();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.drawFrame();
}

setup();
},{"./lib/gates":"/Users/administrator/Development/_study/spikes/simplecpu/assets/lib/gates.js"}],"adder":[function(require,module,exports){
var gatesLib = require('./lib/gates')
  , c = null
  , ctx = null;

function clicker(e){
	 gatesLib.checkAt(e.pageX-ctx.canvas.offsetLeft,e.pageY-ctx.canvas.offsetTop);
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.drawFrame();
}

window.drawComments = function(){
	ctx.setTransform(1,0,0,1,0,0);	
	ctx.fillStyle = "#666666";
	ctx.fillText("1st bit",0,35);	
	ctx.fillText("2nd bit",0,185);
	ctx.fillText("carry in",255,20);	
	ctx.fillText("carry out",165,452);
	ctx.fillText("value",380,100);
}
function setup(){
	//standard setup
	c = document.getElementById("gates");
	c.onselectstart = function(){return false;}
	ctx = c.getContext("2d");
	ctx.font = "16px Arial";
	gatesLib.setCtx(ctx);

	c.addEventListener('click',clicker,false);
	//page unique setup
	for(i=0;i<12;i++)
		gatesLib.wires[i] = new gatesLib.Wire();

	gatesLib.levers[0] = new gatesLib.Lever(8,40,0);
	gatesLib.levers[1] = new gatesLib.Lever(8,110,1);
	gatesLib.levers[2] = new gatesLib.Lever(220,8,5);

	gatesLib.gates[0] = new gatesLib.Gate(gatesLib.XOR,120,100,0,1,4);
	gatesLib.gates[1] = new gatesLib.Gate(gatesLib.XOR,280,115,4,7,8);
	gatesLib.gates[2] = new gatesLib.Gate(gatesLib.AND,80,200,3,2,9);
	gatesLib.gates[3] = new gatesLib.Gate(gatesLib.AND,220,200,6,5,10);
	gatesLib.gates[4] = new gatesLib.Gate(gatesLib.OR,150,350,9,10,11);

	gatesLib.lamps[0]= new gatesLib.Lamp(380,115,8);
	gatesLib.lamps[1]= new gatesLib.Lamp(140,450,11);

	gatesLib.joins[0]= new gatesLib.Join(95,80,0,2);
	gatesLib.joins[1]= new gatesLib.Join(65,130,1,3);
	gatesLib.joins[2]= new gatesLib.Join(235,130,5,7);
	gatesLib.joins[3]= new gatesLib.Join(205,100,4,6);

	gatesLib.mapWires();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.drawFrame();
}
setup();


},{"./lib/gates":"/Users/administrator/Development/_study/spikes/simplecpu/assets/lib/gates.js"}],"memory":[function(require,module,exports){
var gatesLib = require('./lib/gates')
  , c = null
  , ctx = null;

function clicker(e){
	 gatesLib.checkAt(e.pageX-ctx.canvas.offsetLeft,e.pageY-ctx.canvas.offsetTop);
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.drawFrame();
}

window.drawComments = function(){
}
function setup(){
	//standard setup
	c = document.getElementById("gates");
	c.onselectstart = function(){return false;}
	ctx = c.getContext("2d");
	ctx.font = "16px Arial";
	gatesLib.setCtx(ctx);

	c.addEventListener('click',clicker,false);
	//page unique setup
	for(i=0;i<=12;i++) {
		gatesLib.wires[i] = new gatesLib.Wire();
	}
	gatesLib.joins[0] = new gatesLib.Join(55,175,1,2);
	gatesLib.joins[1] = new gatesLib.Join(100,145,4,5);
	gatesLib.joins[2] = new gatesLib.Join(173,50,3,4);
	gatesLib.joins[3] = new gatesLib.Join(210,80,9,8);
	gatesLib.joins[4] = new gatesLib.Join(210,130,10,7);
	gatesLib.joins[5] = new gatesLib.Join(305,65,11,10);
	gatesLib.joins[6] = new gatesLib.Join(305,145,12,9);

	gatesLib.gates[0] = new gatesLib.Gate(gatesLib.NAND,120,50,0,2,3);
	gatesLib.gates[1] = new gatesLib.Gate(gatesLib.NAND,120,160,5,1,6);
	gatesLib.gates[2] = new gatesLib.Gate(gatesLib.NAND,240,65,3,8,11);
	gatesLib.gates[3] = new gatesLib.Gate(gatesLib.NAND,240,145,7,6,12);

	gatesLib.levers[0] = new gatesLib.Lever(8,5,0);
	gatesLib.levers[1] = new gatesLib.Lever(8,145,1);

	gatesLib.lamps[0] = new gatesLib.Lamp(345,65,11);

	gatesLib.wires[1].value = true;
	gatesLib.mapWires();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.drawFrame();
}
setup();

},{"./lib/gates":"/Users/administrator/Development/_study/spikes/simplecpu/assets/lib/gates.js"}],"more-gates":[function(require,module,exports){
var gatesLib = require('./lib/gates')
  , c = null
  , ctx = null;

function clicker(e){
	 gatesLib.checkAt(e.pageX-ctx.canvas.offsetLeft,e.pageY-ctx.canvas.offsetTop);
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.update();
	 gatesLib.drawFrame();
}

window.drawComments = function(){
	ctx.setTransform(1,0,0,1,0,0);
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#000000";

	ctx.fillText("\"and\"",200,25);	
	ctx.setTransform(1,0,0,1,75,10);
	ctx.lineTo(0,0);
	ctx.arc(80,60,60,0-(Math.PI/2),Math.PI/2);
	ctx.lineTo(0,120);
	ctx.closePath();	
	ctx.stroke();
	ctx.setTransform(1,0,0,1,0,0);
	
	ctx.fillText("\"or\"",250,175);	
	ctx.beginPath();
	ctx.setTransform(1,0,0,1,120,160);
	ctx.lineTo(0,0);
	ctx.arc(80,70,70,0-(Math.PI/2),Math.PI/2);
	ctx.lineTo(-70,140);
	ctx.moveTo(0,00);
	ctx.arc(-70,70,70,0-(Math.PI/2),Math.PI/2);
	ctx.stroke();
	ctx.setTransform(1,0,0,1,0,0);
	
	ctx.fillText("\"xor\"",340,330);	
	ctx.beginPath();
	ctx.setTransform(1,0,0,1,150,360);
	ctx.lineTo(0,-20);
	ctx.arc(130,70,90,0-(Math.PI/2),Math.PI/2);
	ctx.lineTo(-90,160);
	ctx.moveTo(0,-20);
	ctx.arc(-90,70,90,0-(Math.PI/2),Math.PI/2);
	ctx.moveTo(-86,-13);
	ctx.arc(-120,70,90,0-(Math.PI/2)+0.35,Math.PI/2-0.35);
	ctx.stroke();
	ctx.setTransform(1,0,0,1,0,0);
}

function setup(){
	//standard setup
	c = document.getElementById("gates");
	c.onselectstart = function(){return false;}
	ctx = c.getContext("2d");
	ctx.font = "16px Arial";
	gatesLib.setCtx(ctx);

	c.addEventListener('click',clicker,false);
	//page unique setup
	for(i=0;i<=22;i++) {
		gatesLib.wires[i] = new gatesLib.Wire();
	}

	gatesLib.levers[0] = new gatesLib.Lever(8,8,0);
	gatesLib.levers[1] = new gatesLib.Lever(8,70,1);
	gatesLib.levers[2] = new gatesLib.Lever(8,165,5);
	gatesLib.levers[3] = new gatesLib.Lever(8,235,6);
	gatesLib.levers[4] = new gatesLib.Lever(8,335,14);
	gatesLib.levers[5] = new gatesLib.Lever(8,465,15);

	gatesLib.lamps[0] = new gatesLib.Lamp(250,70,4);
	gatesLib.lamps[1] = new gatesLib.Lamp(300,230,13);
	gatesLib.lamps[2] = new gatesLib.Lamp(400,430,22);

	gatesLib.joins[0] = new gatesLib.Join(136,69,2,3);
	gatesLib.joins[1] = new gatesLib.Join(120,195,7,8);
	gatesLib.joins[2] = new gatesLib.Join(120,265,9,10);
	gatesLib.joins[3] = new gatesLib.Join(145,365,14,16);
	gatesLib.joins[4] = new gatesLib.Join(145,495,15,17);
	gatesLib.joins[5] = new gatesLib.Join(215,430,18,19);
	gatesLib.joins[6] = new gatesLib.Join(120,195,5,7);
	gatesLib.joins[7] = new gatesLib.Join(120,265,6,9);

	gatesLib.gates[0] = new gatesLib.Gate(gatesLib.tNAND,90,70,0,1,2);
	gatesLib.gates[1] = new gatesLib.Gate(gatesLib.tNAND,160,70,2,3,4);
	gatesLib.gates[2] = new gatesLib.Gate(gatesLib.tNAND,140,195,7,8,11);
	gatesLib.gates[3] = new gatesLib.Gate(gatesLib.tNAND,140,265,9,10,12);
	gatesLib.gates[4] = new gatesLib.Gate(gatesLib.tNAND,210,230,11,12,13);
	gatesLib.gates[5] = new gatesLib.Gate(gatesLib.tNAND,170,430,16,17,18);
	gatesLib.gates[6] = new gatesLib.Gate(gatesLib.tNAND,240,380,14,18,20);
	gatesLib.gates[7] = new gatesLib.Gate(gatesLib.tNAND,240,480,19,15,21);
	gatesLib.gates[8] = new gatesLib.Gate(gatesLib.tNAND,310,430,20,21,22);

	gatesLib.mapWires();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.update();
	gatesLib.drawFrame();
}
setup();

},{"./lib/gates":"/Users/administrator/Development/_study/spikes/simplecpu/assets/lib/gates.js"}]},{},[]);
