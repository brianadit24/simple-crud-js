const model = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function createUser(req, res){
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(req.body.password, salt)

    model.User.create({
        name: req.body.name,
        label: req.body.label,
        picture: req.body.picture,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        summary: req.body.summary,
        password: hash,
    })
    .then( function(result){
        res.json(result)
    })
    .catch( function(error){
        res.json({error: error})
    })
}
function readUser(req, res){
    model.User.findAll()
    .then( function(result){
        res.json(result)
    })
    .catch( function(error){
        res.json({error:error})
    })
}
function updateUser(req, res){
    let decodedId = req.decoded.id;
    if(Number(decodedId) === Number(req.params.id)){
        // let salt = bcrypt.genSaltSync(10)
        // let hash = bcrypt.hashSync(req.body.password, salt)
        model.User.update({
            name: req.body.name,
            label: req.body.label,
            picture: req.body.picture,
            email: req.body.email,
            phone: req.body.phone,
            website: req.body.website,
            summary: req.body.summary,
            // password: hash,
        },{
            where: {
                id: req.params.id
            }
        })
        .then( function(result){
            res.json(result)
        })
        .catch( function(error){
            res.json({error: error})
        })
    } else {
        res.json({
            message: 'Ini bukan data Anda'
        })
    }
}
function deleteUser(req, res){
    let decodedId =  req.decoded.id
    if(Number(decodedId) === Number(req.params.id)){
        model.User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then( function(result){
            res.json(result)
        })
        .catch( function(error){
            res.json({error: error})
        })
    } else{
        res.json({
            message : 'Ini bukan data Anda'
        })
    }
}
function loginUser(req, res){
    const email = req.body.email
    const password = req.body.password

    model.User.findOne({
        where: {
            email: email
        }
    })
    .then( function(result){
        let passwordHash = result.password;
        let checkPassword = bcrypt.compareSync(password, passwordHash);

        if(checkPassword){
            res.json({
                message: 'Berhasil Login',
                token: jwt.sign({id: result.id}, 'Brian-Dev')
            })
        } else{
            res.json({
                message: 'Gagal Login'
            })
        }
    })
    .catch(  function(error){
        res.json({error: error})
    })
}

module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
}