import React from 'react'
import type { Character } from './character-list.vm';
import { CharacterListComponent } from './character-list.component';
import { ErrorMessage, Spinner } from "#common/components"
import { getCharacterPage } from './api';
import { mapCharacterListFromApiToVm } from './character-list.mapper';

export const CharacterListContainer = () => {
  const [characters, setCharacters] = React.useState<Character[]>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("")

  const loadCharacters = () => {
    setIsLoading(true);
    setError("");

    getCharacterPage()
      .then((characterList) => setCharacters(mapCharacterListFromApiToVm(characterList)))
      .catch(() => setError("No se han podido cargar los personajes"))
      .finally(() => setIsLoading(false))
  }

  React.useEffect(() => {
    loadCharacters()
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return <CharacterListComponent characters={characters} />
}
