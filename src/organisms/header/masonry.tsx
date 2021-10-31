import { pxToRem } from "@/ions/utils/unit";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const StyledMasonryGrid = styled.div<{
	colCount?: number;
}>`
	flex: 1;
	height: max-content;
	${({ theme, colCount = 2 }) => css`
		padding: ${pxToRem(theme.space.s)};
		column-gap: ${pxToRem(theme.space.s)};
		columns: ${colCount};
	`}
`;

export const StyledMasonryBox = styled.button`
	display: flex;
	padding: 0;
	overflow: hidden;
	border: 0;
	background: none;
	break-inside: avoid;
	${({ theme }) => css`
		padding: ${pxToRem(theme.space.xs)} 0;
		border-radius: ${pxToRem(theme.radius.s)};
	`};
`;
