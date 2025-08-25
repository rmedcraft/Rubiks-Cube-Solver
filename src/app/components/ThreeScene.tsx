import * as THREE from "three";
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from '@react-three/drei'
import { CubeView, CubeViewHandle } from "./CubeView";
import { Canvas, useThree } from "@react-three/fiber";
import { addCleanupEventListener } from "../utils/eventListener";
import { propagateServerField } from "next/dist/server/lib/render-server";

// export const scene = new THREE.Scene();
export interface ThreeSceneHandle {
    scramble: () => void
}

export interface ThreeSceneProps {
    pausedRef: React.RefObject<boolean>
}

export const ThreeScene = forwardRef<ThreeSceneHandle, ThreeSceneProps>((props: ThreeSceneProps, ref) => {
    const { pausedRef } = props

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

    useImperativeHandle(ref, () => ({
        scramble: () => { console.log("idk") }
    }))

    const dim = 3
    return (
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} onCreated={({ camera }) => positionCamera(camera)} style={{ width: "100vw", height: "100vh" }}>
            <color attach="background" args={["black"]} />
            <OrbitControls enableDamping={false} target={[0, 0, 0]} />

            <CubeView ref={cubeRef} paused={pausedRef} dim={dim} />
        </Canvas>
    )
});