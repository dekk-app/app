import { Group } from "@/canvas/group";
import { useFontStore } from "@/ions/hooks/fonts";
import { useEditor } from "@/ions/store/editor";
import { Slice as SliceType, TextEntity as TextEntityType, useSpace } from "@/ions/store/space";
import { getPoints } from "@/ions/utils/points";
import { Text } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import React, { MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import { Plane } from "three";

export const TextEntity = ({
	color,
	font,
	id,
	slice,
	text,
	width,
	textAlign,
	lineHeight,
	letterSpacing,
	x,
	y,
	z,
	anchorX,
	anchorY,
	clipPlanesInvert,
	clipPlanes,
}: TextEntityType & {
	slice: SliceType;
	clipPlanes: MutableRefObject<Plane[]>;
	clipPlanesInvert: MutableRefObject<Plane[]>;
}) => {
	const updateTextEntity = useSpace(state => state.updateTextEntity);
	const space = useSpace(state => state.space);
	const activeEntity = useEditor(state => state.activeEntity);
	const activeSlice = useEditor(state => state.activeSlice);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const fonts = useFontStore(state => state.fonts);

	const ref = useRef<typeof Text>();
	const { height: spaceHeight, width: spaceWidth } = space;
	const localCoords = useRef<Vector3>(new THREE.Vector3(x, y, z));
	const isActive = activeEntity === id;
	const isActiveSlice = activeSlice === slice.id;

	const fontObject = fonts?.find(({ family }) => family === font.family);
	const fontFile = fontObject?.files[font.variant];
	const siblings = useMemo(() => {
		const points = getPoints(spaceWidth, spaceHeight, { x: 4, y: 4 });
		return [...points, ...slice.entities.map(({ x, y, id }) => ({ x, y, id }))];
	}, [spaceWidth, spaceHeight, slice]);

	return (
		<Group
			draggable={isActiveSlice}
			x={x}
			y={y}
			z={z}
			id={id}
			showHelper={isActive}
			helperColor="#ff9c00"
			siblings={siblings}
			offset={{ x: slice.x, y: slice.y }}
			onDragEnd={event_ => {
				updateTextEntity({ x: event_.x, y: event_.y, z: event_.z }, id);
			}}
			onSpring={({ position }) => {
				localCoords.current = position;
			}}
			onDoubleClick={event_ => {
				event_.stopPropagation();
				setActiveEntity(id);
				setActiveSlice(slice.id);
			}}
		>
			{activeSlice === slice.id && (
				<Text
					overflowWrap="break-word"
					maxWidth={width ?? 1600}
					font={fontFile}
					fontSize={font.size}
					textAlign={textAlign}
					lineHeight={lineHeight}
					letterSpacing={letterSpacing}
					anchorX={anchorX}
					anchorY={anchorY}
				>
					<meshBasicMaterial
						clipIntersection
						transparent
						attach="material"
						opacity={0.05}
						color={color}
						clippingPlanes={clipPlanesInvert.current}
					/>
					{text}
				</Text>
			)}
			<Text
				ref={ref}
				overflowWrap="break-word"
				maxWidth={width ?? 1600}
				font={fontFile}
				fontSize={font.size}
				textAlign={textAlign}
				lineHeight={lineHeight}
				letterSpacing={letterSpacing}
				anchorX={anchorX}
				anchorY={anchorY}
			>
				<meshBasicMaterial
					attach="material"
					color={color}
					clippingPlanes={clipPlanes.current}
				/>
				{text}
			</Text>
		</Group>
	);
};
