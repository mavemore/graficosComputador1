var width = window.innerWidth*0.8;
var height =  window.innerHeight;

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

//crear objetos
var cubo = new THREE.CubeGeometry( 1,1,1);
var esfera = new THREE.SphereGeometry(0.5,32,32);
var piramide = new THREE.CylinderGeometry(0,1,1,4,false);

/*ring prism begin*/
/*fuente: https://stackoverflow.com/questions/28460758/smooth-ring-3d-in-three-js*/
Ring3D = function(innerRadius, outerRadius, heigth, Segments) {

	var extrudeSettings = {
		amount: heigth,
		bevelEnabled: false,
		curveSegments: Segments
	};
	var arcShape = new THREE.Shape();
	arcShape.moveTo(outerRadius, 0);
	arcShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

	var holePath = new THREE.Path();
	holePath.moveTo(innerRadius, 0);
	holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
	arcShape.holes.push(holePath);

	var geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
	return geometry;

}  
/*ring ends*/
var toroide = new Ring3D( 0.5,1,1,32); 
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
object.rotation.y = Math.PI * 45/180;
scene.add(object);

camera.position.y = 3;
camera.position.z = 5;
//camera.position.x = 3;
camera.lookAt(object.position);

//anadir skybox 
/*var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
 
scene.add(skybox);*/

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

light1.position.x = 2
light1.position.y = 1.5
light1.position.z = 0
light2.position.x = -3
light2.position.y = -2
light2.position.z = 1
light3.position.x = -2
light3.position.y = 1.5
light3.position.z = -2
//

//añadir piso
var meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(10,10, 10,10),
	new THREE.MeshBasicMaterial({color:0xffffff, wireframe: true})
);
meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
scene.add(meshFloor);


renderer.render(scene, camera);


function cambiarFigura(){
	var figura = document.getElementById("selectFigura").value;
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
	renderer.render(scene, camera);
}

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
}

function estadoLRoja(){
	estado = document.getElementById("luz1").checked;
	if (estado){
		scene.add( light1 );
	}else{
		scene.remove( light1 );
	}
	renderer.render(scene, camera);
}


function estadoLAzul(){
	estado = document.getElementById("luz2").checked;
	if (estado){
		scene.add( light2 );
	}else{
		scene.remove( light2 );
	}
	renderer.render(scene, camera);
}


function estadoLVerde(){
	estado = document.getElementById("luz3").checked;
	if (estado){
		scene.add( light3 );
	}else{
		scene.remove( light3 );
	}
	renderer.render(scene, camera);
}

function trasladarObjeto(){
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
	object.position.y=0;
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
	camera.position.y = 3;
	camera.position.z = 5;
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
