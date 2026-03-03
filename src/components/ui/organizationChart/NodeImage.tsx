import { useState } from "react";
import NextImage from "next/image";
import { PPSvg } from "./PPSvg";

interface ImageWithLoadingProps {
    pathImg: string;
    imageUrl: string;
    label: string;
    className?: string;
    imgSize: number;
    quality?: number;
    priority?: boolean;
}

function ImageWithLoading({
    pathImg,
    imageUrl,
    label,
    className,
    imgSize,
    quality = 85,
    priority = false
}: ImageWithLoadingProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative w-full h-full ${className || ""}`}>
            {/* Loading skeleton */}
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-pulse" />
            )}

            {/* Image */}
            <NextImage
                src={`${pathImg}${imageUrl}`}
                alt={label}
                width={Math.ceil(imgSize)}
                height={Math.ceil(imgSize)}
                quality={quality}
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"
                    }`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />

            {/* Error fallback */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">✕</span>
                </div>
            )}
        </div>
    );
}

interface NodeImageProps {
    imageUrl?: string;
    label: string;
    isActive: boolean;
    svgSize: { w: number; h: number };
    pathImg: string;
    className?: string;
    isForeignObject?: boolean;
    quality?: number;
    priority?: boolean;
    fixedSize?: number;
}

export function NodeImage({
    imageUrl,
    label,
    isActive,
    svgSize,
    pathImg,
    className,
    isForeignObject = false,
    quality = 85,
    priority = false,
    fixedSize
}: NodeImageProps) {
    // compute a size that scales with the svg viewport so the
    // picture remains proportional when the container resizes
    const imgSize = fixedSize ?? (svgSize.w * (svgSize.w < 500 ? 0.085 : svgSize.w < 800 ? 0.07 : 0.05));
    const half = imgSize / 2;

    if (imageUrl) {
        if (!isForeignObject) {
            return (
                <ImageWithLoading
                    pathImg={pathImg}
                    imageUrl={imageUrl}
                    label={label}
                    className={className}
                    imgSize={imgSize}
                    quality={quality}
                    priority={priority}
                />
            );
        }

        return (
            <foreignObject
                x={-half}
                y={-half}
                width={imgSize}
                height={imgSize}
                pointerEvents="none"
            >
                <ImageWithLoading
                    pathImg={pathImg}
                    imageUrl={imageUrl}
                    label={label}
                    className={className}
                    imgSize={imgSize}
                    quality={quality}
                    priority={priority}
                />
            </foreignObject>
        );
    }


    if (!isForeignObject) {
        return (
            <div
                className={`w-[80%] h-[80%] ${className || ""}`}
            >
                <PPSvg
                    className={`w-full h-full ${isActive ? "text-white" : "text-black dark:text-white"} m-auto`}
                />
            </div>
        );
    }

    // Fallback icon (pas d'image)
    return (
        <foreignObject
            x={-half * 0.8}
            y={-half * 0.8}
            width={imgSize * 0.8}
            height={imgSize * 0.8}
            pointerEvents="none"
        >
            <PPSvg
                className={`w-full h-full ${isActive ? "text-white" : "text-black dark:text-white"
                    } m-auto`}
            />
        </foreignObject>
    );
}