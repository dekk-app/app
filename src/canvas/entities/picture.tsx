import { Group } from "@/canvas/group";
import { useEditor } from "@/ions/store/editor";
import {
	PictureEntity as PictureEntityType,
	Slice as SliceType,
	useSpace,
} from "@/ions/store/space";
import { useLoader } from "@react-three/fiber";
import React, { MutableRefObject } from "react";
import * as THREE from "three";
import { Plane } from "three";

export const PictureEntity = ({
	src,
	height,
	id,
	width,
	slice,
	x,
	y,
	z,
	clipPlanes,
	clipPlanesInvert,
}: PictureEntityType & {
	slice: SliceType;
	clipPlanes: MutableRefObject<Plane[]>;
	clipPlanesInvert: MutableRefObject<Plane[]>;
}) => {
	const texture = useLoader(THREE.TextureLoader, src);
	const updatePictureEntity = useSpace(state => state.updatePictureEntity);
	const space = useSpace(state => state.space);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const activeEntity = useEditor(state => state.activeEntity);
	const activeSlice = useEditor(state => state.activeSlice);
	const isActive = activeEntity === id;
	const isActiveSlice = activeSlice === slice.id;
	const { height: spaceHeight, width: spaceWidth } = space;

	return (
		<Group
			draggable={isActiveSlice}
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
				updatePictureEntity({ x: event_.x, y: event_.y, z: event_.z }, id);
			}}
			onDoubleClick={event_ => {
				event_.stopPropagation();
				setActiveEntity(id);
				setActiveSlice(slice.id);
			}}
		>
			{activeSlice === slice.id && (
				<mesh renderOrder={0}>
					<planeBufferGeometry args={[width, height]} />
					<meshBasicMaterial
						transparent
						clipIntersection
						map={texture}
						toneMapped={false}
						opacity={0.05}
						clippingPlanes={clipPlanesInvert.current}
					/>
				</mesh>
			)}
			<mesh>
				<planeBufferGeometry args={[width, height]} />
				<meshBasicMaterial
					map={texture}
					toneMapped={false}
					clippingPlanes={clipPlanes.current}
				/>
			</mesh>
		</Group>
	);
};
