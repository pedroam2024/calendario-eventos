import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'moment/locale/es';
import Events from './Events'; // Importa el componente Events

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Reunión de trabajo',
      start: new Date(2024, 6, 10, 10, 0),
      end: new Date(2024, 6, 10, 12, 0),
      description: 'Discutir el proyecto X con el equipo',
      email: 'ejemplo@email.com',
      phone: '123456789',
    },
    {
      id: 2,
      title: 'Cita médica',
      start: new Date(2024, 6, 12, 14, 0),
      end: new Date(2024, 6, 12, 15, 0),
      description: 'Consultorio Dr. Pérez',
      email: 'otro@email.com',
      phone: '987654321',
    }, 
    {
      id: 3,
      title: 'Cita médica',
      start: new Date(2024, 6, 10, 14, 0),
      end: new Date(2024, 6, 10, 15, 0),
      description: 'Consultorio Dr. Pérez',
      email: 'otro@email.com',
      phone: '987654321',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [operationType, setOperationType] = useState('INS'); // Estado para el tipo de operación

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setOperationType('UPD'); // Al seleccionar un evento existente, cambia el tipo de operación a 'UPD'
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setOperationType('INS'); // Al cerrar el modal, vuelve al tipo de operación 'INS' por defecto
  };

  const handleOperation = (updatedEvent, type) => {
    if (type === 'INS') {
      // Lógica para agregar un nuevo evento
      setEvents([...events, updatedEvent]);
    } else if (type === 'UPD') {
      // Lógica para actualizar un evento existente
      const updatedEvents = events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
    } else if (type === 'DLT') {
      // Lógica para eliminar un evento
      const filteredEvents = events.filter((event) => event.id !== updatedEvent.id);
      setEvents(filteredEvents);
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    // Lógica para agregar un nuevo evento
    const newEvent = {
      id: events.length + 1,
      title: 'Nuevo Evento',
      start: new Date(),
      end: new Date(),
    };
    setSelectedEvent(newEvent);
    setShowModal(true);
    setOperationType('INS'); // Al agregar un nuevo evento, cambia el tipo de operación a 'INS'
  };

  return (
    <div className="App">
      <h1 className="text-center mt-4 mb-4">Calendario de Eventos</h1>
      <div className="text-center mb-4">
        <Button variant="primary" onClick={handleAddEvent}>Agregar Evento</Button>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={handleSelectEvent}
              formats={{
                timeGutterFormat: 'HH:mm',
              }}
              messages={{
                today: 'Hoy',
                previous: 'Anterior',
                next: 'Siguiente',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                allDay: 'Todo el día',
                showMore: total => `+ Ver más (${total})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal para mostrar detalles del evento */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Events event={selectedEvent} handleOperation={handleOperation} handleClose={handleCloseModal} operationType={operationType} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
