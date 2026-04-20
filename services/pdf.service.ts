import jsPDF from "jspdf"
import QRCode from "qrcode"

interface TicketData {
  id: string
  qrCode: string
  eventTitle: string
  ticketType: string
  userName: string
  date: string
  location?: string
  imageUrl?: string
  price?: string
}

export async function generateTicketPDFDocument(data: TicketData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [200, 85], // Custom ticket size
  })
  
  const width = 200
  const height = 85
  const perforatedX = 145 // Position of the perforation

  // 1. Left Section: Event Info with Image Background
  if (data.imageUrl) {
    try {
      const response = await fetch(data.imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      (doc as any).addImage(uint8Array, 'JPEG', 0, 0, perforatedX, height);
    } catch (e) {
      console.error("Failed to load event image for PDF:", e);
      // Fallback color for left section if image fails
      doc.setFillColor(31, 12, 59); // Dark purple
      doc.rect(0, 0, perforatedX, height, "F");
    }
  } else {
    // Base color for left section
    doc.setFillColor(31, 12, 59); // Dark purple
    doc.rect(0, 0, perforatedX, height, "F");
  }

  // Dark overlay/gradient simulation
  doc.setFillColor(0, 0, 0)
  const gState = (doc as any).GState;
  if (gState) {
    (doc as any).setGState(new gState({ opacity: 0.4 }));
    doc.rect(0, 0, perforatedX, height, "F");
    (doc as any).setGState(new gState({ opacity: 1.0 }));
  } else {
    // Basic fallback if GState is not available or handled differently
    doc.rect(0, 0, perforatedX, height, "F");
  }

  // Branding
  doc.setFontSize(10)
  doc.setTextColor(212, 175, 55) // Gold
  doc.text("JOY ALAWEY MINISTRIES", 10, 15)

  // Event Details
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  const titleLines = doc.splitTextToSize(data.eventTitle.toUpperCase(), perforatedX - 20)
  doc.text(titleLines, 10, 30)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(200, 200, 200)
  doc.text(data.date, 10, 50)
  doc.text(data.location || "Abidjan, Côte d'Ivoire", 10, 57)

  // Price area
  doc.setFillColor(212, 175, 55)
  doc.rect(10, 65, 30, 8, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text(data.price || data.ticketType, 25, 70.5, { align: "center" })

  // User Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text(data.userName, 10, 78)

  // 2. Perforation Line
  doc.setDrawColor(200, 200, 200);
  if ((doc as any).setLineDash) {
    (doc as any).setLineDash([2, 1], 0);
  }
  doc.line(perforatedX, 5, perforatedX, height - 5);
  if ((doc as any).setLineDash) {
    (doc as any).setLineDash([], 0);
  }

  // 3. Right Section: Validation
  doc.setFillColor(255, 255, 255)
  doc.rect(perforatedX, 0, width - perforatedX, height, "F")

  // "SCAN HERE" text
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text("SCANNEZ ICI", (perforatedX + width) / 2, 15, { align: "center" })

  // QRCode Generation
  const qrImageBuffer = await QRCode.toDataURL(data.qrCode, { 
    margin: 1,
    color: {
        dark: "#3b0a68", // Purple QR code to match branding
        light: "#FFFFFF"
    }
  })
  doc.addImage(qrImageBuffer, "PNG", perforatedX + 7, 22, 40, 40)

  doc.setFontSize(7)
  doc.setTextColor(180, 180, 180)
  doc.text(data.id, (perforatedX + width) / 2, 70, { align: "center" })

  // Transform ArrayBuffer to Buffer for Node environments
  const arrayBuffer = doc.output("arraybuffer")
  return Buffer.from(arrayBuffer)
}
