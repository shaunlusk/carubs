const PromiseEachHelper = require('../PromiseEachHelper');

describe('PromiseEachHelper', () => {
    it('should call then on all promises', (done) => {
        const thenArgs = [
            'then arg check 1',
            'then arg check 2'
        ];

        const prom1 = new Promise((resolve, reject) => {
            resolve(thenArgs[0]);
        });
        const prom2 = new Promise((resolve, reject) => {
            resolve(thenArgs[1]);
        });

        const args = [];
        const callback = (someArg) => {
            args.push(someArg);
        }

        PromiseEachHelper([prom1, prom2], callback, (err) => {
            expect(err).toBeUndefined();
            expect(args).toEqual(expect.arrayContaining(thenArgs));
            done();
        });
    });
    it('should abort on error', (done) => {
        const errStr = 'it blew up';
        const prom1 = new Promise((resolve, reject) => {
            reject(errStr);
        });
        const prom2 = new Promise((resolve, reject) => {
            resolve('whatever');
        });

        const args = [];
        const callback = (someArg) => {
            args.push(someArg);
        }

        PromiseEachHelper([prom1, prom2], callback, (err) => {
            expect(err).toBe(errStr);
            done();
        });
    });
});