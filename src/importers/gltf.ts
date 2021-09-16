import { Bim } from "../models/Imc";
import * as draco3d from 'draco3dgltf';
import { Document, Extension, NodeIO, Transform } from '@gltf-transform/core';
import {MeshoptCompression, MeshQuantization} from '@gltf-transform/extensions';
import { quantize, reorder } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { DracoMeshCompression } from '@gltf-transform/extensions';
import { writeJson } from 'fs-extra';

import cliProgress from 'cli-progress';
import {meshopt} from "@gltf-transform/functions/dist/meshopt";
import {compress} from "../lib/Compress";
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
    private toRGBAColor(num: number) {
        num >>>= 0;
        const b = num & 0xff,
            g = (num & 0xff00) >>> 8,
            r = (num & 0xff0000) >>> 16,
            alpha = ((num & 0xff000000) >>> 24) / 255;
        return [r / 255, g / 255, b / 255, alpha];
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
        // writeJson('test.json', this.bimData.Container.es.e, { spaces: 1 });
        this.rollDownMeshes();

        const doc = new Document();
        const buffer = doc.createBuffer();
             const scene = doc.createScene();
             const test = true;
        const elements = this.bimData.Container.es.e.filter((e) => e.ms.m && e.ms.m.length !== 0);
        b1.start(elements.length, 0);
        for (let j = 0; j < elements.length; j++) {
            // console.log(j + ' / ' + elements.length);
            const element = elements[j];
            // if (!element.ms.m) continue;
            if (test) {
                // if (!element.ms.m.length) continue;
                let mesh = doc.createMesh(element.id);
                // mesh.setName(element.id);
                let node = doc.createNode(element.id);
                node.setExtras({
                    // ...element.pvs_map,
                    element_id: element.id,
                });
                // mesh.setExtras({ element_id: element.id });
                for (let i = 0; i < element.ms.m.length; i++) {
                    let sPrim = element.ms.m[i];
                    const position = doc
                        .createAccessor()
                        .setType('VEC3')
                        .setArray(
                            new Float32Array(sPrim.vs.flatMap((vs) => [vs.x, vs.y, vs.z])),
                        )
                        .setBuffer(buffer);
                    const indices = doc
                        .createAccessor()
                        .setType('SCALAR')
                        .setArray(
                            new Uint16Array(sPrim.ts.flatMap((ts) => [ts.a, ts.b, ts.c])),
                        )
                        .setBuffer(buffer);
                    const primitive = doc
                        .createPrimitive()
                        .setAttribute('POSITION', position)
                        .setIndices(indices);
                    const positionArr = position.getArray();
                    if (positionArr) {
                        const colors = [];
                        const colorAccessor = doc
                            .createAccessor()
                            .setType('VEC4')
                            .setBuffer(buffer);
                        const rgba = this.toRGBAColor(Number.parseInt(sPrim.c));
                        for (let i = 0; i < position.getCount(); i++) {
                            colors.push(rgba[0], rgba[1], rgba[2], rgba[3]);
                        }
                        colorAccessor.setArray(new Float32Array(colors));
                        primitive.setAttribute('COLOR', colorAccessor);
                        // const colorsSelected = [];
                        // const colorAccessorSelected = doc
                        //     .createAccessor()
                        //     .setType('VEC4')
                        //     .setBuffer(buffer);
                        // for (let i = 0; i < position.getCount(); i++) {
                        //     colorsSelected.push(rgba[0], rgba[1], rgba[2], rgba[3]);
                        // }
                        // colorAccessorSelected.setArray(new Float32Array(colorsSelected));
                        // primitive.setAttribute('COLOR_SELECTED', colorAccessorSelected);
                        // const element_ids = [];
                        // const elementIdsAccessor = doc
                        //     .createAccessor()
                        //     .setType('SCALAR')
                        //     .setBuffer(buffer);
                        // for (let i = 0; i < position.getCount(); i++) {
                        //     element_ids.push(Number(element.id));
                        // }
                        // elementIdsAccessor.setArray(new Float32Array(element_ids));
                        // primitive.setAttribute('ELEMENT_ID', elementIdsAccessor);
                    }
                    // primitive.setMaterial(material);
                    mesh.addPrimitive(primitive);
                }
                node.setMesh(mesh);
                scene.addChild(node);
            } else {
                for (let i = 0; i < element.ms.m.length; i++) {
                    const sMesh = element.ms.m[i];
                    const node = doc.createNode(element.id);
                    node.setExtras({
                        'element_id': element.id
                    });
                    const mesh = doc.createMesh();
                    // const color = GLTFImporter.toColor(Number.parseInt(sMesh.c));
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

                    const primitive = doc
                        .createPrimitive()
                        .setAttribute('POSITION', position)
                        .setIndices(indices);
                    const positionArr = position.getArray();
                    if (positionArr) {
                        const colors = [];
                        const colorAccessor = doc
                            .createAccessor()
                            .setType('VEC4')
                            .setBuffer(buffer);
                        const rgba = this.toRGBAColor(Number.parseInt(sMesh.c));
                        for (let i = 0; i < position.getCount(); i++) {
                            colors.push(rgba[0], rgba[1], rgba[2], rgba[3]);
                        }
                        colorAccessor.setArray(new Float32Array(colors));
                        primitive.setAttribute('COLOR', colorAccessor);
                        const colorsSelected = [];
                        const colorAccessorSelected = doc
                            .createAccessor()
                            .setType('VEC4')
                            .setBuffer(buffer);
                        for (let i = 0; i < position.getCount(); i++) {
                            colorsSelected.push(rgba[0], rgba[1], rgba[2], rgba[3]);
                        }
                        colorAccessorSelected.setArray(new Float32Array(colorsSelected));
                        primitive.setAttribute('COLOR_SELECTED', colorAccessorSelected);
                        const element_ids = [];
                        const elementIdsAccessor = doc
                            .createAccessor()
                            .setType('SCALAR')
                            .setBuffer(buffer);
                        for (let i = 0; i < position.getCount(); i++) {
                            element_ids.push(Number(element.id));
                        }
                        elementIdsAccessor.setArray(new Float32Array(element_ids));
                        primitive.setAttribute('ELEMENT_ID', elementIdsAccessor);
                    }

                    mesh.addPrimitive(primitive);
                    node.setMesh(mesh);
                    scene.addChild(node);
                }
            }
            b1.increment();
        }
        b1.stop();
        console.log('here');
        // await MeshoptEncoder.ready;
        // doc.getRoot().listMeshes().forEach((mesh) => {
        //     MeshoptEncoder.
        // })
        // doc.createExtension(MeshQuantization).setRequired(true);
        const io = new NodeIO();
        //     .registerExtensions([/*DracoMeshCompression,*/ MeshoptCompression])
        //     .registerDependencies({
        //         // 'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
        //         // 'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
        //         'meshopt.decoder': MeshoptDecoder,
        //         'meshopt.encoder': MeshoptEncoder,
        //     });
        // await doc.transform(
        //     reorder({ encoder: MeshoptEncoder }),
        // );
        // doc.createExtension(MeshoptCompression)
        //     .setRequired(true)
        //     .setEncoderOptions({ method: MeshoptCompression.EncoderMethod.FILTER });
        // io.write('compressed-high.glb', doc);
        // await doc.transform(reorder({encoder: MeshoptEncoder}), quantize({
        //     pattern: /^(POSITION)(_\d+)?$/,
        // }));
        // await doc.transform(reorder({encoder: MeshoptEncoder}), );
        // doc.createExtension(MeshoptCompression)
        //     .setRequired(true)
        //     .setEncoderOptions({
        //         method: MeshoptCompression.EncoderMethod.QUANTIZE
        //     });
        // doc.createExtension(DracoMeshCompression);
        // writeJson('test.json', io.writeJSON(doc), { spaces: 1 });
        return io.writeBinary(doc);
    }
}
