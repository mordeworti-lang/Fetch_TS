import { runJsonPlaceholderExamples } from './examples/jsonplaceholder.example';
import { runRickAndMortyExamples } from './examples/rickmorty.example';
import { runAdvancedExamples } from './examples/advanced.example';
import { runEnhancedServiceExample } from './examples/enhanced.service.example';

const main = async (): Promise<void> => {
  try {
    await runJsonPlaceholderExamples();
    await runRickAndMortyExamples();
    await runAdvancedExamples();
    await runEnhancedServiceExample();
  } catch (error) {
    console.error('Application error:', error);
    process.exit(1);
  }
};

main();
