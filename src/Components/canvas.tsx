import { useEffect, useRef } from "react";
import { procesarCanvas } from "../Utils/procesarCanvas";
import { MiniCanvas } from "./MiniCanvas";
import type { ResultadoPrediccion } from "../Utils/predecir";

type CanvasProps = {
    videoRef: HTMLVideoElement | null
    versionVideo : number
    onPredic: (value: ResultadoPrediccion) => void
  };

export const Canvas = ({ videoRef, versionVideo, onPredic }: CanvasProps) =>{
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if (videoRef && canvasRef.current) {
                        const cleanup = procesarCanvas({ videoCurrent: videoRef, canvasRef });
                        return cleanup;
          }

        },[videoRef, versionVideo])


    return(
        <>
             <canvas  id="canvasGrande" ref={canvasRef} />
             <MiniCanvas canvasGrande={canvasRef} onPredic={onPredic} />
        </>

    )
}