import { RippleButton } from "./ui/rippleButton";
import { BsPause, BsPlay } from "react-icons/bs";

export function PageUI(props: any) {
    const { paused, setPaused } = props

    return (
        <div className="absolute inset-0 pointer-events-none">
            <div className="m-2 pointer-events-auto">
                <RippleButton variant="default" size="icon" onClick={() => setPaused((paused: boolean) => !paused)}>
                    {paused ? <BsPlay /> : <BsPause />}
                </RippleButton>
            </div>
        </div >
    )
}