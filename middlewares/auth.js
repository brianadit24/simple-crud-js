const jwt = require('jsonwebtoken')
const model = require('../models')

module.exports = (req, res, next) => {
    let token = req.headers.token;
    if(token){
        let verify = jwt.verify(token, 'Brian-Dev')

        model.User.findOne({
            where: {
                id: verify.id
            }
        })
        .then((result) => {
            if(result){
                req.decoded = verify
                next()
            }else{
                res.status(401).json({
                    'Message': 'Kamu tidak punya akses'
                })
            }
        }).catch((err) => {
            res.json({error: err})
        });
    }else{
        res.status(401).json({
            'Message': 'Silahkan Login Dahulu'
        })
    }
}