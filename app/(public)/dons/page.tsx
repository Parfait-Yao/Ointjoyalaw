import { DonationForm } from "@/components/public/DonationForm"

export default function DonsPage() {
  return (
    <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 max-w-[1600px] py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Soutenir le Ministère</h1>
        <p className="text-lg text-gray-600">
          Votre générosité aide Ointjoyalaw Ministries à accomplir sa mission : propager l'Évangile, soutenir nos organisations affiliées et aider les plus démunis. Que Dieu vous bénisse abondamment.
        </p>
      </div>

      <div className="mb-16">
        <DonationForm />
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        <div>
          <h3 className="font-bold text-lg mb-2">Paiement Sécurisé</h3>
          <p className="text-gray-600 text-sm">Tous vos paiements par carte bancaire sont sécurisés par Stripe.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Mobile Money</h3>
          <p className="text-gray-600 text-sm">Transfert facile (Wave, Orange, MTN) géré par CinetPay.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Transparence</h3>
          <p className="text-gray-600 text-sm">Nous garantissons une utilisation intègre et transparente des fonds.</p>
        </div>
      </div>
    </div>
  )
}
