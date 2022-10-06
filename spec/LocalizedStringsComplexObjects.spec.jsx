/** @jsx createElement */

import LocalizedStrings from '../lib/LocalizedStrings';
import { JSDOM } from 'jsdom';

global.window = new JSDOM('html').window;
global.document = new JSDOM('html').window.document;

const createElement = (tag, props, ...children) => {
  if (typeof tag === 'function') return tag(props, ...children);
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith('on') && name.toLowerCase() in window)
      element.addEventListener(name.toLowerCase().substr(2), value);
    else element.setAttribute(name, value.toString());
    if (name === 'key') element[name] = value.toString(); // Added to simulate the behavior of React components...
  });

  children.forEach((child) => {
    appendChild(element, child);
  });

  return element;
};

const appendChild = (parent, child) => {
  if (Array.isArray(child))
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

describe('Testing main Library Functions with complex objects', () => {
  /**
   * Load up language file to use during tests
   */
  global.navigator = {};

  let allStrings, strings;

  beforeEach(() => {
    allStrings = {
      en: {
        language: 'english',
        jsxDom: (
          <div key='div'>
            How do you want your egg
            <br />
            today?
          </div>
        ),
        plainObject: {
          a: 'aaa',
          b: 'bbb',
          c: 'in English only',
        },
        plainObjectInArray: [
          {
            a: 'aaa',
            b: 'bbb',
            c: 'in English only',
          },
        ],
      },
      plainObjectInFunction: () => ({
        a: 'aaa',
        b: 'bbb',
        c: 'in English only',
      }),
      it: {
        language: 'italian',
        jsxDom: <p>Come vuoi il tuo uovo oggi?</p>,
        plainObject: {
          a: 'aaa2',
          b: 'bbb2',
        },
        plainObjectInArray: [
          {
            a: 'aaa2',
            b: 'bbb2',
          },
        ],
        plainObjectInFunction: () => ({
          a: 'aaa2',
          b: 'bbb2',
        }),
      },
    };
    strings = new LocalizedStrings(allStrings, { logsEnabled: false });
  });

  it('checking plain objects from the default language', () => {
    expect(strings.plainObject).toEqual({
      a: 'aaa',
      b: 'bbb',
      c: 'in English only',
    });
  });

  // Switch language
  it('checking plain objects existing in another language', () => {
    strings.setLanguage('it');
    expect(strings.plainObject).toEqual({
      a: 'aaa2',
      b: 'bbb2',
      c: 'in English only',
    });
  });

  // Switch language
  it('checking plain objects in an array existing in another language', () => {
    strings.setLanguage('it');
    expect(strings.plainObjectInArray[0]).toEqual({
      a: 'aaa2',
      b: 'bbb2',
      c: 'in English only',
    });
  });

  // Switch language
  it('checking plain objects in a function existing in another language', () => {
    strings.setLanguage('it');
    expect(strings.plainObjectInFunction()).toEqual({
      a: 'aaa2',
      b: 'bbb2',
    });
  });

  // Switch to non existing language
  it('checking plain objects fallbacks', () => {
    strings.setLanguage('de');
    expect(strings.plainObject).toEqual({
      a: 'aaa',
      b: 'bbb',
      c: 'in English only',
    });
  });

  it('checking JSX Dom nodes from the default language', () => {
    expect(strings.jsxDom.key).toEqual('div');
  });
  // Switch language
  it('checking JSX Dom nodes existing in another language', () => {
    strings.setLanguage('it');
    expect(strings.jsxDom.key).toBeUndefined();
  });

  // Switch to non existing language
  it('checking JSX Dom nodes fallbacks', () => {
    strings.setLanguage('de');
    expect(strings.jsxDom.key).toEqual('div');
  });
});
