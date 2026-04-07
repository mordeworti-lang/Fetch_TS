export const API_ENDPOINTS = {
  jsonPlaceholder: {
    base: 'https://jsonplaceholder.typicode.com',
    users: 'https://jsonplaceholder.typicode.com/users',
    posts: 'https://jsonplaceholder.typicode.com/posts'
  },
  rickAndMorty: {
    base: 'https://rickandmortyapi.com/api',
    characters: 'https://rickandmortyapi.com/api/character'
  }
} as const;
