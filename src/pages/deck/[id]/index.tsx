import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import {
	ImageLayerInput,
	Layer as LayerType,
	Slide as SlideType,
	TextLayerInput,
	useStore,
} from "@/ions/store";
import { pxToRem } from "@/ions/utils/unit";
import {
	StyledBox,
	StyledButtonRow,
	StyledFieldRow,
	StyledHeader,
	StyledLayoutWithLeftRight,
	StyledLeft,
	StyledMain,
	StyledPressable,
	StyledRight,
} from "@/organisms/layout/styled";
import { PageProps } from "@/types";
import { ColorInput } from "@dekk-ui/color-input-field";
import { Icon } from "@dekk-ui/icon";
import { IconButton } from "@dekk-ui/icon-button";
import { NumberInput } from "@dekk-ui/input-field";
import { InputLabel } from "@dekk-ui/input-label";
import styled from "@emotion/styled";
import { Html, Text } from "@react-three/drei";
import { Canvas as R3FCanvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import CameraControls from "camera-controls";
import { ContentState, Editor, EditorState } from "draft-js";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession } from "next-auth/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { FC, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WebGLRenderer } from "three";
import useDarkMode from "use-dark-mode";

interface TextEditorProps {
	value?: string;
	layerId?: string;
}
const TextEditor = (props: TextEditorProps) => {
	const updateLayer = useStore(state => state.updateLayer);
	const [editorState, setEditorState] = React.useState(() =>
		EditorState.createWithContent(ContentState.createFromText(props.value))
	);

	return (
		<Editor
			editorState={editorState}
			onChange={state => {
				const text = state.getCurrentContent().getPlainText();
				updateLayer(props.layerId, { text });
				setEditorState(state);
			}}
		/>
	);
};

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

const Canvas: FC = ({ children }) => {
	const { value: darkMode } = useDarkMode();
	const [gl, setGL] = useState<WebGLRenderer>(null);
	useEffect(() => {
		if (gl) {
			gl.setClearColor(darkMode ? "#1d1d1d" : "#f7f7f8");
		}
	}, [gl, darkMode]);
	return (
		<R3FCanvas
			linear
			orthographic
			gl={{
				powerPreference: "high-performance",
				alpha: false,
				antialias: false,
				stencil: false,
				depth: false,
			}}
			camera={{ position: [0, 0, 50], zoom: 50, up: [0, 0, 1], far: 10_000 }}
			onCreated={({ gl: webGLRenderer }) => {
				setGL(webGLRenderer);
				webGLRenderer.localClippingEnabled = true;
			}}
		>
			<Suspense fallback={null}>{children}</Suspense>
		</R3FCanvas>
	);
};

const Lights = () => {
	return (
		<group>
			<ambientLight intensity={1} />
		</group>
	);
};

const Controls = () => {
	// Focus on slide
	// const position = useMemo(() => new THREE.Vector3(), []);
	// const look = useMemo(() => new THREE.Vector3(), []);
	// const activeSlideRef = useStore(state => state.activeSlideRef);

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
		controls.mouseButtons.right = null;
		controls.minZoom = 3;
		controls.maxZoom = 100;
	}, [controls]);

	useFrame(() => {
		const delta = clock.getDelta();
		setZoom(controls.camera.zoom);
		// Focus on slide
		// if (activeSlideRef?.current) {
		// 	const { x, y, z } = activeSlideRef.current.position;
		// 	position.set(x, y, z + 0.2);
		// 	look.set(x, y, z - 0.2);
		// 	state.camera.position.lerp(position, 1);
		// 	state.camera.updateProjectionMatrix();
		// 	controls.setLookAt(
		// 		state.camera.position.x,
		// 		state.camera.position.y,
		// 		state.camera.position.z,
		// 		look.x,
		// 		look.y,
		// 		look.z,
		// 		true
		// 	);
		// }

		return controls.update(delta);
	});
	return null;
};

export interface LayerProps {
	layer: LayerType;
	slide: SlideType;
}

const Layer = ({ layer, slide }: LayerProps) => {
	const { id } = layer;
	const ref = useRef<THREE.Object3D>();

	const activeLayer = useStore(state => state.activeLayer);
	const setActiveLayer = useStore(state => state.setActiveLayer);
	const setActiveSlide = useStore(state => state.setActiveSlide);
	const setActiveLayerRef = useStore(state => state.setActiveLayerRef);
	useEffect(() => {
		if (id === activeLayer && ref.current) {
			setActiveLayerRef(ref);
		}
	}, [activeLayer, setActiveLayerRef, ref, id]);
	switch (layer.__typename) {
		case "text":
			return (
				<group
					ref={ref}
					position={[layer.x ?? 0, layer.y ?? 0, 0.1]}
					onClick={event_ => {
						event_.stopPropagation();
						setActiveLayer(layer.id);
						setActiveSlide(slide.id);
						console.log("TEXT LAYER");
					}}
				>
					<Text
						fontSize={layer.font.size / 100}
						overflowWrap="normal"
						maxWidth={layer.width ?? 16}
						textAlign="center"
						color={layer.color || slide.color}
					>
						{layer.text}
					</Text>
					{layer.id === activeLayer && (
						<Html transform distanceFactor={20}>
							<div
								style={{
									fontSize: (layer.font.size / 100) * 20,
									minWidth: "1em",
									maxWidth: (layer.width ?? 16) * 20,
									minHeight: "1em",
									fontFamily: "Roboto",
									boxShadow: "0 0 0 1px highlight",
									textAlign: "center",
									lineHeight: 1,
									color: "transparent",
									caretColor: layer.color || slide.color,
								}}
							>
								<TextEditor value={layer.text} layerId={layer.id} />
							</div>
						</Html>
					)}
				</group>
			);
		case "image":
			return (
				<group
					ref={ref}
					position={[layer.x ?? 0, layer.y ?? 0, 0.1]}
					onClick={event_ => {
						event_.stopPropagation();
						setActiveLayer(layer.id);
						setActiveSlide(slide.id);
						console.log("IMAGE LAYER");
					}}
				>
					{" "}
					<Picture key={layer.id} src={layer.src} args={[8, 8]} />
				</group>
			);
		default:
			return null;
	}
};

interface SlideProps {
	position: [number, number, number];
	id: string;
	background?: string;
	width: number;
	height: number;
}
const Slide: FC<SlideProps> = ({
	id,
	background = "#ffffff",
	children,
	position,
	width,
	height,
}) => {
	const zoom = useStore(state => state.zoom);
	const ref = useRef<THREE.Object3D>();
	const setActiveSlide = useStore(state => state.setActiveSlide);
	const setActiveLayer = useStore(state => state.setActiveLayer);
	// Set ref to currently active slide
	const activeSlide = useStore(state => state.activeSlide);
	const setActiveSlideRef = useStore(state => state.setActiveSlideRef);

	useEffect(() => {
		if (id === activeSlide && ref.current) {
			setActiveSlideRef(ref);
		}
	}, [activeSlide, setActiveSlideRef, ref, id]);
	return (
		<>
			<mesh
				ref={ref}
				position={position}
				onClick={event_ => {
					event_.stopPropagation();
					setActiveSlide(id);
					setActiveLayer(null);
					console.log("SLIDE");
				}}
			>
				<planeGeometry args={[width, height]} />
				<meshStandardMaterial color={background} />
			</mesh>
			<group position={position}>
				<group position={[-8, 4.5, 0]}>
					<Html>
						<StyledSlideLabel style={{ maxWidth: zoom * 16 }}>{id}</StyledSlideLabel>
					</Html>
				</group>
				{children}
			</group>
		</>
	);
};

const CanvasLogic = () => {
	const slides = useStore(state => state.slides);
	const activeSlide = useStore(state => state.activeSlide);
	const activeLayer = useStore(state => state.activeLayer);
	const activeSlideRef = useStore(state => state.activeSlideRef);
	const setActiveSlideRef = useStore(state => state.setActiveSlideRef);
	const setActiveLayerRef = useStore(state => state.setActiveLayerRef);
	useEffect(() => {
		if (!activeSlide) {
			setActiveSlideRef(null);
		}
	}, [activeSlide, setActiveSlideRef]);
	useEffect(() => {
		if (!activeLayer) {
			setActiveLayerRef(null);
		}
	}, [activeLayer, setActiveLayerRef]);
	return (
		<>
			<Lights />
			<Controls />
			{slides.map(slide => {
				return (
					<Slide
						key={slide.id}
						position={[slide.x, slide.y, 0]}
						width={slide.width}
						height={slide.height}
						id={slide.id}
						background={slide.background}
					>
						{slide.layers.map(layer => {
							return <Layer key={layer.id} layer={layer} slide={slide} />;
						})}
					</Slide>
				);
			})}
			<EffectComposer multisampling={8} autoClear={false}>
				{activeSlideRef && (
					<Outline
						selection={activeSlideRef}
						visibleEdgeColor={0x00_00_ff}
						hiddenEdgeColor={0x00_00_ff}
						edgeStrength={10}
					/>
				)}
			</EffectComposer>
		</>
	);
};

const Page: NextPage<PageProps> = () => {
	const { t } = useTranslation(["editor", "menu"]);
	const addSlide = useStore(state => state.addSlide);
	const addLayer = useStore(state => state.addLayer);
	const slides = useStore(state => state.slides);

	const setActiveSlide = useStore(state => state.setActiveSlide);
	const setActiveLayer = useStore(state => state.setActiveLayer);
	const updateSlide = useStore(state => state.updateSlide);
	const updateLayer = useStore(state => state.updateLayer);
	const activeSlide = useStore(state => state.activeSlide);
	const activeLayer = useStore(state => state.activeLayer);
	const currentSlide = slides.find(slide => slide.id === activeSlide);
	const currentLayer = currentSlide?.layers.find(slide => slide.id === activeLayer);

	return (
		<StyledLayoutWithLeftRight>
			<StyledHeader>
				<StyledBox>
					<Link passHref href="/dashboard">
						<a>{t("menu:dashboard")}</a>
					</Link>
				</StyledBox>
				<StyledButtonRow>
					<IconButton
						icon="editorText"
						aria-label={t("editor:text")}
						onClick={() => {
							addLayer<TextLayerInput>({ type: "text", text: "Text" });
						}}
					/>
					<IconButton
						icon="editorImage"
						aria-label={t("editor:image")}
						onClick={() => {
							addLayer<ImageLayerInput>({
								type: "image",
								src: "/assets/robot.png",
							});
						}}
					/>
				</StyledButtonRow>
			</StyledHeader>
			<StyledLeft>
				<StyledPressable
					onClick={() => {
						addSlide({ title: "Hello" });
					}}
				>
					<div>{t("editor:add-slide")}</div>
					<Icon icon="plus" />
				</StyledPressable>
				<StyledBox isScrollable noSpaces>
					{slides.map((slide, slideIndex) => {
						return (
							<div key={slide.id}>
								<StyledPressable
									onClick={() => {
										setActiveSlide(slide.id);
										setActiveLayer(null);
									}}
								>
									<div>Slide: {slideIndex}</div> <Icon icon="chevronUp" />
								</StyledPressable>
								<div>
									{slide.layers.map((layer, layerIndex) => {
										return (
											<StyledPressable
												key={layer.id}
												indentLevel={1}
												onClick={() => {
													setActiveSlide(slide.id);
													setActiveLayer(layer.id);
												}}
											>
												<div>Layer: {layerIndex}</div>
											</StyledPressable>
										);
									})}
								</div>
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
				{currentLayer ? (
					<div>
						{currentLayer?.__typename === "text" && (
							<>
								<StyledFieldRow>
									<InputLabel htmlFor="layer:fontSize">
										{t("editor:fontSize")}
									</InputLabel>
									<NumberInput
										id="layer:fontSize"
										value={currentLayer.font.size}
										onChange={size => {
											updateLayer(currentLayer.id, { font: { size } });
										}}
									/>
								</StyledFieldRow>

								<StyledFieldRow>
									<NumberInput
										id="layer:x"
										value={currentLayer.x}
										onChange={x => {
											updateLayer(currentLayer.id, { x });
										}}
									/>
									<NumberInput
										id="layer:y"
										value={currentLayer.y}
										onChange={y => {
											updateLayer(currentLayer.id, { y });
										}}
									/>
								</StyledFieldRow>
							</>
						)}
					</div>
				) : (
					currentSlide && (
						<div>
							<StyledFieldRow>
								<InputLabel htmlFor="slide:background">
									{t("editor:background")}
								</InputLabel>
								<ColorInput
									key={currentSlide.id}
									id="slide:background"
									defaultValue={currentSlide.background}
									onChange={event_ => {
										updateSlide(currentSlide.id, {
											background: event_.target.value,
										});
									}}
								/>
							</StyledFieldRow>
							<StyledFieldRow>
								<InputLabel htmlFor="slide:color">{t("editor:color")}</InputLabel>
								<ColorInput
									key={currentSlide.id}
									id="slide:color"
									defaultValue={currentSlide.color}
									onChange={event_ => {
										updateSlide(currentSlide.id, {
											color: event_.target.value,
										});
									}}
								/>
							</StyledFieldRow>
						</div>
					)
				)}
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
