import isPlainObject from 'lodash.isplainobject';
import { JSDOM } from 'jsdom';

describe('Testing object checking', () => {
  it('that a plain object is recognized as such', () => {
    expect(
      isPlainObject({
        excellent: 'excellent',
        good: 'good',
        missingComplex: 'missing value',
      })
    ).toBeTruthy();
  });
  it('that an empty plain object is recognized as such', () => {
    expect(isPlainObject({})).toBeTruthy();
  });
  it('that a Date is not a plain object', () => {
    expect(isPlainObject(new Date())).toBeFalsy();
  });
  it('that an empty array is not a plain object', () => {
    expect(isPlainObject([])).toBeFalsy();
  });
  it('that an array is not a plain object', () => {
    expect(isPlainObject(['foo', 'bar'])).toBeFalsy();
  });
  it('that a DOM node is not a plain object', () => {
    const document = new JSDOM('html').window.document;
    expect(isPlainObject(document.createElement('div'))).toBeFalsy();
  });
});
