import * as THREE from 'three';
import { Side } from './CubeView';

export class TileView {
    tile: THREE.Group = new THREE.Group()
    color: Color = Color.white;

    constructor(color: Color) {
        const tileMesh: THREE.Mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.9, 0.9),
            new THREE.MeshBasicMaterial({ color: Color.white })
        );
        tileMesh.name = "coloredTile"
        tileMesh.renderOrder = 1
        this.tile.add(tileMesh)

        const borderMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
        );
        borderMesh.renderOrder = 0;
        this.tile.add(borderMesh)

        tileMesh.position.z += 0.001

        this.setColor(color);
    }

    setColor(color: Color) {
        const mesh = this.tile.getObjectByName("coloredTile");
        if (!(mesh instanceof THREE.Mesh)) return

        const material = mesh.material
        material.color.setHex(color);
        this.color = color;
    }

    getColor() {
        const material = this.tile.getObjectByName("coloredTile");
        if (!(material instanceof THREE.MeshBasicMaterial)) return

        return material.color.getHex() as Color;
    }

    rotateBySide(side: Side) {
        if (side === Side.back) {
            this.tile.rotateX(Math.PI);
        }
        if (side === Side.left) {
            this.tile.rotateY(-Math.PI / 2);
        }
        if (side === Side.right) {
            this.tile.rotateY(Math.PI / 2);
        }
        if (side === Side.top) {
            this.tile.rotateX(-Math.PI / 2);
        }
        if (side === Side.bottom) {
            this.tile.rotateX(Math.PI / 2);
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