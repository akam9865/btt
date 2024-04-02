import * as React from "react";
import Popover from "@mui/material/Popover";

import Button from "@mui/material/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { styled } from "@mui/material";
import Image from "next/image";
import { Session } from "next-auth";

export function ProfileButton() {
  const { data, status } = useSession();

  if (status === "authenticated") {
    return <UserPopover user={data.user} />;
  }

  return <Button onClick={() => signIn()}>Sign In</Button>;
}

function UserPopover({ user }: { user?: Session["user"] }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Profile aria-describedby={id} onClick={(e) => handleClick(e)}>
        {user?.name}
        <Avatar imageUrl={user?.image} />
      </Profile>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Button onClick={() => signOut()}>Sign Out</Button>
      </Popover>
    </div>
  );
}

const Profile = styled(Button)({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const Avatar = ({ imageUrl }: { imageUrl?: string | null }) => {
  return imageUrl ? (
    <ProfilePicture src={imageUrl} alt="profile" width={32} height={32} />
  ) : null;
};

const ProfilePicture = styled(Image)({
  borderRadius: "50%",
});
