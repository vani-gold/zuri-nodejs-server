const path = require('path')
const fs = require('fs')
const http = require('http')
const { fileURLToPath } = require('url')

// 200 successfull
// 201 successfull creation
// 300 redirect
// 301 redirect after creation

const server = http.createServer((req, resp) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)
    let contentType = getContentType(filePath) || 'text/html'
    let emptyPagePath = path.join(__dirname, 'public', '404.html')
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(emptyPagePath, 'utf8', (err, content) => {
                    resp.writeHead(200, { 'Content-Type': contentType })
                    resp.end(content)
                })
            }
            else {
                resp.writeHead(500)
                resp.end('A server error has occured')
            }
        }
        if (!err) {
            resp.writeHead(200, { 'Content-Type': contentType })
            resp.end(content)
        }
    })

})



const getContentType = (filePath) => {
    let extname = path.extname(filePath)
    if (extname === '.js') {
        return 'text/javascript'
    }
    if (extname === '.css') {
        return 'text/css'
    }
    if (extname === '.png') {
        return 'image/png'
    }
    if (extname === '.jpeg') {
        return 'image/jpeg'
    }

}

const port = 5002

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
