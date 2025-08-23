import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from '@react-three/drei'
import { CubeView, CubeViewHandle } from "./CubeViewTest";
import { Canvas } from "@react-three/fiber";
import { addCleanupEventListener } from "../utils/eventListener";

// export const scene = new THREE.Scene();

export default function ThreeScene() {
    const pausedRef = useRef<boolean>(false)

    const cubeRef = useRef<CubeViewHandle>(null)

    const clockRef = useRef(new THREE.Clock())
    const speedRef = useRef(4)

    const frameIDRef = useRef<number | null>(null)

    useEffect(() => {
        function animate() {
            if (cubeRef.current) {
                const delta = clockRef.current.getDelta() * speedRef.current
                if (!pausedRef.current) {
                    cubeRef.current.update(delta)
                }
            }
            frameIDRef.current = requestAnimationFrame(animate);
        }

        frameIDRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameIDRef.current!)
    }, [])

    addCleanupEventListener(window, "keydown", (evt) => {
        if (evt.key === "p" || evt.key === " ") {
            pausedRef.current = !pausedRef.current
        }
    })

    return (
        <div>
            <Canvas style={{ width: "100vw", height: "100vh" }}>
                <OrbitControls target={[0, 0, 0]} />

                <CubeView ref={cubeRef} paused={pausedRef} dim={3} />
            </Canvas>
        </div>
    )

    // const containerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         // initialize three.js scene here
    //         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //         const renderer = new THREE.WebGLRenderer();
    //         renderer.setSize(window.innerWidth, window.innerHeight);
    //         containerRef.current?.appendChild(renderer.domElement);

    //         const cubeView = new CubeView(3);

    //         const cube = cubeView.getCube()
    //         scene.add(cube);

    //         const controls = new OrbitControls(camera, renderer.domElement);
    //         controls.enablePan = false
    //         controls.update();

    //         // position the camera nicely
    //         function positionCamera() {
    //             const box = new THREE.Box3().setFromObject(cube)
    //             camera.position.set(1, 1, 1)
    //             while (box.containsPoint(camera.position)) {
    //                 camera.position.addScalar(1)
    //             }
    //             camera.position.addScalar(3)
    //         }
    //         positionCamera()

    //         window.addEventListener("keydown", (evt: any) => {
    //             if (evt.key === "p" || evt.key === " ") {
    //                 cubeView.paused = !cubeView.paused
    //             }
    //             if (evt.key === "r") {
    //                 positionCamera()
    //             }
    //         })

    //         const clock = new THREE.Clock()
    //         const speed = 4
    //         function animate() {
    //             controls.update();

    //             renderer.render(scene, camera);
    //             requestAnimationFrame(animate);

    //             cubeView.update(clock.getDelta() * speed)
    //         }

    //         animate();

    //         // handle resizing the page
    //         const handleResize = () => {
    //             const width = window.innerWidth;
    //             const height = window.innerHeight;

    //             camera.aspect = width / height;
    //             camera.updateProjectionMatrix();

    //             renderer.setSize(width, height);
    //         };

    //         window.addEventListener('resize', handleResize);

    //         // Clean up when component is unmounted
    //         return () => {
    //             scene.remove(cube)

    //             window.removeEventListener('resize', handleResize);

    //             renderer.dispose()
    //             renderer.domElement.remove()
    //         };
    //     }
    // }, []);
    // return <div ref={containerRef} />;
};