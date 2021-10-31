import { TextureProps } from "@react-three/fiber/dist/declarations/src/three-types";
import React from "react";
import * as THREE from "three";

export interface GradientTextureProps extends TextureProps {
	stops: number[];
	colors: string[];
	attach?: string;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	width: number;
	height: number;
}

export const GradientTexture = ({
	stops,
	colors,
	width,
	height,
	x1,
	x2,
	y1,
	y2,
	...props
}: GradientTextureProps) => {
	const texture = React.useMemo(() => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d")!;
		canvas.width = width;
		canvas.height = height;
		const gradient = context.createLinearGradient(x1, y1, x2, y2);
		let i = stops.length;
		while (i--) {
			gradient.addColorStop(stops[i], colors[i]);
		}

		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
		const texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		return texture;
	}, [stops, colors, x1, x2, y1, y2, width, height]);
	React.useEffect(
		() => () => {
			texture.dispose();
		},
		[texture]
	);
	return <primitive object={texture} attach="map" {...props} />;
};
