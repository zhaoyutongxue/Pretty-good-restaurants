// version 1: 
// module.exports = func = (req, res, next) => {
//     return (req, res, next) => {
//         func(req, res, next).catch(next);
//     }
// }

// version 2: 
// const wrapAsync = function (fn) {
//     return (req, res, next) => {
//         fn(req, res, next).catch(next);
//     }
// }

// module.exports = wrapAsync;

// version 3: 
function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = wrapAsync;



