"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export function DonationForm() {
  const [amount, setAmount] = useState<string>("")
  const [method, setMethod] = useState<"CARD" | "MOBILE">("CARD")
  const [loading, setLoading] = useState(false)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return
    
    setLoading(true)
    // Simulation API Don
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "XOF", name: "Anonyme", email: "" })
      })
      if (res.ok) {
        alert("Merci pour votre don ! (Bientôt redirigé vers Stripe/CinetPay)")
        setAmount("")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Faire un Don</CardTitle>
        <CardDescription className="text-center">Soutenez le ministère Ointjoyalaw</CardDescription>
      </CardHeader>
      <form onSubmit={handleDonate}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={method === "CARD" ? "default" : "outline"}
              className={method === "CARD" ? "bg-purple-800" : ""}
              onClick={() => setMethod("CARD")}
            >
              Carte Bancaire
            </Button>
            <Button
              type="button"
              variant={method === "MOBILE" ? "default" : "outline"}
              className={method === "MOBILE" ? "bg-purple-800" : ""}
              onClick={() => setMethod("MOBILE")}
            >
              Mobile Money
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[5000, 10000, 20000].map(val => (
                <Button
                  key={val}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(val.toString())}
                  className={amount === val.toString() ? "border-purple-800 text-purple-800" : ""}
                >
                  {val} FCFA
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Ou un autre montant</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Entrez un montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled={loading || !amount}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Faire un don maintenant"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
