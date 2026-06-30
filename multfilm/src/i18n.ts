import { ref } from 'vue'

type Language = 'de' | 'en'

const translations = {
  de: {
    appName: 'Multfilm',
    navHome: 'Startseite',
    navWatchlist: 'Merkliste',
    navSeen: 'Gesehen',
    languageToggle: 'Sprache ändern',
    trendingMovies: 'Aktuelle Filme',
    alreadyInWatchlist: 'Schon in der Merkliste',
    addToWatchlist: 'Zur Merkliste',
    details: 'Details',
    markSeen: 'Als gesehen markieren',
    markUnseen: 'Als nicht gesehen markieren',
    watchlistStatusError: 'Merkliste-Status konnte nicht gespeichert werden.',
    seenStatusError: 'Gesehen-Status konnte nicht gespeichert werden.',
    entriesLoadError: 'Merkliste-/Gesehen-Status konnte nicht geladen werden.',
    moviesLoadError: 'Filme konnten nicht geladen werden.',
    watchlistTitle: 'Meine Merkliste',
    addOwnMovie: 'Eigenen Film hinzufügen',
    movieTitlePlaceholder: 'Filmtitel eingeben...',
    add: 'Hinzufügen',
    titleRequired: 'Bitte gib einen Filmtitel ein.',
    duplicateMovie: 'Dieser Film ist schon in deiner Merkliste.',
    movieAddError: 'Film konnte nicht zur Merkliste hinzugefügt werden.',
    movieAdded: 'wurde zur Merkliste hinzugefügt.',
    searchWatchlist: 'Merkliste durchsuchen',
    searchTitlePlaceholder: 'Filmtitel suchen...',
    filterWatchlist: 'Merkliste filtern',
    filterAll: 'Alle',
    filterUnseen: 'Noch nicht gesehen',
    filterSeen: 'Gesehen',
    noWatchlistMatch: 'Kein Film passt zu deiner Suche oder deinem Filter.',
    remove: 'Entfernen',
    seenTitle: 'Gesehen',
    commentLabel: 'Wie fandest du den Film?',
    commentPlaceholder: 'Dein Kommentar...',
    save: 'Speichern',
    saved: 'Gespeichert',
    commentSaveError: 'Kommentar konnte nicht gespeichert werden.',
    personalRating: 'Deine Bewertung',
    ratingSaveError: 'Bewertung konnte nicht gespeichert werden.',
    starRatingLabel: 'Sternebewertung',
    rating: 'Bewertung',
    releaseDate: 'Erscheinungsdatum',
    overview: 'Beschreibung',
    back: 'Zurück',
  },
  en: {
    appName: 'Multfilm',
    navHome: 'Home',
    navWatchlist: 'Watchlist',
    navSeen: 'Seen',
    languageToggle: 'Change language',
    trendingMovies: 'Trending Movies',
    alreadyInWatchlist: 'Already in watchlist',
    addToWatchlist: 'Add to watchlist',
    details: 'Details',
    markSeen: 'Mark as seen',
    markUnseen: 'Mark as not seen',
    watchlistStatusError: 'Watchlist status could not be saved.',
    seenStatusError: 'Seen status could not be saved.',
    entriesLoadError: 'Watchlist/seen status could not be loaded.',
    moviesLoadError: 'Movies could not be loaded.',
    watchlistTitle: 'My Watchlist',
    addOwnMovie: 'Add your own movie',
    movieTitlePlaceholder: 'Enter movie title...',
    add: 'Add',
    titleRequired: 'Please enter a movie title.',
    duplicateMovie: 'This movie is already in your watchlist.',
    movieAddError: 'Movie could not be added to your watchlist.',
    movieAdded: 'was added to your watchlist.',
    searchWatchlist: 'Search watchlist',
    searchTitlePlaceholder: 'Search movie title...',
    filterWatchlist: 'Filter watchlist',
    filterAll: 'All',
    filterUnseen: 'Not seen yet',
    filterSeen: 'Seen',
    noWatchlistMatch: 'No movie matches your search or filter.',
    remove: 'Remove',
    seenTitle: 'Seen',
    commentLabel: 'How did you like the movie?',
    commentPlaceholder: 'Your comment...',
    save: 'Save',
    saved: 'Saved',
    commentSaveError: 'Comment could not be saved.',
    personalRating: 'Your rating',
    ratingSaveError: 'Rating could not be saved.',
    starRatingLabel: 'Star rating',
    rating: 'Rating',
    releaseDate: 'Release date',
    overview: 'Overview',
    back: 'Back',
  },
} satisfies Record<Language, Record<string, string>>

export type TranslationKey = keyof typeof translations.de

const storedLanguage = window.localStorage.getItem('multfilm-language')
const initialLanguage: Language = storedLanguage === 'en' ? 'en' : 'de'

export const language = ref<Language>(initialLanguage)

export function t(key: TranslationKey) {
  return translations[language.value][key]
}

export function toggleLanguage() {
  language.value = language.value === 'de' ? 'en' : 'de'
  window.localStorage.setItem('multfilm-language', language.value)
}
