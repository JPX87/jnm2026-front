"use client"

import '@/scss/_old/home.scss'
import CountdownTimer from "@/components/_archive/Timer/CountdownTimer";

const dateJNM = "2026-05-26T09:00:00"
//const dateJNM = "2025-11-11T19:10:00"

export default function Home() {
  return (
    <main className="home"> 
      <div className="relative back top-0 h-screen overflow-auto bg">
        <div className="sticky h-1/3 items-end justify-center">
        </div>

        <div className="sticky parallax top-0 h-screen items-center justify-center fg1">
          <div className="absolute top-0 mt-10 bg-JNM-secondary rounded-2xl">
            <CountdownTimer targetDate={dateJNM} />
          </div>
        </div>

        <div className="sticky parallax top-0 h-screen items-center justify-center bg-JNM-primary">
          {/*<h2 className="text-4xl font-bold">The First slide</h2>
          <p className="mt-2">Scroll Down for next slide</p>*/}
        </div>
      </div>
    </main>
  );
}
