
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pilot, Category } from '../types';

/**
 * Genera un PDF de alta calidad con estética de competencia profesional.
 * Incluye Posición de Llegada (orden secuencial de inscripción), Ranking, Número de Kart, Piloto, Categoría y Asociación.
 */
export const generatePilotsPDF = (
  pilots: Pilot[], 
  title: string, 
  category?: Category, 
  association?: string
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // 1. FILTRADO (Excluimos bajas para mantener integridad de la planilla activa)
  const activePilots = pilots.filter(p => p.status !== 'Baja');

  // 2. DISEÑO DEL ENCABEZADO PRO (Carbon & Racing Red)
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Acento Rojo KDO
  doc.setFillColor(220, 38, 38);
  doc.triangle(pageWidth, 0, pageWidth, 45, pageWidth - 80, 0, 'F');
  doc.rect(0, 43.5, pageWidth, 1.5, 'F');

  // Textos del Encabezado
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  
  doc.setFontSize(8);
  doc.text('PLANILLA OFICIAL DE REGISTRO', 20, 15);
  
  doc.setFontSize(28);
  doc.text('INSCRIPTOS POR LLEGADA', 18, 32);

  // Info de la planilla (Derecha)
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  const dateStr = new Date().toLocaleDateString('es-AR');
  const catStr = category && category !== 'all' ? category.toUpperCase() : 'TODAS LAS CATEGORÍAS';
  const assocStr = association ? association.toUpperCase() : 'ASOCIACIÓN KDO BUENOS AIRES';
  
  doc.text(`ENTIDAD: ${assocStr}`, pageWidth - 20, 20, { align: 'right' });
  doc.text(`CATEGORÍA: ${catStr}`, pageWidth - 20, 26, { align: 'right' });
  doc.text(`REPORTE EMITIDO: ${dateStr}`, pageWidth - 20, 32, { align: 'right' });

  // 3. CONFIGURACIÓN DE LA TABLA (Cumpliendo requerimiento de Posición y Categoría)
  const head = [['POS. LLEGADA', 'RANKING', 'KART', 'PILOTO', 'CATEGORÍA', 'ASOCIACIÓN / EQUIPO']];
  const body = activePilots.map((p, index) => [
    index + 1, // Número correlativo basado en el orden de inscripción
    `${p.ranking}º`, // Ranking oficial del piloto
    `#${p.number}`,
    p.name.toUpperCase(),
    p.category.toUpperCase(),
    p.association.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 55,
    head: head,
    body: body,
    theme: 'striped',
    headStyles: { 
      fillColor: [0, 0, 0], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold', 
      halign: 'center',
      fontSize: 8,
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [30, 30, 30],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 28, fillColor: [230, 230, 230] }, // Posición de Llegada
      1: { halign: 'center', cellWidth: 20, fontStyle: 'bold' }, // Ranking
      2: { halign: 'center', fontStyle: 'bold', cellWidth: 15, textColor: [220, 38, 38] }, // Kart
      3: { halign: 'left', fontStyle: 'bold', cellWidth: 65 }, // Piloto
      4: { halign: 'left', cellWidth: 50 }, // Categoría
      5: { halign: 'left' } // Asociación/Equipo
    },
    margin: { left: 20, right: 20 },
    didDrawPage: (data) => {
      // Pie de Página corporativo
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      const str = "Página " + doc.internal.getNumberOfPages();
      doc.text(str, pageWidth - 20, pageHeight - 10, { align: 'right' });
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('SOLO KARTING', 20, pageHeight - 10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text(' - REGISTRO OFICIAL RMS 3.0 ELITE KDO', 45, pageHeight - 10);
    }
  });

  // Nombre del archivo dinámico
  const fileName = `SoloKarting_Inscriptos_Llegada_${catStr.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
