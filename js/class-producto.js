class Producto{

    constructor(id, tipo, nombre, imagen, precio){
        this.id=id;
        this.nombre=nombre;
        this.precio=precio;
        this.imagen=imagen;
        this.tipo=tipo;
        this.cantidad = 1
    }

    sumarUnidad(){
        this.cantidad += 1
        return this.cantidad
    }

    restarUnidad(){
        this.cantidad -= 1
        return this.cantidad
    }

}

// array de productos en catalogo

let productosEnCatalogo = [];

async function cargarProductosEnCatalogo(){
    const res = await fetch("productos.json");
    const data = await res.json();

    for(let tipoDeProducto of data){
        for(let producto of tipoDeProducto){
            let newProducto = new Producto(producto.id, producto.tipo, producto.nombre, producto.imagen, parseInt(producto.precio));
            productosEnCatalogo.push(newProducto);
        }
    }
}

cargarProductosEnCatalogo();

