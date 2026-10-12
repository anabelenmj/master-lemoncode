import { characterPageSchema, type CharacterPageApiModel } from "./character-list.api-model";
import { validateResponse } from "#common/helpers/validate-response.helper.ts";

export const getCharacterPage = async (): Promise<CharacterPageApiModel> => {
  const response = await fetch("/api/characters")

  if (!response.ok) {
    throw new Error("El servidor ha constestado con un error")
  }

  return validateResponse(characterPageSchema, await response.json())
}