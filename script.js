let productosOriginales = [];
let categoriaActual = "Todas";
let rangoPrecioActual = "todos";
let textoBusqueda = "";

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productosOriginales = data;
    mostrarProductos(productosOriginales);

    document.querySelectorAll('.filtros button').forEach(btn => {
      btn.addEventListener('click', () => {
        const categoria = btn.dataset.categoria;
        const filtrados = categoria === 'Todas'
          ? data
          : data.filter(p => p.categoria === categoria);
        mostrarProductos(filtrados);
      });
    });
  });

const botonesFiltro = document.querySelectorAll('.filtros button');

botonesFiltro.forEach(btn => {
  btn.addEventListener('click', () => {
    botonesFiltro.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    categoriaActual = btn.dataset.categoria;
    aplicarFiltros();
  });
});



function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  productos.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <div class="img-container">
          <img src="img/${p.imagen}" alt="${p.nombre}">
          ${p.stock === 'Agotado' ? '<span class="badge-agotado">AGOTADO</span>' : ''}
        </div>
        <h3>${p.nombre}</h3>
        <p class="precio">$${p.precio}</p>
        <p class="${p.stock === 'Disponible' ? 'disponible' : 'agotado'}">${p.stock}</p>
        ${p.stock === 'Disponible'
          ? `<a class="boton-whatsapp" href="https://wa.me/56966765619" target="_blank">Consultar por WhatsApp</a>`
          : ''}
      </div>
    `;
  });
}

const toggleBtn = document.getElementById("toggle-theme");

// Cargar tema guardado
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggleBtn.textContent = "☀️";
} else {
  toggleBtn.textContent = "🌙";
}

// Cambiar tema
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "🌙";
  }
});

const precioFiltro = document.getElementById("precioFiltro");

precioFiltro.addEventListener("change", () => {
  rangoPrecioActual = precioFiltro.value;
  aplicarFiltros();
});

const buscador = document.getElementById("buscador");

buscador.addEventListener("input", () => {
  textoBusqueda = buscador.value.toLowerCase();
  aplicarFiltros();
});

function aplicarFiltros() {
  let resultado = [...productosOriginales];

  // FILTRO CATEGORÍA
  if (categoriaActual !== "Todas") {
    resultado = resultado.filter(p => p.categoria === categoriaActual);
  }

  // FILTRO PRECIO
  if (rangoPrecioActual !== "todos") {
    resultado = resultado.filter(p => {
      const precio = p.precio;

      if (rangoPrecioActual === "1") return precio >= 1000 && precio <= 5000;
      if (rangoPrecioActual === "2") return precio >= 6000 && precio <= 15000;
      if (rangoPrecioActual === "3") return precio >= 16000 && precio <= 50000;
    });
  }

  // BUSCADOR
  if (textoBusqueda.trim() !== "") {
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(textoBusqueda)
    );
  }
  
  if (resultado.length === 0) {
    document.getElementById("productos").innerHTML = `
      <p class="sin-resultados">No hay resultados para tu búsqueda 🔮</p>
    `;
    return;
  }

  mostrarProductos(resultado);
}

