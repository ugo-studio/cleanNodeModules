import { writeFile } from "fs/promises";
import mydirname from "./dirname.js";

async function main() {
  const data = `export default function _projectsDir() {
    return "C:\\\\projects\\\\";
  }`;
  await writeFile(`${mydirname()}projectsDir.js\\`, data);
}
main();
