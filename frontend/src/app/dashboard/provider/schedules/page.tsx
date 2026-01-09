"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClock,
  FaUsers,
  FaCheck,
} from "react-icons/fa";
import { ProtectedRoute, LoadingSpinner } from "@/components/common";
import { UserRole } from "@/types";
import { useAuth, useServices } from "@/hooks";
import { useSchedules, useUpdateScheduleStatus } from "@/hooks/schedules";
import Link from "next/link";

function SchedulesPageContent() {
  const { user } = useAuth();
  const providerId = user?.id as number;
  const searchParams = useSearchParams();
  const serviceIdFromQuery = searchParams.get("serviceId");

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    serviceIdFromQuery ? parseInt(serviceIdFromQuery) : null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<any | null>(null);

  useEffect(() => {
    if (serviceIdFromQuery) {
      setSelectedServiceId(parseInt(serviceIdFromQuery));
    }
  }, [serviceIdFromQuery]);

  const { services, isLoading: isLoadingServices } = useServices({
    providerId,
  });

  const {
    schedules,
    isLoading: isLoadingSchedules,
    deleteSchedule,
  } = useSchedules({
    serviceId: selectedServiceId!,
  });
  const { updateStatus, isUpdating } = useUpdateScheduleStatus();

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedServiceId(value === "" ? null : parseInt(value));
  };

  const handleShowDeleteModal = (schedule: any) => {
    setScheduleToDelete(schedule);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setScheduleToDelete(null);
  };

  const handleActivate = async (scheduleId: number) => {
    if (!selectedServiceId) return;

    updateStatus({
      serviceId: selectedServiceId,
      scheduleId: scheduleId,
      status: "active",
    });
  };

  const handleInactivate = async () => {
    if (!scheduleToDelete || !selectedServiceId) return;

    updateStatus({
      serviceId: selectedServiceId,
      scheduleId: scheduleToDelete.id,
      status: "inactive",
      onSuccess: handleCloseDeleteModal,
    });
  };

  const handleCancel = async () => {
    if (!scheduleToDelete || !selectedServiceId) return;

    updateStatus({
      serviceId: selectedServiceId,
      scheduleId: scheduleToDelete.id,
      status: "cancelled",
      onSuccess: handleCloseDeleteModal,
    });
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await deleteSchedule(scheduleToDelete.id);
      handleCloseDeleteModal();
    } catch (error) {
      handleCloseDeleteModal();
    }
  };

  const selectedService = services?.find((s) => s.id === selectedServiceId);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">Mis Horarios</h2>
          <p className="text-muted mb-0">
            Gestiona los horarios de tus servicios
          </p>
        </div>
        <Link
          href="/dashboard/provider/schedules/create"
          passHref
          legacyBehavior
        >
          <Button variant="primary">
            <FaPlus className="me-2" />
            Crear Horario
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Selecciona un servicio:</Form.Label>
            <Form.Select
              value={selectedServiceId || ""}
              onChange={handleServiceChange}
              disabled={isLoadingServices}
            >
              <option value="">-- Selecciona un servicio --</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Selecciona un servicio para ver sus horarios
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      {!selectedServiceId ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FaCalendarAlt size={80} className="text-muted mb-3" />
            <h4>Selecciona un servicio</h4>
            <p className="text-muted mb-0">
              Elige un servicio del menú desplegable para ver sus horarios
            </p>
          </Card.Body>
        </Card>
      ) : isLoadingSchedules ? (
        <LoadingSpinner fullScreen text="Cargando horarios..." />
      ) : !schedules || schedules.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FaCalendarAlt size={80} className="text-muted mb-3" />
            <h4>No hay horarios para este servicio</h4>
            <p className="text-muted mb-4">
              Comienza creando horarios para que los clientes puedan reservar
            </p>
            <Link
              href="/dashboard/provider/schedules/create"
              passHref
              legacyBehavior
            >
              <Button variant="primary">
                <FaPlus className="me-2" />
                Crear Primer Horario
              </Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {schedules.map((schedule) => (
            <Col key={schedule.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge bg="info" className="mb-2">
                      {selectedService?.name}
                    </Badge>
                    <Badge
                      bg={schedule.availableSlots > 0 ? "success" : "danger"}
                    >
                      {schedule.availableSlots}/{schedule.capacity}
                    </Badge>
                  </div>

                  <h5 className="mb-3">
                    <FaCalendarAlt className="text-primary me-2" />
                    {schedule.dayOfWeekName}
                  </h5>

                  <div className="mb-2">
                    <FaClock className="text-primary me-2" />
                    <strong>Horario:</strong>
                    <span className="ms-2">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>

                  <div className="mb-2">
                    <strong>Estado:</strong>
                    <Badge
                      bg={
                        schedule.status === "active" ? "success" : "secondary"
                      }
                      className="ms-2"
                    >
                      {schedule.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="mb-3 pb-3 border-bottom">
                    <FaUsers className="text-primary me-2" />
                    <strong>Reservas:</strong>
                    <span className="ms-2">
                      {schedule.reservationCounts} de {schedule.capacity}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      href={`/dashboard/provider/schedules/${schedule.id}/reservations?serviceId=${selectedServiceId}`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="flex-grow-1"
                      >
                        <FaUsers className="me-1" />
                        Ver Reservas
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/provider/schedules/${schedule.id}/edit?serviceId=${selectedServiceId}`}
                      passHref
                      legacyBehavior
                    >
                      <Button variant="outline-secondary" size="sm">
                        <FaEdit />
                      </Button>
                    </Link>
                    {schedule.status === "active" ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleShowDeleteModal(schedule)}
                        disabled={schedule.hasReservation}
                        title={
                          schedule.hasReservation
                            ? "No se puede eliminar un horario con reservas"
                            : "Gestionar horario"
                        }
                      >
                        <FaTrash />
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleActivate(schedule.id)}
                        disabled={isUpdating}
                        title="Activar horario"
                      >
                        <FaCheck />
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gestionar Horario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">¿Qué acción deseas realizar con este horario?</p>
          {scheduleToDelete && (
            <div className="border rounded p-3 bg-light mb-3">
              <div className="mb-2">
                <strong>Servicio:</strong> <span>{selectedService?.name}</span>
              </div>
              <div className="mb-2">
                <strong>Día:</strong>{" "}
                <span>{scheduleToDelete.dayOfWeekName}</span>
              </div>
              <div>
                <strong>Horario:</strong>{" "}
                <span>
                  {scheduleToDelete.startTime} - {scheduleToDelete.endTime}
                </span>
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <Alert variant="info" className="mb-0">
              <strong>Desactivar:</strong>
              <br />
              <small>
                El horario no estará disponible para nuevas reservas de
                clientes, pero seguirá visible en tu panel para gestión.
              </small>
            </Alert>

            <Alert variant="warning" className="mb-0">
              <strong>Cancelar:</strong>
              <br />
              <small>
                El horario se cancelará permanentemente y no estará disponible
                para nadie. Las reservas existentes se mantendrán.
              </small>
            </Alert>

            <Alert variant="danger" className="mb-0">
              <strong>Eliminar:</strong>
              <br />
              <small>
                El horario será eliminado permanentemente de la base de datos.
                Solo disponible si no tiene reservas.
              </small>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="secondary"
            onClick={handleCloseDeleteModal}
            disabled={isUpdating}
          >
            Cerrar
          </Button>
          <div className="d-flex gap-2">
            <Button
              variant="info"
              onClick={handleInactivate}
              disabled={isUpdating}
            >
              Desactivar
            </Button>
            <Button
              variant="warning"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isUpdating || scheduleToDelete?.hasReservation}
              title={
                scheduleToDelete?.hasReservation
                  ? "No se puede eliminar un horario con reservas"
                  : "Eliminar permanentemente"
              }
            >
              Eliminar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default function SchedulesPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <SchedulesPageContent />
    </ProtectedRoute>
  );
}
