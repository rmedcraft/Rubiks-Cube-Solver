import { useEffect } from "react";

export function addCleanupEventListener(addTo: Window | Document, listenOn: keyof DocumentEventMap, func: (evt: any) => void, options?: boolean | AddEventListenerOptions) {
    useEffect(() => {
        addTo.addEventListener(listenOn, func, options)

        return () => addTo.removeEventListener(listenOn, func, options)
    }, [])
}