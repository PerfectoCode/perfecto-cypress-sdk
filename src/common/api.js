const cloudSuffix = '-perfectomobile-com';
const normalizeCloudName = cloud => cloud.endsWith(cloudSuffix) ? cloud : cloud + cloudSuffix;

export const getPerfectoHeaders = (cloud, securityToken) => ({
  'perfecto-tenantid': normalizeCloudName(cloud),
  'Perfecto-Authorization': securityToken
});

export const parseReportingError = (error) => {
  const data = error.data || (error.response && error.response.data) || error.message;
  return (data && data.length > 0 && data[0].userMessage) || data;
}

export const getRepositoryUrl = (cloud) => {
  let envPrefix = '';

  if (process.env.NODE_ENV === 'preprod') {
    envPrefix = 'dev-stg.';
  }

  return `https://${cloud}.app.${envPrefix}perfectomobile.com/repository-management-webapp/rest/v1/repository-management/artifacts/direct`;
};

export const getBackendBaseUrl = (cloud='tenant') => {
  const NASE_BACKEND_URL = process.env.NASE_BACKEND_URL;

  return NASE_BACKEND_URL || 'https://' + cloud + '.perfectomobile.com/lab-execution/v1'
}
