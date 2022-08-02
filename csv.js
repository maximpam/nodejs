const https = require('https');
const fs = require('fs');

https.get('https://reqres.in/api/users', res => {
    let data = [];
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.statusCode);
    console.log('Date in Response header:', headerDate);

    res.on('data', chunk => {
        data.push(chunk);
    });

    res.on('end', () => {
        console.log('Response ended: ');
        const result = JSON.parse(data);
        console.log(result.data);
        const elements = result.data;
        let file = 'ID,Email,First Name,Last Name';

        for (const element of elements) {
            console.log(element);
            file += '\r\n'+element.id+','+element.email+','+element.first_name+','+element.last_name;
        }
        console.log(file);
        fs.writeFileSync("FILE.CSV", file);

    });
}).on('error', err => {
    console.log('Error: ', err.message);
});