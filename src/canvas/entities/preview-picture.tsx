import { PictureEntity as PictureEntityType } from "@/ions/store/space";
import { useLoader } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";

export const PreviewPictureEntity = ({ src, height, width, x, y, z }: PictureEntityType) => {
	const texture = useLoader(THREE.TextureLoader, src);
	return (
		<group position={[x, y, z]}>
			<mesh>
				<planeBufferGeometry args={[width, height]} />
				<meshBasicMaterial map={texture} toneMapped={false} />
			</mesh>
		</group>
	);
};
