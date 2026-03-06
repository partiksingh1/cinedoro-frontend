export type UserRole = 'admin' | 'customer' | 'staff'; // Ruoli possibili dell'utente definiti dal backend.

export interface User {
    // Modello utente usato nel frontend.
    id: number; // Identificativo univoco dell'utente.
    firstName: string; // Nome dell'utente.
    lastName: string; // Cognome dell'utente.
    email: string; // Email dell'utente.
    password?: string; // Password opzionale, presente solo se qualche endpoint la richiede.
    role: UserRole; // Ruolo dell'utente.
    createdAt: string; // Data e ora di creazione come stringa JSON restituita dal backend.
}