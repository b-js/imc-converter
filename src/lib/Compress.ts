import * as child_process from 'child_process';
// @ts-ignore
import {__files_dirname} from '../../files/dirname';
const path = require('path');
const dir = path.join(__files_dirname, 'output');
const gltfpack = require('gltfpack');
const fs = require('fs-extra');

export const compress = (filename: string) => {
    return new Promise((res, rej) => {
        const ls = child_process.exec(`gltfpack -i ${dir}\\${filename} -o ${dir}\\${filename} -kn -ke -noq -c`);
        // ls.stdout.on("data", data => {
        //     console.log(`stdout: ${data}`);
        // });
        //
        // ls.stderr.on("data", data => {
        //     console.log(`stderr: ${data}`);
        // });

        ls.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        ls.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
        });
    })
};

