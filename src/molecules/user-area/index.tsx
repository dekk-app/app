import { pxToRem } from "@/ions/utils/unit";
import { StyledCentered } from "@/organisms/layout/styled";
import { Avatar } from "@dekk-ui/avatar";
import styled from "@emotion/styled";
import { useSession } from "next-auth/client";
import React, { memo } from "react";

const StyledAvatar = styled(Avatar)`
	width: ${pxToRem(96)};
	height: auto;
`;

const UserArea = () => {
	const [session] = useSession();
	return (
		<StyledCentered>
			<StyledAvatar
				src={
					session.user.image ??
					`https://avatars.dicebear.com/api/identicon/${session.user.id as number}.svg`
				}
				alt={session.user.name ?? "Unknown"}
			/>
			<p>{session.user.name ?? "Unknown"}</p>
		</StyledCentered>
	);
};

export default memo(UserArea);
