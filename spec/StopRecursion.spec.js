import stopRecursion from '../lib/StopRecursion';
import LocalizedStrings from '../lib/LocalizedStrings';

// Used to check that 2 objects of different types have the same properties
const canonicalize = (obj) => {
  JSON.parse(JSON.stringify(obj));
};

describe('Testing stopRecursion,', () => {
  it('that we can access plain object properties through stopRecursion', () => {
    const obj = {
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    };
    const isolated = stopRecursion(JSON.parse(JSON.stringify(obj)));
    expect(canonicalize(isolated)).toEqual(canonicalize(obj));
  });
  it("that we can access the original object through stopRecursion's valueOf() property", () => {
    const obj = {
      excellent: 'excellent',
      good: 'good',
      missingComplex: 'missing value',
    };
    const isolated = stopRecursion(obj);
    expect(isolated.valueOf()).toBe(obj);
  });
  it('that an array is no longer an array through stopRecursion', () => {
    const isolated = stopRecursion(['foo', 'bar']);
    expect(Object.isExtensible(isolated)).toBeFalsy();
  });
  it("that we can access array's menmbers through stopRecursion", () => {
    const isolated = stopRecursion(['foo', 'bar']);
    expect(canonicalize(isolated)).toEqual(
      canonicalize({ 0: 'foo', 1: 'bar' })
    );
  });
  it("that we can access the original array through stopRecursion's valueOf() property", () => {
    const obj = ['foo', 'bar'];
    const isolated = stopRecursion(obj);
    expect(isolated.valueOf()).toBe(obj);
  });
  it("that object's methods can be used", () => {
    const obj = new Date();
    const isolated = stopRecursion(obj);
    expect(isolated.toISOString()).toEqual(obj.toISOString());
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
    expect(canonicalize(strings.ratings)).toEqual(
      canonicalize({
        excellent: 'excellent',
        good: 'good',
        missingComplex: 'missing value',
      })
    );
  });
  it('Extract simple value from default language', () => {
    expect(strings.ratings).toBe(allStrings.en.ratings);
  });
  it('Extract simple value from default language', () => {
    expect(canonicalize(strings.anArray)).toEqual(
      canonicalize({
        0: 'excellent',
        1: 'good',
        2: 'missing',
      })
    );
  });
  it('Extract simple value from default language', () => {
    expect(strings.anArray).toBe(allStrings.en.anArray);
  });

  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(canonicalize(strings.ratings)).toEqual(
      canonicalize({
        excellent: 'eccellente',
        good: 'buono',
      })
    );
  });
  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(strings.ratings).toBe(allStrings.it.ratings);
  });
  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(canonicalize(strings.missingArray)).toEqual(
      canonicalize({ 0: 'good' })
    );
  });
  it('Extract simple value from another language', () => {
    strings.setLanguage('it');
    expect(strings.anArray).toBe(allStrings.it.anArray);
  });

  it('Extract simple value from a missing object in another language', () => {
    strings.setLanguage('it');
    expect(canonicalize(strings.missingObject)).toEqual(
      canonicalize({ excellent: 'excellent' })
    );
  });
  it('Extract simple value from a missing object another language', () => {
    strings.setLanguage('it');
    expect(strings.missingObject).toBe(allStrings.en.missingObject);
  });
  it('Extract simple value from a missing object another language', () => {
    strings.setLanguage('it');
    expect(canonicalize(strings.missingArray)).toEqual(
      canonicalize({ 0: 'good' })
    );
  });
  it('Extract simple value from a missing object another language', () => {
    strings.setLanguage('it');
    expect(strings.missingArray).toBe(allStrings.en.missingArray);
  });
});
