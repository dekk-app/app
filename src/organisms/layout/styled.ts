import { pxToRem } from "@/ions/utils/unit";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const StyledLayout = styled.div`
	display: grid;
	height: 100vh;
	${({ theme }) => css`
		background: ${theme.ui.colors.theme.background};
		color: ${theme.ui.colors.theme.color};
	`};
`;

export const StyledLayoutWithLeft = styled(StyledLayout)`
	grid-template-areas: "Header Header" "Left Main";
	grid-template-columns: ${pxToRem(250)} 1fr;
	grid-template-rows: ${pxToRem(48)} 1fr;
`;

export const StyledLayoutWithRight = styled(StyledLayout)`
	grid-template-areas: "Header Header" "Main Right";
	grid-template-columns: 1fr ${pxToRem(250)};
	grid-template-rows: ${pxToRem(48)} 1fr;
`;

export const StyledLayoutWithLeftRight = styled(StyledLayout)`
	grid-template-areas: "Header Header Header" "Left Main Right";
	grid-template-columns: ${pxToRem(250)} 1fr ${pxToRem(250)};
	grid-template-rows: ${pxToRem(48)} 1fr;
`;

export const StyledHeader = styled.header`
	grid-area: Header;
`;

export const StyledLeft = styled.aside`
	grid-area: Left;
`;

export const StyledRight = styled.aside`
	grid-area: Right;
`;

export const StyledMain = styled.main`
	grid-area: Main;
`;
