
function PromiseEachHelper(promiseArray, forEachCallback, finalCallback) {
    let counter = 0;
    let errorOccurred = false;
    promiseArray.forEach((promise) => {
        promise.then((val) => {
            // Due to the asynchronicity, there is no guarantee this will prevent any callbacks after a rejection has occured.
            if (errorOccurred) return;
            forEachCallback(val);
            counter++;
            if (counter >= promiseArray.length) {
                finalCallback();
            }
        }).catch((err) => {
            if (err) {
                errorOccurred = true;
                finalCallback(err);
            }
        });
    });
}

module.exports = PromiseEachHelper;