import * as THREE from 'three';

export class TileView {
    color: THREE.Color = new THREE.Color(Color.blue);
    mesh: THREE.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial({ color: this.color }));

    setColor(color: Color) {
        (this.mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
    }

    getColor() {
        return (this.mesh.material as THREE.MeshBasicMaterial).color.getHex() as Color;
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