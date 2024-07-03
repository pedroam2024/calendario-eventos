import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEvent = {
      id,
      title,
      start: moment(start).toDate(),
      end: moment(end).toDate(),
      description,
      email,
      phone,
    };
    handleOperation(updatedEvent, operationType);
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
            <Button variant="danger" onClick={() => handleOperation(event, 'DLT')} className="ml-2">
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
