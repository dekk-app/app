import { palette } from "@/ions/theme";
import { Viewport } from "@react-three/fiber";
import { produce } from "immer";
import { MutableRefObject } from "react";
import { Object3D } from "three";
import { Except } from "type-fest";
import { v4 as uuid } from "uuid";
import create from "zustand";

export type LayerType = "text" | "image";

export interface LayerInputBase {
	type: LayerType;
	title?: string;
	height?: number;
	width?: number;
	x?: number;
	y?: number;
}

export interface Font {
	family?: string;
	size?: number;
	weight?: number;
	style?: "italic";
}

export interface TextLayerInput extends LayerInputBase {
	type: "text";
	text: string;
	font?: Font;
	background?: string;
	color?: string;
}

export interface ImageLayerInput extends LayerInputBase {
	type: "image";
	src: string;
	alt?: string;
}

export interface ImageLayer extends ImageLayerInput {
	__typename: "image";
	id: string;
	height: number;
	width: number;
	x: number;
	y: number;
}

export interface TextLayer extends TextLayerInput {
	__typename: "text";
	id: string;
	x: number;
	y: number;
}

export type LayerInput = TextLayerInput | ImageLayerInput;
export type Layer = TextLayer | ImageLayer;

export type Layers = Layer[];

export interface SlideInput {
	title?: string;
	x?: number;
	y?: number;
	height?: number;
	width?: number;
	background?: string;
	color?: string;
}

export interface Slide extends SlideInput {
	id: string;
	layers: Layers;
	x: number;
	y: number;
	height: number;
	width: number;
}

export type Slides = Slide[];

export interface Store {
	activeSlide: string | null;
	activeLayer: string | null;
	controllable: boolean;
	activeSlideRef: MutableRefObject<Object3D>;
	activeLayerRef: MutableRefObject<Object3D>;
	slides: Slides;
	viewport: Except<Viewport, "initialDpr" | "dpr">;
	zoom: number;
	addLayer<T extends LayerInput>(input: T): void;
	addSlide(input: SlideInput): void;
	updateSlide(id: string, input: SlideInput): void;
	updateLayer(id: string, input: Partial<Except<LayerInput, "type">>): void;
	setActiveSlide(input: string | null): void;
	setActiveLayer(input: string | null): void;
	setActiveSlideRef(input: MutableRefObject<Object3D>): void;
	setActiveLayerRef(input: MutableRefObject<Object3D>): void;
	setControllable(input: boolean): void;
	setViewport(viewport: Except<Viewport, "initialDpr" | "dpr">): void;
	setZoom(zoom: number): void;
}

export const useStore = create<Store>(set => ({
	viewport: {
		aspect: 1,
		distance: 0,
		factor: 1,
		height: 0,
		width: 0,
	},
	zoom: 1,
	controllable: true,
	activeSlide: null,
	activeLayer: null,
	activeSlideRef: null,
	activeLayerRef: null,
	slides: [
		{
			id: "0",
			x: 0,
			y: 0,
			height: 9,
			width: 16,
			background: palette.brand,
			color: "#ffffff",

			layers: [
				{
					type: "text",
					__typename: "text",
					x: 0,
					y: 2,
					text: "Title",
					id: "0_title",
					font: {
						size: 3,
						weight: 400,
						family: "Roboto",
					},
				},
				{
					type: "text",
					__typename: "text",
					x: 0,
					y: -2,
					text: "Subtitle",
					id: "0_subtitle",
					font: {
						size: 2,
						weight: 400,
						family: "Roboto",
					},
				},
			],
		},
		{
			id: "1",
			x: 17,
			y: 0,
			height: 9,
			width: 16,
			background: palette.brand,
			color: "#ffffff",

			layers: [
				{
					type: "text",
					__typename: "text",
					x: -4.5,
					y: 2,
					width: 4.5,
					text: "Title",
					id: "1_title",
					font: {
						size: 2,
						weight: 400,
						family: "Roboto",
					},
				},
				{
					type: "text",
					__typename: "text",
					x: -4.5,
					y: -1,
					width: 4.5,
					text: "Lorem ipsum nunquam examinare victrix.",
					id: "1_copy",
					font: {
						size: 0.5,
						weight: 400,
						family: "Roboto",
					},
				},
				{
					type: "image",
					__typename: "image",
					x: 3,
					y: 0,
					height: 6,
					width: 6,
					id: "1_image",
					src: "/assets/robot.png",
				},
			],
		},
	],
	addLayer: layerInput => {
		set(
			produce<Store>(previousState => {
				const slide = previousState.slides.find(
					slide => slide.id === previousState.activeSlide
				);
				if (slide) {
					switch (layerInput.type) {
						case "text":
							slide.layers.push({
								height: 1,
								width: 1,
								x: 0,
								y: 0,
								text: "Text",
								...layerInput,
								font: {
									weight: 400,
									size: 4,
									family: "Roboto",
									...layerInput.font,
								},
								__typename: layerInput.type,
								id: uuid(),
							});
							break;
						case "image":
							slide.layers.push({
								height: 1,
								width: 1,
								x: 0,
								y: 0,
								src: "/assets/robot.png",
								...layerInput,
								__typename: layerInput.type,
								id: uuid(),
							});
							break;
						default:
							break;
					}
				}
			})
		);
	},
	addSlide: slideInput => {
		set(previousState => ({
			slides: [
				...previousState.slides,
				{
					x: previousState.slides.length * 17,
					y: 0,
					width: 16,
					height: 9,
					background: "#ffffff",
					color: "#000000",
					...slideInput,
					id: uuid(),
					layers: [],
				},
			],
		}));
	},
	updateSlide: (id, slideInput) => {
		set(
			produce<Store>(previousState => {
				const slide = previousState.slides.find(slide => slide.id === id);
				if (slide) {
					for (const key in slideInput) {
						if (Object.prototype.hasOwnProperty.call(slideInput, key)) {
							slide[key] = slideInput[key as keyof SlideInput];
						}
					}
				}
			})
		);
	},
	updateLayer: (id, layerInput) => {
		set(
			produce<Store>(previousState => {
				const layer = previousState.slides
					.find(slide => slide.id === previousState.activeSlide)
					?.layers.find(layer => layer.id === id);
				if (layer) {
					for (const key in layerInput) {
						if (Object.prototype.hasOwnProperty.call(layerInput, key)) {
							layer[key] = layerInput[key as keyof Except<LayerInput, "type">];
						}
					}
				}
			})
		);
	},
	setActiveSlide: activeSlide => {
		set({ activeSlide });
	},
	setActiveLayer: activeLayer => {
		set({ activeLayer });
	},
	setActiveSlideRef: activeSlideRef => {
		set({ activeSlideRef });
	},
	setActiveLayerRef: activeLayerRef => {
		set({ activeLayerRef });
	},
	setControllable: controllable => {
		set({ controllable });
	},
	setViewport: viewport => {
		set({ viewport });
	},
	setZoom: zoom => {
		set({ zoom });
	},
}));
