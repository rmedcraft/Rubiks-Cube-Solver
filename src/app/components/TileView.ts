import * as THREE from 'three';
import { Side } from './CubeView';

export class TileView {
    mesh: THREE.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ color: Color.white }));
    color: Color = Color.white;

    constructor(color: Color) {
        this.setColor(color);
    }

    setColor(color: Color) {
        (this.mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
        this.color = color;
    }

    getColor() {
        return (this.mesh.material as THREE.MeshBasicMaterial).color.getHex() as Color;
    }

    rotateBySide(side: Side) {
        if (side === Side.back) {
            this.mesh.rotateX(Math.PI);
        }
        if (side === Side.left) {
            this.mesh.rotateY(-Math.PI / 2);
        }
        if (side === Side.right) {
            this.mesh.rotateY(Math.PI / 2);
        }
        if (side === Side.top) {
            this.mesh.rotateX(-Math.PI / 2);
        }
        if (side === Side.bottom) {
            this.mesh.rotateX(Math.PI / 2);
        }
    }
}

export enum Color {
    white = 0xffffff,
    red = 0xff0000,
    green = 0x00ff00,
    blue = 0x0000ff,
    yellow = 0xffff00,
    orange = 0xffa500,
}