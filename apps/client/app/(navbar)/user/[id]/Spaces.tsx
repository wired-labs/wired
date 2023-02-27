import { fetchLatestSpaces } from "../../../../src/server/helpers/fetchLatestSpaces";
import SpaceCard from "../../explore/SpaceCard";

interface Props {
  owner: string;
}

export default async function Spaces({ owner }: Props) {
  const spaces = await fetchLatestSpaces(40, owner);

  return spaces.map(({ id, metadata }) => (
    <SpaceCard key={id} id={id} metadata={metadata} sizes="512" />
  ));
}
