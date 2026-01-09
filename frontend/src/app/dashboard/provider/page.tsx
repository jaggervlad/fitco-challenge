"use client";

import { Container, Row, Col, Card, Badge, Table } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaServicestack,
  FaDollarSign,
  FaCheckCircle,
  FaArrowUp,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import { ProtectedRoute } from "@/components/common";
import { UserRole } from "@/types";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Importar componentes de gráficos dinámicamente para evitar problemas de SSR
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

function ProviderDashboardContent() {
  // Mock data para gráficos y métricas
  const mockStats = {
    totalReservations: 156,
    confirmedReservations: 142,
    pendingReservations: 8,
    cancelledReservations: 6,
    totalRevenue: 7800,
    monthlyRevenue: 1250,
    averageRating: 4.8,
    totalServices: 8,
  };

  // Datos para el gráfico de líneas (Reservas por día)
  const reservationsChartData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Reservas",
        data: [12, 19, 15, 22, 18, 25, 20],
        fill: true,
        backgroundColor: "rgba(13, 110, 253, 0.1)",
        borderColor: "rgb(13, 110, 253)",
        tension: 0.4,
      },
    ],
  };

  // Datos para el gráfico de barras (Servicios más populares)
  const servicesChartData = {
    labels: [
      "Yoga",
      "Pilates",
      "Entrenamiento",
      "Masajes",
      "Nutrición",
      "Rehabilitación",
    ],
    datasets: [
      {
        label: "Reservas",
        data: [45, 38, 52, 28, 35, 18],
        backgroundColor: [
          "rgba(13, 110, 253, 0.8)",
          "rgba(25, 135, 84, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
          "rgba(13, 202, 240, 0.8)",
          "rgba(108, 117, 125, 0.8)",
        ],
      },
    ],
  };

  // Datos para el gráfico de dona (Estados de reservas)
  const statusChartData = {
    labels: ["Confirmadas", "Pendientes", "Canceladas"],
    datasets: [
      {
        data: [
          mockStats.confirmedReservations,
          mockStats.pendingReservations,
          mockStats.cancelledReservations,
        ],
        backgroundColor: [
          "rgba(25, 135, 84, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // Datos para el gráfico de líneas (Ingresos mensuales)
  const revenueChartData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ingresos ($)",
        data: [
          650, 780, 920, 1100, 1050, 1200, 1150, 1300, 1250, 1400, 1350, 1250,
        ],
        fill: true,
        backgroundColor: "rgba(25, 135, 84, 0.1)",
        borderColor: "rgb(25, 135, 84)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="mb-2">
          <FaChartBar className="me-2" />
          Dashboard de Proveedor
        </h1>
        <p className="text-muted">
          Analiza el rendimiento de tus servicios y reservas
        </p>
      </div>

      {/* Métricas Principales */}
      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <Card className="bg-primary text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Total Reservas</h6>
                  <h2 className="mb-0">{mockStats.totalReservations}</h2>
                  <small>
                    <FaArrowUp className="me-1" />
                    +12% este mes
                  </small>
                </div>
                <FaCalendarAlt size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="bg-success text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Ingresos</h6>
                  <h2 className="mb-0">${mockStats.totalRevenue}</h2>
                  <small>${mockStats.monthlyRevenue} este mes</small>
                </div>
                <FaDollarSign size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="bg-info text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Servicios</h6>
                  <h2 className="mb-0">{mockStats.totalServices}</h2>
                  <small>Activos</small>
                </div>
                <FaServicestack size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="bg-warning text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Valoración</h6>
                  <h2 className="mb-0">{mockStats.averageRating}</h2>
                  <small>Promedio</small>
                </div>
                <FaCheckCircle size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos Principales */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaChartLine className="me-2 text-primary" />
                Reservas por Día de la Semana
              </h5>
            </Card.Header>
            <Card.Body>
              <Line data={reservationsChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2 text-primary" />
                Estado de Reservas
              </h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={statusChartData} options={chartOptions} />
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <Badge bg="success" className="me-2"></Badge>
                    Confirmadas
                  </span>
                  <strong>{mockStats.confirmedReservations}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <Badge bg="warning" className="me-2"></Badge>
                    Pendientes
                  </span>
                  <strong>{mockStats.pendingReservations}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>
                    <Badge bg="danger" className="me-2"></Badge>
                    Canceladas
                  </span>
                  <strong>{mockStats.cancelledReservations}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico de Ingresos y Servicios Populares */}
      <Row className="g-4 mb-4">
        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaDollarSign className="me-2 text-success" />
                Ingresos Mensuales
              </h5>
            </Card.Header>
            <Card.Body>
              <Line data={revenueChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaServicestack className="me-2 text-info" />
                Servicios Más Populares
              </h5>
            </Card.Header>
            <Card.Body>
              <Bar data={servicesChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de Actividad Reciente */}
      <Row className="g-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaClock className="me-2 text-primary" />
                Actividad Reciente
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          JP
                        </div>
                        Juan Pérez
                      </div>
                    </td>
                    <td>Yoga Principiantes</td>
                    <td>15 Ene 2026</td>
                    <td>10:00 AM</td>
                    <td>
                      <Badge bg="success">Confirmada</Badge>
                    </td>
                    <td>$50</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-success text-white me-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          MG
                        </div>
                        María García
                      </div>
                    </td>
                    <td>Entrenamiento Personal</td>
                    <td>15 Ene 2026</td>
                    <td>2:00 PM</td>
                    <td>
                      <Badge bg="warning">Pendiente</Badge>
                    </td>
                    <td>$80</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-info text-white me-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          CL
                        </div>
                        Carlos López
                      </div>
                    </td>
                    <td>Masaje Deportivo</td>
                    <td>16 Ene 2026</td>
                    <td>9:00 AM</td>
                    <td>
                      <Badge bg="success">Confirmada</Badge>
                    </td>
                    <td>$65</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-warning text-white me-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          AR
                        </div>
                        Ana Rodríguez
                      </div>
                    </td>
                    <td>Consulta Nutricional</td>
                    <td>16 Ene 2026</td>
                    <td>11:30 AM</td>
                    <td>
                      <Badge bg="success">Confirmada</Badge>
                    </td>
                    <td>$45</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-danger text-white me-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          LS
                        </div>
                        Luis Sánchez
                      </div>
                    </td>
                    <td>Pilates Avanzado</td>
                    <td>17 Ene 2026</td>
                    <td>4:00 PM</td>
                    <td>
                      <Badge bg="danger">Cancelada</Badge>
                    </td>
                    <td>$55</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default function ProviderDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <ProviderDashboardContent />
    </ProtectedRoute>
  );
}
