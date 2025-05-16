import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Color, TileView } from "./tileView";
import { color } from "three/tsl";

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // initialize three.js scene here
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 5;

            // const geometry = new THREE.BoxGeometry();
            // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            // const pane = new THREE.PlaneGeometry();
            // const cube = new THREE.Mesh(pane, material);
            // scene.add(cube);
            const tileView = new TileView();
            scene.add(tileView.mesh);

            console.log(tileView.mesh);


            const controls = new OrbitControls(camera, renderer.domElement);
            controls.update();
            let index = 0;
            let i = 0;

            let colors = [Color.white, Color.red, Color.orange, Color.blue, Color.green, Color.yellow];
            tileView.setColor(colors[index++]);
            // handle animations
            function animate() {
                controls.update();
                // tileView.mesh.rotation.x += 0.01;
                // tileView.mesh.rotation.y += 0.01;

                i++;
                if (i >= 100) {
                    i = 0;
                    tileView.setColor(colors[index++]);
                    if (index >= colors.length) {
                        index = 0;
                    }
                }


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
