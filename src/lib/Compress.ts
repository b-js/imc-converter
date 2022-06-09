import * as child_process from 'child_process';

const path = require('path');
// const dir = path.join(path.resolve(),'files', 'output');

export const compress = (filename: string) => {
    return new Promise((res, rej) => {
        // console.log(`gltfpack -i ${filename} -o ${filename} -kn -ke -noq -c`);
        const ls = child_process.exec(`gltfpack -i ${filename} -o ${filename} -kn -ke -noq -c`);
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

