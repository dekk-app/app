import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import create from "zustand";

export interface GoogleFont {
	category: string;
	family: string;
	files: Record<string, string>;
	kind: "webfonts#webfont";
	lastModified: string;
	subsets: string[];
	variants: string[];
	version: string;
}

export interface GoogleFontData {
	items: GoogleFont[];
	kind: "webfonts#webfont";
}

export const getFontUrl = (font: GoogleFont) => {
	const family = font.family.replace(/\s/g, "+");
	const italic = font.variants.some(variant => variant.endsWith("italic")) ? "ital," : "";
	const weight = font.variants
		.map(variant => {
			if (variant === "regular") {
				return "0,400";
			}

			if (variant === "italic") {
				return "1,400";
			}

			return `${variant.endsWith("italic") ? 1 : 0},${Number.parseInt(variant, 10)}`;
		})
		// Tuples need to be sorted!
		.sort()
		.join(";");
	return `https://fonts.googleapis.com/css2?family=${family}:${italic}wght@${weight}&display=swap`;
};

export interface FontStore {
	fonts: GoogleFont[];

	setFonts(fonts: GoogleFont[]): void;
}

export const useFontStore = create<FontStore>(set => ({
	fonts: null,
	setFonts(fonts) {
		set({ fonts });
	},
}));

export const useGoogleFonts = (availableFonts: string[]) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AxiosError | null>(null);
	const setFonts = useFontStore(state => state.setFonts);
	const fonts = useFontStore(state => state.fonts);
	useEffect(() => {
		if (
			fonts &&
			availableFonts.sort().join("|") === fonts?.map(({ family }) => family).join("|")
		) {
			return;
		}

		const url = `/api/googleapis/webfonts/v1/webfonts?sort=alpha`;
		setLoading(true);
		setError(null);
		axios
			.get<GoogleFontData>(url)
			.then(response => {
				setFonts(
					response.data.items.filter(({ family }) => availableFonts.includes(family))
				);
			})
			.catch(error_ => {
				setError(error_);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [fonts, availableFonts, setFonts]);
	return { error, loading };
};
