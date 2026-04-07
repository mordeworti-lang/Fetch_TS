import { ApiService } from '@/services';
import { fetchData } from '@/core';
import { API_ENDPOINTS } from '@/config';
import { Character } from '@/types';

interface CharactersResponse {
  results: Character[];
}

export const runRickAndMortyExamples = async (): Promise<void> => {
  console.log('\n=== Rick & Morty API Examples ===\n');

  console.log('--- Fetching all characters ---');
  const allData = await fetchData<CharactersResponse>(API_ENDPOINTS.rickAndMorty.characters);
  console.log(`Status: ${allData.status}`);

  const characters = allData.data?.results ?? [];
  console.log(`Found ${characters.length} characters`);
  console.log(`First character: ${characters[0]?.name ?? 'N/A'}\n`);

  console.log('--- Fetching character with ID 1 ---');
  const singleService = new ApiService<Character>(API_ENDPOINTS.rickAndMorty.characters);
  const character = await singleService.getOne(1);
  console.log(`Status: ${character.status}`);
  console.log(`Character: ${JSON.stringify(character.data, null, 2)}\n`);

  console.log('--- Fetching character with invalid ID (99999) ---');
  const invalidCharacter = await singleService.getOne(99999);
  console.log(`Status: ${invalidCharacter.status}`);
  console.log(`Error: ${invalidCharacter.error ?? 'None'}`);
  console.log(`Data: ${invalidCharacter.data ?? 'null'}\n`);
};

