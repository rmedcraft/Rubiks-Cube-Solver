import { extend } from "@react-three/fiber";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useRef } from "react";
import * as THREE from "three"
import { Side } from "./CubeView";
import { withRouter } from "next/router";

export enum Color {
    white = 0xffffff,
    red = 0xff0000,
    green = 0x00ff00,
    blue = 0x0000ff,
    yellow = 0xffff00,
    orange = 0xffa500,
}

export interface TileViewHandle {
    rotateBySide: (side: Side) => void,
    setColor: (color: Color) => void,
    getColor: () => Color,
    getTile: () => THREE.Group<THREE.Object3DEventMap>
}

interface TileViewProps {
    color: Color
}

export const TileView = forwardRef<TileViewHandle, TileViewProps>((props, ref) => {
    const tileRef = useRef<THREE.Group>(null!);
    const borderRef = useRef<THREE.Mesh>(null!)

    const [color, setColor] = useState(props.color)

    useImperativeHandle(ref, () => ({
        rotateBySide(side: Side) {
            if (!tileRef.current) return

            if (side === Side.back) {
                tileRef.current.rotateX(Math.PI);
            }
            if (side === Side.left) {
                tileRef.current.rotateY(-Math.PI / 2);
            }
            if (side === Side.right) {
                tileRef.current.rotateY(Math.PI / 2);
            }
            if (side === Side.top) {
                tileRef.current.rotateX(-Math.PI / 2);
            }
            if (side === Side.bottom) {
                tileRef.current.rotateX(Math.PI / 2);
            }
        },
        setColor,
        getColor: () => color,
        getTile: () => tileRef.current
    }))

    useEffect(() => {
        if (borderRef.current) {
            borderRef.current.position.z -= 0.001
        }
    }, [])

    return (
        <group ref={tileRef}>
            <mesh renderOrder={1} name="coloredTile">
                <planeGeometry args={[0.9, 0.9]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <mesh renderOrder={0} ref={borderRef}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color={0x000000} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
})

