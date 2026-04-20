"use client"

import Image from "next/image"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Mail, User, Phone, CheckCircle, Download, ArrowRight, ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RegistrationModalProps {
  eventId: string
  eventTitle: string
  isFree: boolean
  price: number | null
  isOpen: boolean
  onClose: () => void
}

const PAYMENT_METHODS = [
  { id: "mtn",    label: "MTN MoMo",     logo: "/images/mtn_logo.jpg",    bg: "#fff9e6" },
  { id: "orange", label: "Orange Money", logo: "/images/orange_logo.jpg", bg: "#fff3e6" },
  { id: "moov",   label: "Moov Money",   logo: "/images/moov_logo.jpg",  bg: "#e6f0ff" },
  { id: "wave",   label: "Wave",         logo: "/images/wave_logo.jpg",  bg: "#e6f9fc" },
]

export function RegistrationModal({ eventId, eventTitle, isFree, price, isOpen, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState<"form" | "payment" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)

  const resetAndClose = () => {
    setStep("form")
    setFormData({ name: "", email: "", phone: "" })
    setSelectedMethod(null)
    setTicketId(null)
    onClose()
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isFree) {
      // Free → register directly
      setLoading(true)
      try {
        const res = await fetch("/api/tickets/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, ...formData }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setTicketId(data.ticket.id)
          setStep("success")
          toast.success(data.message)
        } else {
          toast.error(data.error || "Erreur lors de l'inscription")
        }
      } catch {
        toast.error("Erreur réseau")
      } finally {
        setLoading(false)
      }
    } else {
      // Paid → go to payment step
      setStep("payment")
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un moyen de paiement")
      return
    }
    if (!formData.phone) {
      toast.error("Veuillez renseigner votre numéro de téléphone")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/tickets/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...formData,
          paymentMethod: selectedMethod,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(data.message || "Veuillez valider le paiement sur votre mobile.")
        setTicketId(data.ticket.id)
        
        // Handle redirection for payment methods like Wave
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
          return
        }
        
        setStep("success") // Proceed to success screen for USSD push methods (MTN/Orange)
      } else {
        toast.error(data.error || "Erreur lors du paiement")
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3b0a68] to-[#5b21b6] p-4 text-white relative">
          <button
            onClick={resetAndClose}
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-0.5">
            {isFree ? "Inscription gratuite" : "Réservation"}
          </p>
          <h2 className="text-lg font-bold leading-tight line-clamp-2">{eventTitle}</h2>
          {!isFree && price && (
            <div className="mt-2 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
              <span className="text-xs font-bold">{Number(price).toLocaleString()} FCFA</span>
            </div>
          )}
        </div>

        {/* Steps indicator */}
        {!isFree && step !== "success" && (
          <div className="flex items-center justify-center gap-3 py-2 border-b border-gray-100 bg-gray-50/50">
            <div className={cn(
              "flex items-center gap-2 text-xs font-bold",
              step === "form" ? "text-purple-700" : "text-gray-400"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                step === "form" ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-500"
              )}>1</div>
              Informations
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className={cn(
              "flex items-center gap-2 text-xs font-bold",
              step === "payment" ? "text-purple-700" : "text-gray-400"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                step === "payment" ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-500"
              )}>2</div>
              Paiement
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* STEP 1: Form */}
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-gray-700 font-semibold flex items-center gap-2 text-[13px]">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reg-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                  placeholder="Ex: Jean Kouamé"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-gray-700 font-semibold flex items-center gap-2 text-[13px]">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> Adresse email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-phone" className="text-gray-700 font-semibold flex items-center gap-2 text-[13px]">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Téléphone {!isFree && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  required={!isFree}
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="h-10 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                  placeholder="Ex: 0701020304"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-2xl bg-[#3b0a68] hover:bg-[#2d0852] text-white font-bold text-sm shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Traitement...</>
                ) : isFree ? (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Confirmer l'inscription</>
                ) : (
                  <><ArrowRight className="h-4 w-4 mr-2" /> Suivant — Paiement</>
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: Payment (paid events only) */}
          {step === "payment" && (
            <div className="space-y-4">
              <div>
                <p className="text-[13px] font-bold text-gray-700 mb-2">Choisissez votre moyen de paiement :</p>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={cn(
                        "relative p-2.5 rounded-2xl border-2 text-center transition-all duration-200 flex flex-col items-center gap-1.5",
                        selectedMethod === method.id
                          ? "border-purple-600 bg-purple-50 shadow-md shadow-purple-100 scale-[1.02]"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: method.bg }}
                      >
                        <Image
                          src={method.logo}
                          alt={method.label}
                          width={38}
                          height={38}
                          className="object-contain rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">{method.label}</span>
                      {selectedMethod === method.id && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Montant à payer :</span>
                  <span className="text-lg font-black text-[#3b0a68]">{price ? Number(price).toLocaleString() : 0} FCFA</span>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Numéro :</span>
                  <span className="text-[13px] font-bold text-gray-700">{formData.phone || "—"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("form")}
                  className="flex-1 h-11 rounded-2xl font-bold text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Retour
                </Button>
                <Button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || !selectedMethod}
                  className="flex-[2] h-11 rounded-2xl bg-[#3b0a68] hover:bg-[#2d0852] text-white font-bold text-sm shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Traitement...</>
                  ) : (
                    "Payer maintenant"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === "success" && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inscription réussie !</h3>
                <p className="text-sm text-gray-500">
                  Un email de confirmation avec votre QR code a été envoyé à <strong className="text-gray-700">{formData.email}</strong>.
                </p>
              </div>

              {ticketId && (
                <a
                  href={`/api/tickets/${ticketId}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 rounded-2xl bg-[#3b0a68] hover:bg-[#2d0852] text-white font-bold text-sm shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Télécharger mon billet (PDF)
                </a>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={resetAndClose}
                className="w-full h-12 rounded-2xl font-bold"
              >
                Fermer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
