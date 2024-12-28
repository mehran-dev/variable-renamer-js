const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

// Function to generate a random variable name
const generateRandomName = () => "a" + Math.floor(Math.random() * 1000);

// Read the JavaScript file
const code = fs.readFileSync("js.js", "utf-8");

// Parse the code into an AST
const ast = parser.parse(code);

// Traverse the AST and rename all variable names
traverse(ast, {
  VariableDeclarator(path) {
    const randomName = generateRandomName();
    path.node.id.name = randomName;
  },
  AssignmentExpression(path) {
    if (path.node.left.type === "Identifier") {
      path.node.left.name = generateRandomName();
    }
  },
});

// Generate the transformed code from the AST
const output = generator(ast).code;

// Save the transformed code to a new file
fs.writeFileSync("./output.js", output);

console.log("Variable names have been renamed.", output);
