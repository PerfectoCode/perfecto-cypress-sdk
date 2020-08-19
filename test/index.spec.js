import { expect } from 'chai';
import helloText from '../src/index';

describe('Simple Test', () => {
  it('should return "Hello world - Perfecto & Cypress"', () => {
    const actualText = helloText('Perfecto & Cypress');
    expect(actualText).eq( 'Hello world - Perfecto & Cypress');
  });
});
