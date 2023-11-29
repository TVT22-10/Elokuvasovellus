const { default: axios } = require('axios');
var xml2js = require('xml2js');

getXml();

//Promise version
async function getXml(){
    try {
        const result = await axios.get('https://www.finnkino.fi/xml/ScheduleDates/');

        const jsResult = await xml2js.parseStringPromise(result.data);
        
        jsResult.NewsCategories.NewsArticleCategory.forEach(e => {
            console.log(e.Name[0]);
        });
        
    } catch (error) {
        console.log(error);
    }
}


// Callback version
// axios.get('https://www.finnkino.fi/xml/ScheduleDates/')
//     .then( res=> {
//         parseString(res.data, (err, result) => {
//             result.NewsCategories.NewsArticleCategory.forEach(e => {
//                 console.log(e.Name[0]);
//             });
//         })
//     });