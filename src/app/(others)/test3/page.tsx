"use client"

import Countdown from "@/components/features/Countdown/Countdown";

export default function Test() {

    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 5);

    return (
        <>
            <Countdown targetDate={targetDate} />
        </>
    )
}