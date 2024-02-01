// @ts-nocheck

export const extractExampleKeys = (bodyExamples, paramExamples) => {
  const mapKeys = examples => {
    if (!examples) return [];

    return examples.map(example => example.key);
  };

  const bodyKeys = mapKeys(bodyExamples);
  const paramKeys = mapKeys(paramExamples);

  return { bodyKeys, paramKeys };
};
