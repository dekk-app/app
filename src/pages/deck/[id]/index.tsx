import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import { useStore } from "@/ions/store";
import { pxToRem } from "@/ions/utils/unit";
import {
	StyledBox,
	StyledButtonRow,
	StyledFieldRow,
	StyledHeader,
	StyledLayoutWithLeftRight,
	StyledLeft,
	StyledMain,
	StyledRight,
} from "@/organisms/layout/styled";
import { PageProps } from "@/types";
import { Button } from "@dekk-ui/button";
import { IconButton } from "@dekk-ui/icon-button";
import { NumberInput } from "@dekk-ui/input-field";
import { InputLabel } from "@dekk-ui/input-label";
import styled from "@emotion/styled";
import { Html, Text } from "@react-three/drei";
import { Canvas as R3FCanvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import CameraControls from "camera-controls";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { FC, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

CameraControls.install({ THREE });
const clock = new THREE.Clock();

const useControls = () => {
	const camera = useThree(state => state.camera);
	const { domElement } = useThree(state => state.gl);
	return useMemo(() => new CameraControls(camera, domElement), [camera, domElement]);
};

const StyledSlideLabel = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	overflow: hidden;
	font-size: ${pxToRem(14)};
	text-overflow: ellipsis;
	white-space: nowrap;
	pointer-events: none;
`;

interface PictureProps {
	src: string;
	args: [number, number];
}
const Picture = ({ src, args }: PictureProps) => {
	const texture = useLoader(THREE.TextureLoader, src);

	return (
		<mesh>
			<planeBufferGeometry args={args} />
			<meshBasicMaterial map={texture} toneMapped={false} />
		</mesh>
	);
};

const gl = {
	powerPreference: "high-performance",
	alpha: false,
	antialias: false,
	stencil: false,
	depth: false,
};
const Canvas: FC = ({ children }) => {
	return (
		<R3FCanvas
			linear
			orthographic
			gl={gl}
			camera={{ position: [0, 0, 50], zoom: 80, up: [0, 0, 1], far: 10_000 }}
			onCreated={({ gl }) => {
				gl.setClearColor("#1d1d1d");
			}}
		>
			<Suspense fallback={null}>{children}</Suspense>
		</R3FCanvas>
	);
};

const Lights = () => {
	return (
		<group>
			<pointLight intensity={0.3} />
			<ambientLight intensity={1} />
			<spotLight intensity={0.2} position={[0, 150, 250]} />
		</group>
	);
};

const Controls = () => {
	const controls = useControls();
	const setZoom = useStore(state => state.setZoom);
	useEffect(() => {
		controls.dollyToCursor = true;
		controls.minPolarAngle = 0;
		controls.maxPolarAngle = 0;
		controls.minAzimuthAngle = 0;
		controls.maxAzimuthAngle = 0;
		controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
		controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
		controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
		controls.minZoom = 3;
		controls.maxZoom = 100;
		console.log(controls);
	}, [controls]);

	useFrame(() => {
		const delta = clock.getDelta();
		setZoom(controls.camera.zoom);
		return controls.update(delta);
	});
	return null;
};

const Slide: FC<{ position: [number, number, number]; id: string }> = ({
	id,
	children,
	position,
}) => {
	const zoom = useStore(state => state.zoom);
	const ref = useRef<THREE.Object3D>();
	const setActiveSlide = useStore(state => state.setActiveSlide);
	const setActiveSlideRef = useStore(state => state.setActiveSlideRef);
	return (
		<group position={position}>
			<mesh
				ref={ref}
				onClick={() => {
					setActiveSlideRef(ref);
					setActiveSlide(id);
				}}
			>
				<planeGeometry args={[16, 9]} />
				<meshStandardMaterial color="#131312" />
			</mesh>

			<group position={[-8, 4.5, 0]}>
				<Html>
					<StyledSlideLabel style={{ maxWidth: zoom * 16 }}>{id}</StyledSlideLabel>
				</Html>
			</group>
			{children}
		</group>
	);
};

const CanvasLogic = () => {
	const slides = useStore(state => state.slides);
	const activeSlideRef = useStore(state => state.activeSlideRef);
	return (
		<>
			<Lights />
			<Controls />
			{slides.map(slide => {
				return (
					<Slide key={slide.id} position={[slide.x, slide.y, 0]} id={slide.id}>
						{slide.layers.map(layer => {
							switch (layer.type) {
								case "text":
									return (
										<Text
											key={layer.id}
											fontSize={4}
											overflowWrap="normal"
											maxWidth={16}
											textAlign="center"
										>
											{layer.value}
										</Text>
									);
								case "image":
									return (
										<Picture key={layer.id} src={layer.value} args={[8, 8]} />
									);
								case "plane":
								case "box":
								default:
									return null;
							}
						})}
					</Slide>
				);
			})}
			{activeSlideRef && (
				<EffectComposer multisampling={8} autoClear={false}>
					<Outline
						selection={activeSlideRef}
						visibleEdgeColor={0xff_ff_ff}
						edgeStrength={4}
					/>
				</EffectComposer>
			)}
		</>
	);
};

const Page: NextPage<PageProps> = () => {
	const addSlide = useStore(state => state.addSlide);
	const addLayer = useStore(state => state.addLayer);
	const slides = useStore(state => state.slides);
	return (
		<StyledLayoutWithLeftRight>
			<StyledHeader>
				<StyledButtonRow>
					<IconButton
						icon="editorText"
						onClick={() => {
							addLayer({ type: "text", value: "Text" });
						}}
					/>
					<IconButton
						icon="editorImage"
						onClick={() => {
							addLayer({ type: "image", value: "/assets/robot.png" });
						}}
					/>
				</StyledButtonRow>
			</StyledHeader>
			<StyledLeft>
				<StyledBox>
					<Link passHref href="/dashboard">
						<a>Dashboard</a>
					</Link>
				</StyledBox>
				<StyledBox>
					<StyledButtonRow>
						<Button
							onClick={() => {
								addSlide({ title: "Hello" });
							}}
						>
							Add Slide
						</Button>
					</StyledButtonRow>
				</StyledBox>
				<StyledBox isScrollable>
					{slides.map((slide, slideIndex) => {
						return (
							<div key={slide.id}>
								<h4>Slide: {slideIndex}</h4>
								<ul>
									{slide.layers.map((layer, layerIndex) => {
										return <li key={layer.id}>Layer: {layerIndex}</li>;
									})}
								</ul>
							</div>
						);
					})}
				</StyledBox>
			</StyledLeft>
			<StyledMain>
				<Canvas>
					<CanvasLogic />
				</Canvas>
			</StyledMain>
			<StyledRight>
				<div>
					<StyledFieldRow>
						<InputLabel htmlFor="number-1">Number</InputLabel>
						<NumberInput id="number-1" textAlign="right" />
					</StyledFieldRow>
					<StyledFieldRow>
						<InputLabel htmlFor="number-2">Number</InputLabel>
						<NumberInput id="number-2" textAlign="right" />
					</StyledFieldRow>
					<StyledFieldRow>
						<InputLabel htmlFor="number-3">Number</InputLabel>
						<NumberInput id="number-3" textAlign="right" />
					</StyledFieldRow>
				</div>
			</StyledRight>
		</StyledLayoutWithLeftRight>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
	const apolloClient = initializeApollo();

	return addApolloState(apolloClient, {
		props: {
			...(await serverSideTranslations(context.locale)),
			providers: await getProviders(),
			session: await getSession(context),
			locale: context.locale,
		},
	});
};

export default Page;
