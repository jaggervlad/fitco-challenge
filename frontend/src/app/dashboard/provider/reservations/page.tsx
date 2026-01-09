"use client";

import { Card, Badge, Table, Spinner, Alert, Dropdown } from "react-bootstrap";
import { FaUsers, FaCalendarAlt, FaClock, FaEllipsisV } from "react-icons/fa";
import { ProtectedRoute } from "@/components/common";
import { UserRole, ReservationStatus } from "@/types";
import { useAuth } from "@/hooks";
import {
  useProviderReservations,
  useUpdateReservationStatus,
} from "@/hooks/reservations";

function ReservationsPageContent() {
  const { user } = useAuth();
  const { reservations, isLoading, isError } = useProviderReservations(
    user?.id
  );
  const { updateStatus, isUpdating } = useUpdateReservationStatus();

  const handleStatusChange = (
    reservationId: number,
    newStatus: ReservationStatus
  ) => {
    if (!user?.id) return;

    updateStatus({
      reservationId,
      status: newStatus,
      providerId: user.id,
    });
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const variants: Record<ReservationStatus, string> = {
      [ReservationStatus.CONFIRMED]: "success",
      [ReservationStatus.PENDING]: "warning",
      [ReservationStatus.CANCELLED]: "danger",
      [ReservationStatus.ATTENDED]: "info",
      [ReservationStatus.NO_SHOW]: "secondary",
    };

    const labels: Record<ReservationStatus, string> = {
      [ReservationStatus.CONFIRMED]: "Confirmada",
      [ReservationStatus.PENDING]: "Pendiente",
      [ReservationStatus.CANCELLED]: "Cancelada",
      [ReservationStatus.ATTENDED]: "Atendida",
      [ReservationStatus.NO_SHOW]: "No asistió",
    };

    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const getDayName = (dayOfWeek: number): string => {
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

  const formatDate = (createdAt: string, dayOfWeek: number): string => {
    const date = new Date(createdAt);
    const dayName = getDayName(dayOfWeek);
    return `${dayName}, ${date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const formatTime = (startTime: string, endTime: string): string => {
    return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(
      (r) => r.status === ReservationStatus.CONFIRMED
    ).length,
    pending: reservations.filter((r) => r.status === ReservationStatus.PENDING)
      .length,
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger">
        Error al cargar las reservas. Por favor, intenta de nuevo más tarde.
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-2">Reservas</h2>
        <p className="text-muted mb-0">Todas las reservas de tus servicios</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                  <FaUsers size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted mb-0 small">Total Reservas</p>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                  <FaCalendarAlt size={24} className="text-success" />
                </div>
                <div>
                  <p className="text-muted mb-0 small">Confirmadas</p>
                  <h3 className="mb-0">{stats.confirmed}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
                  <FaClock size={24} className="text-warning" />
                </div>
                <div>
                  <p className="text-muted mb-0 small">Pendientes</p>
                  <h3 className="mb-0">{stats.pending}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="table-responsive" style={{ overflow: "visible" }}>
            <Table hover>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Estado</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No hay reservas disponibles
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <div>
                          <div className="fw-bold">
                            {reservation.customer?.name || "N/A"}
                          </div>
                          <small className="text-muted">
                            {reservation.customer?.email || "N/A"}
                          </small>
                        </div>
                      </td>
                      <td>{reservation.service?.name || "N/A"}</td>
                      <td>
                        {reservation.schedule
                          ? formatDate(
                              reservation.createdAt,
                              reservation.schedule.dayOfWeek
                            )
                          : "N/A"}
                      </td>
                      <td>
                        {reservation.schedule
                          ? formatTime(
                              reservation.schedule.startTime,
                              reservation.schedule.endTime
                            )
                          : "N/A"}
                      </td>
                      <td>{getStatusBadge(reservation.status)}</td>
                      <td>
                        {reservation.notes ? (
                          <small className="text-muted">
                            {reservation.notes}
                          </small>
                        ) : (
                          <small className="text-muted fst-italic">
                            Sin notas
                          </small>
                        )}
                      </td>
                      <td>
                        <Dropdown drop="start">
                          <Dropdown.Toggle
                            variant="light"
                            size="sm"
                            id={`dropdown-${reservation.id}`}
                            disabled={isUpdating}
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>

                          <Dropdown.Menu align="end">
                            {reservation.status ===
                              ReservationStatus.PENDING && (
                              <Dropdown.Item
                                onClick={() =>
                                  handleStatusChange(
                                    reservation.id,
                                    ReservationStatus.CONFIRMED
                                  )
                                }
                              >
                                Confirmar reserva
                              </Dropdown.Item>
                            )}
                            {reservation.status ===
                              ReservationStatus.CONFIRMED && (
                              <Dropdown.Item
                                onClick={() =>
                                  handleStatusChange(
                                    reservation.id,
                                    ReservationStatus.ATTENDED
                                  )
                                }
                              >
                                Marcar como atendida
                              </Dropdown.Item>
                            )}
                            {(reservation.status ===
                              ReservationStatus.CANCELLED ||
                              reservation.status ===
                                ReservationStatus.ATTENDED ||
                              reservation.status ===
                                ReservationStatus.NO_SHOW) && (
                              <Dropdown.Item disabled>
                                Sin acciones disponibles
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default function ReservationsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <ReservationsPageContent />
    </ProtectedRoute>
  );
}
