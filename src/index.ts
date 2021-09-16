import Parser from "./lib/Parse";
import * as fs from 'fs';
import GLTFImporter from "./importers/gltf";
import {Bim} from "./models/Imc";
import {compress} from "./lib/Compress";
// @ts-ignore
import {__files_dirname} from '../files/dirname';
const gltfPipeline = require('gltf-pipeline');



const __input_dir = __files_dirname + '/input/';
const __output_dir = __files_dirname + '/output/';
function init(filename: string) {
    fs.readFile(__input_dir + filename, { encoding: 'utf-8'}, (err, data) => {
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
    const pathFileName = __output_dir + filename.split('.').slice(0, -1).join('.') + '.glb';
    const fileAlreadyExist = fs.existsSync(pathFileName)
    console.log('Import done, saving...')
    if (fileAlreadyExist) {
        fs.unlinkSync(pathFileName);
        console.log('Previous file was deleted');
    }
    fs.appendFile(__output_dir + filename.split('.').slice(0, -1).join('.') + '.glb', Buffer.from(output), (err) => {
        if (err) throw err;
        console.log(__output_dir + filename.split('.').slice(0, -1).join('.') + '.glb' + ' file created!');
    })
    const res = await compress(filename.split('.').slice(0, -1).join('.') + '.glb');
    console.log(res);
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
