const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err.message);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Internal Server Error";

    res.status(statusCode).json({ message });
};

export { errorHandler };