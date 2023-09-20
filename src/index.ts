import { lstat, readdir, rm } from "fs/promises";
import _projectsDir from "./projectsDir.js";
import log from "single-line-log";
import chalk from "../node_modules/chalk/source/index.js";
import readline from "readline";

// how many months old the dir was last modified
const ago = 2;

// colors
const orange = chalk.hex("#e79600");
const greenBright = chalk.hex("#46df00");
const purple = chalk.hex("#ac00e0");
const blueBright = chalk.hex("#00eeff");
const yellow = chalk.hex("#bdca00");
const red = chalk.hex("#ff0000");

// initialize readline
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log(
    blueBright("\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  );
  console.log(blueBright(`Starting...`));
  console.log(
    blueBright(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n")
  );
  const projectsDir = _projectsDir();
  const deletedNum = await deleteNodeModules(projectsDir);
  input.close();
  log.stdout.clear();
  console.log(
    blueBright("\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  );
  console.log(blueBright(`Deleted ${deletedNum} node_module(s).`));
  console.log(
    blueBright(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n")
  );
}
main();

function deleteNodeModules(projectsDir: string) {
  return new Promise<number>(async (resolve) => {
    try {
      let deletedNum = 0;
      const list = await loopDir(projectsDir);
      log.stdout(``);
      log.stdout.clear();
      console.log(orange(`Found ${list.length} node_module(s)`));
      if (list.length > 0) {
        input.question(
          orange("Are you sure you want to delete them? (y/n): "),
          async (answer) => {
            console.log(`\n`);
            if (answer.toLowerCase().startsWith("y")) {
              for (const { path, mtime } of list) {
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - ago);
                if (mtime <= monthsAgo) {
                  try {
                    log.stdout.clear();
                    console.log(greenBright(`Deleting: ${path}`));
                    // await rm(path, { recursive: true });
                    deletedNum += 1;
                  } catch (error) {
                    log.stdout.clear();
                    console.log(red(`\n${error}`));
                  }
                } else {
                  log.stdout.clear();
                  console.log(
                    yellow(
                      `Will not delete "${path}" because it is not older than ${ago} months.`
                    )
                  );
                }
              }
            }
            // return result
            resolve(deletedNum);
          }
        );
      }
    } catch (error) {
      console.log(red(`\n\n${error}\n\n`));
      resolve(0);
    }
  });
}

async function loopDir(dir: string) {
  const res: { path: string; mtime: Date }[] = [];
  try {
    const contents = await readdir(dir);
    for (const name of contents) {
      const stat = await lstat(dir + name);
      const isFile = stat.isFile();
      const path = dir + name + (isFile ? "" : "\\");
      log.stdout(`Checking: ${path} -> ${stat.mtime}`);
      if (path.endsWith("\\node_modules\\")) {
        const found = { path, mtime: stat.mtime };
        res.push(found);
        log.stdout(purple(`Found: ${path} -> ${stat.mtime}`));
        log.stdout.clear();
        console.log(`\n`);
      } else if (
        !isFile &&
        !path.endsWith("\\target\\") &&
        !path.endsWith("\\build\\") &&
        !path.endsWith("\\.expo\\") &&
        !path.endsWith("\\.idea\\") &&
        !path.endsWith("\\.git\\")
      ) {
        (await loopDir(path)).forEach((i) => res.push(i));
      }
    }
  } catch (_) {}
  return res;
}
