import { RippleButton } from "./ui/rippleButton";
import { BsPause, BsPlay } from "react-icons/bs";

export function PageUI(props: any) {
    const { paused, setPaused, sceneRef } = props

    return (
        <div className="absolute inset-0 w-screen h-screen pointer-events-none">
            <div className="m-2 pointer-events-auto">
                <RippleButton variant="default" size="icon" onClick={() => setPaused((paused: boolean) => !paused)}>
                    {paused ? <BsPlay /> : <BsPause />}
                </RippleButton>
            </div>
            <div className="absolute bottom-2 w-screen flex flex-row justify-center gap-3">
                <div className=" pointer-events-auto">
                    <RippleButton variant="default" >
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