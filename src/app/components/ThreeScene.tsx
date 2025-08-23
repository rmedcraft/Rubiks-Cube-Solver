import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from '@react-three/drei'
import { CubeView, CubeViewHandle } from "./CubeView";
import { Canvas, useThree } from "@react-three/fiber";
import { addCleanupEventListener } from "../utils/eventListener";

// export const scene = new THREE.Scene();

export default function ThreeScene() {
    const pausedRef = useRef<boolean>(false)

    const cubeRef = useRef<CubeViewHandle>(null)
    function positionCamera(camera: THREE.Camera) {
        if (!cubeRef.current) return

        const box = new THREE.Box3().setFromObject(cubeRef.current.getCube()!)
        camera.position.set(1, 1, 1)
        while (box.containsPoint(camera.position)) {
            camera.position.addScalar(1)
        }
        camera.position.addScalar(3)
    }

    addCleanupEventListener(window, "keydown", (evt) => {
        if (evt.key === "p" || evt.key === " ") {
            pausedRef.current = !pausedRef.current
        }
    })

    const dim = 3
    return (
        <Canvas onCreated={({ camera }) => positionCamera(camera)} style={{ width: "100vw", height: "100vh" }}>
            <OrbitControls position0={new THREE.Vector3(1, 1, 1).multiplyScalar(dim)} target={[0, 0, 0]} />

            <CubeView ref={cubeRef} paused={pausedRef} dim={dim} />
        </Canvas>
    )
};