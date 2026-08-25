// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'

const trips = [
  { leader:'Harri Aho', place:'Le National, Pariisi', country:'Ranska', trip:'Le National - Pariisi', start:'2026-09-11', end:'2026-09-13', x:50.56, y:25.43, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/harri-aho/' },
  { leader:'Joel Virtanen', place:'St Andrews', country:'Skotlanti', trip:'St Andrews - Links Life by Golfpassi', start:'2026-09-18', end:'2026-09-21', x:49.37, y:20.72, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/joel-virtanen/' },
  { leader:'Petri Tamminen', place:'Pirin Golf', country:'Bulgaria', trip:'Pirin Golf & Country Club', start:'2026-09-26', end:'2026-10-03', x:55.82, y:29.98, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/petri-tamminen/' },
  { leader:'Juha-Matti Vuorinen', place:'Costa Navarino', country:'Kreikka', trip:'The Westin Costa Navarino', start:'2026-09-27', end:'2026-10-11', x:55.51, y:33.17, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-matti-vuorinen/' },
  { leader:'Harri Aho', place:'Costa Navarino', country:'Kreikka', trip:'The Westin Costa Navarino', start:'2026-10-11', end:'2026-10-25', x:55.51, y:33.17, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/harri-aho/' },
  { leader:'Harri Thil', place:'Infinitum', country:'Espanja', trip:'Hotel Blaumar & Infinitum Golf', start:'2026-10-16', end:'2026-10-23', x:50.29, y:30.47, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/harri-thil/' },
  { leader:'Matti Eve', place:'Belek', country:'Turkki', trip:'Sirene Golf - Belek', start:'2026-10-17', end:'2026-10-31', x:57.89, y:33.24, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/matti-eve/' },
  { leader:'Juha-Matti Vuorinen', place:'Rio Real', country:'Espanja', trip:'Rio Real Golf & Hotel', start:'2026-10-21', end:'2026-11-18', x:48.77, y:33.46, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-matti-vuorinen/' },
  { leader:'Anu Alppi', place:'Fairplay', country:'Espanja', trip:'Fairplay Golf & Spa Resort', start:'2026-10-22', end:'2026-11-05', x:48.52, y:33.58, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/anu-alppi/' },
  { leader:'Sonja Pakonen', place:'La Sella', country:'Espanja', trip:'Denia Marriott La Sella Golf Resort & Spa', start:'2026-10-25', end:'2026-11-01', x:50.02, y:31.96, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/sonja-pakonen/' },
  { leader:'Mikko Valtonen', place:'Montecastillo', country:'Espanja', trip:'Barceló Montecastillo Golf & Sport Resort', start:'2026-10-27', end:'2026-11-03', x:48.47, y:33.34, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/kim-kujala-2/' },
  { leader:'Tatu Toivo', place:'CampoReal', country:'Portugali', trip:'Dolce CampoReal', start:'2026-10-28', end:'2026-11-04', x:47.68, y:31.81, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tatu-toivo/' },
  { leader:'Tomi Pund', place:'Mar Menor', country:'Espanja', trip:'Ona Mar Menor', start:'2026-10-30', end:'2026-11-06', x:49.77, y:32.66, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tomi-pund/' },
  { leader:'Juha Nuutti', place:'Calahonda', country:'Espanja', trip:'Long Stay - Doña Lola', start:'2026-11-01', end:'2026-11-29', x:48.80, y:33.48, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-nuutti/' },
  { leader:'Markku Hietanen', place:'Montecastillo', country:'Espanja', trip:'Barceló Montecastillo Golf & Sport Resort', start:'2026-11-05', end:'2026-11-12', x:48.47, y:33.34, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/markku-hietanen/' },
  { leader:'Tommi Nousiainen', place:'Aroeira', country:'Portugali', trip:'Aroeira Lisbon Hotel - Sea & Golf', start:'2026-11-06', end:'2026-11-13', x:47.68, y:32.11, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tommi-nousiainen/' },
  { leader:'Juha-Matti Vuorinen', place:'Mauritius', country:'Mauritius', trip:'Tamarina Golf & Spa Boutique Hotel', start:'2026-11-11', end:'2026-11-24', x:65.30, y:70.89, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-matti-vuorinen/' },
  { leader:'Joel Virtanen', place:'Marrakech', country:'Marokko', trip:'Riu Tikida Palmeraie', start:'2026-11-14', end:'2026-11-21', x:47.93, y:36.68, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/joel-virtanen/' },
  { leader:'Tero Simola', place:'La Finca', country:'Espanja', trip:'Golf & fysiikka La Finca Resort', start:'2026-11-29', end:'2026-12-06', x:49.80, y:32.45, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tero-simola/' },
  { leader:'Niklas Virta', place:'La Finca', country:'Espanja', trip:'Golf & fysiikka La Finca Resort', start:'2026-11-29', end:'2026-12-06', x:49.80, y:32.45, profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/niklas-virta/' }
]

function parseDate(value) {
  const [y,m,d] = value.split('-').map(Number)
  return new Date(Date.UTC(y,m-1,d))
}
function toIso(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`
}
function addDays(value, days) {
  const date = parseDate(value)
  date.setUTCDate(date.getUTCDate()+days)
  return toIso(date)
}
function todayInHelsinki() {
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Helsinki',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date())
  const get = type => parts.find(p=>p.type===type)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}
function initials(name) {
  return name.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase()
}
function longDate(value) {
  return new Intl.DateTimeFormat('fi-FI',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(parseDate(value))
}
function shortDate(value) {
  return new Intl.DateTimeFormat('fi-FI',{day:'numeric',month:'numeric',year:'numeric',timeZone:'UTC'}).format(parseDate(value))
}
function markerOffset(items,index) {
  const current = items[index]
  let nearby = 0
  for (let i=0;i<index;i++) {
    const prev = items[i]
    if (Math.abs(prev.x-current.x)<3.2 && Math.abs(prev.y-current.y)<3.2) nearby++
  }
  const offsets = [
    [0,0],[4.0,-4.2],[-4.3,4.4],[4.6,4.5],[-4.6,-4.5],[0,7.5],[0,-7.5]
  ]
  const [dx,dy] = offsets[nearby % offsets.length]
  return { x: current.x+dx, y: current.y+dy }
}

export default function Page() {
  const today = todayInHelsinki()
  const [selectedDate, setSelectedDate] = useState(today)
  const [selected, setSelected] = useState(null)
  const active = useMemo(()=>trips.filter(t=>selectedDate>=t.start && selectedDate<=t.end),[selectedDate])
  const days = useMemo(()=>Array.from({length:11},(_,i)=>addDays(selectedDate,i-5)),[selectedDate])
  const nextActive = useMemo(()=>trips.map(t=>t.start).filter(date=>date>selectedDate).sort()[0] || null,[selectedDate])

  function chooseDate(date) {
    setSelectedDate(date)
    setSelected(null)
  }

  return (
    <main className="app">
      <header className="top">
        <div className="brand">
          <div className="logo">G</div>
          <div>
            <div className="eyebrow">Golfpassi</div>
            <h1>Maailmalla</h1>
          </div>
        </div>
        <div className="dateBlock">
          {selectedDate!==today ? <button className="todayButton" onClick={()=>chooseDate(today)}>Tänään</button> : null}
          <div className="date">{longDate(selectedDate)}</div>
        </div>
      </header>

      <section className="map">
        <div className="world" aria-hidden="true" />
        <div className="live"><span className="liveDot"/>{active.length} {active.length===1?'matkanvetäjä':'matkanvetäjää'} maailmalla</div>
        {active.length===0 ? (
          <div className="empty">
            <strong>Ei matkanvetäjiä maailmalla {selectedDate===today?'tänään':'tänä päivänä'}.</strong>
            {nextActive ? <button onClick={()=>chooseDate(nextActive)}>Seuraava aktiivinen päivä · {shortDate(nextActive)} →</button> : null}
          </div>
        ) : null}
        {active.map((t,i)=>{
          const pos = markerOffset(active,i)
          return (
            <button key={`${t.leader}-${t.start}-${t.place}`} className="marker" style={{left:`${pos.x}%`,top:`${pos.y}%`}} onClick={()=>setSelected(t)}>
              <span className="avatar">{initials(t.leader)}</span>
              <span className="markerLabel"><strong>{t.leader}</strong><small>{t.place}</small></span>
            </button>
          )
        })}
        {selected ? (
          <aside className="detail">
            <button className="close" onClick={()=>setSelected(null)} aria-label="Sulje">×</button>
            <div className="detailAvatar">{initials(selected.leader)}</div>
            <h2>{selected.leader}</h2>
            <div className="detailPlace">{selected.place}, {selected.country}</div>
            <div className="trip">{selected.trip}</div>
            <div className="period">{shortDate(selected.start)} – {shortDate(selected.end)}</div>
            <a className="profileLink" href={selected.profile} target="_blank" rel="noreferrer">Golfpassin profiili ↗</a>
          </aside>
        ) : null}
      </section>

      <div className="nav">
        <button className="arrow" onClick={()=>chooseDate(addDays(selectedDate,-7))}>←</button>
        <div className="days">
          {days.map(date=>{
            const d=parseDate(date)
            const has=trips.some(t=>date>=t.start&&date<=t.end)
            return <button key={date} className={`day ${date===selectedDate?'active':''} ${has?'has':''}`} onClick={()=>chooseDate(date)}>
              <span>{new Intl.DateTimeFormat('fi-FI',{weekday:'short',timeZone:'UTC'}).format(d)}</span>
              <b>{d.getUTCDate()}</b><i/>
            </button>
          })}
        </div>
        <button className="arrow" onClick={()=>chooseDate(addDays(selectedDate,7))}>→</button>
      </div>
      <p className="caption">Klikkaa ihmistä. Ei raportteja – vain kuka on missä.</p>
    </main>
  )
}
