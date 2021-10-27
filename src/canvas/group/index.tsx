import { GroupProps } from "@/canvas/group/types";
import { withSnap } from "@/canvas/group/with-snap";
import { useEditor } from "@/ions/store/editor";
import { a, useSpring } from "@react-spring/three";
import { useHelper } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events";
import { useDrag } from "@use-gesture/react";
import React, { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { Object3D } from "three";

export const Group: FC<GroupProps> = ({
	children,
	draggable,
	helperColor,
	onDoubleClick,
	onSpring,
	onDragEnd,
	showHelper,
	siblings,
	offset,
	id,
	x,
	y,
	z,
}) => {
	const zoom = useEditor(state => state.zoom);
	const setControllable = useEditor(state => state.setControllable);
	const setGuidesX = useEditor(state => state.setGuidesX);
	const setGuidesY = useEditor(state => state.setGuidesY);
	const controllable = useEditor(state => state.controllable);
	const { getCurrentViewport } = useThree(state => state.viewport);
	const camera = useThree(state => state.camera);

	const ref = useRef<Object3D>();
	const noRef = useRef<Object3D>();
	useHelper(showHelper ? ref : noRef, THREE.BoxHelper, helperColor);

	const [spring, api] = useSpring<{ position: [number, number, number] }>(() => ({
		position: [x, y, z],
		config: { mass: 0.1, tension: 150, friction: 5 },
		onChange({ value }: { value: { position: [number, number, number] } }) {
			if (onSpring) {
				onSpring(value);
			}
		},
	}));

	const bind = useDrag(
		({ event, down, movement: [mX, mY] }) => {
			// Prevent dragging underlying objects
			event.stopPropagation();
			const moved = mX !== 0 && mY !== 0;
			if (!draggable) {
				return;
			}

			const nextX = x + mX;
			const nextY = y + mY;
			const nextZ = z;
			const { value: snapX, guide: guideX } = withSnap(nextX, {
				key: "x",
				id,
				siblings,
				threshold: 10 / zoom,
			});
			const { value: snapY, guide: guideY } = withSnap(nextY, {
				key: "y",
				id,
				siblings,
				threshold: 10 / zoom,
			});

			// Animate to the new location
			api.start({
				position: [snapX, snapY, nextZ],
				immediate: down,
			});
			if (down) {
				const viewport = getCurrentViewport();
				// When down check if the controls are enabled and disable them to prevent moving
				// the canvas while dragging objects.
				if (controllable) {
					setControllable(false);
				}

				if (guideX && moved) {
					setGuidesX([
						new THREE.Vector3(
							snapX + offset.x,
							-viewport.height / 2 + camera.position.y,
							200
						),
						new THREE.Vector3(
							snapX + offset.x,
							viewport.height / 2 + camera.position.y,
							200
						),
					]);
				} else {
					setGuidesX(null);
				}

				if (guideY && moved) {
					setGuidesY([
						new THREE.Vector3(
							-viewport.width / 2 + camera.position.x,
							snapY + offset.y,
							200
						),
						new THREE.Vector3(
							viewport.width / 2 + camera.position.x,
							snapY + offset.y,
							200
						),
					]);
				} else {
					setGuidesY(null);
				}
			} else {
				// When done release the control-lock
				setControllable(true);
				setGuidesX(null);
				setGuidesY(null);
				if (onDragEnd) {
					onDragEnd({ x: snapX, y: snapY, z: nextZ });
				}
			}
		},
		{
			rubberband: true,
			transform: ([x, y]) => {
				return [x / zoom, -y / zoom];
			},
		}
	) as unknown as () => EventHandlers;

	useEffect(() => {
		api.start({
			position: [x, y, z],
			immediate: false,
		});
	}, [x, y, z, api]);

	return (
		<a.group {...bind()} {...spring} ref={ref} onDoubleClick={onDoubleClick}>
			{children}
		</a.group>
	);
};
