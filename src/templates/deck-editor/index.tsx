import { FontLoader } from "@/atoms/font-loader";
import { useEditor } from "@/ions/store/editor";
import { useSpace } from "@/ions/store/space";
import { Header } from "@/organisms/header/deck";
import {
	StyledHeader,
	StyledLayoutWithLeftRight,
	StyledLeft,
	StyledMain,
	StyledRight,
} from "@/organisms/layout/styled";
import { Main } from "@/organisms/main/deck";
import { SidebarLeft } from "@/organisms/sidebar-left/deck";
import {
	SidebarRightPicture,
	SidebarRightSlice,
	SidebarRightText,
} from "@/organisms/sidebar-right/deck";
import React from "react";

export const DeckEditor = () => {
	const activeSlice = useEditor(state => state.activeSlice);
	const activeEntity = useEditor(state => state.activeEntity);
	const entities = useSpace(state => state.entities);
	const entity = entities.find(({ id }) => id === activeEntity);

	return (
		<StyledLayoutWithLeftRight>
			<FontLoader />
			<StyledHeader>
				<Header />
			</StyledHeader>
			<StyledLeft>
				<SidebarLeft />
			</StyledLeft>
			<StyledMain>
				<Main />
			</StyledMain>
			<StyledRight>
				{!entity && activeSlice && <SidebarRightSlice />}
				{entity?.type === "text" && <SidebarRightText />}
				{entity?.type === "picture" && <SidebarRightPicture />}
			</StyledRight>
		</StyledLayoutWithLeftRight>
	);
};
