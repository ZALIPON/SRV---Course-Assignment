const crypto = require('crypto');
const AdminService = require('../services/AdminService');
const db = require('../models');
const adminService = new AdminService(db);

module.exports = async function authenticateBasic(req, res, next) {
    // console.log(Object.keys(req))
    // console.log('rawHeaders: ', req.rawHeaders);
    // console.log('req.rawHeaders.[1]: ', req.rawHeaders[1]);
    // const basic = req.rawHeaders[1];
    // newBasic = basic.replace("Basic ", "");
    // console.log(newBasic);
    // const decodedString = atob(newBasic);
    // console.log(decodedString);
    // console.log(decodedString.split(":"));

    const header = req.headers['authorization'] || '';
    if (!header.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const [login, password] = Buffer.from(header.slice(6), 'base64').toString().split(':');
    try {
        const user = await adminService.findOne(login);
    if (!user) throw new Error();

    const hash = await new Promise((res, rej) => {
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (e, h) => e ? rej(e) : res(h));
    });
    if (!crypto.timingSafeEqual(user.password, hash)) throw new Error();

    req.user = user;
    // console.log(user);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};