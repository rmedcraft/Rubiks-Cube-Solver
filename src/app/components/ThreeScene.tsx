import * as THREE from "three";
import React, { useRef, useEffect, KeyboardEvent } from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CubeView } from "./CubeView";

export const scene = new THREE.Scene();

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {

            // initialize three.js scene here
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 5;

            const cubeView = new CubeView(3);

            scene.add(cubeView.getCube());

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enablePan = false
            controls.update();


            // sets the controls to orbit the center of the cube by default
            // controls.autoRotate = true;

            // const axesHelper = new THREE.AxesHelper(5)
            // scene.add(axesHelper)

            // const axes = [new THREE.Vector3(1, 0, 0).normalize(), new THREE.Vector3(0, 1, 0).normalize(), new THREE.Vector3(0, 0, 1).normalize()]
            // let i = 0
            // let ct = 0

            window.addEventListener("keydown", (evt: any) => {
                if (evt.key === "p") {
                    cubeView.paused = !cubeView.paused
                }
            })

            const clock = new THREE.Clock()
            const speed = 4
            function animate() {
                controls.update();

                renderer.render(scene, camera);
                requestAnimationFrame(animate);

                const timeChange = clock.getDelta()
                if (!cubeView.paused) {
                    cubeView.update(timeChange * speed)
                }
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
