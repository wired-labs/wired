import { Profile, useGetProfileByHandleQuery } from "../../generated/graphql";
import { HANDLE_ENDING } from "../../helpers/lens/constants";
import { useLensStore } from "../../helpers/lens/store";
import ProfilePicture from "./ProfilePicture";

interface Props {
  circle?: boolean;
  draggable?: boolean;
}

export default function ViewerProfilePicture({ circle, draggable }: Props) {
  const handle = useLensStore((state) => state.handle);

  const [{ data }] = useGetProfileByHandleQuery({
    variables: { handle: handle?.concat(HANDLE_ENDING) },
    pause: !handle,
  });

  return (
    <ProfilePicture
      circle={circle}
      draggable={draggable}
      profile={data?.profiles.items[0] as Profile}
    />
  );
}
