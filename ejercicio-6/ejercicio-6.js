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
        const accion = event.detail.accion;

        if (accion === 'cargar') {
            let texto = prompt('Pegue el JSON de la figura:');
            if (texto === null || texto.trim() === '') return;

            try {
                let figura = JSON.parse(texto);
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

function dibujarFiguras(canvas, figuras) {
    let ctx = canvas.getContext('2d');

    figuras.forEach(figura => {
        ctx.beginPath();

        if (figura.tipo === 'circulo') {
            ctx.arc(figura.x, figura.y, figura.radio, 0, Math.PI * 2);
        } else if (figura.tipo === 'poligono') {
            const puntos = figura.puntos;
            if (!puntos || puntos.length === 0) return;
            // lineTo sí necesita que el cursor arranque en el primer vértice
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
}
