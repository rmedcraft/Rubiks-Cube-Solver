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
    positionBySide: (side: Side, r: number, c: number, dim: number) => void
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
        positionBySide: (side, r, c, dim) => {
            if (!tileRef.current) return
            const tileObj = tileRef.current

            // position tile correctly
            if (side === Side.front) {
                tileObj.position.y = c;
                tileObj.position.x = r;
            }
            if (side === Side.back) {
                tileObj.position.y = c;
                tileObj.position.x = r;
                tileObj.position.z = -dim;
            }

            if (side === Side.left) {
                tileObj.position.z = r;
                tileObj.position.y = c;
                // line up with the borders of the front and back
                tileObj.position.z += 0.5 - dim;

                tileObj.position.x -= 0.5;

            }
            if (side === Side.right) {
                tileObj.position.z = r;
                tileObj.position.y = c;
                // line up with the borders of the front and back
                tileObj.position.z += 0.5 - dim;

                tileObj.position.x += dim - 0.5;
            }

            if (side === Side.top) {
                tileObj.position.y += dim - 0.5;
                tileObj.position.x = r;
                tileObj.position.z = c; // have the physical rotations match what you expect to happen in the matrix

                // line up with the borders of the front and back
                tileObj.position.z += 0.5 - dim;
            }
            if (side === Side.bottom) {
                tileObj.position.y -= 0.5;
                tileObj.position.x = r;
                tileObj.position.z = c;

                // line up with the borders of the front and back
                tileObj.position.z += 0.5 - dim;
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

