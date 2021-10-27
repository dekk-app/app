import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

CameraControls.install({ THREE });
export const clock = new THREE.Clock();

export const Controls = () => {
	const camera = useThree(state => state.camera);
	const { getCurrentViewport } = useThree(state => state.viewport);
	const setZoom = useEditor(state => state.setZoom);
	const { domElement } = useThree(state => state.gl);
	const controllable = useEditor(state => state.controllable);
	const controls = useMemo(() => new CameraControls(camera, domElement), [camera, domElement]);
	const activeSlice = useEditor(state => state.activeSlice);
	useEffect(() => {
		if (activeSlice) {
			const slice = useSpace.getState().slices.find(({ id }) => id === activeSlice);
			const zoom = useEditor.getState().zoom;
			const space = useSpace.getState().space;
			const viewport = getCurrentViewport();
			void controls.moveTo(slice.x, slice.y, 0);
			void controls.zoomTo((viewport.width * zoom) / space.width);
		}
	}, [activeSlice, getCurrentViewport, controls]);

	useEffect(() => {
		const viewport = getCurrentViewport();
		const zoom = useEditor.getState().zoom;
		const space = useSpace.getState().space;

		void controls.zoomTo((viewport.width * zoom) / space.width);
	}, [controls, getCurrentViewport]);

	useEffect(() => {
		controls.dollyToCursor = true;
		controls.minPolarAngle = 0;
		controls.maxPolarAngle = 0;
		controls.minAzimuthAngle = 0;
		controls.maxAzimuthAngle = 0;
		controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
		controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
		controls.mouseButtons.right = CameraControls.ACTION.NONE;
		controls.minZoom = 0.05;
		controls.maxZoom = 2;
	}, [controls]);

	useEffect(() => {
		controls.enabled = controllable;
	}, [controls, controllable]);

	useFrame(() => {
		const delta = clock.getDelta();
		setZoom(controls.camera.zoom);
		return controls.update(delta);
	});
	return null;
};
