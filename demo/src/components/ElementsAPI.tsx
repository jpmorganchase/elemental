import '@jpmorganchase/elemental-core/styles.css';

import { API, useGetOasNavTree } from '@jpmorganchase/elemental';
import { Box } from '@stoplight/mosaic';
import React, { useContext } from 'react';

import { GlobalContext } from '../context';

import * as data from '../reference/sample.json';

export const ElementsAPI: React.FC = () => {
  const { layout } = useContext(GlobalContext);

  const customNav = useGetOasNavTree(data);
  console.log('customNav', customNav);

  return (
    <Box flex={1} overflowY={layout !== 'stacked' ? 'hidden' : undefined}>
      {/* <API apiDescriptionDocument={data} router="hash" layout={layout} /> */}
      <API
        apiDescriptionDocument={data}
        hideTryIt={false}
        router="hash"
        layout="sidebar"
        hideInternal={true}
        tryItOutDefaultServer={"https://apigatewaycat.jpmorgan.com/trust-safety/v1/payment"}
        useCustomNav={false}
        hideInlineExamples={true}
      />
    </Box>
  );
};
