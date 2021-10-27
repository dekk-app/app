import { Vector3 } from "three";
import create from "zustand";

export interface Store {
	zoom: number;
	controllable: boolean;
	activeSlice: string | null;
	activeEntity: string | null;
	guidesX: Vector3[] | null;
	guidesY: Vector3[] | null;
	setGuidesX(guides: Vector3[] | null): void;
	setGuidesY(guides: Vector3[] | null): void;
	setControllable(controllable: boolean): void;
	setZoom(zoom: number): void;
	setActiveSlice(activeSlice: string | null): void;
	setActiveEntity(activeEntity: string | null): void;
}

export const useEditor = create<Store>(set => ({
	zoom: 0.75,
	controllable: true,
	activeSlice: null,
	activeEntity: null,
	guidesX: null,
	guidesY: null,
	setControllable(controllable) {
		set({ controllable });
	},
	setGuidesX(guidesX) {
		set({ guidesX });
	},
	setGuidesY(guidesY) {
		set({ guidesY });
	},
	setZoom(zoom) {
		set({ zoom });
	},
	setActiveSlice(activeSlice) {
		set({ activeSlice });
	},
	setActiveEntity(activeEntity) {
		set({ activeEntity });
	},
}));
