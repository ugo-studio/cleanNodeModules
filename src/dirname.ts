import { fileURLToPath } from "url";

export default function mydirname(url: string="./") {
  return fileURLToPath(new URL(url, import.meta.url));
}
