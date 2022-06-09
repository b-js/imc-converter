import * as fs from 'fs';
import GLTFImporter from "./importers/gltf";
import {Bim} from "./models/Imc";
import {compress} from "./lib/Compress";
// @ts-ignore
import {__files_dirname} from '../files/dirname';
// const gltfPipeline = require('gltf-pipeline');

import Parser from "./lib/Parse";

const path = require('path');
const dir = path.join(path.resolve(),'files');

const __input_dir = path.resolve(dir, 'input');
const __output_dir = path.resolve(dir, 'output');

function init(filename: string) {
    fs.readFile(path.join(__input_dir, filename), { encoding: 'utf-8'}, (err, data) => {
        if (err) {
            throw err;
        }
        console.log('Opening file successful! File has ' + data.length + ' symbols');
        const parser = new Parser();
        const parsedData = parser.run(data);
        execute(parsedData, filename);
    });
}
async function execute(parsedData: Bim, filename: string) {
    const gltfImporter = new GLTFImporter(parsedData);
    const output = await gltfImporter.execute();
    const pathFile = filename.split('.').slice(0, -1).join('.') + '.glb';
    const outputFilePath = path.join(__output_dir, pathFile);
    const fileAlreadyExist = fs.existsSync(outputFilePath)
    console.log('Import done, saving...')
    if (fileAlreadyExist) {
        fs.unlinkSync(outputFilePath);
        console.log('Previous file was deleted');
    }
    fs.appendFile(outputFilePath, Buffer.from(output), (err) => {
        if (err) throw err;
        console.log(outputFilePath + ' file created!');
    });
    const res = await compress(outputFilePath);
    console.log('DONE!');
    // gltfPipeline.glbToGltf(__output_dir + filename.split('.').slice(0, -1).join('.') + '.glb', (gltf: any ) => {
    //     gltfPipeline.processGltf(gltf, { separate: true }, (results: any) => {
    //             console.log(results);
    //         }
    //     );
    // });

}
// parser.run('asdss');
console.log('Hello from imc converter! Opening File...');
init('отель.imc');
