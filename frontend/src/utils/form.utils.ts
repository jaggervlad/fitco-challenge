import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

interface ValidationDetail {
  field: string;
  message: string;
}

/**
 * Mapea errores de validación del servidor a campos del formulario
 * @param error - El error capturado del servidor
 * @param setError - Función setError de react-hook-form
 * @param formData - Los datos del formulario para verificar que el campo existe
 */
export function mapServerValidationErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
  formData: T
): void {
  const details = error.response?.data?.details;

  if (details && Array.isArray(details)) {
    details.forEach((detail: ValidationDetail) => {
      const fieldName = detail.field as Path<T>;

      // Verificar que el campo existe en el formulario
      if (fieldName in formData) {
        setError(fieldName, {
          type: "server",
          message: detail.message,
        });
      }
    });
  }
}

/**
 * Crea un callback onError que mapea automáticamente los errores de validación
 * @param setError - Función setError de react-hook-form
 * @param formData - Los datos del formulario
 * @returns Función callback para usar en onError
 */
export function createValidationErrorHandler<T extends FieldValues>(
  setError: UseFormSetError<T>,
  formData: T
) {
  return (error: any) => {
    mapServerValidationErrors(error, setError, formData);
  };
}

/**
 * Maneja errores de mutación mostrando notificaciones toast apropiadas
 * @param error - El error capturado del servidor
 * @param fallbackMessage - Mensaje por defecto si no se encuentra uno específico
 * @param onError - Callback opcional para manejo adicional del error
 */
export function handleMutationError(
  error: any,
  fallbackMessage: string,
  onError?: (error: any) => void
): void {
  const responseData = error.response?.data;

  if (responseData?.details && Array.isArray(responseData.details)) {
    // Errores de validación: mostrar el primer error
    const firstError = responseData.details[0];
    toast.error(firstError?.message || "Error de validación");
  } else {
    // Errores genéricos
    const errorMessage =
      responseData?.message || error.message || fallbackMessage;
    const errorMsg =
      typeof errorMessage === "string" ? errorMessage : fallbackMessage;
    toast.error(errorMsg);
  }

  onError?.(error);
}
