//Constructores

function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//Realiza cotizacion con los datos
Seguro.prototype.cotizarSeguro = function (){
    /*
    1 = Americano 1.15
    2 = Asiato 1.05
    3 = Europeo 1.35
    */
    let cantidad;
    const base = 2000;

    switch(this.marca){
        case '1':
        cantidad = base * 1.15;
        case '2':
        cantidad = base * 1.05;
        case '3':
        cantidad = base * 1.35;
        default:
            break;
    }

    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;
    // Cada año el coste es menor 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;
    /*
    Si el seguro es basico 30% +
    Si el seguro es completo 50% +
    */
    if (this.tipo === 'basico'){
    cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    return cantidad;
}

function UI(){}

// Llena "años"
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;
    
    const selectYear = document.querySelector('#year');

    for(let i = max; i>min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestra alertas
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement('div');
    if(tipo === 'error'){
        div.classList.add('mensaje', 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en HTML la alerta
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() =>{
        div.remove();
    },3000)
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const {marca, year, tipo} = seguro;

    let textoMarca;

    switch(marca){
        case '1':
        textoMarca = 'Americano'
            break;
        case '2':
        textoMarca = 'Asiatico'
            break;
        case '3':
        textoMarca = 'Europeo'
            break;
        default:
            break;
    }
//Crear el resultado
const div = document.createElement('div');
div.classList.add('mt-10');

div.innerHTML = `
<p class="header">Tu Resumen</p>
<p class="font-bold">Marca: <span class = "font-normal"> ${textoMarca}</span></p>
<p class="font-bold">Año: <span class = "font-normal"> ${year}</span></p>
<p class="font-bold">Tipo de seguro: <span class = "font-normal capitalize"> ${tipo}</span></p>
<p class="font-bold">Total: <span class = "font-normal">$ ${total}</span></p>
`;

const resultadoDiv = document.querySelector('#resultado');

//Mostrar spinner
const spinner = document.querySelector('#cargando');
spinner.style.display = 'block';
setTimeout(()=>{
    spinner.style.display = 'none';//Se borra el spinner
    resultadoDiv.appendChild(div);// Se muestra el resultado
}, 3000);

}

//Instancia "UI"
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();//Llena el select con los años
})

eventListeners();
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    //Marca seleccionada
    const marca = document.querySelector('#marca').value;
    //Año seleccionado
    const year = document.querySelector('#year').value;
    //Tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    if (marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    ui.mostrarMensaje('Cotizando...', 'exito');

    //Ocultar cotizaciones previos
    const resultados = document.querySelector('#resultado div');
    if (resultados !=null){
        resultados.remove()
    }

    //Instanciar seguro
    const seguro = new Seguro(marca, year, tipo)
    const total = seguro.cotizarSeguro();
    //Prototype cotizacion
    ui.mostrarResultado(total, seguro);
}