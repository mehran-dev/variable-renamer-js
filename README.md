### how to use as loader in webpack config

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.js", // Adjust to your entry file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        use: [
          {
            loader: path.resolve(__dirname, "variableRenamingLoader.js"), // Use your custom loader
          },
          {
            loader: "babel-loader", // Process the transformed code with Babel
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
        exclude: /node_modules/, // Exclude node_modules from processing
      },
    ],
  },
};
```

### VITE

```javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

// Function to generate a random variable name
const generateRandomName = () => "a" + Math.floor(Math.random() * 1000);

/**
 * Vite Plugin for Renaming Variables
 */
module.exports = function variableRenamerPlugin() {
  return {
    name: "vite-plugin-variable-renamer", // Plugin name
    transform(code, id) {
      // Process only JS/TS files
      if (!/\.(js|jsx|ts|tsx)$/.test(id)) {
        return null;
      }

      // Parse the code into an AST
      const ast = parser.parse(code, {
        sourceType: "module", // To support ES modules
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

      // Return the transformed code
      return {
        code: output,
        map: null, // No source map
      };
    },
  };
};
```

```javascript
// prerequisites !
// npm install @babel/parser @babel/traverse @babel/generator
```

```javascript
// vite.config.js
import { defineConfig } from "vite";
import variableRenamerPlugin from "./vite-plugin-variable-renamer";

export default defineConfig({
  plugins: [
    variableRenamerPlugin(), // Add your custom plugin
  ],
});
```
