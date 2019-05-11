require('@babel/register')();

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

var jsdom = require('jsdom');
var sinon = require('sinon');

var exposedProperties = ['window', 'navigator', 'document'];
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html>`);

global.document = dom.window.document;
global.window = dom.window;

Object.keys(document.defaultView).forEach(property => {
  if (property === "localStorage") { return }
  if (property === "sessionStorage") { return }

  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

beforeEach(function() {
  global.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  global.sandbox.restore();
});
