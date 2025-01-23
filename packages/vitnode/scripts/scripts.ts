#!/usr/bin/env node
/* eslint-disable no-console */
import { prepareFiles } from "./prepare-files.js";

const initMessage = "\x1b[34m[VitNode]\x1b[0m";

if (process.argv[2] === "prepare") {
  prepareFiles({ initMessage });
}
