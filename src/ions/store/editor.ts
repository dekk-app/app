import { Viewport } from "@react-three/fiber";
import { produce } from "immer";
import { MutableRefObject } from "react";
import { Object3D } from "three";
import { Except } from "type-fest";
import { v4 as uuid } from "uuid";
import create from "zustand";

export interface Font {
	family?: string;
	size?: number;
	weight?: number;
	style?: "italic";
}

export type LayerType = "text" | "image" | "plane";

export interface LayerInputBase {
	title: string;
	height?: number;
	width?: number;
	x?: number;
	y?: number;
	animation?: string;
}

export interface LayerBase {
	id: string;
	x: number;
	y: number;
}

export interface LayerUpdateBase {
	title?: string;
	height?: number;
	width?: number;
	x?: number;
	y?: number;
}

export interface TextLayerInput extends LayerInputBase {
	type: "text";
	text: string;
	font?: Font;
	background?: string;
	color?: string;
}

export interface TextLayerUpdate extends LayerUpdateBase {
	font?: Font;
	background?: string;
	color?: string;
}

export interface ImageLayerInput extends LayerInputBase {
	type: "image";
	src: string;
	alt?: string;
}

export interface ImageLayerUpdate extends LayerUpdateBase {
	src?: string;
	alt?: string;
}

export interface ImageLayer extends Except<ImageLayerInput, "x" | "y">, LayerBase {
	__typename: ImageLayerInput["type"];
}

export interface TextLayer extends Except<TextLayerInput, "x" | "y">, LayerBase {
	__typename: TextLayerInput["type"];
}

export interface SlideInput {
	title?: string;
	layers?: string[];
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	background?: string;
	color?: string;
}

export interface Slide extends SlideInput {
	id: string;
	layers: string[];
	x: number;
	y: number;
}

export type LayerInput = TextLayerInput | ImageLayerInput;
export type LayerUpdate = TextLayerUpdate | ImageLayerUpdate;
export type Layer = TextLayer | ImageLayer;
export type Layers = Layer[];
export type Slides = Slide[];
export type SimpleViewport = Except<Viewport, "initialDpr" | "dpr">;
export type Object3DReference = MutableRefObject<Object3D>;
export type Object3DReferences = Object3DReference[];

export interface Store {
	viewport: SimpleViewport;
	selectedSlides: Object3DReferences;
	selectedLayers: Object3DReferences;
	activeSlide: string | null;
	activeLayer: string | null;
	deck: Slides; // Backend
	slides: Slides; // Backend
	layers: Layers; // Backend
	addSlide(input: SlideInput): void; // Backend
	addLayer(input: LayerInput): void; // Backend
	activateSlide(id: Slide["id"] | null): void;
	selectSlide(ref: Object3DReference): void;
	addSelectedSlide(ref: Object3DReference): void;
}

export const useEditor = create<Store>(set => ({
	viewport: {
		aspect: 1,
		distance: 0,
		factor: 1,
		height: 0,
		width: 0,
	},
	layers: [],
	selectedLayers: [],
	activeLayer: null,
	slides: [],
	selectedSlides: [],
	activeSlide: null,
	deck: [],
	activateSlide: id => {
		set({
			activeSlide: id,
		});
	},
	addSelectedSlide: ref => {
		set(
			produce<Store>(previousState => {
				previousState.selectedSlides.push(ref);
			})
		);
	},
	selectSlide: ref => {
		set({
			selectedSlides: [ref],
		});
	},
	addSlide: input => {
		set(previousState => ({
			slides: [
				...previousState.slides,
				{
					x: 0,
					y: 0,
					layers: [],
					...input,
					id: uuid(),
				},
			],
		}));
	},
	addLayer: input => {
		set(previousState => {
			const defaults = { x: 0, y: 0 };
			const internals = { id: uuid() };
			switch (input.type) {
				case "text":
					return {
						layers: [
							...previousState.layers,
							{ ...defaults, ...input, ...internals, __typename: input.type },
						],
					};
				case "image":
					return {
						layers: [
							...previousState.layers,
							{ ...defaults, ...input, ...internals, __typename: input.type },
						],
					};
				default:
					return { layers: previousState.layers };
			}
		});
	},
}));
