'use client'

import Scene from "@/components/features/hero-3d/Scene"
import CountdownTimer from "@/components/_archive/Timer/CountdownTimer"
const dateJNM = "2026-05-26T09:00:00"

export default function Test() {
    return (
        <>
            <div className="absolute z-10 top-3 left-0 right-0 m-auto mt-10">
                <img src={"logo.svg"} className="w-2xs md:w-md m-auto border-0" />
            </div>
            <Scene />
            <div className="absolute bottom-10 left-0 right-0 m-auto mt-10">
                <CountdownTimer targetDate={dateJNM} />
            </div>
        </>
    )
}