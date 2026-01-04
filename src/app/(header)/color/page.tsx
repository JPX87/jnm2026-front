import { ColorPalette } from "@/components/ui/branding/debug/ColorPalette/ColorPalette";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Couleurs",
};

export default function Color() {
    return (
        <>
            <ColorPalette />
        </>
    )
}