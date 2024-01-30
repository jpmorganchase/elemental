import { Box, InvertTheme, VStack } from '@stoplight/mosaic';
import { Request as HarRequest } from 'har-format';
import { useAtom } from 'jotai';
import * as React from 'react';

import ExamplesContext from '../../context/ExamplesContext';
import { RequestSamples } from '../RequestSamples';
import { ResponseExamples, ResponseExamplesProps } from '../ResponseExamples/ResponseExamples';
import { persistedParameterValuesAtom } from './Parameters/persistedParameterValuesState';
import { TryIt, TryItProps } from './TryIt';

export type TryItWithRequestSamplesProps = Omit<TryItProps, 'onRequestChange'> &
  ResponseExamplesProps & { hideTryIt?: boolean };

export const TryItWithRequestSamples: React.FC<TryItWithRequestSamplesProps> = ({ hideTryIt, ...props }) => {
  const [requestData, setRequestData] = React.useState<HarRequest | undefined>();

  const [globalSelectedExample, setGlobalSelectedExample] = React.useState('Approved Auth MIT Subsequent Stored');
  const [_, setPersistedParameterValues] = useAtom(persistedParameterValuesAtom);

  const handleUpdateGlobalSelectedExample = (newExample: string) => {
    setGlobalSelectedExample(newExample);
    setPersistedParameterValues({});
  };

  return (
    <ExamplesContext.Provider value={{ globalSelectedExample, setGlobalSelectedExample }}>
      <VStack spacing={6}>
        <ul>
          <li>
            <button onClick={() => handleUpdateGlobalSelectedExample('Approved Auth Basic')}>
              Approved Auth Basic
            </button>
          </li>
          <li>
            <button onClick={() => handleUpdateGlobalSelectedExample('Approved Auth CIT Onetime Stored')}>
              Approved Auth CIT Onetime Stored
            </button>
          </li>
          <li>
            <button onClick={() => handleUpdateGlobalSelectedExample('Approved Auth MIT Subsequent Stored')}>
              Approved Auth MIT Subsequent Stored
            </button>
          </li>
        </ul>
        {!hideTryIt && (
          <InvertTheme>
            <Box>
              <TryIt {...props} onRequestChange={setRequestData} />
            </Box>
          </InvertTheme>
        )}

        {requestData && <RequestSamples request={requestData} />}

        <ResponseExamples {...props} />
      </VStack>
    </ExamplesContext.Provider>
  );
};
