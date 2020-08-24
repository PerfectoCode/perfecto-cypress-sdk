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
  const customFields = parseCustomFields([...argv?.config.reporting?.customFields, ...argv?.reporting?.customFields]);

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
