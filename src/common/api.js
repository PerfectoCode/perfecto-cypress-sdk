export const getPerfectoHeaders = (cloud, securityToken) => ({
  'perfecto-tenantid': cloud, // TODO: (Elhay) is it always -perfectomobile-con, do i need this part?
  'Perfecto-Authorization': securityToken
});

export const parseReportingError = (error) => {
  const data = error.data || (error.response && error.response.data) || error.message;
  return (data && data.length > 0 && data[0].userMessage) || data;
}
