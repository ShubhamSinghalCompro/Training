const fs = require('fs');
// fs is a core module in node.js and it provides the methods for reading and writing files. 
// The fs module provides an API for interacting with the file system in Node.js.

//Synchronous Call 
console.log('Start'); 
fs.writeFileSync('./test.txt', 'Test File! from Node.js');
console.log('File created!');

//Asynchronous Call 
fs.writeFile('./test.txt', 'Test File Async! from Node.js', (err) => {
    if (err) throw err;
})
console.log('File created!');
console.log('End');

// Reading a file synchronously. It returns the result as a string. ..blocking call
const data = fs.readFileSync('./contacts.txt', 'utf8');
console.log(data);

// Reading a file asynchronously. It returns a promise. ..non-blocking call

fs.readFile('./contacts.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

//appending a file. Can be used for logging purposes.
fs.appendFileSync('./contacts.txt', 'New Contact\n');

//copy
fs.cpSync('./test.txt', './test2.txt');

//delete
fs.unlinkSync('./test2.txt');

statistics
console.log(fs.statSync('./test.txt'));
