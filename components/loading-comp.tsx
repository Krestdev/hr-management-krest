import React from 'react'
import { FlipWords } from './flip-words'

function LoadingComponent() {
  return (
    <div className="w-full min-h-[60vh] py-10 sm:py-14 lg:py-24 flex items-center justify-center">
        <span className="text-[clamp(14px,2vw,18px)] font-light uppercase text-center text-slate-900">
            {"Chargement des "}<FlipWords words={["données", "variables", "médias", "particules"]}/>
        </span>
    </div>
  )
}

export default LoadingComponent