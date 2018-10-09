'use strict';
/* globals fetchMock */

var fetchMockLocal;

try {
  fetchMockLocal = fetchMock;
} catch (err) {
  fetchMockLocal = require('fetch-mock');
}

const User = exports.User || require('./user').User;

describe('User', function() {
  it('should load', function() {
    expect(User).toBeDefined();
  });

  describe('contruction', function() {
    it('should construct', function() {
      var user = new User();
      expect(user).toBeDefined();
    });

    it('should support json', function() {
      var user = new User({
        username: 'anonymouse'
      });

      expect(user).toBeDefined();
      expect(user.username).toEqual('anonymouse');
      expect(user.url).toEqual('http://localhost:3000/v1/users/anonymouse');
    });
  });

  describe('profile', function() {
    afterEach(function() {
      fetchMockLocal.restore();
    });

    it('should fetch', function(done) {
      var user = new User({
        username: 'anonymouse'
      });

      fetchMockLocal.mock({
        name: 'anonymouse_json',
        matcher: /\/v1\/users\/anonymouse/,
        method: 'GET',
        response: {
          id: 1,
          givenName: 'Anony',
          language: 'fr',
          username: 'anonymouse',
          createdAt: '2016-05-15T15:04:18.027Z',
          updatedAt: '2016-05-15T15:04:18.027Z'
        }
      });

      user.fetch()
        .then(function(result) {
          expect(result).toBe(user);
          expect(user.givenName).toEqual('Anony');
          expect(user.language).toEqual('fr');
          expect(user.createdAt).toEqual('2016-05-15T15:04:18.027Z');

          expect(fetchMockLocal.called('anonymouse_json')).toBeTruthy();
          done();
        })
        .catch(function(err) {
          expect(err.message).toEqual('Failed to fetch');

          expect(fetchMockLocal.called('anonymouse_json')).toBeTruthy();
          done();
        });
    });

    it('should handle 403', function(done) {
      var user = new User({
        username: 'impersonator'
      });

      fetchMockLocal.mock({
        name: 'impersonator_json',
        matcher: /\/v1\/users\/impersonator/,
        method: 'GET',
        response: {
          status: 403,
          body: {
            message: 'Unauthorized'
          }
        }
      });

      user.fetch()
        .then(function(result) {
          expect(result).toBeNull();
          expect(true).toBeFalsy();

          done();
        })
        .catch(function(err) {
          expect(err.status).toEqual(403);
          expect(err.statusText).toEqual('Forbidden');
          expect(err.message).toEqual('Unauthorized');
          // expect(err.url).toEqual('http://localhost:3000/v1/users/impersonator');

          expect(fetchMockLocal.called('impersonator_json')).toBeTruthy();
          done();
        });
    });
  });

  describe('render', function() {
    afterEach(function() {
      fetchMockLocal.restore();
    });

    it('should render', function(done) {
      var user = new User({
        givenName: 'Anony',
        familyName: 'Mouse',
        id: 'af3104b0-cb69-11e8-ba75-6f9a7b4c6ada',
        revision: '1-1539051540535',
        deletedAt: null,
        deletedReason: '',
        username: 'anonymouse',
        email: 'anony@mouse.it',
        gravatar: 'e240ea628afa673f40019d12c10b3991',
        description: 'A user for testing.',
        language: '',
        hash: '$2a$10$cD3yHU5Pzxg1BHtDIFvLLOl/fNsW/eq7LAFziCt1ClDEupAgIfohG',
        createdAt: '2018-10-09T02:19:00.603Z',
        updatedAt: '2018-10-09T02:19:00.603Z',
      });
      user.render()
        .then(function(result) {
          expect(result).toBe(user);
          if (typeof document !== 'undefined' && typeof global.jQuery !== 'undefined') {
            expect(global.jQuery('#profile').text().replace(/\W+/g, ' ')).toEqual(' Anony Mouse anonymouse Email anony mouse it Description A user for testing ');
          }
          done();
        });
    });
  });
});
