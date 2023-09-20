import { mkdir } from "fs/promises";
import _projectsDir from "./projectsDir.js";

class Dir {
  name: string;
  content: Dir[];
  constructor(name: string, content: Dir[]) {
    this.name = name;
    this.content = content;
  }
}

async function main() {
  const projectsDir = _projectsDir();
  const dirs = [
    new Dir(projectsDir + Math.random().toFixed(5) + `\\node_modules`, []),
    new Dir(projectsDir + Math.random().toFixed(5) + `\\node_modules`, []),
    new Dir(projectsDir + Math.random().toFixed(5) + `\\node_modules`, []),
  ];
  loopDir(dirs);
  console.log("created dirs!");
}
main();

function loopDir(dir: Dir[]) {
  dir.forEach(async (dir) => {
    console.log(dir.name);
    await mkdir(dir.name, { recursive: true });
    loopDir(dir.content);
  });
}
