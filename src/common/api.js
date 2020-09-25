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
