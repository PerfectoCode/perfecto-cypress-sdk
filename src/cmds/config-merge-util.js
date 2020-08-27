export const parseCustomFields = (fieldsArray) => {
  if (!fieldsArray?.length) return;
  return fieldsArray.reduce((acc, item) => {
    const [key, value] = item?.split(',');

    if (!key || !value) {
      throw 'reporting.customField should be a string with comma: fieldKey,fieldValue';
    }
    acc[key] = value;
    return acc;
  }, {});
};

export const mergeConfigWithParams = (argv) => {
  const configCustom = argv.config?.reporting?.customFields || [];
  const optionsCustom = argv.reporting?.customFields  || [];
  const customFields = parseCustomFields([...configCustom, ...optionsCustom]);

  return {
    ...argv.config,
    reporting: {
      ...argv?.reporting,
      customFields
    },
    tests: argv?.tests,
    credentials: argv?.credentials
  };
}
