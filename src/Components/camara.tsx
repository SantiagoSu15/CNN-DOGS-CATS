import Video from "./Video";
import type { ResultadoPrediccion } from "../Utils/predecir";

type CamaraProps = {
    onPredic: (value: ResultadoPrediccion) => void;
};

const Camara = ({ onPredic }: CamaraProps) =>{

    return (
        <div className = "camaraContenedor">
            <div className="videoContenedor">
                <Video onPredic={onPredic} />
            </div>
        </div>
    );

} 


export default Camara;