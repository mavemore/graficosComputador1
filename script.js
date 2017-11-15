var width = window.innerWidth;
var height =  window.innerHeight;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

//crea la escena
var scene = new THREE.Scene();
//crea la camara
//fov, aspect, near, far
var camera = new THREE.PerspectiveCamera( 45, width/height, 0.1, 1000 );

//necesario para mostrar graficos
var renderer = new THREE.WebGLRenderer({
	antialias: true
});

//setea el tamano de la pantalla
renderer.setSize( width, height);

//anade escena a canvas
document.body.appendChild( renderer.domElement );

//ajustar segun tam pantalla
window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

controls = new THREE.OrbitControls(camera, renderer.domElement);

//crear objetos
var cubo = new THREE.CubeGeometry( 1,1,1);
var esfera = new THREE.SphereGeometry(0.5,32,32);
var piramide = new THREE.CylinderGeometry(0,1,1,4,false);

var toroide = new THREE.TorusGeometry( 0.5, 0.2, 8, 30 )
var cilindro = new THREE.CylinderGeometry(0.5,0.5,1,32);

/*prism begin*/
/*fuente: https://codepen.io/zsigmondp/pen/ALKadK*/
PrismGeometry = function ( vertices, height ) {

	var Shape = new THREE.Shape();

	( function f( ctx ) {

		ctx.moveTo( vertices[0].x, vertices[0].y );
		for (var i=1; i < vertices.length; i++) {
			ctx.lineTo( vertices[i].x, vertices[i].y );
		}
		ctx.lineTo( vertices[0].x, vertices[0].y );

	} )( Shape );

	var settings = { };
	settings.amount = height;
	settings.bevelEnabled = false;
	THREE.ExtrudeGeometry.call( this, Shape, settings );

};

PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );

var A = new THREE.Vector2( -1, 0 );
var B = new THREE.Vector2( 1, 0 );
var C = new THREE.Vector2( 0, 1 );

var prisma = new PrismGeometry( [ A, B, C ], 1 );

//lambert material para iluminacion
var material = new THREE.MeshLambertMaterial( { color: 0x33cc33} );
var object = new THREE.Mesh( cubo, material );
object.position.y=0.7
object.rotation.y = Math.PI * 45/180;
//object.position.y += 1; 
//object.scale.x = 3;
scene.add(object);

camera.position.y = 5;
camera.position.z = 10;
//camera.position.x = 3;
camera.lookAt(object.position);


// anadir iluminacion
var sphere = new THREE.SphereGeometry( 0.1, 32, 32 );
light1 = new THREE.PointLight( 0xff0040, 3, 20 );
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
scene.add( light1 );
light2 = new THREE.PointLight( 0x0040ff, 3, 20 );
light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
scene.add( light2 );
light3 = new THREE.PointLight( 0x80ff80, 3, 20);
light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
scene.add( light3 );

light1.position.x = 4
light1.position.y = 3
light1.position.z = 0
light2.position.x = -4
light2.position.y = 3
light2.position.z = 4
light3.position.x = -4
light3.position.y = 3
light3.position.z = -4
//

//añadir piso
var meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(10,10, 10,10),
	new THREE.MeshBasicMaterial({color:0xffffff, wireframe: true})
);
meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
scene.add(meshFloor);

/*MENU*/
var options = {
  velx: 0,
  vely: 0,
  forma: 'cubo',
  stop: function() {
    this.velx = 0;
    this.vely = 0;
  },
  rotar: function(){
  	this.velx = 0.1;
    this.vely = 0.1;
  },
  reset: function() {
    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;
    this.velx = 0;
    this.vely = 0;
    object.rotation.x=0;
	object.rotation.y = Math.PI * 45/180;
	object.rotation.z=0;
  }
};

var sceneOptions = {
  luzRoja: true,
  luzAzul:true,
  luzVerde: true,
  resetCamera: function() {
    camera.position.z = 10;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.lookAt(object.position);
  }
};


var gui = new dat.GUI({ autoplace: false, height: 1000 });

var f1 = gui.addFolder('Objeto');
f1.addColor(object.material, 'color').name('Color').listen();
forma = f1.add(options, 'forma', ['cubo', 'esfera', 'piramide','toroide','cilindro','prisma']).name('Forma');
var f1_1 = f1.addFolder('Escala');
f1_1.add(object.scale, 'x',1,5).name('X').listen();
f1_1.add(object.scale, 'y',1,5).listen();
f1_1.add(object.scale, 'z',1,5).name('Z').listen();
var f1_2 = f1.addFolder('Traslación');
f1_2.add(object.position, 'x',-5,5).name('X').listen();
f1_2.add(object.position, 'y',0.7,5.7).name('Y').listen();
f1_2.add(object.position, 'z',-5,5).name('Z').listen();
var f1_3 = f1.addFolder('Rotación');
f1_3.add(object.rotation, 'x',0,5).name('X').listen();
f1_3.add(object.rotation, 'y',0,5).name('Y').listen();
f1_3.add(object.rotation, 'z',0,5).name('Z').listen();
var f1_4 = gui.addFolder('Acciones');
f1_4.add(options, 'stop');
f1_4.add(options, 'rotar');
f1_4.add(options, 'reset');

var f2 = gui.addFolder('Escena');
luzRoja = f2.add(sceneOptions, 'luzRoja');
luzAzul = f2.add(sceneOptions, 'luzAzul');
luzVerde = f2.add(sceneOptions, 'luzVerde');
f2.add(sceneOptions, 'resetCamera');

forma.onFinishChange(function(value) {
  cambiarFigura(value);
});

luzRoja.onFinishChange(function(value) {
  estadoLRoja(value);
});

luzAzul.onFinishChange(function(value) {
  estadoLAzul(value);
});

luzVerde.onFinishChange(function(value) {
  estadoLVerde(value);
});


animate();


function cambiarFigura(value){
	var figura = value;
	if (figura=='esfera'){
		object.geometry = esfera;
	}else if (figura=='cubo'){
		object.geometry = cubo;
	}else if (figura=='piramide'){
		object.geometry = piramide;
	}else if (figura=='toroide'){
		object.geometry = toroide;
	}else if (figura=='cilindro'){
		object.geometry = cilindro;
	}else if (figura=='prisma'){
		object.geometry = prisma;
	}
	//renderer.render(scene, camera);
}
/*
function cambiarColor(){
	//var color = document.getElementById("selectColor").value;
	var color = document.getElementById("inputColor").value;
	//console.log(color);
	color = color.substr(1,6);
	//console.log(color);
	color = "0x" + color;
	//console.log(color);
	object.material.color.setHex( color );
	renderer.render(scene, camera);
}*/

function estadoLRoja(estado){
	//estado = document.getElementById("luz1").checked;
	if (estado){
		scene.add( light1 );
	}else{
		scene.remove( light1 );
	}
	//renderer.render(scene, camera);
}


function estadoLAzul(estado){
	//estado = document.getElementById("luz2").checked;
	if (estado){
		scene.add( light2 );
	}else{
		scene.remove( light2 );
	}
	//renderer.render(scene, camera);
}


function estadoLVerde(estado){
	//estado = document.getElementById("luz3").checked;
	if (estado){
		scene.add( light3 );
	}else{
		scene.remove( light3 );
	}
	//renderer.render(scene, camera);
}

/*function trasladarObjeto(){
	trasladox = document.getElementById("traslacionX").value;
	trasladoy = document.getElementById("traslacionY").value;
	trasladoz = document.getElementById("traslacionZ").value;
	object.translateX( trasladox );
	object.translateY( trasladoy );
	object.translateZ( trasladoz );
	renderer.render(scene, camera);
}

function restaurarObjeto(){
	object.position.x=0;
	object.position.y=0.5;
	object.position.z=0;
	renderer.render(scene, camera);
}

function rotarObjeto(){
	rotacionX = document.getElementById("rotacionX").value;
	rotacionY = document.getElementById("rotacionY").value;
	rotacionZ = document.getElementById("rotacionZ").value;
	object.rotation.x=rotacionX;
	object.rotation.y = rotacionY;
	object.rotation.z=rotacionZ;
	renderer.render(scene, camera);
}

function restaurarRotacionObjeto(){
	object.rotation.x=0;
	object.rotation.y = Math.PI * 45/180;
	object.rotation.z=0;
	renderer.render(scene, camera);
}

function trasladarCamara(){
	trasladox = document.getElementById("traslacioncX").value;
	trasladoy = document.getElementById("traslacioncY").value;
	trasladoz = document.getElementById("traslacioncZ").value;
	camera.translateX( trasladox );
	camera.translateY( trasladoy );
	camera.translateZ( trasladoz );
	camera.lookAt(object.position);
	renderer.render(scene, camera);
}

function restaurarCamara(){
	camera.position.x=0;
	camera.position.y = 5;
	camera.position.z = 10;
	camera.lookAt(object.position);
	renderer.render(scene, camera);
}

function rotarCamara(){
	rotacionX = document.getElementById("rotacioncX").value;
	rotacionY = document.getElementById("rotacioncY").value;
	rotacionZ = document.getElementById("rotacioncZ").value;
	camera.rotation.x=rotacionX;
	camera.rotation.y = rotacionY;
	camera.rotation.z=rotacionZ;
	camera.lookAt(object.position);
	renderer.render(scene, camera);
}

function restaurarRotacionCamara(){
	camera.rotation.x=0;
	camera.rotation.y = 0;
	camera.rotation.z=0;
	camera.lookAt(object.position);
	renderer.render(scene, camera);
}

function tamObjeto(){
	tamX = document.getElementById("scaleX").value;
	tamY = document.getElementById("scaleY").value;
	tamZ = document.getElementById("scaleZ").value;
	object.scale.x =tamX;
	object.scale.y =tamY;
	object.scale.z =tamZ;
	renderer.render(scene, camera);
}

function restaurarTamanioObjeto(){
	
	object.scale.x =1;
	object.scale.y =1;
	object.scale.z =1;

	renderer.render(scene, camera);
}*/

function animate(){
	requestAnimationFrame(animate);
	
	// Keyboard movement inputs
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	// Keyboard turn inputs
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}

	object.rotation.x += options.velx;
  	object.rotation.y += options.vely;
	
	renderer.render(scene, camera);
}


function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

//window.onload = init;