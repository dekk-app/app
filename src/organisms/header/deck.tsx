import List from "@/atoms/list";
import ListItem from "@/atoms/list-item";
import { useOnClickOutside } from "@/ions/hooks/click-outside";
import { useUnsplash } from "@/ions/hooks/images";
import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { pxToRem } from "@/ions/utils/unit";
import { StyledMasonryBox, StyledMasonryGrid } from "@/organisms/header/masonry";
import { StyledButtonRow } from "@/organisms/layout/styled";
import { focus } from "@dekk-ui/focus-ring";
import { IconButton } from "@dekk-ui/icon-button";
import { TextInput } from "@dekk-ui/input-field";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";
import React, { ComponentType, forwardRef, ReactNode, useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";

export const StyledDropDownWrapper = styled.div`
	display: flex;
	position: relative;
`;

export const StyledDropDownHeader = styled.header`
	${({ theme }) => css`
		padding: ${pxToRem(theme.space.xs)} ${pxToRem(theme.space.s)};
	`};
`;
export const StyledDropDownRef = styled.div`
	display: flex;
	position: relative;
	align-content: center;
	align-items: center;
`;

export const StyledDropDown = styled.div`
	display: flex;
	position: absolute;
	z-index: 100;
	top: 100%;
	left: 50%;
	flex-direction: column;
	max-height: ${pxToRem(600)};
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 7px 12px rgba(0, 0, 0, 0.25);
	${({ theme }) => css`
		background: ${theme.ui.fill["1"]};
		margin-top: ${pxToRem(theme.space.xs + theme.space.xxs)};
		border-radius: ${pxToRem(theme.radius.s)};
		transform: translate(-50%, ${pxToRem(theme.space.xs)});
	`};
`;

export const StyledScroll = styled.div`
	display: flex;
	flex: 1;
	overflow: auto;
`;

const StyledImage = styled.img`
	width: 100%;
	height: auto;
	border-radius: inherit;
`;

export interface DropDownProps {
	button: ComponentType;
	open?: boolean;
	width?: number;
	children: ReactNode;
}
export const DropDown = forwardRef<HTMLDivElement, DropDownProps>(
	({ children, width, button: Button, open }, ref) => {
		const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
		const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
		const { styles, attributes } = usePopper(referenceElement, popperElement);
		return (
			<StyledDropDownWrapper ref={ref}>
				<StyledDropDownRef ref={setReferenceElement}>
					<Button />
					{open && (
						<StyledDropDown
							ref={setPopperElement}
							style={{ ...styles.popper, width }}
							{...attributes.popper}
						>
							{children}
						</StyledDropDown>
					)}
				</StyledDropDownRef>
			</StyledDropDownWrapper>
		);
	}
);

DropDown.displayName = "DropDown";

export const StyledTextButton = styled.button`
	display: flex;
	width: 100%;
	border: 0;
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	background: none;
	color: inherit;
	text-align: left;

	&:focus {
		outline: 0;
	}

	&:focus-visible {
		${focus};
	}

	&:hover {
		background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
	}

	&:active {
		background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
	}

	${({ theme }) => css`
		padding: ${pxToRem(theme.space.s)};
	`};
`;

const textPresets = [
	{
		title: "Title",
		id: "Title",
		size: 160,
		family: "Roboto",
		weight: 900,
		variant: "900",
	},
	{
		title: "Headline",
		id: "Headline",
		size: 120,
		family: "Roboto",
		weight: 700,
		variant: "700",
	},
	{
		title: "Subtitle",
		id: "Subtitle",
		size: 100,
		family: "Roboto",
		weight: 400,
		variant: "regular",
	},
	{
		title: "Body",
		id: "Body",
		size: 80,
		family: "Roboto",
		weight: 400,
		variant: "regular",
	},
];

const TextDropDown = () => {
	const { t } = useTranslation(["editor"]);
	const addTextEntity = useSpace(state => state.addTextEntity);
	const activeSlice = useEditor(state => state.activeSlice);
	const [textOpen, setTextOpen] = useState(false);
	const textRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(
		textRef,
		useCallback(() => {
			setTextOpen(false);
		}, [])
	);
	return (
		<DropDown
			ref={textRef}
			open={textOpen}
			button={() => (
				<IconButton
					icon="formatText"
					isSelected={textOpen}
					disabled={!activeSlice}
					aria-label={t("editor:text")}
					onClick={() => {
						setTextOpen(previousState => !previousState);
					}}
				/>
			)}
		>
			<StyledScroll>
				<List>
					{textPresets.map(({ id, title, size, family, weight, variant }) => {
						return (
							<ListItem key={id}>
								<StyledTextButton
									onClick={() => {
										addTextEntity(
											{
												text: title,
												width: 800,
												font: {
													size,
													family,
													weight,
													variant,
												},
											},
											activeSlice
										);
										setTextOpen(false);
									}}
								>
									<div
										style={{
											fontFamily: `'${family}'`,
											fontSize: size / 2,
											fontWeight: weight,
										}}
									>
										{title}
									</div>
								</StyledTextButton>
							</ListItem>
						);
					})}
				</List>
			</StyledScroll>
		</DropDown>
	);
};

export const ImageDropDown = () => {
	const { t } = useTranslation(["editor"]);
	const addPictureEntity = useSpace(state => state.addPictureEntity);
	const activeSlice = useEditor(state => state.activeSlice);
	const [imagesOpen, setImagesOpen] = useState(false);
	const [query, setQuery] = useState("colorful");
	const imageRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(
		imageRef,
		useCallback(() => {
			setImagesOpen(false);
		}, [])
	);

	const { data: unsplash } = useUnsplash(query, 1000);
	return (
		<DropDown
			ref={imageRef}
			width={600}
			open={imagesOpen}
			button={() => (
				<IconButton
					icon="imageOutline"
					disabled={!activeSlice}
					isSelected={imagesOpen}
					aria-label={t("editor:image")}
					onClick={() => {
						setImagesOpen(previousState => !previousState);
					}}
				/>
			)}
		>
			<StyledDropDownHeader>
				<TextInput
					fullWidth
					value={query}
					onChange={event_ => {
						setQuery(event_.target.value);
					}}
				/>
			</StyledDropDownHeader>
			<StyledScroll>
				<StyledMasonryGrid colCount={3}>
					{unsplash?.results.map(image => (
						<StyledMasonryBox
							key={image.id}
							as="button"
							onClick={() => {
								const width = 600;
								const aspectRatio = image.width / image.height;
								addPictureEntity(
									{
										src: image.urls.regular,
										width,
										height: width / aspectRatio,
									},
									activeSlice
								);
								setImagesOpen(false);
							}}
						>
							<StyledImage src={image.urls.regular} alt={image.description} />
						</StyledMasonryBox>
					))}
				</StyledMasonryGrid>
			</StyledScroll>
		</DropDown>
	);
};

const ObjectDropDown = () => {
	const { t } = useTranslation(["editor"]);
	const activeSlice = useEditor(state => state.activeSlice);
	return (
		<DropDown
			button={() => (
				<IconButton
					icon="cubeOutline"
					disabled={!activeSlice}
					aria-label={t("editor:3d-object")}
					onClick={() => {
						console.log("3d object");
					}}
				/>
			)}
		>
			<StyledScroll>3d objects</StyledScroll>
		</DropDown>
	);
};

export const Header = () => {
	return (
		<StyledButtonRow>
			<TextDropDown />
			<ImageDropDown />
			<ObjectDropDown />
		</StyledButtonRow>
	);
};
