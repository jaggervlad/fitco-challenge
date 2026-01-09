"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Form,
  Modal,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";
import { ProtectedRoute } from "@/components/common";
import { UserRole } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAuth,
  useCreateReservation,
  useSchedules,
  useServiceById,
} from "@/hooks";

interface ServiceDetailPageProps {
  params: { id: string };
}

function ServiceDetailPageContent({ params }: ServiceDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  const { createReservation, isCreating } = useCreateReservation();
  const { service, isLoading: isLoadingService } = useServiceById({
    serviceId: parseInt(id),
  });
  const { schedules, isLoading: isLoadingSchedules } = useSchedules({
    serviceId: parseInt(id),
  });
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");

  if (isLoadingService || !service) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  const handleReserve = (scheduleId: number) => {
    setSelectedSchedule(scheduleId);
    setShowModal(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedSchedule || !user?.id) return;

    await createReservation({
      serviceId: parseInt(id),
      scheduleId: selectedSchedule,
      customerId: user.id,
      notes: notes,
      onSuccess: () => {
        setShowModal(false);
        setNotes("");
        setSelectedSchedule(null);
        router.push("/dashboard/client/reservations");
      },
    });
  };

  const getSelectedScheduleInfo = () => {
    return schedules?.find((s) => s.id === selectedSchedule);
  };

  return (
    <Container className="py-4">
      <Link href="/dashboard/client/services" className="btn btn-link mb-3 p-0">
        <FaArrowLeft className="me-2" />
        Volver a servicios
      </Link>

      <Row className="g-4">
        {/* Información del Servicio */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <div
              className="bg-gradient d-flex align-items-center justify-content-center position-relative"
              style={{
                height: "200px",
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                backgroundImage: `url(https://placehold.co/800x200/667eea/ffffff?text=${encodeURIComponent(
                  service.name
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute w-100 h-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%)",
                }}
              />
            </div>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="mb-0">{service.name}</h2>
              </div>

              <div className="mb-4">
                <h5 className="text-muted mb-3">Descripción</h5>
                <p>{service.description}</p>
              </div>
            </Card.Body>
          </Card>

          {/* Horarios Disponibles */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2 text-primary" />
                Horarios Disponibles
              </h5>
            </Card.Header>
            <Card.Body>
              {isLoadingSchedules ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : schedules && schedules.length > 0 ? (
                <ListGroup variant="flush">
                  {schedules.map((schedule) => (
                    <ListGroup.Item
                      key={schedule.id}
                      className="d-flex justify-content-between align-items-center py-3"
                    >
                      <div>
                        <div className="d-flex align-items-center mb-1">
                          <strong className="me-3">
                            {schedule.dayOfWeekName}
                          </strong>
                          <FaClock className="text-primary me-2" />
                          <span>
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                        <small className="text-muted">
                          {schedule.availableSlots > 0 ? (
                            <>
                              {schedule.availableSlots} de {schedule.capacity}{" "}
                              lugares disponibles
                            </>
                          ) : (
                            <span className="text-danger">
                              Sin disponibilidad
                            </span>
                          )}
                        </small>
                      </div>
                      <Button
                        variant={
                          schedule.availableSlots > 0 ? "primary" : "secondary"
                        }
                        disabled={schedule.availableSlots === 0}
                        onClick={() => handleReserve(schedule.id)}
                      >
                        {schedule.availableSlots > 0 ? "Reservar" : "Completo"}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>No hay horarios disponibles para este servicio.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Información Adicional */}
        <Col lg={4}>
          <Card className="shadow-sm mb-4 sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <h5 className="mb-3">Detalles del Servicio</h5>

              <div className="mb-3 pb-3 border-bottom">
                <FaDollarSign className="text-success me-2" />
                <strong>Precio:</strong>
                <div className="mt-1">
                  <h3 className="text-success mb-0">${service.price}</h3>
                  <small className="text-muted">por sesión</small>
                </div>
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <FaClock className="text-primary me-2" />
                <strong>Duración:</strong>
                <p className="mb-0 mt-1">{service.durationMinutes} minutos</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {getSelectedScheduleInfo() && (
            <>
              <div className="mb-3">
                <strong>Servicio:</strong>
                <p className="mb-0">{service.name}</p>
              </div>
              <div className="mb-3">
                <strong>Horario:</strong>
                <p className="mb-0">
                  {getSelectedScheduleInfo()?.dayOfWeekName},{" "}
                  {getSelectedScheduleInfo()?.startTime} -{" "}
                  {getSelectedScheduleInfo()?.endTime}
                </p>
              </div>
              <div className="mb-3">
                <strong>Precio:</strong>
                <p className="mb-0 text-success">${service.price}</p>
              </div>
              <Form.Group>
                <Form.Label>
                  <strong>Notas (opcional):</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Agrega cualquier información adicional..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmReservation}
            disabled={isCreating}
          >
            {isCreating ? "Procesando..." : "Confirmar Reserva"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
      <ServiceDetailPageContent params={params} />
    </ProtectedRoute>
  );
}
