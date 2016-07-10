'use strict'

var lib = require('./');

describe('as library', function(){
  it('should load', function(){
    expect(lib).toBeDefined();
  });


  it('should expose User', function(){
    expect(lib.User).toBeDefined();
  });
});
