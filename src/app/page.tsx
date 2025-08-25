"use client"; // This is a client component
import { useEffect, useRef, useState } from "react";
import { ThreeScene, ThreeSceneHandle } from "./components/ThreeScene";
import { WebGL } from "three/examples/jsm/Addons.js";
import { PageUI } from "./components/PageUI";

export default function Home() {
    const [webGL, setWebGL]: any = useState(null)
    const [paused, setPaused]: any = useState(false)
    const pausedRef = useRef(paused)
    const sceneRef = useRef<ThreeSceneHandle>(null)

    useEffect(() => {
        setWebGL(WebGL.isWebGL2Available())
    }, [])

    useEffect(() => {
        pausedRef.current = paused
    }, [paused])

    // temporarily return nothing until we know whether webGL is available or not
    if (webGL === null) return

    return (
        <div id="canvas-container">
            {webGL && <div>
                <ThreeScene ref={sceneRef} pausedRef={pausedRef} />
                <PageUI paused={paused} setPaused={setPaused} sceneRef={sceneRef} />
            </div>}
            {!webGL && <div>
                <h1>This website requires WebGL to run properly</h1>
                <h6>Try updating your browser and trying again</h6>
            </div>}
        </div>
    );
}
