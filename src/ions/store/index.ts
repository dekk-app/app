import { Viewport } from "@react-three/fiber";
import { produce } from "immer";
import { MutableRefObject } from "react";
import { Object3D } from "three";
import { Except } from "type-fest";
import { v4 as uuid } from "uuid";
import create from "zustand";

export type LayerType = "text" | "plane" | "box" | "image";
export interface LayerInput {
	type: LayerType;
	value?: string;
}

export interface Layer extends LayerInput {
	id: string;
	value: string;
}

export type Layers = Layer[];

export interface SlideInput {
	title: string;
	x?: number;
	y?: number;
}

export interface Slide extends SlideInput {
	id: string;
	layers: Layers;
	x: number;
	y: number;
}
export type Slides = Slide[];

export interface Store {
	activeSlide: string | null;
	controllable: boolean;
	activeSlideRef: MutableRefObject<Object3D>;
	slides: Slides;
	viewport: Except<Viewport, "initialDpr" | "dpr">;
	zoom: number;
	addLayer(input: LayerInput): void;
	addSlide(input: SlideInput): void;
	setActiveSlide(input: string | null): void;
	setActiveSlideRef(input: MutableRefObject<Object3D>): void;
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
	activeSlideRef: null,
	slides: [],
	addLayer: layerInput => {
		set(
			produce<Store>(previousState => {
				const slide = previousState.slides.find(
					slide => slide.id === previousState.activeSlide
				);

				if (slide) {
					slide.layers.push({
						value: `Layer ${slide.layers.length + 1}`,
						...layerInput,
						id: uuid(),
					});
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
					...slideInput,
					id: uuid(),
					layers: [],
				},
			],
		}));
	},
	setActiveSlide: activeSlide => {
		set({ activeSlide });
	},
	setActiveSlideRef: activeSlideRef => {
		set({ activeSlideRef });
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
