import Countdown from "@/components/features/Countdown/Countdown";
import { Slice } from "@/components/layout/Slice/Slice";
import { Avionn } from "@/components/ui/shapes/Avionn/Avionn";
import MessageBubble from "@/components/ui/shapes/MessageBubble/MessageBubble";
import Link from "next/link";

const dateJNM = "2026-05-26T06:00:00"

export default function Home() {

  const targetDate = new Date(dateJNM)

  return (
    <main className="home relative" id="top">
      <Slice absolute first>
        <h1 id="countdown" className="text-center text-4xl 2xs:text-[55px] xs:text-6xl xs:text-7xl lg:text-8xl xl:text-[150px] sm:mt-0 mb-[20%] sm:m-auto font-bold my-[20px] sm:my-[50px]">EMBARQUEMENT DANS</h1>
        <Countdown className="mx-auto mb-[30%] xs:mb-0" targetDate={targetDate} />
        <Avionn className="absolute left-0 right-0 -bottom-30 xs:-bottom-60 sm-bottom-70 lg:-bottom-71 m-auto rotate-90 -scale-x-100 w-56 sm:w-80 md:w-96 lg:w-[400px] lg:h-72 fill-(--color-primary)" />
      </Slice>
      <Slice absolute parentClassName="h-[60vh] mb-16 sm:mb-0 sm:h-screen">
        <div className="relative w-10/12 flex flex-col gap-3 py-14 px-6 justify-center rounded-3xl bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black) m-auto">
          <h1 id="contact" className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold my-[50px] transition-all">DES QUESTIONS SUR LES JNM ?</h1>
          <div className="py-2 sm:flex lg:mx-24">
            <Link href="kesako" rel="noopener noreferrer"
              className="block mb-4 mx-auto sm:m-auto w-max bg-(--color-secondary) dark:bg-(--color-seconde-black) text-(--color-tertiary) text-xl sm:text-2xl font-bold rounded-4xl py-2 sm:py-3 px-8 sm:px-10 lg:px-20 hover:bg-gray-800 transition-all cursor-pointer">
              LES JNMS ?
            </Link>
            <Link target="_blank" href="https://ig.me/m/jnm2026_tls" rel="noopener noreferrer"
              className="block m-auto w-max bg-(--color-secondary) dark:bg-(--color-seconde-black) text-(--color-tertiary) text-xl sm:text-2xl font-bold rounded-4xl py-2 sm:py-3 px-8 sm:px-10 lg:px-20 hover:bg-gray-800 transition-all cursor-pointer">
              CONTACTEZ-NOUS
            </Link>
          </div>
          <MessageBubble classNameP="absolute top-[-20px] md:top-[-50px] right-5" className="bg-(--color-tertiary) border-(--color-primary) border-4" rounded />
          <MessageBubble classNameP="absolute bottom-[-30px] md:bottom-[-50px] left-5" className="bg-(--color-tertiary) border-(--color-primary) border-4" />
        </div>
      </Slice>
    </main>
  );
}
