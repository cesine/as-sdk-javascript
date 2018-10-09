(function(exports, global) {
  'use strict';

  global.fetch = global.fetch || require('node-fetch');

  /**
   * @class The User Model knows how to handle a
   * user's profile
   *
   * @extends Object
   */
  class User {

    /**
     * @param {Object} json Serialized json from a previuos app load
     */
    constructor(json) {
      console.log('Constructing user', json);

      if (json) {
        for (const attr in json) {
          if (json.hasOwnProperty(attr)) {
            this[attr] = json[attr];
          }
        }
      }
    }

    get url() {
      return 'http://localhost:3000/v1/users/' + this.username;
    }

    fetch() {
      const self = this;
      let xhr;

      return global.fetch(this.url).then(function(response) {
        xhr = response;
        return response.json();
      }).then(function(data) {
        if (xhr.status >= 400) {
          data.status = xhr.status;
          data.statusText = xhr.statusText;
          data.url = xhr.url;
          throw data;
        }

        if (data) {
          for (const attr in data) {
            if (data.hasOwnProperty(attr)) {
              self[attr] = data[attr];
            }
          }
        }
        return self;
      })
      .then(() => {
        return self.render();
      });
    }

    render() {
      if (typeof document === 'undefined') {
        return Promise.resolve(this);
      }
      if (typeof global.jQuery !== 'function') {
        return Promise.resolve(this);
      }

      const element = global.jQuery('#profile');
      if (!element) {
        return Promise.resolve(this);
      }

      element.find('.displayName').html(`${this.givenName} ${this.familyName} <small>(@${this.username})</small>`);
      element.find('.email').text(this.email);
      element.find('.description').text(this.description);

      return Promise.resolve(this);
    }
  }

  exports.User = User;
})(exports, global);
