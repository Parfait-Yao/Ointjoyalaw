import jsPDF from "jspdf"
import QRCode from "qrcode"

interface TicketData {
  id: string
  qrCode: string
  eventTitle: string
  ticketType: string
  userName: string
  date: string
}

export async function generateTicketPDFDocument(data: TicketData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })
  
  // Background
  doc.setFillColor(250, 250, 252)
  doc.rect(0, 0, 210, 297, "F")

  // Header Title
  doc.setFontSize(24)
  doc.setTextColor(59, 10, 104) // Dark Purple
  doc.text("OINTJOYALAW MINISTRIES", 105, 30, { align: "center" })

  doc.setFontSize(16)
  doc.setTextColor(212, 175, 55) // Gold
  doc.text("Billet Officiel", 105, 45, { align: "center" })

  // Event Card
  doc.setFillColor(255, 255, 255)
  doc.rect(20, 60, 170, 120, "F")
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.text(data.eventTitle, 105, 80, { align: "center" })

  doc.setFontSize(14)
  doc.text(`Nom : ${data.userName}`, 30, 100)
  doc.text(`Type : ${data.ticketType}`, 30, 110)
  doc.text(`Date : ${data.date}`, 30, 120)

  // QRCode Generation
  const qrImageBuffer = await QRCode.toDataURL(data.qrCode, { margin: 1 })
  doc.addImage(qrImageBuffer, "PNG", 75, 130, 60, 60)

  doc.setFontSize(10)
  doc.text(`ID Billet: ${data.id}`, 105, 195, { align: "center" })

  // Transform ArrayBuffer to Buffer for Node environments
  const arrayBuffer = doc.output("arraybuffer")
  return Buffer.from(arrayBuffer)
}
