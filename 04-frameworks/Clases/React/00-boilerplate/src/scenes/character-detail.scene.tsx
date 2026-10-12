import { CharacterDetailContainer } from "#pods/character-detail";
import { useParams } from "react-router";

export const CharacterDetailScene = () => {
  const { id } = useParams<{ id: string }>();

  return <CharacterDetailContainer id={id ?? ""} />
};
