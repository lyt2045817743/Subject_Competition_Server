const jwt = require('jsonwebtoken');

// 生成token
function genToken(info, privateKey) {
    return jwt.sign(info, privateKey, {expiresIn: 10});
}

// 检查token是否过期
function decodeToken(token) {
    return jwt.decode(token);
}

function verifyToken(token, privateKey) {
    return jwt.verify(token, privateKey, function(err, decoded) {
        if (err) {
            console.log(err);
        } else {
            return decoded;
        }
    });
}

module.exports = {
    genToken,
    decodeToken,
    verifyToken
}