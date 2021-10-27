import { PictureEntity } from "@/canvas/entities/picture";
import { TextEntity } from "@/canvas/entities/text";
import { Group } from "@/canvas/group";
import { useEditor } from "@/ions/store/editor";
import { Slice as SliceType, useSpace } from "@/ions/store/space";
import { Line } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export const Slice = (slice: SliceType) => {
	const { backgroundColor, color, entities, id, x, y, z } = slice;
	const { width, height, ...space } = useSpace(state => state.space);
	const slices = useSpace(state => state.slices);
	const updateSlice = useSpace(state => state.updateSlice);
	const activeSlice = useEditor(state => state.activeSlice);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const points = useMemo(
		() => [
			new THREE.Vector3(width / 2, height / 2, 0),
			new THREE.Vector3(width / -2, height / 2, 0),
			new THREE.Vector3(width / -2, height / -2, 0),
			new THREE.Vector3(width / 2, height / -2, 0),
			new THREE.Vector3(width / 2, height / 2, 0),
		],
		[width, height]
	);

	const clipPlanes = useRef([
		new THREE.Plane(new THREE.Vector3(0, 1, 0), -y + height / 2),
		new THREE.Plane(new THREE.Vector3(0, -1, 0), y + height / 2),
		new THREE.Plane(new THREE.Vector3(1, 0, 0), -x + width / 2),
		new THREE.Plane(new THREE.Vector3(-1, 0, 0), x + width / 2),
	]);
	const clipPlanesInvert = useRef([
		new THREE.Plane(new THREE.Vector3(0, 1, 0), -y - height / 2),
		new THREE.Plane(new THREE.Vector3(0, -1, 0), y - height / 2),
		new THREE.Plane(new THREE.Vector3(1, 0, 0), -x - width / 2),
		new THREE.Plane(new THREE.Vector3(-1, 0, 0), x - width / 2),
	]);

	useEffect(() => {
		clipPlanes.current[0].constant = -y + height / 2;
		clipPlanes.current[1].constant = y + height / 2;
		clipPlanes.current[2].constant = -x + width / 2;
		clipPlanes.current[3].constant = x + width / 2;
		clipPlanesInvert.current[0].constant = -y - height / 2;
		clipPlanesInvert.current[1].constant = y - height / 2;
		clipPlanesInvert.current[2].constant = -x - width / 2;
		clipPlanesInvert.current[3].constant = x - width / 2;
	}, [clipPlanes, clipPlanesInvert, y, x, height, width]);

	return (
		<Group
			draggable
			x={x}
			y={y}
			z={z}
			id={id}
			showHelper={activeSlice === id}
			helperColor="#ab32ba"
			siblings={slices.flatMap(({ x, y, id }) => [
				{ x, y, id },
				{ x: x + width / 2, y: y + height / 2, id },
				{ x: x - width / 2, y: y - height / 2, id },
			])}
			offset={{ x: 0, y: 0 }}
			onDoubleClick={event_ => {
				event_.stopPropagation();
				setActiveSlice(id);
				setActiveEntity(null);
			}}
			onDragEnd={event_ => {
				updateSlice({ x: event_.x, y: event_.y, z: event_.z }, id);
			}}
			onSpring={({ position }) => {
				clipPlanes.current[0].constant = -position[1] + height / 2;
				clipPlanes.current[1].constant = position[1] + height / 2;
				clipPlanes.current[2].constant = -position[0] + width / 2;
				clipPlanes.current[3].constant = position[0] + width / 2;
				clipPlanesInvert.current[0].constant = -position[1] - height / 2;
				clipPlanesInvert.current[1].constant = position[1] - height / 2;
				clipPlanesInvert.current[2].constant = -position[0] - width / 2;
				clipPlanesInvert.current[3].constant = position[0] - width / 2;
			}}
		>
			<mesh>
				<planeBufferGeometry attach="geometry" args={[width, height]} />
				<meshBasicMaterial
					attach="material"
					color={backgroundColor ?? space.backgroundColor}
				/>
			</mesh>

			{entities.map((entity, index) => {
				switch (entity.__typename) {
					case "text":
						return (
							<TextEntity
								key={entity.id}
								color={color ?? space.color}
								{...entity}
								slice={slice}
								clipPlanes={clipPlanes}
								clipPlanesInvert={clipPlanesInvert}
								z={index + 10}
							/>
						);
					case "picture":
						return (
							<PictureEntity
								key={entity.id}
								{...entity}
								slice={slice}
								clipPlanes={clipPlanes}
								clipPlanesInvert={clipPlanesInvert}
								z={index + 10}
							/>
						);
					default:
						return null;
				}
			})}
			{activeSlice === id && <Line points={points} color="#007bff" lineWidth={1} />}
		</Group>
	);
};
