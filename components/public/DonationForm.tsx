"use client"

import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Mail, User, Phone, CheckCircle, ArrowRight, ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const PAYMENT_METHODS = [
  { id: "mtn",    label: "MTN MoMo",     logo: "/images/mtn_logo.jpg",    bg: "#fff9e6" },
  { id: "orange", label: "Orange Money", logo: "/images/orange_logo.jpg", bg: "#fff3e6" },
  { id: "moov",   label: "Moov Money",   logo: "/images/moov_logo.jpg",  bg: "#e6f0ff" },
  { id: "wave",   label: "Wave",         logo: "/images/wave_logo.jpg",  bg: "#e6f9fc" },
]

export function DonationForm() {
  const [step, setStep] = useState<"amount" | "info" | "payment" | "success">("amount")
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<string>("")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseInt(amount) < 500) {
      toast.error("Veuillez entrer un montant valide (min 500 FCFA)")
      return
    }
    setStep("info")
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    setStep("payment")
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un moyen de paiement")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          ...formData,
          paymentMethod: selectedMethod,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success("Demande de paiement envoyée.")
        
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
          return
        }
        
        setStep("success")
      } else {
        toast.error(data.error || "Erreur lors du traitement du don")
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3b0a68] to-[#5b21b6] p-6 text-white text-center">
        <div className="bg-white rounded-3xl p-4 inline-block mb-3 shadow-lg">
          <Image
            src="/images/logo-site.png"
            alt="Logo Joy Alawey"
            width={160}
            height={80}
            className="h-14 w-auto object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Faire un Don</h2>
        <p className="text-purple-100 text-sm mt-1 opacity-90">Soutenez les actions du Ministère</p>
      </div>

      {/* Progress Indicator */}
      {step !== "success" && (
        <div className="flex items-center justify-center gap-3 py-4 border-b border-gray-50 bg-gray-50/30">
          {[
            { id: "amount", label: "Montant" },
            { id: "info", label: "Infos" },
            { id: "payment", label: "Paiement" }
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                step === s.id ? "bg-purple-700 text-white scale-110 shadow-md shadow-purple-200" : 
                (i < ["amount", "info", "payment"].indexOf(step) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500")
              )}>
                {i < ["amount", "info", "payment"].indexOf(step) ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                step === s.id ? "text-purple-700" : "text-gray-400"
              )}>{s.label}</span>
              {i < 2 && <div className="w-4 h-px bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* STEP 1: Amount */}
        {step === "amount" && (
          <form onSubmit={handleAmountSubmit} className="space-y-6 py-2">
            <div className="space-y-4">
              <Label htmlFor="don-amount" className="text-gray-700 font-bold text-xs uppercase tracking-widest text-center block">
                Entrez le montant de votre don (FCFA)
              </Label>
              
              <div className="relative group">
                <Input
                  id="don-amount"
                  type="number"
                  min="500"
                  autoFocus
                  placeholder="Ex: 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all text-xl font-bold text-center text-[#3b0a68] placeholder:text-gray-200"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-[10px] font-black">
                  XOF
                </div>
              </div>
              
              <p className="text-center text-[10px] text-gray-400 font-medium">
                Montant minimum : 500 FCFA
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-[#3b0a68] hover:bg-[#2d0852] text-white font-black text-sm shadow-xl shadow-purple-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              CONTINUER <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* STEP 2: Info */}
        {step === "info" && (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="don-name" className="text-gray-700 font-semibold flex items-center gap-2 text-[13px]">
                <User className="w-3.5 h-3.5 text-gray-400" /> Nom complet
              </Label>
              <Input
                id="don-name"
                required
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                placeholder="Ex: Jean Kouamé"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="don-email" className="text-gray-700 font-semibold flex items-center gap-2 text-[13px]">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
              </Label>
              <Input
                id="don-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="don-phone" className="text-gray-700 font-semibold flex items-center gap-2 text-[13px]">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> Téléphone Mobile Money
              </Label>
              <Input
                id="don-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                placeholder="Ex: 0701020304"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("amount")} className="h-14 rounded-2xl px-6">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                className="flex-1 h-14 rounded-2xl bg-[#3b0a68] hover:bg-[#2d0852] text-white font-black text-sm shadow-xl shadow-purple-900/20 transition-all active:scale-[0.98]"
              >
                MODE DE PAIEMENT <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment */}
        {step === "payment" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3",
                    selectedMethod === method.id
                      ? "border-purple-600 bg-purple-50 shadow-xl shadow-purple-100 scale-[1.05] z-10"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  )}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner bg-white p-1"
                  >
                    <Image
                      src={method.logo}
                      alt={method.label}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">{method.label}</span>
                  {selectedMethod === method.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 space-y-2">
               <div className="flex justify-between items-center text-xs text-purple-600 font-bold uppercase tracking-wider">
                  <span>Récapitulatif</span>
                  <span>Don unique</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-sm">Montant global :</span>
                  <span className="text-2xl font-black text-purple-900">{parseInt(amount).toLocaleString()} FCFA</span>
               </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep("info")} className="h-14 rounded-2xl px-6">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading || !selectedMethod}
                className="flex-1 h-14 rounded-2xl bg-[#3b0a68] hover:bg-[#2d0852] text-white font-black text-sm shadow-xl shadow-purple-900/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin mr-2" /> TRAITEMENT...</>
                ) : (
                  "CONFIRMER LE DON"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === "success" && (
          <div className="text-center py-8 space-y-6">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Merci pour votre générosité !</h3>
              <p className="text-gray-500 text-sm max-w-[250px] mx-auto">
                Votre don de <strong className="text-purple-700">{parseInt(amount).toLocaleString()} FCFA</strong> a été reçu avec succès. Que Dieu vous bénisse.
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-black"
            >
              RETOUR À L'ACCUEIL
            </Button>
          </div>
        )}
      </div>
      
      {/* Footer Support */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Paiement sécurisé par CentralAPIs
        </p>
      </div>
    </div>
  )
}
