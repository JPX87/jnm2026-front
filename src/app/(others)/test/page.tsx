export default function Test() {
    return (
        <>
            <div className="sticky parallax top-0 h-screen flex flex-col items-center justify-center bg">
                <h2 className="text-4xl font-bold">The First slide</h2>
                <p className="mt-2">Scroll Down for next slide</p>*
            </div>
            <div className="sticky parallax top-0 h-screen flex flex-col items-center justify-center mid">
                <h2 className="text-4xl font-bold">The Second slide</h2>
                <p className="mt-2">Scroll Down for next slide</p>
            </div>
            <div className="sticky parallax top-0 h-screen flex flex-col items-center justify-center fg">
                <h2 className="text-4xl font-bold">The Third slide</h2>
                <p className="mt-2">Scroll Down</p>
            </div>
        </>
    )
}