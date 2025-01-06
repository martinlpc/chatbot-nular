const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message} (status=${err.status})`)
    res.status(err.status || 500).send({
        success: false,
        error: err.message || 'Internal Server Error'
    })
}

export default errorHandler