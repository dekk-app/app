import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";

export interface Sibling {
	id: string;
	x: number;
	y: number;
}

export interface Offset {
	x: number;
	y: number;
}

export interface GroupProps {
	id: string;
	showHelper?: boolean;
	helperColor?: string;
	draggable?: boolean;
	x: number;
	y: number;
	z: number;
	siblings: Sibling[];
	offset: Offset;

	onDragEnd?(event_: { x: number; y: number; z: number }): void;

	onDoubleClick?(event_: ThreeEvent<PointerEvent>): void;

	onSpring?(value: { position: [number, number, number] }): void;
}

export interface WithSnapOptions {
	key: "x" | "y";
	id: string;
	siblings: Sibling[];
	threshold?: number;
	step?: number;
}
