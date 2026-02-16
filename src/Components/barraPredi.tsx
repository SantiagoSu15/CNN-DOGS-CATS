import type { ResultadoPrediccion } from '../Utils/predecir';
import {labels} from '../Utils/etiquetas'


type BarraPrediProps = {
  predic: ResultadoPrediccion | null;
};

export const BarraPredi = ({ predic }: BarraPrediProps) =>{
    if (!predic) {
        return (
            <div className="barraPredi">
                <p>N/A</p>
            </div>
        );
    }

    let clase = labels[predic.clase as number] || "Desconocida";

    
    return(
        <div className="barraPredi">
            <p>{`Clase: ${clase}`}</p>
            <p>{`Prob: ${(predic.probabilidad * 100).toFixed(1)}%`}</p>
            <p>{`Conf: ${(predic.confianza * 100).toFixed(1)}%`}</p>
        </div>
    )
}



