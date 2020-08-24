const parseCustomFields = (fieldsArray, configValues) => {
  if (!fieldsArray?.length) return;
  return fieldsArray.reduce((acc, item) => {
    if (typeof item !== 'string') {
      return acc;
    }

    const [key, value] = item?.split(',');

    if (!key || !value) {
      throw 'reporting.customField should be a string with comma: fieldKey,fieldValue';
    }
    acc[key] = value;
    return acc;
  }, {...configValues});
};

export const mergeConfigWithParams = (argv) => {
  return {
    ...argv.config,
    reporting: {
      ...argv?.reporting,
      customFields: {
        ...parseCustomFields(argv?.reporting?.customFields, argv.config?.reporting?.customFields)
      }
    },
    tests: {
      ...argv.config?.tests,
      ...argv?.tests
    },
    credentials: {
      ...argv.config?.credentials,
      ...argv?.credentials
    }
  };
}
