import * as fs from 'fs';

import {Bim} from "./models/Imc";
import GLTFImporter from "./importers/gltf-from-base";
import Parser from "./lib/Parse";

const __input_dir = './files/input/';
const __output_dir = './files/output/';
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

}
// parser.run('asdss');
console.log('Hello from imc converter! Opening File...');
init('kv_maximum.imc');
