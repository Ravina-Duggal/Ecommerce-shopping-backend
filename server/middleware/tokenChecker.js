let jwt = require('jsonwebtoken')
const helper = require('../utilities/helpers')


module.exports = (req, res, next) => {
    const token = req.headers['authorization']
    if (token) {
        jwt.verify(token, helper.SECRET, function (err, decoded) {
            if (err) {
                return res.status(403).json({ "status": false, "message": 'Unauthorized access.' });
            }
            req.decoded = decoded;
            next();
        });
    }
    else {
        return res.status(403).send({
            status: 403,
            success: false,
            message: "No Token Found "
        });
    }
}