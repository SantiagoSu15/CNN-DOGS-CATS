import type { RefObject } from "react";

type procesarCParam = {
    videoCurrent : HTMLVideoElement | null,
    canvasRef : RefObject<HTMLCanvasElement | null> 
}

export const procesarCanvas = ({videoCurrent,canvasRef}: procesarCParam) =>{

    const procesarCamara = () =>{
        if (!canvasRef ||!canvasRef.current || !videoCurrent) return;

        const ctx = canvasRef.current.getContext("2d",{ willReadFrequently: true });
        if (!ctx) return;

         ctx.drawImage(
            videoCurrent,           
            0, 0,                   
            videoCurrent.videoWidth,  
            videoCurrent.videoHeight, 
            0, 0,                   
            canvasRef.current.width, canvasRef.current.height                    
        );

        requestAnimationFrame(procesarCamara);
    } 
    procesarCamara();
}