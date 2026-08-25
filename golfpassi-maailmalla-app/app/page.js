'use client'

import { useMemo, useState } from 'react'

const trips = [
  { leader:'Anu Alppi', place:'Fairplay', country:'Espanja', trip:'Fairplay Golf & Spa Resort', start:'2026-10-22', end:'2026-11-05', x:47, y:45 },
  { leader:'Juha-Matti Vuorinen', place:'Rio Real', country:'Espanja', trip:'Rio Real Golf & Hotel', start:'2026-10-21', end:'2026-11-18', x:49, y:42 },
  { leader:'Sonja Pakonen', place:'La Sella', country:'Espanja', trip:'Denia Marriott La Sella Golf Resort & Spa', start:'2026-10-25', end:'2026-11-01', x:52, y:40 },
  { leader:'Tatu Toivo', place:'CampoReal', country:'Portugali', trip:'Dolce CampoReal', start:'2026-10-28', end:'2026-11-04', x:45, y:41 },
  { leader:'Tomi Pund', place:'Mar Menor', country:'Espanja', trip:'Ona Mar Menor', start:'2026-10-30', end:'2026-11-06', x:52, y:45 },
  { leader:'Joel Virtanen', place:'Marrakech', country:'Marokko', trip:'Riu Tikida Palmeraie', start:'2026-11-14', end:'2026-11-21', x:48, y:53 },
  { leader:'Tero Simola', place:'La Finca', country:'Espanja', trip:'Golf & fysiikka La Finca Resort', start:'2026-11-29', end:'2026-12-06', x:52, y:44 },
  { leader:'Niklas Virta', place:'La Finca', country:'Espanja', trip:'Golf & fysiikka La Finca Resort', start:'2026-11-29', end:'2026-12-06', x:55, y:47 }
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
function initials(name) {
  return name.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase()
}
function longDate(value) {
  return new Intl.DateTimeFormat('fi-FI',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(parseDate(value))
}
function shortDate(value) {
  return new Intl.DateTimeFormat('fi-FI',{day:'numeric',month:'numeric',year:'numeric',timeZone:'UTC'}).format(parseDate(value))
}

export default function Page() {
  const [selectedDate, setSelectedDate] = useState('2026-10-24')
  const [selected, setSelected] = useState(null)
  const active = useMemo(()=>trips.filter(t=>selectedDate>=t.start && selectedDate<=t.end),[selectedDate])
  const days = useMemo(()=>Array.from({length:11},(_,i)=>addDays(selectedDate,i-5)),[selectedDate])

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
        <div className="date">{longDate(selectedDate)}</div>
      </header>

      <section className="map">
        <div className="world" aria-hidden="true">
          <div className="land americas"/><div className="land eurasia"/><div className="land africa"/><div className="land australia"/><div className="land greenland"/>
        </div>
        <div className="live"><span className="liveDot"/>{active.length} {active.length===1?'matkanvetäjä':'matkanvetäjää'} maailmalla</div>
        {active.length===0 ? <div className="empty">Tänä päivänä kartalla ei ole matkanvetäjiä.</div> : null}
        {active.map((t,i)=>(
          <button key={`${t.leader}-${t.start}`} className="marker" style={{left:`${t.x+i*.8}%`,top:`${t.y+i*1.1}%`}} onClick={()=>setSelected(t)}>
            <span className="avatar">{initials(t.leader)}</span>
            <span><strong>{t.leader}</strong><small>{t.place}</small></span>
          </button>
        ))}
        {selected ? (
          <aside className="detail">
            <button className="close" onClick={()=>setSelected(null)} aria-label="Sulje">×</button>
            <div className="detailAvatar">{initials(selected.leader)}</div>
            <h2>{selected.leader}</h2>
            <div className="detailPlace">{selected.place}, {selected.country}</div>
            <div className="trip">{selected.trip}</div>
            <div className="period">{shortDate(selected.start)} – {shortDate(selected.end)}</div>
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
