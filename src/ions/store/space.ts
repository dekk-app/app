import { produce } from "immer";
import { v4 } from "uuid";
import create from "zustand";

export type FontStyle = "italic" | "normal";
export type FontFamily = string;
export type FontWeight = number;

export interface Font {
	family?: FontFamily;
	size?: number;
	style?: FontStyle;
	weight?: FontWeight;
	variant?: string;
}
export type EntityType = "group" | "picture" | "text" | "3dObject";
export type AnchorX = "center" | "left" | "right";
export type AnchorY = "bottom" | "middle" | "top";
export type TextAlign = "left" | "center" | "justify" | "right";

export interface EntityGeneratedFields<T = EntityType> {
	id: string;
	__typename: T;
}

export interface EntityFields {
	x: number;
	y: number;
	z: number;
}

export interface TextEntity extends EntityFields, EntityGeneratedFields<"text"> {
	type: "text";
	text: string;
	font: Font;
	color?: string;
	width?: number;
	textAlign: TextAlign;
	lineHeight: number;
	letterSpacing: number;
	anchorX?: AnchorX;
	anchorY?: AnchorY;
}
export type EditableTextEntityKeys =
	| "text"
	| "font"
	| "textAlign"
	| "lineHeight"
	| "color"
	| "width"
	| "letterSpacing"
	| "anchorX"
	| "anchorY";

export interface TextEntityUpdate
	extends Partial<EntityFields>,
		Partial<Pick<TextEntity, EditableTextEntityKeys>> {}

export interface TextEntityInput
	extends Partial<EntityFields>,
		Partial<Pick<TextEntity, EditableTextEntityKeys>> {}

export interface PictureEntity extends EntityFields, EntityGeneratedFields<"picture"> {
	type: "picture";
	src: string;
	height: number;
	width: number;
}

export type EditablePictureEntityKeys = "src" | "width" | "height";

export interface PictureEntityUpdate
	extends Partial<EntityFields>,
		Partial<Pick<PictureEntity, EditablePictureEntityKeys>> {}

export interface PictureEntityInput
	extends Partial<EntityFields>,
		Partial<Pick<PictureEntity, EditablePictureEntityKeys>> {}

export interface SliceStopGeneratedFields {
	id: string;
	entities: Array<TextEntity | PictureEntity>;
	entityIds: string[];
}

export interface GradientStop {
	id: string;
	color: string;
	stop: number;
}

export interface SliceFields {
	x: number;
	y: number;
	z: number;
	backgroundColor?: string;
	gradient: GradientStop[];
	showGradient?: boolean;
	color?: string;
}

export interface Slice extends SliceFields, SliceStopGeneratedFields {}

export interface SliceUpdate extends Partial<SliceFields> {}

export interface SliceInput extends Partial<SliceFields> {}

export interface SpaceGeneratedFields {
	id: string;
}

export interface SpaceFields {
	height: number;
	width: number;
	backgroundColor: string;
	color: string;
}

export interface Space extends SpaceFields, SpaceGeneratedFields {}

export interface SpaceUpdate extends Partial<SpaceFields> {}

interface Store {
	entities: Array<TextEntity | PictureEntity>;
	slices: Slice[];
	space: Space;
	addTextEntity(input: TextEntityInput, parentId: string): void;
	addPictureEntity(input: PictureEntityInput, parentId: string): void;
	deleteEntity(id: string, parentId: string): void;
	addSlice(input: SliceInput): Slice;
	deleteSlice(id: string): void;
	updateTextEntity(update: TextEntityUpdate, id: string): void;
	updatePictureEntity(update: PictureEntityUpdate, id: string): void;
	updateSlice(update: SliceUpdate, id: string): void;
	updateSpace(update: SpaceUpdate): void;
}

const defaultEntity: TextEntity = {
	id: "entity:default",
	x: 0,
	y: 0,
	z: 2,
	type: "text",
	__typename: "text",
	text: "Welcome to Dekk",
	textAlign: "center",
	lineHeight: 1.2,
	letterSpacing: 0,
	anchorX: "center",
	anchorY: "middle",
	width: 1200,
	color: "#ffffff",
	font: {
		family: "Roboto",
		size: 160,
		variant: "regular",
		weight: 400,
		style: "normal",
	},
};

const defaultSlice: Slice = {
	id: "slice:default",
	x: 0,
	y: 0,
	z: 1,
	entities: [defaultEntity],
	entityIds: [defaultEntity.id],
	showGradient: true,
	gradient: [
		{ id: "0", stop: 0, color: "#ff0000" },
		{ id: "1", stop: 1, color: "#0000ff" },
	],
};

const defaultSpace: Space = {
	id: "space:default",
	width: 1600,
	height: 900,
	backgroundColor: "#ffffff",
	color: "#000000",
};

const merge = <T extends Record<string, any>>(original: T, update: Partial<T>): void => {
	if (!original || !update) {
		return;
	}

	for (const key in update) {
		if (Object.prototype.hasOwnProperty.call(update, key)) {
			const value = update[key];
			if (typeof original[key] === "object") {
				merge(original[key], value);
			} else {
				original[key] = value;
			}
		}
	}
};

export const useSpace = create<Store>(set => ({
	entities: [defaultEntity],
	slices: [defaultSlice],
	space: defaultSpace,
	addTextEntity(input, parentId) {
		set(
			produce<Store>(state => {
				const entity: TextEntity = {
					x: 0,
					y: 0,
					z: 2,
					font: {
						size: 160,
						family: "Roboto",
						variant: "regular",
						weight: 400,
						style: "normal",
						...input.font,
					},
					text: "Text",
					textAlign: "center",
					lineHeight: 1.2,
					letterSpacing: 0,
					anchorX: "center",
					anchorY: "middle",
					width: 1200,
					...input,
					type: "text",
					__typename: "text",
					id: v4(),
				};
				const slice = state.slices.find(slice => slice.id === parentId);
				if (slice) {
					state.entities.push(entity);
					slice.entities.push(entity);
					slice.entityIds.push(entity.id);
				}
			})
		);
	},
	addPictureEntity(input, parentId) {
		set(
			produce<Store>(state => {
				const entity: PictureEntity = {
					x: 0,
					y: 0,
					z: 2,
					width: 600,
					height: 600,
					src: "/assets/robot.png",
					...input,
					type: "picture",
					__typename: "picture",
					id: v4(),
				};
				const slice = state.slices.find(slice => slice.id === parentId);
				if (slice) {
					state.entities.push(entity);
					slice.entities.push(entity);
					slice.entityIds.push(entity.id);
				}
			})
		);
	},
	addSlice(input) {
		let slice: Slice;
		set(
			produce<Store>(state => {
				const sliceStep = state.space.width * 1.5;
				const rightMost = state.slices.reduce((previousValue, currentValue) => {
					if (currentValue.x > previousValue.x) {
						return currentValue;
					}

					return previousValue ?? currentValue;
				}, state.slices[0]) ?? {
					x: -sliceStep,
					y: 0,
					z: 1,
				};

				const topMost = state.slices.reduce((previousValue, currentValue) => {
					if (currentValue.z > previousValue) {
						return currentValue.z;
					}

					return previousValue ?? currentValue.z;
				}, state.slices[0]?.z ?? 0);

				slice = {
					x: rightMost.x + sliceStep,
					y: rightMost.y,
					z: topMost,
					gradient: [],
					showGradient: false,
					...input,
					id: v4(),
					entities: [],
					entityIds: [],
				};

				state.slices.push(slice);
			})
		);
		return slice;
	},
	deleteEntity(id, parentId) {
		set(
			produce<Store>(state => {
				const index = state.entities.findIndex(entity => entity.id === id);
				if (index > -1) {
					state.entities.splice(index, 1);
					const slice = state.slices.find(slice => slice.id === parentId);
					if (slice) {
						const entityIndex = slice.entities.findIndex(entity => entity.id === id);
						const entityIdIndex = slice.entityIds.indexOf(id);
						slice.entities.splice(entityIndex, 1);
						slice.entityIds.splice(entityIdIndex, 0);
					}
				}
			})
		);
	},
	deleteSlice(id: string) {
		set(
			produce<Store>(state => {
				const index = state.slices.findIndex(slice => slice.id === id);
				if (index > -1) {
					state.slices.splice(index, 1);
				}
			})
		);
	},
	updateTextEntity(update, id) {
		set(
			produce<Store>(state => {
				merge(
					state.entities.find(item => item.id === id),
					update
				);
				for (const slice of state.slices) {
					merge(
						slice.entities.find(item => item.id === id),
						update
					);
				}
			})
		);
	},
	updatePictureEntity(update, id) {
		set(
			produce<Store>(state => {
				merge(
					state.entities.find(item => item.id === id),
					update
				);
				for (const slice of state.slices) {
					merge(
						slice.entities.find(item => item.id === id),
						update
					);
				}
			})
		);
	},
	updateSlice(update, id) {
		set(
			produce<Store>(state => {
				merge(
					state.slices.find(item => item.id === id),
					update
				);
			})
		);
	},
	updateSpace(update) {
		set(
			produce<Store>(state => {
				merge(state.space, update);
			})
		);
	},
}));
