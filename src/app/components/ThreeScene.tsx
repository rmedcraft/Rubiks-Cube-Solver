import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CubeView } from "./CubeView";
import { WebGL } from "three/examples/jsm/Addons.js";

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

            const cubeView = new CubeView(3);

            const cube = cubeView.getCube()
            scene.add(cube);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enablePan = false
            controls.update();

            // position the camera nicely
            function positionCamera() {
                const box = new THREE.Box3().setFromObject(cube)
                camera.position.set(1, 1, 1)
                while (box.containsPoint(camera.position)) {
                    camera.position.addScalar(1)
                }
                camera.position.addScalar(3)
            }
            positionCamera()

            window.addEventListener("keydown", (evt: any) => {
                if (evt.key === "p" || evt.key === " ") {
                    cubeView.paused = !cubeView.paused
                }
                if (evt.key === "r") {
                    positionCamera()
                }
            })

            const clock = new THREE.Clock()
            const speed = 4
            function animate() {
                controls.update();

                renderer.render(scene, camera);
                requestAnimationFrame(animate);

                cubeView.update(clock.getDelta() * speed)
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

            // Clean up when component is unmounted
            return () => {
                scene.remove(cube)

                window.removeEventListener('resize', handleResize);

                renderer.dispose()
                renderer.domElement.remove()
            };
        }
    }, []);
    return <div ref={containerRef} />;
};

export default ThreeScene;
