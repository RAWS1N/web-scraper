const app = require('./app')


port = process.env.PORT || 5000

app.listen(port,() => {
    console.log(`server is listening on port:${port}`)
})