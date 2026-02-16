import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export type ResultadoPrediccion = {
    clase: number;
    probabilidad: number;
    confianza: number;
};

let detectorCargado: cocoSsd.ObjectDetection | null = null;

export const cargarDetector = async () => {
    if (!detectorCargado) {
        detectorCargado = await cocoSsd.load();
    }
    return detectorCargado;
};




export const Predecir = async (canvas: HTMLCanvasElement | null,resize_canvas: HTMLCanvasElement | null,modelo: tf.LayersModel | null): Promise<ResultadoPrediccion | null> => {
    if (!modelo || !canvas || !resize_canvas) return null;

    const detector = await cargarDetector();
    const detecciones = await detector.detect(canvas);
    const animales = detecciones.filter(det => 
        det.class === 'dog' || det.class === 'cat'
    );

    if (animales.length === 0) {
        return null;
    }

    const animalDetectado = animales[0];




    resample_single(canvas,150,150,resize_canvas);

    var ctx2 = resize_canvas.getContext("2d",{ willReadFrequently: true });
    var imgData = ctx2?.getImageData(0,0, 150, 150);
    const arr: number[][][] = [];
    let arr100: number[][] = [];

    if (!imgData) return null;

    for (var p=0; p < imgData.data.length; p+= 4) {
        var rojo = imgData.data[p] / 255;
        var verde = imgData.data[p+1] / 255;
        var azul = imgData.data[p+2] / 255;

        arr100.push([rojo, verde, azul]);
        if (arr100.length == 150) {
          arr.push(arr100);
          arr100 = [];
        }
      }
    const batch: number[][][][] = [arr]

        const resultado = tf.tidy(() => {
        const tensor = tf.tensor4d(batch);
        const prediccion = modelo.predict(tensor) as tf.Tensor;
        const data = prediccion.dataSync();

        const sorted = Array.from(data)
            .map((prob, idx) => ({ clase: idx, prob }))
            .sort((a, b) => b.prob - a.prob);

        const top1 = sorted[0];
        const top2 = sorted[1];
        const diferencia = top1.prob - top2.prob;

    
        return {
            tipoAnimal: animalDetectado.class, 
            confianzaDeteccion: animalDetectado.score,
            clase: top1.clase,
            probabilidad: top1.prob,
            diferencia: diferencia
        };
    });

    console.log(`Predicción: Clase ${resultado.clase} con ${(resultado.probabilidad * 100).toFixed(2)}% de confianza`);
    
    return {
        clase: resultado.clase,
        probabilidad: resultado.probabilidad,
        confianza: resultado.confianzaDeteccion
    };
}








function resample_single(canvas:HTMLCanvasElement, width:number, height:number, resize_canvas:HTMLCanvasElement) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d",{ willReadFrequently: true });
    var ctx2 = resize_canvas.getContext("2d",{ willReadFrequently: true });

    if(!ctx || !ctx2) return;

    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx2.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }


    ctx2.putImageData(img2, 0, 0);
}