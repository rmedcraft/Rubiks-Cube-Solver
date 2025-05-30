import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Color, TileView } from "./TileView";
import { CubeView, Side } from "./CubeView";
// import { TileView } from "./tileView";

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [debugMode, setDebugMode] = useState(false);

    // window!.addEventListener('keydown', (event) => {
    //     if (event.ctrlKey) {
    //         setDebugMode(debugMode => !debugMode);
    //         console.log("ctrl pressed, debug mode: " + debugMode);
    //     }
    // });
    useEffect(() => {
        if (typeof window !== "undefined") {

            // initialize three.js scene here
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 5;

            const cubeView = new CubeView(3, debugMode);
            cubeView.printCube();
            scene.add(cubeView.getCube());

            // console.log(tileView.mesh);


            const controls = new OrbitControls(camera, renderer.domElement);
            controls.update();

            // sets the controls to orbit the center of the cube by default
            controls.target = cubeView.getCenterPoint();
            // controls.autoRotate = true;

            function animate() {
                controls.update();

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }

            animate();

            // handle resizing the page
            const handleResize = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;

                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);

            // Clean up the event listener when the component is unmounted
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return <div ref={containerRef} />;
};

export default ThreeScene;
