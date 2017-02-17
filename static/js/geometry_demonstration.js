/**
 * Created by artem on 2/13/17.
 */

"use strict";

const THREE = require("./three");



/*
 <script>
 let scene = new THREE.Scene();
 let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

 let renderer = new THREE.WebGLRenderer();
 renderer.setSize( window.innerWidth, window.innerHeight );
 document.body.appendChild( renderer.domElement );

 let geometry = new THREE.BoxGeometry( 1, 1, 1 );
 let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 let anotherMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );

 let cube = new THREE.Mesh( geometry, material );
 let anotherCube = new THREE.Mesh(geometry, anotherMaterial);
 scene.add( cube );
 scene.add(anotherCube);

 camera.position.z = 5;

 let pointLight = new THREE.PointLight(0xFFFFFF);
 pointLight.position.x = 10;
 pointLight.position.y = 50;
 pointLight.position.z = 130;
 scene.add(pointLight);

 let time = 0;
 let startPosition = anotherCube.position;

 let render = function () {
 requestAnimationFrame( render );

 cube.rotation.x += 0.1;
 cube.rotation.y += 0.1;

 cube.position.x += 0.01;

 time += 0.1;
 const amplitude = 0.1;
 anotherCube.position.x = startPosition.x + 2 * amplitude * Math.cos(time);
 anotherCube.position.y = startPosition.y + amplitude * Math.sin(time);

 let dist = cube.getWorldPosition().sub(anotherCube.getWorldPosition());
 if (dist.length() < 0.2) {
 console.log("Bang!");
 }

 renderer.render(scene, camera);
 };

 console.log("before render");

 render();
 </script>
 */
