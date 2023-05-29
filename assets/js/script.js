// 1 generamos la clase finanza

class Finanza{
    constructor(presupuesto = 0){ // se inicia en 0 
        this._presupuesto = presupuesto; 
        this._saldo = 0;
        this.gastos = [];
    }

    get presupuesto(){
        return this._presupuesto;
    }

    set presupuesto(monto){
        this._presupuesto += monto;
        this.saldo += monto;
    }

    get saldo(){
        return this._saldo;
    }
    
    set saldo(monto){
      this._saldo += monto;
    }

    getGastoTotal(){
        let totalGasto = 0;
        // recorremos el array de objetos gasto y sumamos los montos, luego lo retorna
        this.gastos.forEach(element => {
            totalGasto += element.monto;
        });       
        return totalGasto;
    }

    reduceSaldo(monto){
        this._saldo -= monto;
    }
    setGasto(gasto){
        this.gastos.push(gasto);       
    }
    //mdn Array.splice;
    deleteGasto(id, monto){
        var objeto = this.gastos.filter(gasto => gasto.id === id); // obtenemos el gasto que contiene dicho id
        this.gastos.splice(this.gastos.indexOf(objeto[0]),1);   // eliminamos ese gasto 
        this._saldo += monto;  // recumeramos saldo
    }       
} 

// 2 clase gasto
class Gasto{
    constructor(id = 0, detalle = '', monto = 0){
        this._id = id;
        this._detalle = detalle;
        this._monto = monto;
    }
}

// 3 misFinanzas,  instanciamos Finanza
let misFinanzas = new Finanza();

// 4 obtenemos el presupuesto  de formPresupuesto
let formPresupuesto = document.querySelector("#formPresupuesto");
formPresupuesto.addEventListener("submit", procesaFormPresupuesto);


//5 obtenemos el gasto de formGasto
let formGasto = document.querySelector("#formGasto"); // directo es6 igual lo reconoce con el nombre del id "formGasto"
formGasto.addEventListener("submit", procesaFormGasto);

// funciones
function drawRowGasto(objGasto){
    

    let tbodyGastos = document.querySelector("#tbodyGastos"); 
        let tr = document.createElement("tr");
        tr.innerHTML = `<tr class="">
                    <td scope="row">${objGasto.detalle}</td>
                    <td>$${formatoMoneda(objGasto.monto)}</td>
                    <td><button class="btn btn-transparent border-0 btnItemGasto" id="test" type="button" onclick="eliminaGasto('${objGasto.id}', ${objGasto.monto})"><i class="fui-trash"></i></button></td>
                </tr>`;
        tbodyGastos.append(tr);
        actualizaTotales();
}

function drawAllRowsGasto(){
    let tbodyGastos = document.querySelector("#tbodyGastos"); 
    tbodyGastos.innerHTML = '';
    misFinanzas.gastos.forEach(element => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<tr class="">
                    <td scope="row">${element.detalle}</td>
                    <td>${element.monto}</td>
                    <td><button class="btn btn-transparent border-0 btnItemGasto" id="test" type="button" onclick="eliminaGasto('${element.id}', ${element.monto})"><i class="fui-trash"></i></button></td>
                </tr>`;
        tbodyGastos.append(tr);
        actualizaTotales();
    });
}

function eliminaGasto(gasto_id, gasto_monto){
    //  console.log(gasto_monto);
    misFinanzas.deleteGasto(gasto_id, gasto_monto);
    drawAllRowsGasto()
    actualizaTotales();
    toastr.remove();
    toastr.error('Gasto eliminado');
}

function formatoMoneda(monto){
    return Number(monto).toLocaleString("es-CL", {minimumFractionDigits: 0});        

 }

function actualizaTotales(){    
    let totalGasto = document.querySelector("#totalGasto");
    let totalSaldo = document.querySelector("#totalSaldo");

    totalGasto.textContent = `$ ${formatoMoneda(misFinanzas.getGastoTotal())}`;    
    totalSaldo.textContent = `$ ${formatoMoneda(misFinanzas.saldo)}`;
}

function habilitaNodosGastos(){
    let detalleGasto = document.querySelector("#detalleGasto");
    let montoGasto = document.querySelector("#montoGasto");
    let btnGasto = document.querySelector("#btnGasto");
    detalleGasto.disabled = false;
    montoGasto.disabled = false;
    btnGasto.disabled = false;
}

function procesaFormPresupuesto(e) {
    e.preventDefault();
    
    let totalPresupuesto = document.querySelector(".totalPresupuesto");
    misFinanzas.presupuesto = montoPresupuesto.value; 
    totalPresupuesto.textContent = '$ '+formatoMoneda(misFinanzas.presupuesto);
    totalPresupuesto.setAttribute("data-presupuesto", misFinanzas.presupuesto);    
    montoPresupuesto.disabled = true;
    btnPresupuesto.disabled = true;
    btnPresupuesto.textContent = "Presupuesto Ingresado";
    habilitaNodosGastos();
    this.reset();
    toastr.remove();
    toastr.success('Presupuesto Agregado');

  }


function procesaFormGasto(e){
    e.preventDefault();
    let gasto = new Gasto();
    gasto.id = generarIdUnico();
    gasto.detalle = this.detalleGasto.value;
    gasto.monto = Number(this.montoGasto.value);
    if((misFinanzas.getGastoTotal()+gasto.monto) > misFinanzas.presupuesto){
      toastr.remove();
      toastr.warning("No puede gastar más del presupuesto, le queda un máximo de $ "+formatoMoneda(misFinanzas.saldo));
    }else{
      misFinanzas.setGasto(gasto);
      misFinanzas.reduceSaldo(gasto.monto);
      drawRowGasto(gasto);
      toastr.remove();
      toastr.info('Gasto Agregado');
    }
    
    
        
    this.reset();
    
    
}
  
generarIdUnico = () => { 
    return Math.random().toString(30).substring(2);           
}
