import { writeFile } from "fs/promises";
import mydirname from "./dirname.js";

async function main() {
  const data = `import mydirname from "./dirname.js";
  export default function _projectsDir() {
      return \`\${mydirname("../")}test\\\\\`;
  }`;
  await writeFile(`${mydirname()}projectsDir.js\\`, data);
}
main();
