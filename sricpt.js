const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const zonaDeChat = document.getElementById('zonaDeChat');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = userInput.value.trim();
  if (!texto) return;

  agregarMensaje(texto, 'user-message');
  userInput.value = '';

  setTimeout(() => {
    const respuesta = generarRespuesta(texto);
    agregarMensaje(respuesta, 'bot-message');
  }, 600);
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

function agregarMensaje(texto, clase) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${clase}`;
  msgDiv.innerHTML = `<div class="message-content">${texto}</div>`;
  zonaDeChat.appendChild(msgDiv);
  zonaDeChat.scrollTop = zonaDeChat.scrollHeight;
}

function generarRespuesta(consulta) {
  const c = consulta.toLowerCase();
  if (c.includes('turno') || c.includes('cita')) {
    return 'Para gestionar un turno médico, necesito saber qué especialidad buscás y tu número de afiliado o DNI.';
  }
  if (c.includes('receta') || c.includes('orden')) {
    return 'Las órdenes médicas y recetas digitales tienen una validez de 30 días. Podés adjuntar la foto o indicarme qué estudio necesitás autorizar.';
  }
  if (c.includes('reintegro')) {
    return 'Para solicitar un reintegro necesitás presentar la factura electrónica (B o C) y el comprobante de pago dentro de los 60 días de realizada la consulta.';
  }
  return 'Entendido. Recordá que soy un asistente administrativo para trámites médicos (no reemplazo una consulta clínica profesional). ¿Podrías darme más detalles de tu gestión?';
}
