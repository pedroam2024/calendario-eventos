import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';

const Events = ({ event, handleOperation, handleClose, operationType }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [helpText, setHelpText] = useState('');

  useEffect(() => {
    if (event) {
      setId(event.id);
      setTitle(event.title || '');
      setStart(event.start ? moment(event.start).format('YYYY-MM-DDTHH:mm') : '');
      setEnd(event.end ? moment(event.end).format('YYYY-MM-DDTHH:mm') : '');
      setDescription(event.description || '');
      setEmail(event.email || '');
      setPhone(event.phone || '');
    } else {
      setId('');
      setTitle('');
      setStart('');
      setEnd('');
      setDescription('');
      setEmail('');
      setPhone('');
      setHelpText('Llene los campos para agregar un nuevo evento.');
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      fechainicio: moment(start).toISOString(),
      fechafin: moment(end).toISOString(),
      description,
      email,
      phone,
    };

    try {
      // Llamada al servicio para agregar un nuevo evento
      const response = await fetch('https://service-event.onrender.com/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'bi-key-test', // Reemplaza 'YOUR_API_KEY_HERE' con tu API key
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('No se pudo agregar el evento');
      }

      // Mostrar notificación de éxito
      NotificationManager.success('El evento ha sido agregado correctamente', 'Éxito');

      // Llamar al manejador para actualizar la lista de eventos o realizar alguna acción adicional
      handleOperation(newEvent, 'INS');
      resetForm(); // Limpiar el formulario después de agregar
    } catch (error) {
      console.error('Error al agregar el evento:', error);

      // Mostrar notificación de error
      NotificationManager.error(`Hubo un error al agregar el evento. Detalle: ${error.message}`, 'Error');
    }
  };

  const handleDelete = async () => {
    try {
      // Llamada al servicio para eliminar el evento
      const response = await fetch(`https://service-event.onrender.com/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
         'api-key': 'bi-key-test', // Reemplaza 'YOUR_API_KEY_HERE' con tu API key
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el evento');
      }

      // Mostrar notificación de éxito
      NotificationManager.success('El evento ha sido eliminado correctamente', 'Éxito');

      // Llamar al manejador para eliminar el evento localmente
      handleOperation(event, 'DLT');
      handleClose(); // Cerrar el formulario después de eliminar
    } catch (error) {
      console.error('Error al eliminar el evento:', error);

      // Mostrar notificación de error
      NotificationManager.error(`Hubo un error al eliminar el evento. Detalle: ${error.message}`, 'Error');
    }
  };

  const resetForm = () => {
    setTitle('');
    setStart('');
    setEnd('');
    setDescription('');
    setEmail('');
    setPhone('');
    setHelpText('Llene los campos para agregar un nuevo evento.');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formId">
        <Form.Label>ID</Form.Label>
        <Form.Control type="text" value={id} readOnly />
      </Form.Group>

      <Form.Group controlId="formTitle">
        <Form.Label>Título *</Form.Label>
        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formStart">
        <Form.Label>Fecha de Inicio *</Form.Label>
        <Form.Control type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formEnd">
        <Form.Label>Fecha de Fin *</Form.Label>
        <Form.Control type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Correo</Form.Label>
        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formPhone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Form.Group>

      <hr />

      <p className="text-muted">{helpText}</p>

      <div className="text-right">
        {operationType === 'INS' ? (
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        ) : (
          <>
            <Button variant="primary" type="submit">
              Guardar
            </Button>&nbsp;
            <Button variant="danger" onClick={handleDelete} className="ml-2">
              Eliminar
            </Button>
          </>
        )}&nbsp;
        <Button variant="secondary" className="ml-2" onClick={handleClose}>
          Cerrar
        </Button>
      </div>
    </Form>
  );
};

export default Events;
