import FlipCountdown from "@/components/_archive/SplitFlapv3/FlipCountdown";

export default function Test() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
        <>
            <FlipCountdown targetDate={tomorrow.toISOString()} />
        </>
    )
}