export const parseCustomFields = (fieldsA, fieldsB) => {
  const fieldsArray =  [...(fieldsA ||  []), ...(fieldsB || [])]
  if (!fieldsArray?.length) return;
  const customFieldsMap = fieldsArray.reduce((acc, item) => {
    const [key, value] = item?.split(',');

    if (!key || !value) {
      throw 'reporting.customField should be a string with comma: fieldKey,fieldValue';
    }

    acc.set(key, {name: key, value});
    return acc;
  }, new Map());

  return [...customFieldsMap.values()];
};

export const mergeConfigWithParams = (argv) => {
  const configCustom = argv.config?.reporting?.customFields || [];
  const optionsCustom = argv.reporting?.customFields  || [];
  const customFields = parseCustomFields(configCustom, optionsCustom);

  return {
    ...argv.config,
    reporting: {
      ...argv?.reporting,
      customFields
    },
    env: {
      ...argv.config.env,
      ...argv.env
    },
    tests: argv?.tests,
    nodeVersion: argv?.nodeVersion,
    credentials: argv?.credentials
  };
}
