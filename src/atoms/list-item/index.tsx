import styled from "@emotion/styled";
import React, { FC } from "react";

export const StyledListItem = styled.li`
	margin: 0;
	list-style: none;
`;

const ListItem: FC = ({ children }) => {
	return <StyledListItem>{children}</StyledListItem>;
};

export default ListItem;
