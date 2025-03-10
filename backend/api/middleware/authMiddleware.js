export const authMiddleware = (req, res, next) => {
    console.log("Authentication middleware triggered");
    next();
};
