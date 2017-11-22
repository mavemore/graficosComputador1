//determinar el tamaño de la ventana
var width = window.innerWidth;
var height =  window.innerHeight;
//determinar las constantes del movimiento de las camaras con teclado.
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

//Permite manejar los controles del mouse
controls = new THREE.OrbitControls(camera, renderer.domElement);

//crear geometria posible de objetos
//cubo
var cubo = new THREE.CubeGeometry( 1,1,1);
//esfera
var esfera = new THREE.SphereGeometry(0.5,32,32);
//piramide
var piramide = new THREE.CylinderGeometry(0,1,1,4,false);
//toroide
var toroide = new THREE.TorusGeometry( 0.5, 0.2, 8, 30 );
//cilindro
var cilindro = new THREE.CylinderGeometry(0.5,0.5,1,32);
//prisma
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
/*prism end*/

//material con que se crean objetos. se usa lambert material para iluminacion
var material = new THREE.MeshPhongMaterial( { color: "#ffae23"} );
//se crea objeto con su geometria y material y se añade a escena
var object = new THREE.Mesh( cubo, material );
object.position.y=0.7
object.rotation.y = Math.PI * 45/180;
object.receiveShadow = true;
object.castShadow = true;
scene.add(object);
//se posiciona la camara y se apunta al objeto
camera.position.y = 5;
camera.position.z = 10;
camera.lookAt(object.position);


// anadir iluminacion
var sphere = new THREE.SphereGeometry( 0.1, 32, 32 );
light1 = new THREE.PointLight( 0xffffff, 1, 20 );
light1.castShadow = true;
light1.shadow.camera.near = 0.1;
light1.shadow.camera.far = 25;
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
scene.add( light1 );
light2 = new THREE.PointLight( 0xffffff, 1, 20 );
light2.castShadow = true;
light2.shadow.camera.near = 0.1;
light2.shadow.camera.far = 25;
light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
scene.add( light2 );
light3 = new THREE.PointLight( 0xffffff, 1, 20);
light3.castShadow = true;
light3.shadow.camera.near = 0.1;
light3.shadow.camera.far = 25;
light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
scene.add( light3 );

light1.position.set(4,3,0);
light2.position.set(-4,3,4);
light3.position.set(-4,3,-4);

//añadir piso
var meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(15,15, 10,10),
	new THREE.MeshPhongMaterial({color:0xffffff, wireframe: false})
);
meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
meshFloor.receiveShadow = true;
scene.add(meshFloor);

//se inicializa variables objetos, se añade primer objeto a la lista de objetos
object.name = 0;
object.velx = 0;
object.vely = 0;
objetos=[object];

/*MENU DE OBJETO*/
var options = {
  forma: 'cubo',
  color: "#ffae23",
  //parar la rotacion del objeto
  stop: function() {
    object.velx = 0;
	object.vely = 0;
  },
  //rota el objeto seleccionado
  rotar: function(){
  	object.velx = 0.1;
	object.vely = 0.1;
  },
  //resetea las variables del objeto a su estado inicial
  reset: function() {
    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;
    object.velx = 0;
	object.vely = 0;
    object.rotation.x=0;
	object.rotation.y = Math.PI * 45/180;
	object.rotation.z=0;
  }
};
/*MENU DE ESCENA*/
var sceneOptions = {
//inicializar luces prendidas
  luzRoja: true,
  luzAzul:true,
  luzVerde: true,
 //devuelve la camamara a sy posicion incial
  resetCamera: function() {
    camera.position.z = 10;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.lookAt(object.position);
  },
  //Añade cubo a la escena
  anadirCubo: function(){
  	//lambert material para iluminacion
	var material = new THREE.MeshPhongMaterial( { color: 0x33cc33} );
	var object = new THREE.Mesh( cubo, material );
	object.position.y=1*(objetos.length+1);
	object.rotation.y = Math.PI * 45/180;
	object.name=objetos.length-1;
	object.velx = 0;
	object.vely = 0;
	object.receiveShadow = true;
	object.castShadow = true;
	objetos.push(object);
	scene.add(object);
  },
  //Añade esfera a la escena
  anadirEsfera: function(){
  	//lambert material para iluminacion
	var material = new THREE.MeshPhongMaterial( { color: 0x33cc33} );
	var object = new THREE.Mesh( esfera, material );
	object.position.y=1*(objetos.length+1);
	object.rotation.y = Math.PI * 45/180;
	object.name=objetos.length-1;
	object.velx = 0;
	object.vely = 0;
	object.receiveShadow = true;
	object.castShadow = true;
	objetos.push(object);
	scene.add(object);
  },
  //añade prisma a la escena
  anadirPrisma: function(){
  	//lambert material para iluminacion
	var material = new THREE.MeshPhongMaterial( { color: 0x33cc33} );
	var object = new THREE.Mesh( prisma, material );
	object.position.y=1*(objetos.length+1);
	object.rotation.y = Math.PI * 45/180;
	object.name=objetos.length-1;
	object.velx = 0;
	object.vely = 0;
	object.receiveShadow = true;
	object.castShadow = true;
	objetos.push(object);
	scene.add(object);
  },
  //añade piramide a la escena
  anadirPiramide: function(){
  	//lambert material para iluminacion
	var material = new THREE.MeshPhongMaterial( { color: 0x33cc33} );
	var object = new THREE.Mesh( piramide, material );
	object.position.y=1*(objetos.length+1);
	object.rotation.y = Math.PI * 45/180;
	object.name=objetos.length-1;
	object.velx = 0;
	object.vely = 0;
	object.receiveShadow = true;
	object.castShadow = true;
	objetos.push(object);
	scene.add(object);
  },
  //añade toroide a la escena
  anadirToroide: function(){
  	//lambert material para iluminacion
	var material = new THREE.MeshPhongMaterial( { color: 0x33cc33} );
	var object = new THREE.Mesh( toroide, material );
	object.position.y=1*(objetos.length+1);
	object.rotation.y = Math.PI * 45/180;
	object.name=objetos.length-1;
	object.velx = 0;
	object.vely = 0;
	object.receiveShadow = true;
	object.castShadow = true;
	objetos.push(object);
	scene.add(object);
  },
  //añade cilindro a la escena
  anadirCilindro: function(){
  	//lambert material para iluminacion
	var material = new THREE.MeshPhongMaterial( { color: 0x33cc33} );
	var object = new THREE.Mesh( cilindro, material );
	object.position.y=1*(objetos.length+1);
	object.rotation.y = Math.PI * 45/180;
	object.name=objetos.length-1;
	object.velx = 0;
	object.vely = 0;
	object.receiveShadow = true;
	object.castShadow = true;
	objetos.push(object);
	scene.add(object);
  }
};

/*Se crea el menu de objetos y escena*/
var gui = new dat.GUI({ autoplace: false, height: 1000 });
var f1 = gui.addFolder('Objeto');
nuevoColor = f1.addColor(options, 'color').name('Color').listen();
var f1_1 = f1.addFolder('Escala');
scalex = f1_1.add(object.scale, 'x',1,5).name('X').listen();
scaley = f1_1.add(object.scale, 'y',1,5).listen();
scalez = f1_1.add(object.scale, 'z',1,5).name('Z').listen();
var f1_2 = f1.addFolder('Traslación');
trasx= f1_2.add(object.position, 'x',-5,5).name('X').listen();
trasy= f1_2.add(object.position, 'y',0.7,5.7).name('Y').listen();
trasz= f1_2.add(object.position, 'z',-5,5).name('Z').listen();
var f1_3 = f1.addFolder('Rotación');
rotx=f1_3.add(object.rotation, 'x',0,5).name('X').listen();
roty=f1_3.add(object.rotation, 'y',0,5).name('Y').listen();
rotz=f1_3.add(object.rotation, 'z',0,5).name('Z').listen();
var f1_4 = gui.addFolder('Acciones');
f1_4.add(options, 'stop');
f1_4.add(options, 'rotar');
f1_4.add(options, 'reset');

var f2 = gui.addFolder('Escena');
luzRoja = f2.add(sceneOptions, 'luzRoja').name('Luz1');
luzAzul = f2.add(sceneOptions, 'luzAzul').name('Luz2');
luzVerde = f2.add(sceneOptions, 'luzVerde').name('Luz3');
f2.add(sceneOptions, 'resetCamera');
f2.add(sceneOptions, 'anadirCubo');
f2.add(sceneOptions, 'anadirCilindro');
f2.add(sceneOptions, 'anadirToroide');
f2.add(sceneOptions, 'anadirPiramide');
f2.add(sceneOptions, 'anadirPrisma');
f2.add(sceneOptions, 'anadirEsfera');

/*cambia el color del objeto seleccionado*/
nuevoColor.onChange(function(value){
	cambiarColor(value);
});
//prende y apaga luz 1
luzRoja.onFinishChange(function(value) {
  estadoLRoja(value);
});
//prende y apaga luz 2
luzAzul.onFinishChange(function(value) {
  estadoLAzul(value);
});
//prende y apaga luz 3
luzVerde.onFinishChange(function(value) {
  estadoLVerde(value);
});


/*clickable objects*/
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );

// Enable Shadows in the Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

animate();
/*permite seleccionar un objeto con un click sobre el objeto*/
/*Three.js documentation: three.js/examples/canvas_interactive_cubes.html*/
function onDocumentTouchStart( event ) {
	event.preventDefault();
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown( event );
}
function onDocumentMouseDown( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( objetos );
	if ( intersects.length > 0 ) {
		//actualiza los valores de los objetos con aquellos seleccionado en el menu 
		object = intersects[ 0 ].object;
		nuevoColor.object = options;
		scalex.object = object.scale;
		scaley.object = object.scale;
		scalez.object = object.scale;
		trasx.object= object.position;
		trasy.object= object.position;
		trasz.object= object.position;
		rotx.object=object.rotation;
		roty.object=object.rotation;
		rotz.object=object.rotation;
	}
}

//cambia el color de un objeto
function cambiarColor(value){
    object.material.color = new THREE.Color(value);
}
//prende y apaga la luz 1
function estadoLRoja(estado){
	if (estado){
		scene.add( light1 );
	}else{
		scene.remove( light1 );
	}
	
}
//prende y apaga la luz 2
function estadoLAzul(estado){
	if (estado){
		scene.add( light2 );
	}else{
		scene.remove( light2 );
	}
}
//prende y apaga la luz 3
function estadoLVerde(estado){
	if (estado){
		scene.add( light3 );
	}else{
		scene.remove( light3 );
	}
}

//dibuja la escena por cada frame
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
	//rotacion de cada objeto en la escena
	for ( var i in objetos ) {
		//objetos[i].rotation.x += objetos[i].velx;
  		objetos[i].rotation.y += objetos[i].vely;
	}
	renderer.render(scene, camera);
}

//reconocer evento de teclado
function keyDown(event){
	keyboard[event.keyCode] = true;
}
//reconocer evento de teclado
function keyUp(event){
	keyboard[event.keyCode] = false;
}
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
