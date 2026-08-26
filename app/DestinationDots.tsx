'use client'

import { useEffect } from 'react'

type Destination={id:string;place:string;country:string;lat:number;lon:number;accuracy:'exact'|'country';tripCount:number}

export default function DestinationDots(){
  useEffect(()=>{
    const map=document.querySelector<HTMLElement>('.map')
    if(!map)return
    const controller=new AbortController()
    let nodes:HTMLElement[]=[]

    fetch('/api/destinations',{cache:'no-store',signal:controller.signal})
      .then(async response=>{if(!response.ok)throw new Error('destination sync unavailable');return response.json()})
      .then(payload=>{
        if(!Array.isArray(payload.destinations))return
        const fragment=document.createDocumentFragment()
        nodes=payload.destinations.map((d:Destination)=>{
          const button=document.createElement('button')
          button.type='button'
          button.className=`destinationDot ${d.accuracy==='exact'?'exact':'approximate'}`
          button.style.left='50%'
          button.style.top='50%'
          button.style.visibility='hidden'
          button.dataset.lat=String(d.lat)
          button.dataset.lon=String(d.lon)
          button.dataset.place=d.place
          button.dataset.country=d.country
          button.dataset.label=`${d.place}, ${d.country}`
          button.setAttribute('aria-label',`Golfpassin kohde: ${d.place}, ${d.country}`)
          button.title=`${d.place}, ${d.country}`
          const label=document.createElement('span')
          label.className='destinationDotLabel'
          label.textContent=d.place
          button.appendChild(label)
          button.addEventListener('click',event=>{
            event.stopPropagation()
            map.querySelectorAll('.destinationDot.isSelected').forEach(el=>{if(el!==button)el.classList.remove('isSelected')})
            button.classList.toggle('isSelected')
          })
          fragment.appendChild(button)
          return button
        })
        map.appendChild(fragment)

        const legend=document.createElement('div')
        legend.className='destinationLegend'
        legend.innerHTML=`<span class="destinationLegendDot"></span>${payload.destinations.length} Golfpassin kohdetta`
        map.appendChild(legend)
        nodes.push(legend)
      })
      .catch(error=>{if(error?.name!=='AbortError')console.warn('Destination dots unavailable',error)})

    const clearSelection=(event:MouseEvent)=>{
      if((event.target as HTMLElement).closest('.destinationDot'))return
      map.querySelectorAll('.destinationDot.isSelected').forEach(el=>el.classList.remove('isSelected'))
    }
    map.addEventListener('click',clearSelection)

    return()=>{
      controller.abort()
      map.removeEventListener('click',clearSelection)
      nodes.forEach(node=>node.remove())
    }
  },[])
  return null
}
