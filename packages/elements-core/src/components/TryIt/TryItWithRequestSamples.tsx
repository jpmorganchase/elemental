import { Box, InvertTheme, VStack } from '@stoplight/mosaic';
import { Request as HarRequest } from 'har-format';
import * as React from 'react';

import ExamplesContext from '../../context/ExamplesContext';
import { RequestSamples } from '../RequestSamples';
import { ResponseExamples, ResponseExamplesProps } from '../ResponseExamples/ResponseExamples';
import { TryIt, TryItProps } from './TryIt';

export type TryItWithRequestSamplesProps = Omit<TryItProps, 'onRequestChange'> &
  ResponseExamplesProps & { hideTryIt?: boolean; hideInlineExamples?: boolean };

export const TryItWithRequestSamples: React.FC<TryItWithRequestSamplesProps> = ({
  hideTryIt,
  hideInlineExamples = false,
  ...props
}) => {
  const [requestData, setRequestData] = React.useState<HarRequest | undefined>();

  const [globalSelectedExample, setGlobalSelectedExample] = React.useState('Approved Auth MIT Subsequent Stored');

  return (
    <ExamplesContext.Provider value={{ globalSelectedExample, setGlobalSelectedExample, hideInlineExamples }}>
      <VStack spacing={6}>
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
