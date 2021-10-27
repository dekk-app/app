import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { StyledButtonRow } from "@/organisms/layout/styled";
import { IconButton } from "@dekk-ui/icon-button";
import { useTranslation } from "next-i18next";
import React from "react";

export const Header = () => {
	const { t } = useTranslation(["editor", "menu"]);
	const addTextEntity = useSpace(state => state.addTextEntity);
	const addPictureEntity = useSpace(state => state.addPictureEntity);
	const activeSlice = useEditor(state => state.activeSlice);
	return (
		<StyledButtonRow>
			<IconButton
				icon="editorText"
				disabled={!activeSlice}
				aria-label={t("editor:text")}
				onClick={() => {
					if (activeSlice) {
						addTextEntity({ text: "Hello Dekk" }, activeSlice);
					}
				}}
			/>
			<IconButton
				icon="editorImage"
				disabled={!activeSlice}
				aria-label={t("editor:image")}
				onClick={() => {
					if (activeSlice) {
						addPictureEntity({ src: "/assets/robot.png" }, activeSlice);
					}
				}}
			/>
		</StyledButtonRow>
	);
};
