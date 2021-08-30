import { pxToRem } from "@/ions/utils/unit";
import {
	Borders,
	Layout,
	MediaQueries,
	Palette,
	Shadows,
	Shapes,
	Sizes,
	Spaces,
	Speeds,
	Theme,
	UIPatterns,
} from "@/types/theme";

export const palette: Palette = {
	red: "#DB0303",
	green: "#2BFFB0",
	blue: "#2B93FF",
	yellow: "#FED22E",
	highlight: "#FFA07A",
	dark: "#232421",
	light: "#F8F9FA",
	brand: "#6A26E9",
	brandDark: "#4F11C0",
};

export const spaces: Spaces = {
	xxs: 4,
	xs: 8,
	s: 16,
	m: 24,
	l: 32,
	xl: 48,
	xxl: 64,
};

export const columnBaseWidth = 80;

export const breakpoints: Sizes = {
	xs: 0,
	s: columnBaseWidth * 4, // 320
	m: columnBaseWidth * 9.5, // 760
	l: columnBaseWidth * 13.5, // 1_080
	xl: columnBaseWidth * 16, // 1_280
};

export const colCount: Sizes = {
	xs: 2,
	s: 4,
	m: 8,
	l: 12,
	xl: 12,
};

export const getMediaQueries = (b: Sizes) =>
	Object.fromEntries(
		Object.entries(b).map(([key, value]: [string, number]) => [
			key,
			`@media only screen and (min-width: ${pxToRem(value)})`,
		])
	) as MediaQueries;

export const mq: MediaQueries = getMediaQueries(breakpoints);

export const layout: Layout = {
	header: {
		height: {
			xs: 64,
			s: 64,
			m: 64,
			l: 96,
			xl: 96,
		},
	},
};

export const borders: Borders = {
	focusRing: "2px",
};

export const shapes: Shapes = {
	xs: pxToRem(4),
	s: pxToRem(4),
	m: pxToRem(8),
	l: pxToRem(12),
	xl: pxToRem(16),
};

export const speeds: Speeds = {
	fast: "0.125s",
	normal: "0.25s",
	slow: "0.375s",
	verySlow: "0.75s",
	extremelySlow: "1.5s",
};

export const shadows: Shadows = {
	"0": `0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)`,
	s: `0 ${pxToRem(1)} ${pxToRem(2)} rgba(0,0,0,0.1), 0 ${pxToRem(3)} ${pxToRem(
		5
	)} rgba(0,0,0,0.2)`,
	m: `0 ${pxToRem(3)} ${pxToRem(4)} rgba(0,0,0,0.1), 0 ${pxToRem(7)} ${pxToRem(
		10
	)} rgba(0,0,0,0.2)`,
	l: `0 ${pxToRem(5)} ${pxToRem(7)} rgba(0,0,0,0.1), 0 ${pxToRem(10)} ${pxToRem(
		15
	)} rgba(0,0,0,0.3)`,
};

export const ui: UIPatterns = {
	colors: {
		primary: {
			background: palette.brand,
			color: "#ffffff",
		},
		light: {
			background: palette.light,
			color: "#000000",
		},
		dark: {
			background: palette.dark,
			color: "#ffffff",
		},
	},
};
export const theme: Theme = {
	borders,
	breakpoints,
	layout,
	mq,
	palette,
	shapes,
	spaces,
	shadows,
	speeds,
	ui,
};

export const light: Theme = {
	...theme,
	ui: {
		colors: {
			...theme.ui.colors,
			theme: {
				background: palette.light,
				color: "#000000",
			},
		},
	},
};

export const dark: Theme = {
	...theme,
	ui: {
		colors: {
			...theme.ui.colors,
			theme: {
				background: palette.dark,
				color: "#ffffff",
			},
		},
	},
};
