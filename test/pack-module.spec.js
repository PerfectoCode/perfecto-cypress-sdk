import { expect } from 'chai';
import perfectoCypress from '../src/index';

describe('Pack - module', () => {
  it('should pack zip into destination folder - /test', async () => {
    const zipFilePath = await perfectoCypress.pack('test/resources/**', [], './test');
    expect(zipFilePath).to.be.eq('test/perfecto-cypress.zip')
    // TODO: (Elhay) validate file size, should be 314 bytes
  });
});
