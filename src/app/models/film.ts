import { Actor } from "./actor"
import { Director } from "./director"
import { Genre } from "./genre"
import { Screening } from "./screening"

export interface Film {
    id: number
    title: string
    durationMinutes: number
    description: string
    releaseDate: string
    ageRating: number
    director: Director
    screenings: Screening[]
    actors: Actor[]
    genres: Genre[]
}
