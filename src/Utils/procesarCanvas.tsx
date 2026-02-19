import type { RefObject } from "react";

type procesarCParam = {
    videoCurrent : HTMLVideoElement | null,
    canvasRef : RefObject<HTMLCanvasElement | null> 
}

export const procesarCanvas = ({videoCurrent,canvasRef}: procesarCParam) =>{
    let animationFrameId: number | null = null;
    let stopped = false;

    const procesarCamara = () =>{
        if (stopped) return;

        if (!canvasRef.current || !videoCurrent) {
            animationFrameId = requestAnimationFrame(procesarCamara);
            return;
        }

        if (videoCurrent.readyState < 2 || videoCurrent.videoWidth === 0 || videoCurrent.videoHeight === 0) {
            animationFrameId = requestAnimationFrame(procesarCamara);
            return;
        }

        if ( canvasRef.current.width !== videoCurrent.videoWidth || canvasRef.current.height !== videoCurrent.videoHeight) {
            canvasRef.current.width = videoCurrent.videoWidth;
            canvasRef.current.height = videoCurrent.videoHeight;
        }

        const ctx = canvasRef.current.getContext("2d",{ willReadFrequently: true });
        if (!ctx) {
            animationFrameId = requestAnimationFrame(procesarCamara);
            return;
        }

        try {
            ctx.drawImage(
                videoCurrent,
                0, 0,
                videoCurrent.videoWidth,
                videoCurrent.videoHeight,
                0, 0,
                canvasRef.current.width, canvasRef.current.height
            );
        } catch (error) {
            console.error("Error procesando cámara:", error);
        }

        animationFrameId = requestAnimationFrame(procesarCamara);
    } 
    procesarCamara();

    return () => {
        stopped = true;
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}