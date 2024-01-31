import { safeStringify } from '@stoplight/json';
import { Button, Menu, MenuItems, Panel } from '@stoplight/mosaic';
import { INodeExample, INodeExternalExample } from '@stoplight/types';
import * as React from 'react';

import ExamplesContext from '../../../context/ExamplesContext';
import { exampleOptions, ParameterSpec } from './parameter-utils';
import { ParameterEditor } from './ParameterEditor';

interface OperationParametersProps<P extends keyof any = string> {
  parameters: readonly ParameterSpec[];
  values: Record<P, string>;
  onChangeValue: (parameterName: P, newValue: string) => void;
  validate?: boolean;
  requestBody: any;
  setSelectedExample: (value: string) => void;
  selectedExample: string;
}

export const OperationParameters: React.FC<OperationParametersProps> = ({
  parameters,
  values,
  onChangeValue,
  validate,
  requestBody,
  setSelectedExample,
  selectedExample,
}) => {
  const getParamLabelsForOverheadSelector = () => {
    return [...new Set(parameters.map(parameter => parameter.examples.map(exampleArr => exampleArr.key)).flat())];
  };

  const examples = getParamLabelsForOverheadSelector();

  const onChange = value => {
    setSelectedExample(value);
  };

  return (
    <Panel defaultIsOpen>
      <Panel.Titlebar
        rightComponent={
          examples.length > 1 && <ExampleMenu examples={examples} requestBody={requestBody} onChange={onChange} />
        }
      >
        Parameters
      </Panel.Titlebar>
      <Panel.Content className="sl-overflow-y-auto ParameterGrid OperationParametersContent">
        {parameters.map(parameter => (
          <ParameterEditor
            key={parameter.name}
            parameter={parameter}
            value={values[parameter.name]}
            onChange={value => onChangeValue(parameter.name, String(value))}
            validate={validate}
            isOptional={false}
            canChangeOptional={false}
            onChangeOptional={() => {}}
          />
        ))}
      </Panel.Content>
    </Panel>
  );
};

function ExampleMenu({ examples, requestBody, onChange }: any) {
  const { globalSelectedExample, setGlobalSelectedExample } = React.useContext(ExamplesContext);

  const handleClick = React.useCallback(
    example => {
      onChange(example);
      setGlobalSelectedExample(example);
    },
    [onChange, setGlobalSelectedExample],
  );

  const menuItems = React.useMemo(() => {
    const items: MenuItems = examples.map(example => ({
      id: `request-example-${example}`,
      title: example,
      onPress: () => handleClick(example),
    }));

    return items;
    // eslint-disable-next-line
  }, [examples, handleClick]);

  return (
    <ExamplesContext.Provider value={{ globalSelectedExample, setGlobalSelectedExample }}>
      <Menu
        aria-label="Examples"
        items={menuItems}
        renderTrigger={({ isOpen }) => (
          <Button appearance="minimal" size="sm" iconRight={['fas', 'sort']} active={isOpen}>
            Examples
          </Button>
        )}
      />
    </ExamplesContext.Provider>
  );
}
