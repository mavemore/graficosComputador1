var width = window.innerWidth;
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

//crear objetos
var cubo = new THREE.CubeGeometry( 1,1,1);
var esfera = new THREE.SphereGeometry(0.5,32,32);
var cono = new THREE.ConeGeometry(0.5,1,32);

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
var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
 
scene.add(skybox);

// anadir iluminacion
var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
 
scene.add(pointLight);

renderer.render(scene, camera);

function cambiarFigura(){
	var figura = document.getElementById("selectFigura").value;
	if (figura=='esfera'){
        object.geometry = esfera;
	}else if (figura=='cubo'){
        object.geometry = cubo;
	}else if (figura=='cono'){
        object.geometry = cono;
	}
    renderer.render(scene, camera);
}

function cambiarColor(){
    var color = document.getElementById("selectColor").value;
    if (color=='verde'){
        object.material.color.setHex( 0x33cc33 );
    }else if (color=='azul'){
        object.material.color.setHex( 0x0066ff );
    }else if (color=='rojo'){
        object.material.color.setHex( 0xff3300 );
    }
    renderer.render(scene, camera);
}

 