import { Bim } from "../models/Imc";
import {Document, vec4, NodeIO} from '@gltf-transform/core';
import { DracoMeshCompression } from '@gltf-transform/extensions';

// @ts-ignore
import draco3d from 'draco3dgltf';
import cliProgress from 'cli-progress';
const b1 = new cliProgress.SingleBar({
    format: 'Converting meshes | {bar} | {percentage}% || {value}/{total} Chunks ||',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});


export default class GLTFImporter {
    bimData!: Bim;
    constructor(bimData: Bim) {
        this.bimData = bimData;
    }
    // get meshes() {
    //     return this.bimData.Container.es.e
    //         .filter((e) => e)
    //         .flatMap((e) => e.ms.m)
    // }
    private rollDownMeshes() {
        this.bimData.Container.es.e.forEach((e) => {
            if (e.ms.m) {
                e.ms.m.forEach((m) => {
                    m.RollDown();
                })
            }
        })
    }
    static toColor(num: number) {
        num >>>= 0;
        const b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            alpha = ( (num & 0xFF000000) >>> 24 ) / 255 ;
        return { hex: ((1 << 24) + (r << 16) + (g << 8) + b), alpha };
        // return [r, g, b, a] as vec4;
    }
    async execute() {
        if (!this.bimData) throw Error('Bim data is undefined');
        this.rollDownMeshes();

        const doc = new Document();
        const buffer = doc.createBuffer();
             const scene = doc.createScene();

        b1.start(this.bimData.Container.es.e.length, 0);
        const elements = this.bimData.Container.es.e;
        for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            if (!element.ms.m) break;
            for (let i = 0; i < element.ms.m.length; i++) {
                const sMesh = element.ms.m[i];
                const node = doc.createNode();
                node.setExtras({
                        'element_id': element.id
                });
                const mesh = doc.createMesh();
                const color = GLTFImporter.toColor(Number.parseInt(sMesh.c));
                const material = doc.createMaterial('material')
                    .setBaseColorHex(color.hex)
                    .setAlpha(color.alpha)
                    .setAlphaMode("BLEND")
                const position = doc.createAccessor()
                    .setType('VEC3')
                    .setArray(new Float32Array(
                        sMesh.vs.flatMap((vs) => [ vs.x, vs.y, vs.z ])
                    ))
                    .setBuffer(buffer);

                const indices = doc.createAccessor()
                    .setType('SCALAR')
                    .setArray(new Uint16Array(
                        sMesh.ts.flatMap((ts) => [ ts.a, ts.b, ts.c ])
                    ))
                    .setBuffer(buffer);

                const prim = doc.createPrimitive()
                    .setAttribute('POSITION', position)
                    .setMaterial(material)
                    .setIndices(indices);

                mesh.addPrimitive(prim);
                node.setMesh(mesh);
                scene.addChild(node);
            }
            b1.increment();
        }
        b1.stop();
        const io = new NodeIO()
            .registerExtensions([DracoMeshCompression])
            .registerDependencies({
                'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
                'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
            });
        doc.createExtension(DracoMeshCompression)
        return io.writeBinary(doc);
    }
}
