#!/usr/bin/env node

import { Command } from "commander";
import * as prettier from "prettier";
import * as fs from "fs";

const program = new Command();

program.argument("<filepath>", "HTML file path")
    .option("-c --comment", "Comment the new Angular 17 control flow")
    .option("-u --uncomment", "Uncomment the new Angular 17 control flow")
    .parse(process.argv);

const filepath = program.args[0];
const commentOption = program.opts().comment;
const uncommentOption = program.opts().uncomment;

function validateCommands()
{
    if (commentOption === uncommentOption) {
        program.error("error: please provide either the comment option -c or the uncomment option -u");
    }

    if (!filepath.endsWith(".html")) {
        program.error("error: please choose an HTML file");
    }

    if (!fs.existsSync(filepath)) {
        program.error("error: file does not exist");
    }
}

async function parseFile() {
    let file = fs.readFileSync(filepath, 'utf8');
    if (commentOption) {
        file = await prettier.format(file, {parser: "angular"});
        fs.writeFileSync(filepath, file, 'utf8');
    }
    const lines = file.split('\n');

    let previousLeftIndent = -1;
    const commentRegex = /<!--[^-]*[@}][^-]*-->/;
    for (let i = 0; i < lines.length; ++i) {
        // Comment
        const currentLeftIndent = (lines[i].match(/^\s*/) || [])[0].length;
        if (commentOption && lines[i].includes("@")) {
            previousLeftIndent = currentLeftIndent;
            lines[i] = `<!--${lines[i]}`;
            lines[i] = `${lines[i]}-->`;
        }
        else if (commentOption && lines[i].includes("}") && currentLeftIndent === previousLeftIndent) {
            previousLeftIndent = -1;
            lines[i] = `<!--${lines[i]}`;
            lines[i] = `${lines[i]}-->`;
        }

        // Uncomment
        if (uncommentOption && commentRegex.test(lines[i])) {
            lines[i] = lines[i].replace("<!--", "");
            lines[i] = lines[i].replace("-->", "");
        }
    }
    fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
}

validateCommands();
await parseFile();
