const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

// Function to generate a random variable name
const generateRandomName = () => "a" + Math.floor(Math.random() * 1000);

// Paths to input and output files
const inputFilePath = path.resolve(__dirname, "js.js"); // Change to your input file
const outputFilePath = path.resolve(__dirname, "output.js"); // Change to your output file

try {
  // Read the content of the input file
  const code = fs.readFileSync(inputFilePath, "utf-8");

  // Parse the code into an AST
  const ast = parser.parse(code, {
    sourceType: "module", // To support ES modules (import/export)
    plugins: ["jsx", "typescript"], // Enable JSX and TypeScript plugins
  });

  // Map to store the mapping of original variable names to new names
  const variableMap = new Map();

  // Traverse the AST and rename all variable names and their references
  traverse(ast, {
    VariableDeclarator(path) {
      const originalName = path.node.id.name; // Original variable name
      if (!variableMap.has(originalName)) {
        const randomName = generateRandomName();
        variableMap.set(originalName, randomName); // Store the mapping
        path.node.id.name = randomName; // Rename the variable
      }
    },
    Identifier(path) {
      const name = path.node.name;
      if (variableMap.has(name)) {
        path.node.name = variableMap.get(name); // Rename references
      }
    },
  });

  // Generate the transformed code from the AST
  const output = generator(ast).code;

  // Write the transformed code to the output file
  fs.writeFileSync(outputFilePath, output, "utf-8");
  console.log("Variable names have been renamed and saved to output.ts");
} catch (err) {
  console.error("Error reading or writing file:", err);
}
