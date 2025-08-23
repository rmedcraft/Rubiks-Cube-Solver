"use client"; // This is a client component
import { useEffect, useState } from "react";
import ThreeScene from "./components/ThreeScene";
import { WebGL } from "three/examples/jsm/Addons.js";
import { PageUI } from "./components/PageUI";

export default function Home() {
    const [webGL, setWebGL]: any = useState(null)

    useEffect(() => {
        setWebGL(WebGL.isWebGL2Available())
    }, [])

    // temporarily return nothing until we know whether webGL is available or not
    if (webGL === null) return

    const [paused, setPaused] = useState(false)

    const states = {
        paused: { paused, setPaused }
    }

    return (
        <div id="canvas-container">
            {webGL && <div>
                <ThreeScene states={states} />
                <PageUI states={states} />
            </div>}
            {!webGL && <div>
                <h1>This website requires WebGL to run properly</h1>
                <h6>Try updating your browser and trying again</h6>
            </div>}
        </div>
    );
}
