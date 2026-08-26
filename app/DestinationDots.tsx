'use client'

import { useEffect } from 'react'

type Destination={id:string;place:string;country:string;lat:number;lon:number;accuracy:'exact'|'country';tripCount:number}

function point(lat:number,lon:number){
  const x=Math.max(3,Math.min(97,(lon+180)/360*100))
  const y=Math.max(6,Math.min(92,56.7-(lat*0.637)))
  return {x,y}
}

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
          const pos=point(d.lat,d.lon)
          const button=document.createElement('button')
          button.type='button'
          button.className=`destinationDot ${d.accuracy==='exact'?'exact':'approximate'}`
          button.style.left=`${pos.x}%`
          button.style.top=`${pos.y}%`
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
