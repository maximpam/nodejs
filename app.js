const http = require('http');
const fs = require('fs');
const port = 3000;
const url = require('url');
const mongoose = require('mongoose');
const User = require('./models/users.js');
mongoose.connect('mongodb+srv://maximpam:QLjpQkvs1bjWNtQ1@cluster0.nvhvahw.mongodb.net/test', { useUnifiedTopology: true, useNewUrlParser: true });

const server = http.createServer(async function (req, res) {

    let urlParts = url.parse(req.url);
    console.log('============================');
    console.log(urlParts.pathname);
    console.log('=============================');

    switch (req.method) {
        case 'GET':
            switch (urlParts.pathname) {
                case '/':
                    homepage(req, res);
                    break;
                case '/test':
                    test(req, res);
                    break;
                case '/user':
                    getUserByEmail(req, res);
                    break;
                default:
                    homepage(req, res);
                    break;
            }
            break;
        case 'POST':
            switch (urlParts.pathname) {
                case '/':
                    homepage(req, res);
                    break;
                case '/user':
                    await saveUser(req, res);
                    break;
                default:
                    homepage(req, res);
                    break;
            }
            break;
        default:
            res.writeHead(404);
            res.end('no such route');
            break;
    }

});
server.listen(port, function (error){
        if(error){
            console.log('Something went wrong', error);
        }else{
            console.log('Servere is listening on port ' + port);
        }
});
function homepage(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('homepage');

}
function test(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('about');
}
async function saveUser(req, res){
    let data = '';
    req.on('data', chunk => {
        console.log(`Data chunk available: ${chunk}`);
        data += chunk;
    });
    req.on('end', async () => {
        if (JSON.parse(data).age && JSON.parse(data).age >= 18) {
            const user = new User({
                email: JSON.parse(data).email,
                name: JSON.parse(data).name,
                surname: JSON.parse(data).surname
            });
            await user.save();
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('Done');
        } else {
            res.writeHead(403, {'Content-Type': 'text/html'});
            res.end('You should be 18+');
        }
    });
};
async function getUserByEmail(req, res) {
    let urlParts = url.parse(req.url);
    let query = urlParts.query;
    const myArray = query.split("=");
    let result = new Map([
        [myArray[0], myArray[1]]
    ]);
    const user = await User.findOne({email:result.get('email')});
    let response = user.name + ' ' + user.surname;
    console.log(response);
    res.end(response);
};