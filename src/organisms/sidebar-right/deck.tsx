import { useFontStore } from "@/ions/hooks/fonts";
import { useEditor } from "@/ions/store/editor";
import { Font, PictureEntity, TextEntity, useSpace } from "@/ions/store/space";
import { findImageAspect } from "@/ions/utils/image";
import { StyledFieldRow, StyledFieldsetRow } from "@/organisms/layout/styled";
import { Button } from "@dekk-ui/button";
import { Checkbox } from "@dekk-ui/checkbox";
import { ColorInput } from "@dekk-ui/color-input-field";
import { CombinedInput } from "@dekk-ui/combined-input-field";
import { Icon } from "@dekk-ui/icon";
import { IconButton } from "@dekk-ui/icon-button";
import { NumberInput, TextInput } from "@dekk-ui/input-field";
import { InputLabel } from "@dekk-ui/input-label";
import { MultiButton } from "@dekk-ui/multi-button";
import { PopoutSelect, Select } from "@dekk-ui/select";
import { ToggleButton } from "@dekk-ui/toggle-button";
import { useTranslation } from "next-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";

export const SidebarRightText = () => {
	const { t } = useTranslation(["editor", "menu"]);
	const fonts = useFontStore(state => state.fonts);
	const activeEntity = useEditor(state => state.activeEntity);
	const space = useSpace(state => state.space);
	const updateTextEntity = useSpace(state => state.updateTextEntity);
	const entities = useSpace(state => state.entities);
	const entity = entities.find(({ id }) => id === activeEntity) as TextEntity;

	const fontFamilies = useMemo(
		() =>
			fonts?.map(font => ({
				value: font.family,
				label: <span style={{ fontFamily: `'${font.family}'` }}>{font.family}</span>,
			})) ?? [],
		[fonts]
	);

	const fontFamily = entity.font.family;

	const fontStyles = useMemo(() => {
		if (fontFamily) {
			const font = fonts?.find(({ family }) => family === fontFamily);
			return (
				font?.variants.map(variant => {
					const fontWeight =
						variant === "regular" || variant === "italic"
							? 400
							: Number.parseInt(variant, 10);
					const fontStyle = variant.endsWith("italic") ? "italic" : "normal";
					return {
						value: variant,
						label: (
							<span style={{ fontFamily: `'${font.family}'`, fontWeight, fontStyle }}>
								{variant}
							</span>
						),
					};
				}) ?? []
			);
		}

		return [];
	}, [fontFamily, fonts]);

	return (
		<>
			<StyledFieldsetRow>
				<InputLabel htmlFor="editor:text">Text</InputLabel>
				<TextInput
					fullWidth
					id="editor:text"
					as="textarea"
					style={{
						resize: "none",
						width: "100%",
						height: 100,
						overflow: "auto",
					}}
					value={entity.text}
					onChange={event_ => {
						updateTextEntity({ text: event_.target.value }, activeEntity);
					}}
				/>
			</StyledFieldsetRow>
			<StyledFieldRow fieldCount={2}>
				<InputLabel htmlFor="editor:x">Position</InputLabel>
				<CombinedInput
					type="number"
					startAdornment="X:"
					textAlign="right"
					id="editor:x"
					value={entity.x}
					onChange={x => {
						updateTextEntity({ x }, activeEntity);
					}}
				/>
				<CombinedInput
					type="number"
					startAdornment="Y:"
					textAlign="right"
					id="editor:x"
					value={entity.y}
					onChange={y => {
						updateTextEntity({ y }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow>
				<InputLabel htmlFor="editor:width">Size</InputLabel>
				<CombinedInput
					type="number"
					startAdornment="W:"
					textAlign="right"
					id="editor:width"
					value={entity.width}
					step={1}
					min={100}
					max={space.width}
					onChange={width => {
						updateTextEntity({ width }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow>
				<InputLabel htmlFor="editor:fontFamily">Font</InputLabel>
				<PopoutSelect
					fullWidth
					id="editor:fontFamily"
					options={fontFamilies}
					value={fontFamilies.find(({ value }) => value === entity.font.family)}
					maxMenuHeight={250}
					placeholder="Search…"
					onChange={({ value }: { value: string }) => {
						const font: Font = {
							family: value,
							variant: "regular",
							weight: 400,
							style: "normal",
						};
						updateTextEntity({ font }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow>
				<InputLabel htmlFor="editor:fontStyle">Style</InputLabel>
				<PopoutSelect
					fullWidth
					id="editor:fontStyle"
					options={fontStyles}
					value={fontStyles.find(({ value }) => value === entity.font.variant)}
					maxMenuHeight={250}
					placeholder="Search…"
					onChange={({ value }: { value: string }) => {
						const weight =
							value === "italic" || value === "regular"
								? 400
								: Number.parseInt(value, 10);
						const style = value.endsWith("italic") ? "italic" : "normal";
						const font: Font = {
							variant: value,
							weight,
							style,
						};
						updateTextEntity({ font }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow fieldCount={2}>
				<InputLabel htmlFor="editor:fontSize">Font Size</InputLabel>
				<Select
					value={{ label: `${entity.font.size}`, value: entity.font.size }}
					options={[
						{ label: "40", value: 40 },
						{ label: "80", value: 80 },
						{ label: "120", value: 120 },
						{ label: "160", value: 160 },
						{ label: "220", value: 220 },
					]}
					onChange={({ value: size }: { value: number }) => {
						updateTextEntity({ font: { size } }, activeEntity);
					}}
				/>
				<NumberInput
					id="editor:fontSize"
					value={entity.font.size}
					textAlign="right"
					onChange={size => {
						updateTextEntity({ font: { size } }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow fieldCount={2}>
				<InputLabel htmlFor="editor:lineHeight">Line Height</InputLabel>
				<Select
					value={{ label: `${entity.lineHeight}`, value: entity.lineHeight }}
					options={[
						{ label: "0.5", value: 0.5 },
						{ label: "1", value: 1 },
						{ label: "1.2", value: 1.2 },
						{ label: "1.5", value: 1.5 },
						{ label: "1.7", value: 1.7 },
					]}
					onChange={({ value: lineHeight }: { value: number }) => {
						updateTextEntity({ lineHeight }, activeEntity);
					}}
				/>
				<NumberInput
					id="editor:lineHeight"
					value={entity.lineHeight}
					min={0.5}
					max={2}
					step={0.1}
					textAlign="right"
					onChange={lineHeight => {
						updateTextEntity({ lineHeight }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow fieldCount={2}>
				<InputLabel htmlFor="editor:letterSpacing">Letter Spacing</InputLabel>
				<Select
					value={{ label: `${entity.letterSpacing}`, value: entity.letterSpacing }}
					options={[
						{ label: "0", value: 0 },
						{ label: "0.02", value: 0.02 },
						{ label: "0.04", value: 0.04 },
						{ label: "0.08", value: 0.08 },
						{ label: "0.1", value: 0.1 },
						{ label: "0.15", value: 0.15 },
						{ label: "0.2", value: 0.2 },
					]}
					onChange={({ value: letterSpacing }: { value: number }) => {
						updateTextEntity({ letterSpacing }, activeEntity);
					}}
				/>
				<NumberInput
					id="editor:letterSpacing"
					value={entity.letterSpacing}
					step={0.01}
					min={-0.1}
					max={0.5}
					textAlign="right"
					onChange={letterSpacing => {
						updateTextEntity({ letterSpacing }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldsetRow>
				<InputLabel as="legend">Text Alignment</InputLabel>
				<MultiButton fullWidth>
					<ToggleButton
						isSelected={entity.textAlign === "left"}
						onClick={() => {
							updateTextEntity({ textAlign: "left" }, activeEntity);
						}}
					>
						<Icon icon="formatAlignLeft" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.textAlign === "center"}
						onClick={() => {
							updateTextEntity({ textAlign: "center" }, activeEntity);
						}}
					>
						<Icon icon="formatAlignCenter" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.textAlign === "justify"}
						onClick={() => {
							updateTextEntity({ textAlign: "justify" }, activeEntity);
						}}
					>
						<Icon icon="formatAlignJustify" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.textAlign === "right"}
						onClick={() => {
							updateTextEntity({ textAlign: "right" }, activeEntity);
						}}
					>
						<Icon icon="formatAlignRight" />
					</ToggleButton>
				</MultiButton>
			</StyledFieldsetRow>
			<StyledFieldsetRow>
				<InputLabel as="legend">Anchor X</InputLabel>
				<MultiButton fullWidth>
					<ToggleButton
						isSelected={entity.anchorX === "left"}
						onClick={() => {
							updateTextEntity({ anchorX: "left" }, activeEntity);
						}}
					>
						<Icon icon="formatHorizontalAlignLeft" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.anchorX === "center"}
						onClick={() => {
							updateTextEntity({ anchorX: "center" }, activeEntity);
						}}
					>
						<Icon icon="formatHorizontalAlignCenter" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.anchorX === "right"}
						onClick={() => {
							updateTextEntity({ anchorX: "right" }, activeEntity);
						}}
					>
						<Icon icon="formatHorizontalAlignRight" />
					</ToggleButton>
				</MultiButton>
			</StyledFieldsetRow>
			<StyledFieldsetRow>
				<InputLabel as="legend">Anchor Y</InputLabel>
				<MultiButton fullWidth>
					<ToggleButton
						isSelected={entity.anchorY === "top"}
						onClick={() => {
							updateTextEntity({ anchorY: "top" }, activeEntity);
						}}
					>
						<Icon icon="formatVerticalAlignTop" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.anchorY === "middle"}
						onClick={() => {
							updateTextEntity({ anchorY: "middle" }, activeEntity);
						}}
					>
						<Icon icon="formatVerticalAlignMiddle" />
					</ToggleButton>
					<ToggleButton
						isSelected={entity.anchorY === "bottom"}
						onClick={() => {
							updateTextEntity({ anchorY: "bottom" }, activeEntity);
						}}
					>
						<Icon icon="formatVerticalAlignBottom" />
					</ToggleButton>
				</MultiButton>
			</StyledFieldsetRow>
			<StyledFieldRow>
				<InputLabel htmlFor="entity:color">{t("editor:color")}</InputLabel>
				<ColorInput
					key={activeEntity}
					id="entity:color"
					defaultValue={entity.color}
					onChange={event_ => {
						updateTextEntity({ color: event_.target.value }, activeEntity);
					}}
				/>
			</StyledFieldRow>
		</>
	);
};

export const SidebarRightPicture = () => {
	const activeEntity = useEditor(state => state.activeEntity);
	const updatePictureEntity = useSpace(state => state.updatePictureEntity);
	const entities = useSpace(state => state.entities);
	const entity = entities.find(({ id }) => id === activeEntity) as PictureEntity;
	const src = entity?.src;
	const [aspectRatio, setAspectRatio] = useState(1);
	useEffect(() => {
		if (src) {
			void findImageAspect(src).then(value => {
				setAspectRatio(value.aspectRatio);
			});
		}
	}, [src]);
	return (
		<>
			<StyledFieldsetRow>
				<InputLabel htmlFor="editor:src">Image</InputLabel>
				<img
					src={entity.src}
					alt="preview image"
					style={{ width: "100%", marginBottom: "1rem" }}
				/>
				<TextInput
					fullWidth
					id="editor:src"
					as="textarea"
					style={{
						resize: "none",
						height: 100,
						overflow: "auto",
					}}
					value={entity.src}
					onChange={event_ => {
						updatePictureEntity({ src: event_.target.value }, activeEntity);
					}}
				/>
			</StyledFieldsetRow>
			<StyledFieldRow fieldCount={2}>
				<InputLabel htmlFor="editor:x">Position </InputLabel>
				<CombinedInput
					type="number"
					startAdornment="X:"
					textAlign="right"
					id="editor:x"
					value={entity.x}
					onChange={x => {
						updatePictureEntity({ x }, activeEntity);
					}}
				/>
				<CombinedInput
					type="number"
					startAdornment="Y:"
					textAlign="right"
					id="editor:y"
					value={entity.y}
					onChange={y => {
						updatePictureEntity({ y }, activeEntity);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow fieldCount={2}>
				<InputLabel htmlFor="editor:width">Size</InputLabel>
				<CombinedInput
					fullWidth
					type="number"
					id="editor:width"
					value={entity.width}
					startAdornment="W:"
					textAlign="right"
					onChange={value => {
						updatePictureEntity(
							{ width: value, height: Math.round((value / aspectRatio) * 100) / 100 },
							activeEntity
						);
					}}
				/>
				<CombinedInput
					fullWidth
					type="number"
					id="editor:height"
					value={entity.height}
					startAdornment="H:"
					textAlign="right"
					onChange={value => {
						updatePictureEntity(
							{ height: value, width: Math.round(value * aspectRatio * 100) / 100 },
							activeEntity
						);
					}}
				/>
			</StyledFieldRow>
		</>
	);
};

export const SidebarRightSlice = () => {
	const { t } = useTranslation(["editor", "menu"]);
	const updateSlice = useSpace(state => state.updateSlice);
	const slices = useSpace(state => state.slices);
	const activeSlice = useEditor(state => state.activeSlice);

	const slice = slices.find(({ id }) => id === activeSlice);
	return (
		<>
			<StyledFieldRow>
				<InputLabel htmlFor="editor:x">Position X</InputLabel>
				<CombinedInput
					type="number"
					startAdornment="X:"
					id="editor:x"
					value={slice.x}
					onChange={x => {
						updateSlice({ x }, activeSlice);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow>
				<InputLabel htmlFor="editor:x">Position Y</InputLabel>

				<CombinedInput
					type="number"
					startAdornment="Y:"
					id="editor:x"
					value={slice.y}
					onChange={y => {
						updateSlice({ y }, activeSlice);
					}}
				/>
			</StyledFieldRow>
			<StyledFieldRow>
				<InputLabel htmlFor="slide:background">{t("editor:background")}</InputLabel>
				<ColorInput
					key={activeSlice}
					id="slide:background"
					defaultValue={slice.backgroundColor}
					onChange={event_ => {
						updateSlice({ backgroundColor: event_.target.value }, activeSlice);
					}}
				/>
			</StyledFieldRow>
			<div>
				<StyledFieldRow>
					<InputLabel htmlFor="slide:showGradient">{t("editor:showGradient")}</InputLabel>
					<div
						style={{
							flex: 1,
							display: "flex",
							alignContent: "center",
							alignItems: "center",
						}}
					>
						<Checkbox
							key={slice.id}
							id="slide:showGradient"
							checked={slice.showGradient}
							onChange={checked => {
								updateSlice({ showGradient: checked }, activeSlice);
							}}
						/>
					</div>
				</StyledFieldRow>
				<div>
					{slice.showGradient && (
						<>
							<StyledFieldRow>
								<Button
									onClick={() => {
										const newStop = { id: v4(), stop: 1, color: "#000000" };
										const newGradient = slice.gradient
											? [...slice.gradient, newStop]
											: [{ ...newStop, stop: 0 }];
										updateSlice({ gradient: newGradient }, activeSlice);
									}}
								>
									Add Stop
								</Button>
							</StyledFieldRow>
							{slice.gradient?.map(stop => {
								return (
									<StyledFieldRow key={stop.id} fieldCount={2}>
										<ColorInput
											id={`slide:gradient.${stop.id}`}
											defaultValue={stop.color}
											onChange={event_ => {
												const newGradient = slice.gradient.map(stop_ =>
													stop_.id === stop.id
														? { ...stop_, color: event_.target.value }
														: stop_
												);
												updateSlice({ gradient: newGradient }, activeSlice);
											}}
										/>
										<NumberInput
											value={stop.stop}
											step={0.01}
											min={0}
											max={1}
											onChange={value => {
												const newGradient = slice.gradient.map(stop_ =>
													stop_.id === stop.id
														? { ...stop_, stop: value }
														: stop_
												);
												updateSlice({ gradient: newGradient }, activeSlice);
											}}
										/>
										<IconButton
											icon="deleteOutline"
											onClick={() => {
												const newGradient = slice.gradient.filter(
													stop_ => stop_.id !== stop.id
												);
												updateSlice({ gradient: newGradient }, activeSlice);
											}}
										/>
									</StyledFieldRow>
								);
							})}
						</>
					)}
				</div>
			</div>
			<StyledFieldRow>
				<InputLabel htmlFor="slide:color">{t("editor:color")}</InputLabel>
				<ColorInput
					key={activeSlice}
					id="slide:color"
					defaultValue={slice.color}
					onChange={event_ => {
						updateSlice({ color: event_.target.value }, activeSlice);
					}}
				/>
			</StyledFieldRow>
		</>
	);
};
