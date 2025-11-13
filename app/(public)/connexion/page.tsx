import React from 'react'
import LoginForm from './loginForm'
import Logo from '@/components/logo'
import { ExternalLink } from 'lucide-react'
import OnViewAnimation from '@/components/onViewAnimation'

function Page() {
  return (
    <div>
      <section className="w-full min-h-[calc(100dvh-60px)] bg-background px-5 py-10 flex flex-col justify-center gap-5 sm:py-16 sm:gap-7 md:px-5">
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-none md:rounded-2xl border-0 md:border overflow-hidden">
          {/**Login form */}
          <div className="w-full h-full py-10 px-5 flex flex-col gap-5 items-center justify-center">
            <OnViewAnimation animation="slideLeft" duration={0.75} delay={0.2}>
              <h1 className="text-center">{"Connexion"}</h1>
            </OnViewAnimation> 
            <LoginForm/>
            <OnViewAnimation animation="popIn" duration={0.75} delay={0.4} className="mt-7">
              <Logo/>
            </OnViewAnimation>
          </div>
          {/**Image and description */}
          <div className="hidden md:flex w-full min-h-[50dvh] h-full relative overflow-hidden px-7 py-8 lg:py-10 flex-col gap-6 justify-center items-center">
            <OnViewAnimation animation="fadeUp" duration={0.75} delay={0.2} className="z-10 max-w-sm">
              <p className="text-[clamp(20px,1.75vw,24px)] leading-[120%] text-white font-medium tracking-[-2%]">{"Bienvenue sur Kizuna, votre outil RH simplifié."}</p>
            </OnViewAnimation>
            <OnViewAnimation animation="popIn" duration={1} delay={0.4} className="z-10">
              <img src="/images/preview.webp" alt="preview" className="z-10 w-full h-auto max-w-sm" />
            </OnViewAnimation>
            <div className="absolute top-0 left-0 w-full h-full bg-primary-500" />
            <OnViewAnimation animation="fadeIn" duration={0.75} delay={0.2} className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-1/2 w-auto aspect-square rounded-full">
              <div className="w-full h-full bg-primary-600 blur-3xl"/>
            </OnViewAnimation>
            <OnViewAnimation animation="fadeIn" duration={0.75} delay={0.4} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2/3 w-auto aspect-square rounded-full">
              <div className="w-full h-full bg-primary-400 blur-2xl"/>
            </OnViewAnimation>
          </div>
        </div>
      </section>
      {/**Credits */}
      <div className="h-[60px] px-5 w-full flex items-center justify-center text-center">
        <p className='text-sm'>{"©Kizuna 2025. Propulsé par "}
          <a href="https://krestdev.com" className="text-primary-500 font-bold transition-colors duration-300 ease-out hover:text-primary-600 inline-flex items-start gap-1.5" target="_blank">
            {"KrestDev"}<ExternalLink size={16}/>
          </a>
        </p>
      </div>
    </div>
  )
}

export default Page