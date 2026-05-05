import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Flag,
  Headphones,
  Mail,
  MapPin,
  Palmtree,
  Phone,
  ShieldCheck,
  Star,
  Sun,
  Trophy,
  Users,
} from "lucide-react";

const trips = [
  {
    title: "Korineum Golf Resort",
    location: "Pohjois-Kypros",
    date: "28.9.2026",
    price: "1 195 €",
    image:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop",
    reason: "Kenttä hotellin vieressä – helppo valinta, kun haluat pelata paljon ilman säätöä.",
  },
  {
    title: "Costa del Sol, La Cala",
    location: "Espanja",
    date: "20.10.2026",
    price: "1 345 €",
    image:
      "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop",
    reason: "Aurinkoa, laadukkaita kenttiä ja sujuva golfarki valmiiksi paketoituna.",
  },
  {
    title: "Long stay Kypros",
    location: "Kypros",
    date: "28 vrk",
    price: "2 690 €",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    reason: "Pidempi golfjakso lämpimässä – aikaa pelille, palautumiselle ja lomalle.",
  },
];

const tripTypes = [
  { title: "Syksyn golfmatkat", subtitle: "Jatka kautta lämpimässä", icon: Sun },
  { title: "Talven long stay", subtitle: "Enemmän aikaa pelille", icon: Palmtree },
  { title: "Kisamatkat", subtitle: "Kun peliin saa tulla panosta", icon: Trophy },
  { title: "Helppo matka yksin", subtitle: "Seuraa ja tuki mukana", icon: Users },
];

const benefits = [
  {
    title: "Kaikki järjestetty valmiiksi",
    text: "Lennot, majoitus, golf ja kuljetukset – kokonaisuus on mietitty puolestasi.",
    icon: CheckCircle2,
  },
  {
    title: "Et tarvitse vuokra-autoa",
    text: "Valitsemme kohteita, joissa golfarki toimii helposti ilman omaa autoa.",
    icon: Car,
  },
  {
    title: "Kentät ja aikataulut suunniteltu",
    text: "Peliaikataulut, siirtymät ja kohteet rakennetaan sujuvaa matkaa varten.",
    icon: Flag,
  },
  {
    title: "Tuki suomeksi koko matkan ajan",
    text: "Saat apua ennen matkaa, matkan aikana ja sen jälkeen.",
    icon: Headphones,
  },
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
    <main className="min-h-screen bg-[#f6f9fc] text-[#003c70]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/50 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10">
          <a href="#" aria-label="Golfpassi etusivu">
            <Image
              src="/golfpassi-logo.png"
              alt="Golfpassi"
              width={230}
              height={64}
              priority
              className="h-11 w-auto object-contain"
            />
          </a>

          <nav className="hidden items-center gap-8 text-[15px] font-extrabold tracking-tight lg:flex">
            {["Matkat", "Kohteet", "Long stay", "Kisamatkat", "Artikkelit", "Tietoa meistä"].map(
              (item) => (
                <a key={item} href="#" className="hover:text-[#00aaff]">
                  {item}
                </a>
              )
            )}
          </nav>

          <a
            href="tel:+358401234567"
            className="hidden items-center gap-3 rounded-full px-4 py-2 text-sm font-black text-[#00aaff] hover:bg-blue-50 md:flex"
          >
            <Phone className="h-6 w-6" />
            <span>
              040 123 4567
              <small className="block text-xs font-semibold text-slate-500">
                Soita ja kysy lisää.
              </small>
            </span>
          </a>
        </div>
      </header>

      <section className="relative min-h-[790px] overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2400&auto=format&fit=crop"
            alt="Golfmatka Välimeren kentällä"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/82 to-white/8" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003c70]/20 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] items-center px-6 md:px-10">
          <div className="max-w-[770px]">
            <p className="mb-6 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black uppercase tracking-wide text-[#ff8200] shadow-sm backdrop-blur">
              Golfmatkat helposti
            </p>

            <h1 className="text-[48px] font-black leading-[0.98] tracking-[-0.04em] text-[#003c70] md:text-[78px]">
              Helpoin tapa lähteä golfmatkalle
            </h1>

            <p className="mt-7 max-w-[680px] text-[21px] font-bold leading-[1.35] text-slate-700 md:text-[27px]">
              Kaikki on valmiina – lennot, hotelli, golf ja kuljetukset.
              Sinä keskityt peliin.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#matkat"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#ff8200] px-9 py-5 text-lg font-black text-white shadow-card hover:-translate-y-0.5 hover:bg-orange-500"
              >
                Katso matkat <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="tel:+358401234567"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-[#003c70] bg-white/85 px-9 py-5 text-lg font-black text-[#003c70] shadow-sm backdrop-blur hover:bg-[#003c70] hover:text-white"
              >
                <Phone className="h-5 w-5" /> Soita ja kysy lisää
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm font-black text-[#003c70]">
              {["Ei vuokra-autoa", "Kentät lähellä", "Sujuva kokonaisuus"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/90 px-4 py-2 shadow-sm backdrop-blur"
                  >
                    ✓ {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-24 mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="rounded-[30px] bg-white p-7 shadow-card">
          <h2 className="mb-7 text-center text-3xl font-black tracking-tight">
            Minkälaista matkaa etsit?
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {tripTypes.map((type) => {
              const Icon = type.icon;
              return (
                <a
                  key={type.title}
                  href="#matkat"
                  className="group flex min-h-[136px] items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:border-[#00aaff] hover:shadow-card"
                >
                  <span className="flex items-center gap-4">
                    <Icon className="h-12 w-12 text-[#ff8200]" />
                    <span>
                      <strong className="block text-lg leading-tight">
                        {type.title}
                      </strong>
                      <small className="mt-1 block text-sm font-semibold text-slate-500">
                        {type.subtitle}
                      </small>
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-[#00aaff] group-hover:translate-x-1" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <h2 className="text-center text-4xl font-black tracking-tight">
          Helpoin tapa lähteä golfmatkalle
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-[28px] bg-white p-8 shadow-sm">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-8 w-8 text-[#00aaff]" />
                </div>
                <h3 className="text-xl font-black leading-tight">{benefit.title}</h3>
                <p className="mt-4 leading-relaxed text-slate-600">
                  {benefit.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="matkat" className="bg-white py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight">
                Näistä kannattaa aloittaa
              </h2>
              <p className="mt-3 max-w-2xl text-lg font-medium text-slate-600">
                Suositellut matkat juuri nyt – valittu helppouden, ajankohdan ja
                pelattavuuden perusteella.
              </p>
            </div>
            <a href="#" className="hidden font-black text-[#00aaff] md:block">
              Katso kaikki matkat →
            </a>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {trips.map((trip) => (
              <article
                key={trip.title}
                className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-slate-100"
              >
                <div className="relative h-64">
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-2xl font-black leading-tight">{trip.title}</h3>
                      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <MapPin className="h-4 w-4" /> {trip.location}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <CalendarDays className="h-4 w-4" /> {trip.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <small className="text-sm font-semibold text-slate-500">
                        alkaen
                      </small>
                      <p className="text-3xl font-black tracking-tight">
                        {trip.price}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 min-h-[72px] leading-relaxed text-slate-600">
                    {trip.reason}
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <a
                      href="#"
                      className="rounded-xl bg-[#ff8200] px-4 py-4 text-center text-sm font-black text-white hover:bg-orange-500"
                    >
                      Katso matka
                    </a>
                    <a
                      href="mailto:info@golfpassi.fi"
                      className="rounded-xl border-2 border-[#00aaff] px-4 py-4 text-center text-sm font-black text-[#003c70] hover:bg-blue-50"
                    >
                      Kysy tästä
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <h2 className="text-center text-4xl font-black tracking-tight">
          Kenelle matkamme sopivat?
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            ["Yksin matkustavalle", "Turvallista, helppoa ja aina seuraa saatavilla."],
            ["Kaveriporukalle", "Porukalla vielä hauskempaa – me huolehdimme järjestelyistä."],
            ["Paljon pelaavalle", "Huolella valitut kentät ja sujuvat peliaikataulut."],
            ["Rennolle lomagolfarille", "Golfia sopivasti ja aikaa myös muille elämyksille."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <Users className="h-10 w-10 text-[#00aaff]" />
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#003c70] py-20 text-white">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-6 md:px-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] bg-white/10 p-9">
            <h2 className="text-4xl font-black tracking-tight">Näin matka toimii</h2>

            <div className="mt-10 grid gap-7 md:grid-cols-3">
              {[
                ["1", "Valitse kiinnostava matka", "Löydä itsellesi sopiva kohde ja ajankohta."],
                ["2", "Tarkista vapaat paikat", "Näet varausjärjestelmässä vapaat paikat ja hinnat."],
                ["3", "Lähde matkaan", "Me hoidamme järjestelyt. Sinä keskityt peliin."],
              ].map(([num, title, text]) => (
                <div key={num}>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#00aaff] text-2xl font-black">
                    {num}
                  </div>
                  <h3 className="text-lg font-black">{title}</h3>
                  <p className="mt-3 text-blue-100">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-9 text-[#003c70] shadow-card">
            <h2 className="text-3xl font-black leading-tight">
              Etkö tiedä mikä matka sopisi?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Kysy meiltä – autamme löytämään juuri sinulle sopivan vaihtoehdon.
            </p>

            <div className="mt-8 grid gap-4">
              <a
                href="tel:+358401234567"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#ff8200] px-6 py-5 font-black text-white"
              >
                <Phone className="h-5 w-5" /> Soita 040 123 4567
              </a>
              <a
                href="mailto:info@golfpassi.fi"
                className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-[#00aaff] px-6 py-5 font-black text-[#003c70]"
              >
                <Mail className="h-5 w-5" /> Lähetä viesti
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#002f57] py-16 text-white">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 md:grid-cols-4 md:px-10">
          <div>
            <Image
              src="/golfpassi-logo.png"
              alt="Golfpassi"
              width={190}
              height={54}
              className="h-11 w-auto"
            />
            <p className="mt-5 text-blue-100">
              Suomalainen golfmatkojen asiantuntija jo yli 20 vuotta.
            </p>
          </div>

          <div>
            <h3 className="font-black">Pikalinkit</h3>
            <ul className="mt-4 space-y-2 text-blue-100">
              <li>Matkat</li>
              <li>Kohteet</li>
              <li>Long stay</li>
              <li>Kisamatkat</li>
            </ul>
          </div>

          <div>
            <h3 className="font-black">Yhteystiedot</h3>
            <ul className="mt-4 space-y-2 text-blue-100">
              <li>040 123 4567</li>
              <li>info@golfpassi.fi</li>
              <li>Ma–Pe 9–17</li>
            </ul>
          </div>

          <div>
            <h3 className="font-black">Turvallinen matkanjärjestäjä</h3>
            <p className="mt-4 text-blue-100">
              Suomen Kuluttajaviraston matkanjärjestäjärekisterissä.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1320px] gap-4 border-t border-white/10 px-6 pt-8 text-sm text-blue-100 md:grid-cols-4 md:px-10">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Turvallinen matkanjärjestäjä
          </span>
          <span className="flex items-center gap-2">
            <Headphones className="h-4 w-4" /> Suomenkielinen tuki
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Helppo ja vaivaton varaus
          </span>
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4" /> Parhaat kentät ja hotellit
          </span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 bg-white p-3 shadow-[0_-10px_30px_rgba(0,60,112,0.15)] md:hidden">
        <a
          href="tel:+358401234567"
          className="rounded-xl bg-[#ff8200] py-3 text-center font-black text-white"
        >
          Soita
        </a>
        <a
          href="#matkat"
          className="rounded-xl bg-[#003c70] py-3 text-center font-black text-white"
        >
          Katso matkat
        </a>
      </div>
    </main>
  );
}
