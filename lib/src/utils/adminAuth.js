"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (req, res, next) => {
    try {
        if (req.loginUser.role == 'Admin') {
            next();
        }
        else {
            return res
                .status(401)
                .send('Sorry! Only Admin Have This Rights...');
        }
    }
    catch (e) {
        res.status(401).send({
            error: e,
        });
    }
};
//# sourceMappingURL=adminAuth.js.map