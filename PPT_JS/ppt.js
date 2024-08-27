// function step1(callback) {
//     setTimeout(() => {
//         console.log("Step 1 complete");
//         callback();
//     }, 1000);
// }
// function step2(callback) {
//     setTimeout(() => {
//         console.log("Step 2 complete");
//         callback();
//     }, 1000);
// }
// function step3(callback) {
//     setTimeout(() => {
//         console.log("Step 3 complete");
//         callback();
//     }, 1000);
// }

// step1(() => {
//     step2(() => {
//         step3(() => {
//             console.log("All steps complete");
//         });
//     });
// });


// // Assigning a function to a variable
// function greet(name) {
//     return "Hello, " + name + "!";
// }

// // Passing a function as an argument
// function processUserInput(callback) {
//     var name = "Alice";
//     console.log(callback(name));
// }

// // Returning a function from another function
// function createGreeter(greeting) {
//     return function(name) {
//         return greeting + ", " + name + "!";
//     };
// }

// // Using the functions
// processUserInput(greet); // Output: Hello, Alice!

// var greeter = createGreeter("Hi");
// console.log(greeter("Bob")); // Output: Hi, Bob!

// // Higher-order function taking a function as an argument
// function repeat(n, action) {
//     for (var i = 0; i < n; i++) {
//         action(i);
//     }
// }

// // Higher-order function returning another function
// function createMultiplier(multiplier) {
//     return function(number) {
//         return number * multiplier;
//     };
// }

// // Function to multiply two numbers
// function multiply(a, b) {
//     return a * b;
// }

// // Curried function to create a multiplier
// function multiply(a) {
//     return function(b) {
//         return a * b;
//     };
// }

// // Create specific multiplier functions
// const double = multiply(2); // Function that multiplies by 2
// const triple = multiply(3); // Function that multiplies by 3

// // Call the functions
// console.log(double(5)); // Output: 10
// console.log(triple(5)); // Output: 15



// console.log(this); // In browsers, refers to the window object

// function showThis() {
//     console.log(this);
// }

// showThis(); // In non-strict mode: window (or global), in strict mode: undefined

// const obj = {
//     name: 'Alice',
//     greet: function() {
//         console.log(this.name);
//     }
// };

// obj.greet(); //obj method

// function Person(name) {
//     this.name = name;
// }

// const person1 = new Person('Bob');
// console.log(person1.name); // constructor

// // Get element by ID
// var elementById = document.getElementById('exampleId');

// // Get element by CSS selector
// var elementBySelector = document.querySelector('.exampleClass');

// // Get elements by class name
// var elementsByClassName = document.getElementsByClassName('exampleClass');

// // Changing content
// elementById.textContent = 'New Text';
// elementById.innerHTML = '<p>New HTML Content</p>';

// // Changing attributes
// elementById.setAttribute('data-example', 'value');
// elementById.src = 'newImage.png';

// // Changing styles
// elementById.style.color = 'blue';
// elementById.style.fontSize = '20px';

// // Creating a new element
// var newElement = document.createElement('div');
// newElement.textContent = 'Hello, World!';

// // Appending the new element to a parent element
// var parentElement = document.querySelector('#parentId');
// parentElement.appendChild(newElement);

// // Removing an element
// parentElement.removeChild(newElement);


// /*Let*/
// let greeting = "say Hi";
// let times = 4;

// if (times > 3) {
//      let hello = "say Hello instead";
//      console.log(hello);// "say Hello instead"
//      console.log(greeting); // "say Hi"
// }
// console.log(greeting);// "say Hi"
// console.log(hello) // hello is not defined

// let b = 10;
// if(true){
//     let a = 10;
//     console.log(a);// 10
// }
// console.log(b);// 10
// console.log(a);// a is not defined
