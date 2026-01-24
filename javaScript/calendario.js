// Iniciamos en Enero 2026 como en tu ejemplo
let currentDocDate = new Date(2026, 0, 1); 
let selectedDate = null;

function renderCalendar() {
    const month = currentDocDate.getMonth();
    const year = currentDocDate.getFullYear();
    
    // Configuración de fechas
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const body = document.getElementById('calendar-body');
    const monthDisplay = document.getElementById('month-display');
    
    // Mostrar Mes y Año
    const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
    monthDisplay.innerText = formatter.format(currentDocDate);
    
    body.innerHTML = '';

    // Crear espacios vacíos para los días antes del día 1
    for (let i = 0; i < firstDay; i++) {
        body.appendChild(document.createElement('div'));
    }

    // Generar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.innerText = day;
        
        dayEl.onclick = (e) => selectDate(day, e.target);
        body.appendChild(dayEl);
    }
}

function selectDate(day, element) {
    // Limpiar selección previa
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    
    // Marcar nuevo día
    element.classList.add('selected');
    selectedDate = day;
    
    // Mostrar panel de horas
    const timeSelection = document.getElementById('time-selection');
    timeSelection.style.display = 'block';
    
    // Simulamos horas disponibles (Esto lo pediremos a n8n después)
    const mockSlots = ["10:00am", "11:00am", "12:00pm", "1:00pm", "4:00pm"];
    const container = document.getElementById('slots-container');
    
    container.innerHTML = mockSlots.map(slot => `
        <button class="outline" onclick="confirmar('${slot}')">${slot}</button>
    `).join('');
}

function changeMonth(diff) {
    currentDocDate.setMonth(currentDocDate.getMonth() + diff);
    renderCalendar();
    // Ocultar horas al cambiar de mes
    document.getElementById('time-selection').style.display = 'none';
}

async function confirmar(hora) {
    const nombre = document.getElementById('paciente-nombre').value;
    const email = document.getElementById('paciente-email').value;

    if (!nombre || !email || !selectedDate) {
        alert("Por favor, completa todos los datos.");
        return;
    }

    // --- LÓGICA PARA FORMATO DE GOOGLE ---
    const año = currentDocDate.getFullYear();
    const mes = currentDocDate.getMonth(); // Enero es 0, Febrero es 1...
    
    // Convertir "12:00pm" o "4:00pm" a formato 24h
    let [tiempo, meridiano] = hora.split(/(am|pm)/i);
    let [horas, minutos] = tiempo.split(':');
    horas = parseInt(horas);
    
    if (meridiano.toLowerCase() === 'pm' && horas < 12) horas += 12;
    if (meridiano.toLowerCase() === 'am' && horas === 12) horas = 0;

    // 1. Crear fecha de inicio
    const fechaInicio = new Date(año, mes, selectedDate, horas, parseInt(minutos));
    
    // 2. Crear fecha de fin (sumamos 55 minutos)
    const fechaFin = new Date(fechaInicio.getTime() + 55 * 60000);

    const datosCita = {
        paciente: nombre,
        email: email,
        inicio: fechaInicio.toISOString(), // Ejemplo: "2026-01-22T12:00:00.000Z"
        fin: fechaFin.toISOString()
    };

    const url = 'https://n8n.israelsuarez.com/webhook/cita-israel';

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCita)
        });
        
        if (res.ok) {
            alert("¡Cita agendada! Revisa tu correo para la invitación.");
        }
    } catch (e) {
        alert("Error de conexión con el servidor.");
    }
}

// Primera carga
renderCalendar();