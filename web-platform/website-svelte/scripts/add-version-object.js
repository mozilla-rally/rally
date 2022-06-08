import cp from "child_process";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json").toString());

const version = {
  version: pkg.version,
  repository: pkg.repository.url,
  branch: cp
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .slice(0, -1),
  commit: cp.execSync("git rev-parse HEAD").toString().trim(),
  buildDate: new Date().toISOString(),
};

fs.writeFileSync("static/version.json", JSON.stringify(version));
