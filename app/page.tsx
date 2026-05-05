import Image from "next/image";
import {
  ArrowRight, CalendarDays, Car, CheckCircle2, CircleHelp, Flag,
  Headphones, Mail, MapPin, Palmtree, Phone, ShieldCheck, Star, Sun,
  Trophy, Users
} from "lucide-react";

const trips = [
  {
    title: "Korineum Golf Resort",
    location: "Pohjois-Kypros",
    date: "28.9.2026",
    price: "1 195 €",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop",
    reason: "Helppo pelata paljon – kenttä vieressä, ei autoa, vain golfia.",
  },
  {
    title: "Costa del Sol, La Cala",
    location: "Espanja",
    date: "20.10.2026",
    price: "1 345 €",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop",
    reason: "Aurinkoa, hyviä kenttiä ja rentoa lomatunnelmaa.",
  },
  {
    title: "Long stay Kypros",
    location: "Kypros",
    date: "28 vrk",
    price: "2 690 €",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    reason: "Pelaa paljon, nauti säästä ja vietä aikaa rennosti pidempään.",
  },
];

const tripTypes = [
  { title: "Syksyn golfmatkat", icon: Sun },
  { title: "Talven long stay", icon: Palmtree },
  { title: "Kisamatkat", icon: Trophy },
  { title: "Helppo matka yksin", icon: Users },
];

const benefits = [
  { title: "Kaikki järjestetty valmiiksi", text: "Lennot, majoitus, golf ja kuljetukset – me hoidamme yksityiskohdat.", icon: CheckCircle2 },
  { title: "Et tarvitse vuokra-autoa", text: "Valitsemme kohteet, joissa pääset kentälle helposti ilman autoa.", icon: Car },
  { title: "Kentät ja aikataulut suunniteltu", text: "Parhaat peliajat ja sujuva aikataulu takaavat onnistuneen matkan.", icon: Flag },
  { title: "Tuki suomeksi koko matkan ajan", text: "Olemme tavoitettavissa ennen matkaa, matkan aikana ja sen jälkeen.", icon: Headphones },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Mitä Golfpassin golfmatka sisältää?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Matkapaketista riippuen matka sisältää lennot, majoituksen, golfkierrokset, kuljetukset ja suomenkielisen tuen.",
      },
    },
    {
      "@type": "Question",
      name: "Voiko golfmatkalle lähteä yksin?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kyllä. Golfpassin matkoille voi lähteä yksin, pariskuntana tai porukalla.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-golfNavy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" aria-label="Golfpassi etusivu">
            <Image src="/golfpassi-logo.png" alt="Golfpassi" width={180} height={52} priority className="h-10 w-auto object-contain" />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
            {["Matkat", "Kohteet", "Long stay", "Kisamatkat", "Artikkelit", "Tietoa meistä"].map((item) => (
              <a key={item} href="#" className="hover:text-golfBlue">{item}</a>
            ))}
          </nav>
          <a href="tel:+358401234567" className="hidden items-center gap-3 rounded-full px-4 py-2 text-sm font-bold text-golfBlue hover:bg-blue-50 md:flex">
            <Phone className="h-5 w-5" />
            <span>040 123 4567<small className="block text-xs font-medium text-slate-500">Soita ja kysy lisää.</small></span>
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2200&auto=format&fit=crop" alt="Golfkenttä meren äärellä" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/10" />
        </div>
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-golfOrange shadow-sm">Golfmatkat helposti</p>
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">Golfmatkat, joissa kaikki on valmiina – sinä keskityt peliin</h1>
            <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-slate-700">Lennot, majoitus, golf ja kuljetukset samassa paketissa. Helppo lähteä yksin tai porukalla.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#matkat" className="inline-flex items-center justify-center gap-3 rounded-xl bg-golfOrange px-7 py-4 text-base font-black text-white shadow-soft hover:-translate-y-0.5 hover:bg-orange-500">Katso matkat <ArrowRight className="h-5 w-5" /></a>
              <a href="tel:+358401234567" className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-golfNavy bg-white/80 px-7 py-4 text-base font-black text-golfNavy hover:bg-golfNavy hover:text-white"><Phone className="h-5 w-5" /> Soita 040 123 4567</a>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-10 relative z-10 mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-6 text-center text-2xl font-black">Minkälaista matkaa etsit?</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {tripTypes.map((type) => {
              const Icon = type.icon;
              return (
                <a key={type.title} href="#matkat" className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:border-golfBlue hover:shadow-soft">
                  <span className="flex items-center gap-4"><Icon className="h-10 w-10 text-golfOrange" /><strong className="text-lg">{type.title}</strong></span>
                  <ArrowRight className="h-5 w-5 text-golfBlue group-hover:translate-x-1" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-black">Helpoin tapa lähteä golfmatkalle</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-3xl bg-slate-50 p-7">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100"><Icon className="h-7 w-7 text-golfBlue" /></div>
                <h3 className="text-lg font-black">{benefit.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="matkat" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black">Näistä kannattaa aloittaa</h2>
              <p className="mt-2 text-slate-600">Suositellut matkat juuri nyt – valittu helppouden, ajankohdan ja pelattavuuden perusteella.</p>
            </div>
            <a href="#" className="hidden font-bold text-golfBlue md:block">Katso kaikki matkat →</a>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {trips.map((trip) => (
              <article key={trip.title} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                <div className="relative h-56"><Image src={trip.image} alt={trip.title} fill className="object-cover" /></div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black">{trip.title}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {trip.location}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" /> {trip.date}</p>
                    </div>
                    <div className="text-right"><small className="text-slate-500">alkaen</small><p className="text-2xl font-black">{trip.price}</p></div>
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-600">{trip.reason}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <a href="#" className="rounded-xl bg-golfOrange px-4 py-3 text-center text-sm font-black text-white hover:bg-orange-500">Katso matka</a>
                    <a href="mailto:info@golfpassi.fi" className="rounded-xl border border-golfBlue px-4 py-3 text-center text-sm font-black text-golfBlue hover:bg-blue-50">Kysy tästä</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-black">Kenelle matkamme sopivat?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Yksin matkustavalle", "Turvallista, helppoa ja aina seuraa saatavilla."],
            ["Kaveriporukalle", "Porukalla vielä hauskempaa – me huolehdimme järjestelyistä."],
            ["Paljon pelaavalle", "Huolella valitut kentät ja sujuvat peliaikataulut."],
            ["Rennolle lomagolfarille", "Golfia sopivasti ja aikaa myös muille elämyksille."]
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-slate-100 p-6">
              <Users className="h-9 w-9 text-golfBlue" />
              <h3 className="mt-4 text-lg font-black">{title}</h3>
              <p className="mt-2 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-golfNavy to-blue-900 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white/10 p-8">
            <h2 className="text-3xl font-black">Näin matka toimii</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                ["1", "Valitse kiinnostava matka", "Löydä itsellesi sopiva kohde ja ajankohta."],
                ["2", "Tarkista vapaat paikat", "Näet varausjärjestelmässä vapaat paikat ja hinnat."],
                ["3", "Lähde matkaan", "Me hoidamme järjestelyt. Sinä keskityt peliin."]
              ].map(([num, title, text]) => (
                <div key={num}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-golfBlue text-xl font-black">{num}</div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-2 text-blue-100">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 text-golfNavy shadow-soft">
            <CircleHelp className="h-10 w-10 text-golfOrange" />
            <h2 className="mt-4 text-2xl font-black">Etkö tiedä mikä matka sopisi?</h2>
            <p className="mt-3 text-slate-600">Kysy meiltä – autamme löytämään juuri sinulle sopivan vaihtoehdon.</p>
            <div className="mt-6 grid gap-3">
              <a href="tel:+358401234567" className="inline-flex items-center justify-center gap-3 rounded-xl bg-golfOrange px-5 py-4 font-black text-white"><Phone className="h-5 w-5" /> Soita 040 123 4567</a>
              <a href="mailto:info@golfpassi.fi" className="inline-flex items-center justify-center gap-3 rounded-xl border border-golfBlue px-5 py-4 font-black text-golfBlue"><Mail className="h-5 w-5" /> Lähetä viesti</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-golfNavy py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
          <div>
            <Image src="/golfpassi-logo.png" alt="Golfpassi" width={180} height={52} className="h-10 w-auto" />
            <p className="mt-4 text-blue-100">Suomalainen golfmatkojen asiantuntija jo yli 20 vuotta.</p>
          </div>
          <div><h3 className="font-black">Pikalinkit</h3><ul className="mt-4 space-y-2 text-blue-100"><li>Matkat</li><li>Kohteet</li><li>Long stay</li><li>Kisamatkat</li></ul></div>
          <div><h3 className="font-black">Yhteystiedot</h3><ul className="mt-4 space-y-2 text-blue-100"><li>040 123 4567</li><li>info@golfpassi.fi</li><li>Ma–Pe 9–17</li></ul></div>
          <div><h3 className="font-black">Turvallinen matkanjärjestäjä</h3><p className="mt-4 text-blue-100">Suomen Kuluttajaviraston matkanjärjestäjärekisterissä.</p></div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 border-t border-white/10 px-6 pt-8 text-sm text-blue-100 md:grid-cols-4">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Turvallinen matkanjärjestäjä</span>
          <span className="flex items-center gap-2"><Headphones className="h-4 w-4" /> Suomenkielinen tuki</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Helppo ja vaivaton varaus</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4" /> Parhaat kentät ja hotellit</span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 bg-white p-3 shadow-[0_-10px_30px_rgba(0,60,112,0.15)] md:hidden">
        <a href="tel:+358401234567" className="rounded-xl bg-golfOrange py-3 text-center font-black text-white">Soita</a>
        <a href="#matkat" className="rounded-xl bg-golfNavy py-3 text-center font-black text-white">Katso matkat</a>
      </div>
    </main>
  );
}
