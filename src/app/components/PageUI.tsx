import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { RippleButton } from "./ui/rippleButton";
import { BsPause, BsPlay } from "react-icons/bs";
import { CubeViewHandle } from "./CubeView";
import { ThreeSceneHandle } from "./ThreeScene";

interface PageUIProps {
    paused: boolean,
    setPaused: Dispatch<SetStateAction<boolean>>,
    sceneRef: React.RefObject<ThreeSceneHandle | null>
}

export function PageUI(props: PageUIProps) {
    const { paused, setPaused, sceneRef } = props
    let cubeRef = useRef<CubeViewHandle>(null)
    const [state, setState] = useState()

    useEffect(() => {
        if (!sceneRef.current) return
        console.log("getCubeRef")
        cubeRef = sceneRef.current.getCubeRef()
        console.log(cubeRef.current)
    }, [])

    function scramble() {
        if (!cubeRef.current) return
        console.log("scrambling")
        cubeRef.current.scramble()
    }

    return (
        <div className="absolute inset-0 w-screen h-screen pointer-events-none">
            <div className="m-2 pointer-events-auto">
                <RippleButton variant="default" size="icon" onClick={() => setPaused((paused: boolean) => !paused)}>
                    {paused ? <BsPlay /> : <BsPause />}
                </RippleButton>
            </div>
            <div className="absolute bottom-2 w-screen flex flex-row justify-center gap-3">
                <div className=" pointer-events-auto">
                    <RippleButton variant="default" onClick={scramble} >
                        {/* onClick={sceneRef.current.scramble()} */}
                        Scramble
                    </RippleButton>
                </div>
                <div className=" pointer-events-auto">
                    <RippleButton variant="default">
                        Solve
                    </RippleButton>
                </div>
            </div>
        </div >
    )
}