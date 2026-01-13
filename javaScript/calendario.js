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

function confirmar(hora) {
    const mes = document.getElementById('month-display').innerText;
    alert(`Cita solicitada:\nFecha: ${selectedDate} de ${mes}\nHora: ${hora}\n\nConectando con n8n...`);
}

// Primera carga
renderCalendar();