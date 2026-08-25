// @ts-nocheck
'use client'

import { useEffect, useMemo, useState } from 'react'

const fallback = [
  { id:'harri-paris',leader:'Harri Aho',place:'Le National, Pariisi',country:'Ranska',trip:'Le National - Pariisi',start:'2026-09-11',end:'2026-09-13',lat:48.75,lon:2.08,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/harri-aho/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'joel-sta',leader:'Joel Virtanen',place:'St Andrews',country:'Skotlanti',trip:'St Andrews - Links Life by Golfpassi',start:'2026-09-18',end:'2026-09-21',lat:56.34,lon:-2.80,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/joel-virtanen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'petri-pirin',leader:'Petri Tamminen',place:'Pirin Golf',country:'Bulgaria',trip:'Pirin Golf & Country Club',start:'2026-09-26',end:'2026-10-03',lat:41.83,lon:23.48,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/petri-tamminen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'juhis-nav',leader:'Juha-Matti Vuorinen',place:'Costa Navarino',country:'Kreikka',trip:'The Westin Costa Navarino',start:'2026-09-27',end:'2026-10-11',lat:36.96,lon:21.70,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-matti-vuorinen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'harri-nav',leader:'Harri Aho',place:'Costa Navarino',country:'Kreikka',trip:'The Westin Costa Navarino',start:'2026-10-11',end:'2026-10-25',lat:36.96,lon:21.70,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/harri-aho/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'thil-infinitum',leader:'Harri Thil',place:'Infinitum',country:'Espanja',trip:'Hotel Blaumar & Infinitum Golf',start:'2026-10-16',end:'2026-10-23',lat:41.08,lon:1.16,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/harri-thil/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'eve-belek',leader:'Matti Eve',place:'Belek',country:'Turkki',trip:'Sirene Golf - Belek',start:'2026-10-17',end:'2026-10-31',lat:36.86,lon:31.05,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/matti-eve/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'juhis-rio',leader:'Juha-Matti Vuorinen',place:'Rio Real',country:'Espanja',trip:'Rio Real Golf & Hotel',start:'2026-10-21',end:'2026-11-18',lat:36.52,lon:-4.84,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-matti-vuorinen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'anu-fairplay',leader:'Anu Alppi',place:'Fairplay',country:'Espanja',trip:'Fairplay Golf & Spa Resort',start:'2026-10-22',end:'2026-11-05',lat:36.34,lon:-5.81,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/anu-alppi/',tripUrl:'https://golfpassi.fi/pelimatkat/espanja/fairplay-golf-spa-resort-14-vrk-anu-alppi-22-10-2026/',imageUrl:null },
  { id:'sonja-lasella',leader:'Sonja Pakonen',place:'La Sella',country:'Espanja',trip:'Denia Marriott La Sella Golf Resort & Spa',start:'2026-10-25',end:'2026-11-01',lat:38.80,lon:0.07,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/sonja-pakonen/',tripUrl:'https://golfpassi.fi/kurssimatkat/espanja/marriott-la-sella-resort-denia-pro-pakonen/',imageUrl:null },
  { id:'tatu-campo',leader:'Tatu Toivo',place:'CampoReal',country:'Portugali',trip:'Dolce CampoReal',start:'2026-10-28',end:'2026-11-04',lat:39.04,lon:-9.24,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tatu-toivo/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'tomi-mar',leader:'Tomi Pund',place:'Mar Menor',country:'Espanja',trip:'Ona Mar Menor',start:'2026-10-30',end:'2026-11-06',lat:37.74,lon:-0.91,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tomi-pund/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'tommi-aroeira',leader:'Tommi Nousiainen',place:'Aroeira',country:'Portugali',trip:'Aroeira Lisbon Hotel - Sea & Golf',start:'2026-11-06',end:'2026-11-13',lat:38.58,lon:-9.19,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tommi-nousiainen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'juhis-mauritius',leader:'Juha-Matti Vuorinen',place:'Mauritius',country:'Mauritius',trip:'Tamarina Golf & Spa Boutique Hotel',start:'2026-11-11',end:'2026-11-24',lat:-20.28,lon:57.38,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/juha-matti-vuorinen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'joel-marrakech',leader:'Joel Virtanen',place:'Marrakech',country:'Marokko',trip:'Riu Tikida Palmeraie',start:'2026-11-14',end:'2026-11-21',lat:31.63,lon:-8.00,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/joel-virtanen/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'tero-finca',leader:'Tero Simola',place:'La Finca',country:'Espanja',trip:'Golf & fysiikka La Finca Resort',start:'2026-11-29',end:'2026-12-06',lat:38.06,lon:-0.80,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/tero-simola/',tripUrl:'https://golfpassi.fi/',imageUrl:null },
  { id:'niklas-finca',leader:'Niklas Virta',place:'La Finca',country:'Espanja',trip:'Golf & fysiikka La Finca Resort',start:'2026-11-29',end:'2026-12-06',lat:38.06,lon:-0.80,profile:'https://golfpassi.fi/hyva-tietaa/matkanjohtajat/niklas-virta/',tripUrl:'https://golfpassi.fi/',imageUrl:null }
]

function parseDate(value) { const [y,m,d]=value.split('-').map(Number); return new Date(Date.UTC(y,m-1,d)) }
function toIso(date) { return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}` }
function addDays(value,days) { const date=parseDate(value); date.setUTCDate(date.getUTCDate()+days); return toIso(date) }
function todayInHelsinki() {
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Helsinki',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date())
  const get=type=>parts.find(p=>p.type===type)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}
function initials(name) { return name.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase() }
function longDate(value) { return new Intl.DateTimeFormat('fi-FI',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(parseDate(value)) }
function shortDate(value) { return new Intl.DateTimeFormat('fi-FI',{day:'numeric',month:'numeric',year:'numeric',timeZone:'UTC'}).format(parseDate(value)) }
function mapPoint(item) {
  const x=Math.max(3,Math.min(97,(item.lon+180)/360*100))
  const y=Math.max(6,Math.min(92,56.7-(item.lat*0.637)))
  return {x,y}
}
function markerOffset(items,index) {
  const current=mapPoint(items[index]); let nearby=0
  for(let i=0;i<index;i++){ const prev=mapPoint(items[i]); if(Math.abs(prev.x-current.x)<3.4&&Math.abs(prev.y-current.y)<4.2) nearby++ }
  const offsets=[[0,0],[4.0,-4.4],[-4.2,4.6],[4.5,4.8],[-4.5,-4.6],[0,8],[0,-8]]
  const [dx,dy]=offsets[nearby%offsets.length]
  return {x:current.x+dx,y:current.y+dy}
}
function avatarUrl(item) { return item.imageUrl ? `/api/avatar?url=${encodeURIComponent(item.imageUrl)}` : null }

export default function Page() {
  const today=todayInHelsinki()
  const [assignments,setAssignments]=useState(fallback)
  const [selectedDate,setSelectedDate]=useState(today)
  const [selected,setSelected]=useState(null)
  const [dataMode,setDataMode]=useState('loading')
  const [updatedAt,setUpdatedAt]=useState(null)

  useEffect(()=>{
    let cancelled=false
    fetch('/api/data',{cache:'no-store'})
      .then(async response=>{
        if(!response.ok) throw new Error('sync unavailable')
        return response.json()
      })
      .then(payload=>{
        if(cancelled||!Array.isArray(payload.assignments)||payload.assignments.length===0) return
        setAssignments(payload.assignments)
        setDataMode('live')
        setUpdatedAt(payload.updatedAt||null)
      })
      .catch(()=>{ if(!cancelled) setDataMode('fallback') })
    return ()=>{ cancelled=true }
  },[])

  const active=useMemo(()=>assignments.filter(t=>selectedDate>=t.start&&selectedDate<=t.end),[assignments,selectedDate])
  const days=useMemo(()=>Array.from({length:11},(_,i)=>addDays(selectedDate,i-5)),[selectedDate])
  const nextActive=useMemo(()=>assignments.map(t=>t.start).filter(date=>date>selectedDate).sort()[0]||null,[assignments,selectedDate])

  function chooseDate(date){ setSelectedDate(date); setSelected(null) }

  return (
    <main className="app">
      <header className="top">
        <div className="brand"><div className="logo">G</div><div><div className="eyebrow">Golfpassi</div><h1>Maailmalla</h1></div></div>
        <div className="dateBlock">{selectedDate!==today?<button className="todayButton" onClick={()=>chooseDate(today)}>Tänään</button>:null}<div className="date">{longDate(selectedDate)}</div></div>
      </header>

      <section className="map">
        <div className="world" aria-hidden="true" />
        <div className="live"><span className="liveDot"/>{active.length} {active.length===1?'matkanvetäjä':'matkanvetäjää'} maailmalla</div>
        {active.length===0 ? <div className="empty"><strong>Ei matkanvetäjiä maailmalla {selectedDate===today?'tänään':'tänä päivänä'}.</strong>{nextActive?<button onClick={()=>chooseDate(nextActive)}>Seuraava aktiivinen päivä · {shortDate(nextActive)} →</button>:null}</div>:null}

        {active.map((t,i)=>{
          const pos=markerOffset(active,i), avatar=avatarUrl(t)
          return <button key={t.id||`${t.leader}-${t.start}-${t.place}`} className="marker" style={{left:`${pos.x}%`,top:`${pos.y}%`}} onClick={()=>setSelected(t)}>
            <span className="avatar">{avatar?<img src={avatar} alt="" onError={e=>{e.currentTarget.style.display='none'}}/>:null}<span className="avatarFallback">{initials(t.leader)}</span></span>
            <span className="markerLabel"><strong>{t.leader}</strong><small>{t.place}</small></span>
          </button>
        })}

        {selected ? <aside className="detail">
          <button className="close" onClick={()=>setSelected(null)} aria-label="Sulje">×</button>
          <div className="detailAvatar">{avatarUrl(selected)?<img src={avatarUrl(selected)} alt=""/>:<span>{initials(selected.leader)}</span>}</div>
          <h2>{selected.leader}</h2><div className="detailPlace">{selected.place}, {selected.country}</div>
          <div className="trip">{selected.trip}</div><div className="period">{shortDate(selected.start)} – {shortDate(selected.end)}</div>
          <div className="detailLinks"><a className="profileLink" href={selected.tripUrl||selected.profile} target="_blank" rel="noreferrer">Katso matka ↗</a><a className="profileLink secondary" href={selected.profile} target="_blank" rel="noreferrer">Matkanvetäjä ↗</a></div>
        </aside>:null}
      </section>

      <div className="nav"><button className="arrow" onClick={()=>chooseDate(addDays(selectedDate,-7))}>←</button><div className="days">{days.map(date=>{const d=parseDate(date),has=assignments.some(t=>date>=t.start&&date<=t.end);return <button key={date} className={`day ${date===selectedDate?'active':''} ${has?'has':''}`} onClick={()=>chooseDate(date)}><span>{new Intl.DateTimeFormat('fi-FI',{weekday:'short',timeZone:'UTC'}).format(d)}</span><b>{d.getUTCDate()}</b><i/></button>})}</div><button className="arrow" onClick={()=>chooseDate(addDays(selectedDate,7))}>→</button></div>
      <p className="caption">Klikkaa ihmistä. Ei raportteja – vain kuka on missä. <span className={`dataState ${dataMode}`}>{dataMode==='live'?'● Golfpassi.fi live':dataMode==='loading'?'○ Päivitetään…':'○ Varadata käytössä'}</span></p>
    </main>
  )
}
