import { pxToRem } from "@/ions/utils/unit";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { FC } from "react";

export const StyledListItem = styled.li`
	margin: 0;
	list-style: none;
	${({ theme }) => css`
		padding: ${pxToRem(theme.space.s)};
	`};
`;

const ListItem: FC = ({ children }) => {
	return <StyledListItem>{children}</StyledListItem>;
};

export default ListItem;
