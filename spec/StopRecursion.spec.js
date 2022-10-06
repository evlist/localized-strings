import stopRecursion from '../lib/StopRecursion';
import LocalizedStrings from '../lib/LocalizedStrings';
import isPlainObject from 'lodash.isplainobject';

describe('Testing stopRecursion,', () => {
  it('that a plain object is no longer a plain object through stopRecursion', () => {
    const isolated = stopRecursion({
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    });
    expect(isPlainObject(isolated)).toBeFalsy();
  });
  it('that we can access plain object properties through stopRecursion', () => {
    const isolated = stopRecursion({
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    });
    expect(isolated).toEqual({
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    });
  });
  it("that we can access the original object through stopRecursion's _value property", () => {
    const obj = {
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    };
    const isolated = stopRecursion(obj);
    expect(isolated._value).toBe(obj);
  });
  it('that an array is no longer an array through stopRecursion', () => {
    const isolated = stopRecursion(['foo', 'bar']);
    expect(isolated instanceof Array).toBeFalsy();
  });
  it("that we can access array's menbers through stopRecursion", () => {
    const isolated = stopRecursion(['foo', 'bar']);
    expect(isolated).toEqual(['foo', 'bar']);
  });
  it("that we can access the original array through stopRecursion's _value property", () => {
    const obj = ['foo', 'bar'];
    const isolated = stopRecursion(obj);
    expect(isolated._value).toBe(obj);
  });
});

describe('Testing main Library in isolation', () => {
  /**
   * Load up language file to use during tests
   */
  global.navigator = {};
  let strings, allStrings;

  beforeEach(() => {
    allStrings = {
      en: {
        language: 'english',
        ratings: stopRecursion({
          excellent: 'excellent',
          good: 'good',
          missingComplex: 'missing value',
        }),
        anArray: stopRecursion(['excellent', 'good', 'missing']),
        missingObject: stopRecursion({ excellent: 'excellent' }),
        missingArray: stopRecursion(['good']),
      },
      it: {
        language: 'italian',
        ratings: stopRecursion({
          excellent: 'eccellente',
          good: 'buono',
        }),
        anArray: stopRecursion(['eccellente', 'buono']),
      },
    };
    strings = new LocalizedStrings(allStrings, { logsEnabled: false });
  });

  // Default language
  it('Extract simple value from default language', () => {
    expect(strings.ratings).toEqual({
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    });
  });
  it('Extract simple value from default language', () => {
    expect(strings.ratings).toBe(allStrings.en.ratings);
  });
  it('Extract simple value from default language', () => {
    expect(strings.anArray).toEqual(['excellent', 'good', 'missing']);
  });
  it('Extract simple value from default language', () => {
    expect(strings.anArray).toBe(allStrings.en.anArray);
  });

  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(strings.ratings).toEqual({
      excellent: 'eccellente',
      good: 'buono',
    });
  });
  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(strings.ratings).toBe(allStrings.it.ratings);
  });
  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(strings.anArray).toEqual(['eccellente', 'buono']);
  });
  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(strings.anArray).toBe(allStrings.it.anArray);
  });

  it('Extract simple value from a missing object in another language', () => {
    strings.setLanguage('it');
    expect(strings.missingObject).toEqual({ excellent: 'excellent' });
  });
  it('Extract simple value from a missing object another language', () => {
    strings.setLanguage('it');
    expect(strings.missingObject).toBe(allStrings.en.missingObject);
  });
  it('Extract simple value from a missing object another language', () => {
    strings.setLanguage('it');
    expect(strings.missingArray).toEqual(['good']);
  });
  it('Extract simple value from a missing object another language', () => {
    strings.setLanguage('it');
    expect(strings.missingArray).toBe(allStrings.en.missingArray);
  });
});
