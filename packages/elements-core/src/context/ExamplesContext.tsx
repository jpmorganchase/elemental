import { createContext } from 'react';

const ExamplesContext = createContext({
  globalSelectedExample: '',
  setGlobalSelectedExample: (selectedExample: string) => {},
});

export default ExamplesContext;
