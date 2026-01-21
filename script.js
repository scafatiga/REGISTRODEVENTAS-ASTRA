document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("formulario");
  const fecha = document.getElementById("fecha");
  const nombre = document.getElementById("nombre");
  const puntoVenta = document.getElementById("puntoVenta");
  const ventaEfectivo = document.getElementById("ventaEfectivo");
  const ventaTarjeta = document.getElementById("ventaTarjeta");
  const gastos = document.getElementById("gastos");
  const total = document.getElementById("total");
  const observaciones = document.getElementById("observaciones");
  const btnGuardar = document.getElementById("btnGuardar");
  const mensaje = document.getElementById("mensaje");

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9TAKS1F5tGwmn-ptYH8uTNeWXG3k1OKkHDoD2cAunNwbI4Mg0GAv3JEyPP3kUe0zNLg/exec";

  function parseEuro(valor) {
    return parseFloat(valor.replace(",", ".")) || 0;
  }

  function actualizarTotal() {
    const efectivo = parseEuro(ventaEfectivo.value);
    const tarjeta = parseEuro(ventaTarjeta.value);
    const gasto = parseEuro(gastos.value);
    const resultado = efectivo + tarjeta - gasto;
    total.value = resultado.toFixed(2).replace(".", ",");

    // Validar el formulario cada vez que cambia el total
    validarFormulario();
  }

  function validarFormulario() {
    // El botón se habilita solo si los campos obligatorios tienen valor
    const valido =
      fecha.value.trim() !== "" &&
      nombre.value.trim() !== "" &&
      puntoVenta.value.trim() !== "";

    btnGuardar.disabled = !valido;
  }

  // Escuchar cambios en campos obligatorios
  [fecha, nombre, puntoVenta].forEach(c => {
    c.addEventListener("input", validarFormulario);
    c.addEventListener("change", validarFormulario);
  });

  // Escuchar cambios en los inputs numéricos para recalcular total
  [ventaEfectivo, ventaTarjeta, gastos].forEach(c => {
    c.addEventListener("input", actualizarTotal);
  });

  async function enviarDatos(data) {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (result.status === "success") {
        mensaje.innerHTML = "✅ Venta guardada";
        formulario.reset();
        total.value = "";
        btnGuardar.disabled = true;
      } else {
        mensaje.innerHTML = "❌ Error al guardar";
        btnGuardar.disabled = false;
      }
    } catch (error) {
      mensaje.innerHTML = "❌ Error de conexión";
      btnGuardar.disabled = false;
    }
  }

  formulario.addEventListener("submit", e => {
    e.preventDefault();

    btnGuardar.disabled = true;
    mensaje.innerHTML = "⏳ Guardando...";

    const data = {
      fecha: fecha.value,
      nombre: nombre.value,
      puntoVenta: puntoVenta.value,
      ventaEfectivo: ventaEfectivo.value,
      ventaTarjeta: ventaTarjeta.value,
      gastos: gastos.value,
      total: total.value,
      observaciones: observaciones.value
    };

    enviarDatos(data);
  });

  // Inicializa validación y total
  actualizarTotal();
  validarFormulario();

});
