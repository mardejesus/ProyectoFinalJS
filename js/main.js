// Proyecto tienda virtual indumentaria de futbol

// Capturo DOM
let btnTodo = document.getElementById("btnTodo")
let btnCamisetas = document.getElementById("btnCamisetas")
let btnShorts = document.getElementById("btnShorts")
let btnMedias = document.getElementById("btnMedias")
let btnBotines = document.getElementById("btnBotines")
let btnCarrito = document.getElementById("btnCarrito")
let btnOrdenar = document.getElementById("selectOrden")
let productosDiv = document.getElementById("tienda-productos")

let modalCarritoBody = document.getElementById("modalCarritoBody")
let precioTotal = document.getElementById("precioTotal")
let btnFinalizarCompra = document.getElementById("botonFinalizarCompra")

let loader = document.getElementById("loader")
let loaderTexto = document.getElementById("loaderTexto")
let tienda = document.getElementById("tienda")


// Array productos en carrito
let productosEnCarrito = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : [];

// Array opcion elegida de productos en catalogos
let productosEnCatalogoElegidos = productosEnCatalogo


// Funciones
function mostrarCatalogo(array) {
  productosDiv.innerHTML = ``
  for (let producto of array) {
    let nuevoDivProducto = document.createElement("div")
    nuevoDivProducto.className = "card articulo"
    nuevoDivProducto.style = "width: 14rem; margin-bottom:15px;"
    nuevoDivProducto.id = `${producto.id}`
    nuevoDivProducto.innerHTML = `
    <img src="${producto.imagen}" class="card-img-top" alt="...">
    <div class="card-body">
      <h3 style="font-size:1rem; font-weight: bold;
      " class="card-title">${producto.nombre}</h3>
      
      <p style="font-size:1rem;" class="card-text precio">${producto.precio}</p>
      <button id="agregarBtn${producto.id}" class="btn btn-dark">Agregar al carrito</button>
    </div>
    `
    productosDiv.appendChild(nuevoDivProducto)
    let agregarBtn = document.getElementById(`agregarBtn${producto.id}`)
    agregarBtn.addEventListener("click", () => { agregarAlCarrito(producto) })
  }
}

function agregarAlCarrito(element) { // agrega el producto al array productosEnCarrito, y al array en storage también.
  let prodAgregado = productosEnCarrito.find((e) => e.id == element.id)
  if (prodAgregado === undefined) {
    element.cantidad=1
    element.precioTotal = element.precio
    productosEnCarrito.push(element)
  } else {
    prodAgregado.sumarUnidad();
  }
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
  Toastify({ text: "Producto añadido", duration: 2000, close: true, avatar: "img/check.svg", newWindow: true, gravity: "bottom", position: "right", stopOnFocus: true, style: { background: "linear-gradient(to right, #00b09b, #00b06b)", }, }).showToast();
}

function cargarProductosCarrito(array) { // carga los elementos del array productosEnCarrito en el modal
  modalCarritoBody.innerHTML = ``
  let precioTotalCarrito = 0

  for (let producto of array) {
    let nuevoDivProductoCarrito = document.createElement("div")
    nuevoDivProductoCarrito.className = "producto-carrito"
    nuevoDivProductoCarrito.id = `productoCarrito${producto.id}`
    nuevoDivProductoCarrito.style = "text-align:center;"
    nuevoDivProductoCarrito.innerHTML = `
    <img src="${producto.imagen}" style="width:150px;" alt="">
    <div>
      <h3>${producto.nombre}</h3>
      <p class="card-text">Precio unitario $${producto.precio}</p>
      <p class="card-text">Total de unidades ${producto.cantidad}</p> 
      <p class="card-text">SubTotal ${producto.cantidad * producto.precio}</p>   
      <button class= "btn btn-dark" id="botonSumarUnidad${producto.id}"><i class=""></i>+1</button>
      <button class= "btn btn-dark" id="botonEliminarUnidad${producto.id}"><i class=""></i>-1</button> 
      <button class= "btn btn-dark" id="botonEliminar${producto.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"> <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path> </svg>
      </button>
    </div>
    `
    modalCarritoBody.appendChild(nuevoDivProductoCarrito)
    precioTotalCarrito += producto.precio
  }

  precioTotal.textContent = `Total: ${precioTotalCarrito}`
  let botonesEliminar = document.getElementsByClassName("botonEliminar")

  // Agregar eventos a botones: eliminar producto, añadir unidad, eliminar unidad.
  array.forEach((producto) => {
    // Sumar
    document.getElementById(`botonSumarUnidad${producto.id}`).addEventListener("click", () => {
      producto.sumarUnidad()
      localStorage.setItem("carrito", JSON.stringify(array))
      cargarProductosCarrito(array)
    })
    // Restar
    document.getElementById(`botonEliminarUnidad${producto.id}`).addEventListener("click", () => {
      let cantProd = producto.restarUnidad()
      if (cantProd < 1) { // si queda en 0 elimina el producto del modal y del array productosEnCarrito
        document.getElementById(`productoCarrito${producto.id}`).remove()
        let prodAEliminar = array.find((prod) => prod.id == producto.id)
        let posicion = array.indexOf(prodAEliminar)
        array.splice(posicion, 1) // elimina del array
        localStorage.setItem("carrito", JSON.stringify(array))
        calcularTotal(array)
      }
      else {
        localStorage.setItem("carrito", JSON.stringify(array))
      }
      cargarProductosCarrito(array)
    })
    // Eliminar producto completo
    document.getElementById(`botonEliminar${producto.id}`).addEventListener("click", () => {
      document.getElementById(`productoCarrito${producto.id}`).remove()
      let prodAEliminar = array.find((prod) => { prod.id == producto.id })
      let posicion = array.indexOf(prodAEliminar)
      array.splice(posicion, 1)
      localStorage.setItem("carrito", JSON.stringify(array))
      calcularTotal(array)
    })
  })
  calcularTotal(array)
}

function calcularTotal(array) {
  total = array.reduce((i, producto) => i + (producto.precio * producto.cantidad), 0)
  total == 0 ? precioTotal.innerHTML = "Carrito vacío" : precioTotal.innerHTML = `Total: ${total}`
  return total
}

function mostrarProductosPorTipo(array, tipo) {
  let productosPorTipo = [].concat(array)
  productosPorTipo = productosPorTipo.filter((e) => e.tipo==tipo)
  productosEnCatalogoElegidos = productosPorTipo
  mostrarCatalogo(productosPorTipo)
  tienda.scrollIntoView({ behavior: "smooth" })
}

function ordenarMenorMayor(array) {
  const menorMayor = [].concat(array)
  menorMayor.sort((a, b) => a.precio - b.precio)
  mostrarCatalogo(menorMayor)
}

function ordenarMayorMenor(array) {
  const mayorMenor = [].concat(array)
  mayorMenor.sort((elem1, elem2) => elem2.precio - elem1.precio)
  mostrarCatalogo(mayorMenor)
}

function ordenarAlfabeticamenteTitulo(array) {
  const arrayAlfabetico = [].concat(array)
  arrayAlfabetico.sort((a, b) => {
    if (a.nombre > b.nombre) {
      return 1
    }
    if (a.nombre < b.nombre) {
      return -1
    }
    return 0
  })
  mostrarCatalogo(arrayAlfabetico)
}

function finalizarCompra(array) {
  if (productosEnCarrito.length == 0) {
    Swal.fire({
      title: 'No hay productos en el carrito',
      icon: 'error',
      confirmButtonColor: 'black',
      timer: 3500
    })
  }
  else {
    Swal.fire({
      title: '¿Realizar compra?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'black',
      cancelButtonColor: 'black',
    }).then((result) => {
      if (result.isConfirmed) {
        //finalizar compra con todos sus detalles
        //a nivel DOM avisarle que se realizo la compra
        let totalFinal = calcularTotal(array)
        Swal.fire({
          title: 'Compra realizada',
          icon: 'success',
          confirmButtonColor: 'green',
        })
        //nivel arrays resear productosEnCarrito
        productosEnCarrito = []
        localStorage.removeItem("carrito")
      }
      else {
        Swal.fire({
          title: 'Compra no realizada',
          icon: 'info',
          confirmButtonColor: 'green',
          timer: 3500
        })
      }
    })
  }

}


// EVENTOS

selectOrden.addEventListener("change", () => {
  console.log(selectOrden.value)
  switch (selectOrden.value) {
    case "1":
      ordenarMayorMenor(productosEnCatalogoElegidos)
      break
    case "2":
      ordenarMenorMayor(productosEnCatalogoElegidos)
      break
    case "3":
      ordenarAlfabeticamenteTitulo(productosEnCatalogoElegidos)
      break
    default:
      mostrarCatalogo(productosEnCatalogoElegidos)
      break
  }
}
)

btnBotines.addEventListener("click", ()=>mostrarProductosPorTipo(productosEnCatalogo, "botin"))
btnMedias.addEventListener("click", ()=>mostrarProductosPorTipo(productosEnCatalogo, "media"))
btnShorts.addEventListener("click", ()=>mostrarProductosPorTipo(productosEnCatalogo, "short"))
btnCamisetas.addEventListener("click", ()=>mostrarProductosPorTipo(productosEnCatalogo, "camiseta"))
btnTodo.addEventListener("click", ()=>{
  mostrarCatalogo(productosEnCatalogo)
  productosEnCatalogoElegidos = productosEnCatalogo
  tienda.scrollIntoView({ behavior: "smooth" })
  }
  )


btnCarrito.addEventListener("click", () => {
  cargarProductosCarrito(productosEnCarrito)
})

btnFinalizarCompra.addEventListener("click", () => {
  finalizarCompra(productosEnCarrito)
})

//setTimeout para imprimir carrito 
setTimeout(() => {
  loaderTexto.remove()
  loader.remove()
  mostrarCatalogo(productosEnCatalogoElegidos)
}, 2500)

mostrarCatalogo(productosEnCatalogoElegidos);