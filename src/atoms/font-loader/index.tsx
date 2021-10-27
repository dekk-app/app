import { getFontUrl, useFontStore, useGoogleFonts } from "@/ions/hooks/fonts";
import Head from "next/head";
import React, { useMemo } from "react";

export const FontLoader = () => {
	useGoogleFonts(
		useMemo(
			() => ["Roboto", "Open Sans", "Montserrat", "Raleway", "Merriweather", "Fira Sans"],
			[]
		)
	);
	const fonts = useFontStore(state => state.fonts);
	return (
		<Head>
			{fonts?.map(font => (
				<link key={font.family} rel="stylesheet" href={getFontUrl(font)} />
			))}
		</Head>
	);
};
