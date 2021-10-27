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
export type EntityType = "text" | "picture" | "group";

export interface EntityGeneratedFields<T = EntityType> {
	id: string;
	__typename: T;
}

export interface EntityFields {
	x: number;
	y: number;
	z: number;
	depth?: number;
}
export type TextAlign = "left" | "center" | "justify" | "right";

export interface TextEntity extends EntityFields, EntityGeneratedFields<"text"> {
	type: "text";
	text: string;
	font: Font;
	color?: string;
	width?: number;
	textAlign: TextAlign;
	lineHeight: number;
	letterSpacing: number;
}
export type EditableTextEntityKeys =
	| "text"
	| "font"
	| "textAlign"
	| "lineHeight"
	| "color"
	| "width"
	| "letterSpacing";

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

export interface SliceFields {
	x: number;
	y: number;
	z: number;
	backgroundColor?: string;
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
	addSlice(input: SliceInput): void;
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
	text: "Text",
	textAlign: "center",
	lineHeight: 1.2,
	letterSpacing: 0,
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
};

const defaultSpace: Space = {
	id: "space:default",
	width: 1600,
	height: 900,
	backgroundColor: "#ffffff",
	color: "#000000",
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
		set(
			produce<Store>(state => {
				const sliceStep = state.space.width * 1.1;
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

				const slice = {
					x: rightMost.x + sliceStep,
					y: rightMost.y,
					z: rightMost.z,
					...input,
					id: v4(),
					entities: [],
					entityIds: [],
				};
				state.slices.push(slice);
			})
		);
	},
	updateTextEntity(update, id) {
		const runUpdate = (entity: TextEntity | PictureEntity) => {
			if (entity && entity.__typename === "text") {
				for (const key in update) {
					if (key === "font") {
						for (const fontKey in update.font) {
							if (Object.prototype.hasOwnProperty.call(update.font, fontKey)) {
								entity.font[fontKey] =
									update.font[fontKey as keyof typeof update.font];
							}
						}
					} else {
						entity[key] = update[key as keyof typeof update];
					}
				}
			}
		};

		set(
			produce<Store>(state => {
				runUpdate(state.entities.find(item => item.id === id));
				for (const slice of state.slices) {
					runUpdate(slice.entities.find(item => item.id === id));
				}
			})
		);
	},
	updatePictureEntity(update, id) {
		set(
			produce<Store>(state => {
				const entity = state.entities.find(item => item.id === id);
				if (entity) {
					for (const key in update) {
						if (Object.prototype.hasOwnProperty.call(update, key)) {
							entity[key] = update[key as keyof typeof update];
						}
					}
				}

				for (const slice of state.slices) {
					const entity = slice.entities.find(item => item.id === id);
					if (entity) {
						for (const key in update) {
							if (Object.prototype.hasOwnProperty.call(update, key)) {
								entity[key] = update[key as keyof typeof update];
							}
						}
					}
				}
			})
		);
	},
	updateSlice(update, id) {
		set(
			produce<Store>(state => {
				const slice = state.slices.find(item => item.id === id);
				if (slice) {
					for (const key in update) {
						if (Object.prototype.hasOwnProperty.call(update, key)) {
							slice[key] = update[key as keyof typeof update];
						}
					}
				}
			})
		);
	},
	updateSpace(update) {
		set(
			produce<Store>(state => {
				for (const key in update) {
					if (Object.prototype.hasOwnProperty.call(update, key)) {
						state.space[key] = update[key as keyof typeof update];
					}
				}
			})
		);
	},
}));
