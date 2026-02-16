import { useEffect, useRef } from "react";
import { Predecir, type ResultadoPrediccion } from "../Utils/predecir";
import { useImportarModeloCNN } from "../Utils/importarModelo"

type canvasMiniProps = {
    canvasGrande : React.RefObject<HTMLCanvasElement | null>
        onPredic: (value: ResultadoPrediccion) => void
}


export const MiniCanvas = ({ canvasGrande, onPredic }: canvasMiniProps) =>{
    const miniCanvasRef = useRef<HTMLCanvasElement>(null);

    const modelo = useImportarModeloCNN();

    useEffect(() => {
                if (!miniCanvasRef.current) return;
                miniCanvasRef.current.width = 150;
                miniCanvasRef.current.height = 150;
        }, []);

        useEffect(() => {
                if (!modelo || !canvasGrande.current || !miniCanvasRef.current) return;

                const intervalId = window.setInterval(async () => {
                    const resultado = await Predecir(canvasGrande.current, miniCanvasRef.current, modelo);
                    if (resultado !== null) onPredic(resultado);
                }, 300);

                return () => window.clearInterval(intervalId);
            }, [modelo, canvasGrande, onPredic]);

    return (
        <canvas id="miniCanvas" ref = {miniCanvasRef}/>
    )
}


