import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'moment/locale/es';
import Events from './Events'; // Importa el componente Events
import { NotificationContainer, NotificationManager } from 'react-notifications'; // Importa react-notifications
import 'react-notifications/lib/notifications.css'; // Estilos para react-notifications

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [operationType, setOperationType] = useState('INS'); // Estado para el tipo de operación

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://service-event.onrender.com/events', {
          headers: {
            'api-key': 'bi-key-test', // Reemplaza 'YOUR_API_KEY_HERE' con tu API key
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching events');
        }
        const data = await response.json();

        console.log('Data from API:', data); // Log de los datos recibidos del servicio

        // Mapea los eventos y convierte las fechas TIMESTAMP a objetos Date
        const mappedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.fechainicio),
          end: new Date(event.fechafin),
          description: event.description,
          email: event.email,
          phone: event.phone,
        }));

        console.log('Mapped Events:', mappedEvents); // Log de los eventos mapeados

        setEvents(mappedEvents); // Actualiza el estado con los eventos mapeados
        NotificationManager.success('Eventos cargados exitosamente'); // Notificación de éxito al cargar eventos
      } catch (error) {
        console.error('Error fetching events:', error);
        NotificationManager.error(`Hubo un error al cargar los eventos. Detalle: ${error.message}`); // Notificación de error
      }
    };

    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setOperationType('UPD'); // Cambia el tipo de operación a 'UPD' al seleccionar un evento existente
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setOperationType('INS'); // Vuelve al tipo de operación 'INS' por defecto al cerrar el modal
  };

  const handleOperation = (updatedEvent, type) => {
    if (type === 'INS') {
      // Lógica para agregar un nuevo evento
      setEvents([...events, updatedEvent]);
      NotificationManager.success('Evento agregado exitosamente'); // Notificación de éxito al agregar evento
    } else if (type === 'UPD') {
      // Lógica para actualizar un evento existente
      const updatedEvents = events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
      NotificationManager.success('Evento actualizado exitosamente'); // Notificación de éxito al actualizar evento
    } else if (type === 'DLT') {
      // Lógica para eliminar un evento
      const filteredEvents = events.filter((event) => event.id !== updatedEvent.id);
      setEvents(filteredEvents);
      NotificationManager.success('Evento eliminado exitosamente'); // Notificación de éxito al eliminar evento
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    // Lógica para agregar un nuevo evento (ejemplo básico)
    const newEvent = {
      id: events.length + 1,
      title: 'Nuevo Evento',
      start: new Date(),
      end: new Date(),
      description: '',
      email: '',
      phone: '',
    };
    setSelectedEvent(newEvent);
    setShowModal(true);
    setOperationType('INS'); // Cambia el tipo de operación a 'INS' al agregar un nuevo evento
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
              startAccessor={(event) => new Date(event.start)}
              endAccessor={(event) => new Date(event.end)}
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

      {/* Contenedor para las notificaciones */}
      <NotificationContainer />

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
