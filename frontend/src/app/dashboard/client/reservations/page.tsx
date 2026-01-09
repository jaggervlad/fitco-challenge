"use client";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { ProtectedRoute } from "@/components/common";
import { UserRole } from "@/types";
import Link from "next/link";
import { useAuth, useReservations, useCancelReservation } from "@/hooks";
import { useState } from "react";

function ReservationsPageContent() {
  const { user } = useAuth();
  const { reservations, isLoading, isError, mutate } = useReservations(
    user?.id || null
  );
  const { cancelReservation, isCancelling } = useCancelReservation();
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<any>(null);

  const handleShowCancelModal = (reservation: any) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const handleCancelReservation = async () => {
    if (!user?.id || !reservationToCancel) return;

    setCancellingId(reservationToCancel.id);
    await cancelReservation({
      reservationId: reservationToCancel.id,
      customerId: user.id,
      onSuccess: () => {
        mutate();
        setCancellingId(null);
        handleCloseCancelModal();
      },
    });
  };

  const getProviderInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[dayOfWeek];
  };

  const formatDate = (createdAt: string, dayOfWeek: number) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    const year = date.getFullYear();
    return `${getDayName(dayOfWeek)}, ${day} ${month} ${year}`;
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge bg="success">
            <FaCheckCircle className="me-1" />
            Confirmada
          </Badge>
        );
      case "pending":
        return (
          <Badge bg="warning">
            <FaHourglassHalf className="me-1" />
            Pendiente
          </Badge>
        );
      case "attended":
        return (
          <Badge bg="info">
            <FaCheckCircle className="me-1" />
            Completada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge bg="danger">
            <FaTimesCircle className="me-1" />
            Cancelada
          </Badge>
        );
      case "no_show":
        return (
          <Badge bg="secondary">
            <FaTimesCircle className="me-1" />
            No Asistió
          </Badge>
        );
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getColorByStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "attended":
        return "info";
      case "cancelled":
        return "danger";
      case "no_show":
        return "secondary";
      default:
        return "primary";
    }
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3 text-muted">Cargando reservas...</p>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar las reservas</Alert.Heading>
          <p>
            No se pudieron cargar tus reservas. Por favor, intenta de nuevo más
            tarde.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">
            <FaCalendarAlt className="me-2" />
            Mis Reservas
          </h2>
          <p className="text-muted mb-0">Gestiona todas tus citas y reservas</p>
        </div>
        <Link href="/dashboard/client/services" passHref legacyBehavior>
          <Button variant="primary">
            <FaCalendarAlt className="me-2" />
            Nueva Reserva
          </Button>
        </Link>
      </div>

      {reservations.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>No tienes reservas</Alert.Heading>
          <p>
            Aún no has realizado ninguna reserva. ¡Explora nuestros servicios y
            agenda tu primera cita!
          </p>
          <Link href="/dashboard/client/services" passHref legacyBehavior>
            <Button variant="primary">Ver Servicios Disponibles</Button>
          </Link>
        </Alert>
      ) : (
        <Row className="g-4">
          {reservations.map((reservation) => {
            const providerName =
              reservation.service?.provider?.name || "Proveedor";
            const serviceName = reservation.service?.name || "Servicio";
            const providerInitials = getProviderInitials(providerName);
            const date = reservation.schedule
              ? formatDate(
                  reservation.createdAt,
                  reservation.schedule.dayOfWeek
                )
              : "Fecha no disponible";
            const time = reservation.schedule
              ? formatTime(
                  reservation.schedule.startTime,
                  reservation.schedule.endTime
                )
              : "Hora no disponible";

            return (
              <Col key={reservation.id} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          className={`rounded-circle bg-${getColorByStatus(
                            reservation.status
                          )} text-white me-2 d-flex align-items-center justify-content-center`}
                          style={{ width: "40px", height: "40px" }}
                        >
                          <strong>{providerInitials}</strong>
                        </div>
                        <div>
                          <h6 className="mb-0">{providerName}</h6>
                          <small className="text-muted">{serviceName}</small>
                        </div>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="mb-2">
                      <FaCalendarAlt className="text-primary me-2" />
                      <strong>Fecha:</strong>
                      <p className="mb-0 ms-4">{date}</p>
                    </div>

                    <div className="mb-3">
                      <FaClock className="text-primary me-2" />
                      <strong>Horario:</strong>
                      <p className="mb-0 ms-4">{time}</p>
                    </div>

                    {reservation.notes && (
                      <div className="mb-3 p-2 bg-light rounded">
                        <small className="text-muted">Notas:</small>
                        <p className="small mb-0">{reservation.notes}</p>
                      </div>
                    )}

                    {reservation.status === "confirmed" && (
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleShowCancelModal(reservation)}
                          disabled={cancellingId === reservation.id}
                        >
                          <FaTimesCircle className="me-2" />
                          Cancelar Reserva
                        </Button>
                      </div>
                    )}

                    {reservation.status === "attended" && (
                      <div className="d-grid gap-2">
                        <Button variant="outline-primary" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal de Confirmación */}
      <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservationToCancel && (
            <>
              <p>¿Estás seguro de que deseas cancelar esta reserva?</p>
              <div className="mb-3">
                <strong>Servicio:</strong>
                <p className="mb-0">
                  {reservationToCancel.service?.name || "Servicio"}
                </p>
              </div>
              <div className="mb-3">
                <strong>Proveedor:</strong>
                <p className="mb-0">
                  {reservationToCancel.service?.provider?.name || "Proveedor"}
                </p>
              </div>
              <div className="mb-3">
                <strong>Horario:</strong>
                <p className="mb-0">
                  {reservationToCancel.schedule
                    ? `${getDayName(reservationToCancel.schedule.dayOfWeek)}, ${
                        reservationToCancel.schedule.startTime
                      } - ${reservationToCancel.schedule.endTime}`
                    : "Hora no disponible"}
                </p>
              </div>
              <Alert variant="warning" className="mb-0">
                <small>
                  Esta acción no se puede deshacer. Una vez cancelada, deberás
                  crear una nueva reserva si deseas volver a agendar.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCancelModal}
            disabled={isCancelling}
          >
            No, mantener reserva
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelReservation}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Cancelando...
              </>
            ) : (
              "Sí, cancelar reserva"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default function ReservationsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
      <ReservationsPageContent />
    </ProtectedRoute>
  );
}
