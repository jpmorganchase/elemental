import { JsonSchemaViewer } from '@stoplight/json-schema-viewer';
import { Box, CopyButton, Flex, NodeAnnotation, Panel, Select, Text, VStack } from '@stoplight/mosaic';
import { CodeViewer } from '@stoplight/mosaic-code-viewer';
import { IHttpOperationRequestBody, IMediaTypeContent } from '@stoplight/types';
import * as React from 'react';

import { useSchemaInlineRefResolver } from '../../../context/InlineRefResolver';
import { useOptionsCtx } from '../../../context/Options';
import { exceedsSize, useGenerateExampleFromMediaTypeContent } from '../../../utils/exampleGeneration/exampleGeneration';
import { isJSONSchema } from '../../../utils/guards';
import { getOriginalObject } from '../../../utils/ref-resolving/resolvedObject';
import { LoadMore } from '../../LoadMore';
import { MarkdownViewer } from '../../MarkdownViewer';
import { SectionSubtitle } from '../Sections';

export interface BodyProps {
  body: IHttpOperationRequestBody;
  onChange?: (requestBodyIndex: number) => void;
  isHttpWebhookOperation?: boolean;
}

export const isBodyEmpty = (body?: BodyProps['body']) => {
  if (!body) return true;

  const { contents = [], description } = body;

  return contents.length === 0 && !description?.trim();
};

export const Body = ({ body, onChange, isHttpWebhookOperation = false }: BodyProps) => {
  const [refResolver, maxRefDepth] = useSchemaInlineRefResolver();
  const [chosenContent, setChosenContent] = React.useState(0);
  const [chosenExampleIndex, setChosenExampleIndex] = React.useState(0);
  const [show, setShow] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { nodeHasChanged, renderExtensionAddon } = useOptionsCtx();

  React.useEffect(() => {
    onChange?.(chosenContent);
    // disabling because we don't want to react on `onChange` change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenContent]);

  if (isBodyEmpty(body)) return null;

  const { contents = [], description } = body;
  const content = contents[chosenContent];
  const schema = content?.schema;
  const descriptionChanged = nodeHasChanged?.({ nodeId: body.id, attr: 'description' });

  // Check if we have examples defined
  let userDefinedExamples: IMediaTypeContent['examples'];
  if (content?.examples && content.examples.length > 0) {
    userDefinedExamples = content.examples;
  }

  // Generate example from the examples array or schema
  const requestExample = useGenerateExampleFromMediaTypeContent(content, chosenExampleIndex, {
    skipReadOnly: true,
  });

  const shouldRenderExamples = Boolean(requestExample && (userDefinedExamples || content?.mediaType === 'application/json'));

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => setShow(true), 50);
  };

  const examplesSelect = userDefinedExamples && userDefinedExamples.length > 1 && (
    <Select
      aria-label="Request Body Example"
      value={String(chosenExampleIndex)}
      options={userDefinedExamples.map((example, index) => ({ value: index, label: example.key }))}
      onChange={value => setChosenExampleIndex(parseInt(String(value), 10))}
      size="sm"
      triggerTextPrefix="Request Body Example: "
    />
  );

  return (
    <VStack spacing={6}>
      <SectionSubtitle title="Body" id="request-body">
        {contents.length > 1 && (
          <Flex flex={1} justify="end">
            <Select
              aria-label="Request Body Content Type"
              value={String(chosenContent)}
              onChange={value => setChosenContent(parseInt(String(value), 10))}
              options={contents.map((content, index) => ({ label: content.mediaType, value: index }))}
              size="sm"
            />
          </Flex>
        )}
      </SectionSubtitle>
      {description && (
        <Box pos="relative">
          <MarkdownViewer markdown={description} />
          <NodeAnnotation change={descriptionChanged} />
        </Box>
      )}
      {isJSONSchema(schema) && (
        <JsonSchemaViewer
          resolveRef={refResolver}
          maxRefDepth={maxRefDepth}
          schema={getOriginalObject(schema)}
          viewMode={isHttpWebhookOperation ? 'standalone' : 'write'}
          renderRootTreeLines
          nodeHasChanged={nodeHasChanged}
          renderExtensionAddon={renderExtensionAddon}
        />
      )}
      {shouldRenderExamples && (
        <Panel rounded isCollapsible={false}>
          <Panel.Titlebar
            rightComponent={<CopyButton size="sm" copyValue={requestExample || ''} aria-label="copy request body" />}
          >
            {examplesSelect || <Text color="body">Request Body Example</Text>}
          </Panel.Titlebar>
          <Panel.Content p={0}>
            {show || !exceedsSize(requestExample) ? (
              <CodeViewer
                aria-label={requestExample}
                noCopyButton
                maxHeight="500px"
                language="json"
                value={requestExample}
                showLineNumbers
                style={
                  // when not rendering in prose (markdown), reduce font size to be consistent with base UI
                  {
                    // @ts-expect-error react css typings do not allow for css variables...
                    '--fs-code': 12,
                  }
                }
              />
            ) : (
              <LoadMore loading={loading} onClick={handleLoadMore} />
            )}
          </Panel.Content>
        </Panel>
      )}
    </VStack>
  );
};
Body.displayName = 'HttpOperation.Body';
