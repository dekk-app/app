import CameraControls from "camera-controls";
import { produce } from "immer";
import { Vector3 } from "three";
import create from "zustand";

export interface Viewport {
	height: number;
	width: number;
}
export interface Store {
	zoom: number;
	viewport: Viewport;
	controllable: boolean;
	controls: CameraControls | null;
	activeSlice: string | null;
	activeEntity: string | null;
	guidesX: Vector3[] | null;
	guidesY: Vector3[] | null;
	setGuidesX(guides: Vector3[] | null): void;
	setGuidesY(guides: Vector3[] | null): void;
	setControllable(controllable: boolean): void;
	setControls(controls: CameraControls): void;
	setZoom(zoom: number): void;
	setViewport(viewport: Partial<Viewport>): void;
	setActiveSlice(activeSlice: string | null): void;
	setActiveEntity(activeEntity: string | null): void;
}

export const useEditor = create<Store>(set => ({
	zoom: 0.75,
	viewport: {
		height: 0,
		width: 0,
	},
	controllable: true,
	controls: null,
	activeSlice: null,
	activeEntity: null,
	guidesX: null,
	guidesY: null,
	setControllable(controllable) {
		set({ controllable });
	},
	setControls(controls) {
		set({ controls });
	},
	setGuidesX(guidesX) {
		set({ guidesX });
	},
	setViewport({ height, width }) {
		set(
			produce<Store>(state => {
				if (height !== undefined) {
					state.viewport.height = height;
				}

				if (width !== undefined) {
					state.viewport.width = width;
				}
			})
		);
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
