//Como quiero mostrar los datos desde la api, desde el VM (que es el archivo que quiero que se quede, con zod, es como nos viene de la api)
import type * as apiModel from "./api"
import type * as viewModel from "./character-detail.vm"

const mapEpisodeFromApiToVm = (
  episode: apiModel.EpisodeApiModel
): viewModel.Episode => ({
  id: episode.id,
  title: episode.name,
  code: episode.episode,
  airDate: episode.airDate,
});

export const mapCharacterDetailFromApiToVm = (character: apiModel.CharacterDetailApiModel): viewModel.CharacterDetail => ({
  id: character.id,
  name: character.name,
  status: character.status,
  species: character.species,
  gender: character.gender,
  image: character.image,
  origin: character.origin,
  location: character.location,
  episodeCount: character.episodeCount,
  episodes: character.episodes ? character.episodes.map(mapEpisodeFromApiToVm) : []
})
