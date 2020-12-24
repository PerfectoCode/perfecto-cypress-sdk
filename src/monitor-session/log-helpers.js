import prettyMilliseconds from 'pretty-ms';

export const printDuration = duration => prettyMilliseconds(duration);
export const truncate = (text, length) => {
  if (!text || text.length <= length) {
    return text;
  }

  return text.slice(0, length) + '...';
};
export const objectToHash = data => {
  if (!data) {
    return 'N/A';
  }
  return Object.values(data).map(item => typeof item === 'object' ? objectToHash(item) : item ).filter(item => item).join('-');
};

export const getReportingExecutionLink = (cloud, executionId) => {
  return `https://${cloud}.app.perfectomobile.com/reporting/library/?externalId%5B0%5D=${executionId}`;
};
