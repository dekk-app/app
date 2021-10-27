import { Group } from "@/canvas/group";
import { useFontStore } from "@/ions/hooks/fonts";
import { useEditor } from "@/ions/store/editor";
import { Slice as SliceType, TextEntity as TextEntityType, useSpace } from "@/ions/store/space";
import { Text } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import React, { MutableRefObject, useRef } from "react";
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
	// Enable for editable tests
	// const [caret, setCaret] = useState({ x: 0, y: 0, height: 0, charIndex: 0 });
	const isActive = activeEntity === id;

	const fontObject = fonts?.find(({ family }) => family === font.family);
	const fontFile = fontObject?.files[font.variant];

	return (
		<Group
			draggable
			x={x}
			y={y}
			z={z}
			id={id}
			showHelper={isActive}
			helperColor="#ff9c00"
			siblings={[
				{ id: "center", x: 0, y: 0 },
				{ id: "left", x: spaceWidth / -4, y: 0 },
				{ id: "right", x: spaceWidth / 4, y: 0 },
				{ id: "top", x: 0, y: spaceHeight / 4 },
				{ id: "bottom", x: 0, y: spaceHeight / -4 },
				{ id: "topLeft", x: spaceWidth / -4, y: spaceHeight / -4 },
				{ id: "bottomLeft", x: spaceWidth / -4, y: spaceHeight / -4 },
				{ id: "topRight", x: spaceWidth / 4, y: spaceHeight / -4 },
				{ id: "bottomRight", x: spaceWidth / 4, y: spaceHeight / -4 },
				...slice.entities.map(({ x, y, id }) => ({ x, y, id })),
			]}
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
				onClick={
					(/* event_ */) => {
						/*
					* SetCaret(
						getCaretAtPoint(
							ref.current.textRenderInfo,
							event_.point.x - x - slice.x,
							event_.point.y - y - slice.y
						)
					);
					* */
					}
				}
			>
				<meshBasicMaterial
					attach="material"
					color={color}
					clippingPlanes={clipPlanes.current}
				/>
				{text}
			</Text>
			{/*
				isActive && (

				<Html transform distanceFactor={1000}>
					<div
						style={{
							maxWidth: (width ?? 1600) / 2.5,
							minHeight: (font.size / 2.5) * 1.2,
							lineHeight,
							fontSize: font.size / 2.5,
							fontFamily: "Roboto",
							letterSpacing: letterSpacing,
							textAlign,
							color: "red",
							caretColor: color,
						}}
					>
						<TextEditor value={text} entityId={id} />
					</div>
				</Html>
			)
				 */}

			{/*
			isActive && (
				<Line
					points={[
						[caret.x, caret.y + caret.height, 0],
						[caret.x, caret.y, 0],
					]}
					color={color}
					lineWidth={1}
				/>
			)
			*/}
		</Group>
	);
};
