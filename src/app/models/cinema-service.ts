export interface CinemaServiceModel {
    id?: number;  // mettiamo id?  perché quando creiamo un nuovo servizio, l'id non è ancora definito
    name: string;
    description: string;
    price: number;
}