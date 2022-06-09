import {Document, NodeIO} from '@gltf-transform/core';


import { Bim } from "../models/Imc";

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
        this.rollDownMeshes();

        const doc = new Document();
        const buffer = doc.createBuffer();
             const scene = doc.createScene();
             const test = true;
        const elements = this.bimData.Container.es.e;
        b1.start(elements.length, 0);
        for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            if (!element.ms.m) {
                b1.increment();
                continue;
            }
            if (test) {
                if (!element.ms.m.length) {
                    b1.increment();
                    continue;
                }
                let mesh = doc.createMesh(element.id);
                let node = doc.createNode(element.id);
                node.setExtras({
                    element_id: element.id,
                });
                mesh.setExtras({ element_id: element.id });
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
                            // .setNormalized(true)
                            .setType('VEC4')
                            // .setArray(new Float32Array(positionArr.length))
                            .setBuffer(buffer);
                        const rgba = this.toRGBAColor(Number.parseInt(sPrim.c));
                        for (let i = 0; i < position.getCount(); i++) {
                            // console.log(i, rgba);
                            // colorAccessor.setElement(i, rgba);
                            // console.log(rgba[3] / 255);
                            colors.push(rgba[0], rgba[1], rgba[2], rgba[3] / 255);
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
                    mesh.addPrimitive(primitive);
                }
                node.setMesh(mesh);
                scene.addChild(node);
            } else {
                for (let i = 0; i < element.ms.m.length; i++) {
                    const sMesh = element.ms.m[i];
                    const node = doc.createNode(element.id);
                    const rgba = this.toRGBAColor(Number.parseInt(sMesh.c));
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
                        for (let i = 0; i < position.getCount(); i++) {
                            colors.push(rgba[0], rgba[1], rgba[2], rgba[3]);
                        }
                        colorAccessor.setArray(new Float32Array(colors));
                        primitive.setAttribute('COLOR', colorAccessor);
                    }
                    mesh.setExtras({
                    });
                    mesh.addPrimitive(primitive);
                    node.setMesh(mesh);
                    scene.addChild(node);
                }
            }
            b1.increment();
        }
        b1.stop();
        const io = new NodeIO();
        return io.writeBinary(doc);
    }
}


