class ModelEj6 extends Model {
    constructor() {
        super();
        this._figuras = [];
    }

    agregarFigura(figura) {
        this._figuras.push(figura);
        this.changed();
    }

    limpiar() {
        this._figuras = [];
        this.changed();
    }

    get figuras() {
        return this._figuras;
    }
}

class ControllerEj6 extends Controller {

    onModelChanged() {
        const figuras = this._model.figuras;
        this._view.render(canvas => dibujarFiguras(canvas, figuras));
    }

    onViewRequest(event) {
        const { accion, tipoLinea, grosor } = event.detail;

        if (accion === 'cargar') {
            let texto = prompt('Pegue el JSON de la figura:');
            if (texto === null || texto.trim() === '') return;

            try {
                let figura = JSON.parse(texto);

                // se anexan al objeto ya parseado los valores elegidos en los
                // inputs de la Vista, sin tocar el formato del JSON pedido
                figura.tipoLinea = tipoLinea;
                figura.grosor = Number(grosor);

                this._model.agregarFigura(figura);
            } catch (e) {
                alert('JSON inválido: ' + e.message);
            }
        }

        if (accion === 'limpiar') {
            this._model.limpiar();
        }
    }
}

function patronDeLinea(tipoLinea) {
    switch (tipoLinea) {
        case 'punteada':
            return [4, 4];
        case 'discontinua':
            return [12, 6];
        case 'solida':
        default:
            return [];
    }
}

function dibujarFiguras(canvas, figuras) {
    let ctx = canvas.getContext('2d');

    figuras.forEach(figura => {

        ctx.lineWidth = figura.grosor || 1;
        ctx.setLineDash(patronDeLinea(figura.tipoLinea));

        ctx.beginPath();

        if (figura.tipo === 'circulo') {
            ctx.arc(figura.x, figura.y, figura.radio, 0, Math.PI * 2);
        } else if (figura.tipo === 'poligono') {
            const puntos = figura.puntos;
            if (!puntos || puntos.length === 0) return;
            ctx.moveTo(puntos[0].x, puntos[0].y);
            for (let i = 1; i < puntos.length; i++) {
                ctx.lineTo(puntos[i].x, puntos[i].y);
            }
            ctx.closePath();
        } else {
            return; 
        }

        ctx.fillStyle = figura.color || 'black';
        ctx.fill();
        ctx.stroke();
    });

    ctx.lineWidth = 1;
    ctx.setLineDash([]);
}