'use client'

import { useEffect } from 'react'
import ErrorDisplay from "@/components/ui/ErrorDisplay/ErrorDisplay"

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[ErrorPage]', error)
    }, [error])

    return (
        <ErrorDisplay
            code={500}
            message={"Oups\u00a0! Une erreur inattendue est survenue."}
            onRetry={reset}
            linkHref="/"
            linkLabel="Retour à l'accueil"
        />
    )
}
