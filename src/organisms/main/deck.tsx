import { Controls } from "@/canvas/controls";
import { DarkModeListener } from "@/canvas/dark-mode";
import { Lights } from "@/canvas/lights";
import { Slice } from "@/canvas/slice";
import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { Object3D } from "three";
import useDarkMode from "use-dark-mode";

const Background = () => {
	const { value: darkMode } = useDarkMode();
	const setActiveEntity = useEditor(state => state.setActiveEntity);
	const setActiveSlice = useEditor(state => state.setActiveSlice);
	const zoom = useEditor(state => state.zoom);
	const { width, height } = useThree(state => state.viewport);
	const camera = useThree(state => state.camera);
	const ref = useRef<Object3D>();
	useFrame(() => {
		if (ref.current) {
			ref.current.position.set(camera.position.x, camera.position.y, 0);
		}
	});
	return (
		<mesh
			ref={ref}
			onDoubleClick={() => {
				setActiveEntity(null);
				setActiveSlice(null);
			}}
		>
			<planeBufferGeometry attach="geometry" args={[width / zoom, height / zoom]} />
			<meshBasicMaterial attach="material" color={darkMode ? "#1d1d1d" : "#f7f7f8"} />
		</mesh>
	);
};

export const ViewportListener = () => {
	const { getCurrentViewport } = useThree(state => state.viewport);
	const setViewport = useEditor(state => state.setViewport);
	useFrame(() => {
		const { width, height } = getCurrentViewport();
		setViewport({ width, height });
	});
	return null;
};

export const Main = () => {
	const slices = useSpace(state => state.slices);
	const guidesX = useEditor(state => state.guidesX);
	const guidesY = useEditor(state => state.guidesY);

	return (
		<Canvas
			flat
			orthographic
			camera={{ position: [0, 0, 1000], up: [0, 0, 1], far: 10_000 }}
			onCreated={({ gl, setDpr }) => {
				gl.localClippingEnabled = true;
				setDpr(window.devicePixelRatio);
			}}
		>
			<Suspense fallback={null}>
				<DarkModeListener />
				<ViewportListener />
				<Controls />
				<Lights />
				<Background />
				{slices.map(slice => {
					return <Slice key={slice.id} {...slice} />;
				})}
				{guidesX && <Line points={guidesX} color="#cb9800" renderOrder={200} />}
				{guidesY && <Line points={guidesY} color="#cb9800" renderOrder={200} />}
			</Suspense>
		</Canvas>
	);
};
