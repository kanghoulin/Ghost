var getKeywords = require('../../../server/data/meta/keywords'),
    sinon   = require('sinon'),
    should = require('should'),
    sandbox = sinon.sandbox.create();

describe('getKeywords', function () {
    afterEach(function () {
        sandbox.restore();
    });
    it('should return tags as keywords if post has tags', function () {
        var keywords = getKeywords({
            post: {
                tags: [
                    {name: 'one'},
                    {name: 'two'},
                    {name: 'three'}
                ]
            }
        });
        should.deepEqual(keywords, ['one', 'two', 'three']);
    });

    it('should only return visible tags', function () {
        var keywords = getKeywords({
            post: {
                tags: [
                    {name: 'one', visibility: 'public'},
                    {name: 'two', visibility: 'internal'},
                    {name: 'three'},
                    {name: 'four', visibility: 'internal'}
                ]
            }
        });
        should.deepEqual(keywords, ['one', 'three']);
    });

    it('should return null if post has tags is empty array', function () {
        var keywords = getKeywords({
            post: {
                tags: []
            }
        });
        should.equal(keywords, null);
    });

    it('should return null if post has no tags', function () {
        var keywords = getKeywords({
            post: {}
        });
        should.equal(keywords, null);
    });

    it('should return null if not a post', function () {
        var keywords = getKeywords({
            author: {}
        });
        should.equal(keywords, null);
    });
});