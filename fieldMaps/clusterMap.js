const featureMap = require('./featureMap');

module.exports = { 
    ...featureMap,
    id: {isId:true, type:'text', useFeature:true, isRequired:true}
};
