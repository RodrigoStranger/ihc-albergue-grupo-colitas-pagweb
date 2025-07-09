import React, { useState } from "react";
import supabase from "../supabase/client";
import "../styles/PaginaAdopcion.css";
import ConfirmationModalAdopcion from "./ConfirmationModalAdopcion";
import DuplicateRequestModal from "./DuplicateRequestModal";

function FormularioAdopcion({ perro, onClose }) {
  const [formData, setFormData] = useState({
    NombreSolicitanteAdopcion: "",
    Numero1SolicitanteAdopcion: "",
    Numero2SolicitanteAdopcion: "",
    DescripcionSolicitanteAdopcion: "",
    EstadoSolicitanteAdopcion: "Pendiente",
  });
  const [fieldErrors, setFieldErrors] = useState({
    NombreSolicitanteAdopcion: "",
    Numero1SolicitanteAdopcion: "",
    Numero2SolicitanteAdopcion: "",
    DescripcionSolicitanteAdopcion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [error, setError] = useState("");

  const validateField = (fieldName, value) => {
    let errorMessage = "";
    switch (fieldName) {
      case "NombreSolicitanteAdopcion":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El nombre solo puede contener letras y espacios";
        }
        break;
      case "Numero1SolicitanteAdopcion":
        if (!value || value.trim() === "") {
          errorMessage = "El número de teléfono es obligatorio";
        } else if (value.length !== 9) {
          errorMessage = "El número de teléfono debe tener exactamente 9 dígitos";
        }
        break;
      case "Numero2SolicitanteAdopcion":
        if (value && value.trim() !== "" && value.length !== 9) {
          errorMessage = "El segundo número de teléfono debe tener exactamente 9 dígitos";
        }
        break;
      case "DescripcionSolicitanteAdopcion":
        if (!value.trim()) {
          errorMessage = "La descripción es obligatoria";
        }
        break;
      default:
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return errorMessage === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "NombreSolicitanteAdopcion") {
      const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({
      NombreSolicitanteAdopcion: "",
      Numero1SolicitanteAdopcion: "",
      Numero2SolicitanteAdopcion: "",
      DescripcionSolicitanteAdopcion: "",
    });
    const isNombreValid = validateField("NombreSolicitanteAdopcion", formData.NombreSolicitanteAdopcion);
    const isTelefonoValid = validateField("Numero1SolicitanteAdopcion", formData.Numero1SolicitanteAdopcion);
    const isTelefono2Valid = validateField("Numero2SolicitanteAdopcion", formData.Numero2SolicitanteAdopcion);
    const isDescripcionValid = validateField("DescripcionSolicitanteAdopcion", formData.DescripcionSolicitanteAdopcion);
    if (!isNombreValid || !isTelefonoValid || !isTelefono2Valid || !isDescripcionValid) {
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      const { data: solicitudesExistentes, error: consultaError } = await supabase
        .from("SolicitudesAdopcion")
        .select("IdPerro, EstadoSolicitanteAdopcion")
        .eq("Numero1SolicitanteAdopcion", formData.Numero1SolicitanteAdopcion);
      if (consultaError) throw consultaError;
      const solicitudMismoPerroEnProceso = solicitudesExistentes.find(
        (s) => s.IdPerro === perro.IdPerro && s.EstadoSolicitanteAdopcion === "Pendiente"
      );
      if (solicitudMismoPerroEnProceso) {
        setShowDuplicateModal(true);
        setIsSubmitting(false);
        return;
      }
      const solicitudOtroPerroEnProceso = solicitudesExistentes.find(
        (s) => s.IdPerro !== perro.IdPerro && s.EstadoSolicitanteAdopcion === "Pendiente"
      );
      if (solicitudOtroPerroEnProceso) {
        setError(
          "Ya tienes una solicitud pendiente para otro perro. Solo puedes tener una solicitud activa a la vez. Espera a que sea procesada antes de enviar otra."
        );
        setIsSubmitting(false);
        return;
      }
      const { error: insertError } = await supabase.from("SolicitudesAdopcion").insert({
        IdPerro: perro.IdPerro,
        NombreSolicitanteAdopcion: formData.NombreSolicitanteAdopcion,
        Numero1SolicitanteAdopcion: formData.Numero1SolicitanteAdopcion,
        Numero2SolicitanteAdopcion: formData.Numero2SolicitanteAdopcion || null,
        DescripcionSolicitanteAdopcion: formData.DescripcionSolicitanteAdopcion,
        EstadoSolicitanteAdopcion: formData.EstadoSolicitanteAdopcion,
      });
      if (insertError) throw insertError;
      setShowConfirmationModal(true);
    } catch (error) {
      setError(`Ocurrió un error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    if (onClose) onClose();
  };

  return (
    <div className="formulario-modal-adopcion">
      <h2>Formulario de Adopción</h2>
      <form onSubmit={handleSubmit} className="formulario-adopcion">
        <div className="form-group">
          <label>
            Nombre Completo <span className="required">*</span>
          </label>
          <input
            type="text"
            name="NombreSolicitanteAdopcion"
            value={formData.NombreSolicitanteAdopcion}
            onChange={handleChange}
            className={fieldErrors.NombreSolicitanteAdopcion ? "input-error" : ""}
            autoComplete="off"
          />
          {fieldErrors.NombreSolicitanteAdopcion && (
            <div className="field-error">{fieldErrors.NombreSolicitanteAdopcion}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            Teléfono <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="Numero1SolicitanteAdopcion"
            value={formData.Numero1SolicitanteAdopcion}
            onChange={handleChange}
            className={fieldErrors.Numero1SolicitanteAdopcion ? "input-error" : ""}
            autoComplete="off"
            maxLength={9}
          />
          {fieldErrors.Numero1SolicitanteAdopcion && (
            <div className="field-error">{fieldErrors.Numero1SolicitanteAdopcion}</div>
          )}
        </div>
        <div className="form-group">
          <label>Teléfono alternativo (opcional)</label>
          <input
            type="tel"
            name="Numero2SolicitanteAdopcion"
            value={formData.Numero2SolicitanteAdopcion}
            onChange={handleChange}
            className={fieldErrors.Numero2SolicitanteAdopcion ? "input-error" : ""}
            autoComplete="off"
            maxLength={9}
          />
          {fieldErrors.Numero2SolicitanteAdopcion && (
            <div className="field-error">{fieldErrors.Numero2SolicitanteAdopcion}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            ¿Por qué quieres adoptar a {perro.NombrePerro}? <span className="required">*</span>
          </label>
          <textarea
            name="DescripcionSolicitanteAdopcion"
            value={formData.DescripcionSolicitanteAdopcion}
            onChange={handleChange}
            className={fieldErrors.DescripcionSolicitanteAdopcion ? "input-error" : ""}
            autoComplete="off"
            rows={3}
          />
          {fieldErrors.DescripcionSolicitanteAdopcion && (
            <div className="field-error">{fieldErrors.DescripcionSolicitanteAdopcion}</div>
          )}
        </div>
        {error && <div className="field-error">{error}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-donar" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </button>
          <button type="button" className="btn-donar" onClick={onClose} style={{ marginLeft: 12 }}>
            Cancelar
          </button>
        </div>
      </form>
      <ConfirmationModalAdopcion
        isOpen={showConfirmationModal}
        onClose={handleConfirmationClose}
        adoptanteName={formData.NombreSolicitanteAdopcion}
        phoneNumber={formData.Numero1SolicitanteAdopcion}
        dogName={perro.NombrePerro}
        dogPhoto={perro.FotoPerro}
      />
      <DuplicateRequestModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        dogName={perro.NombrePerro}
        dogPhoto={perro.FotoPerro}
      />
    </div>
  );
}

export default FormularioAdopcion;
