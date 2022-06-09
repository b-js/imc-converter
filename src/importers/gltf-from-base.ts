// import { Bim, BimContainerElement, ElementMesh } from "../models/Imc";
// import { Document, NodeIO } from "@gltf-transform/core";
// import { MeshEntity, NodeEntity } from "../db-2/class-to-Db";
//
// import { Db } from "../db-2/query";
// import { DracoMeshCompression } from '@gltf-transform/extensions';
// import { connect } from "../db-2/connect";
// import draco3d from 'draco3dgltf';
//
// // @ts-ignore
//
//
//
//
//
//
//
//
//
//
//
// export default class GltfFromDb {
// private data!: {
//     _id:string,
//     nuid: string;
//     nid: string;
//     id: string;
//     pvs_map: Record<string, any>;
//  m: MeshEntity[],
//  ms?:{m: ElementMesh[]};
// }[];
//
// private bimData!: BimContainerElement[];
// constructor(bimData?: any) {
//
// }
// private createMeshes() {
//     this.data.map(item => {
//         item.ms = {
//             m: item.m.map(m => new ElementMesh({ ...m, ts: [], vs: [] } as unknown as ElementMesh))
//         }
//     })
// }
//     private rollDownMeshes() {
//         this.bimData.forEach(d => {if(d.ms?.m) {
//            d.ms.m.forEach(m => m.RollDown())
//         }})
//     }
//
//     private toColor(num: number) {
//         num >>>= 0;
//         const b = num & 0xFF,
//             g = (num & 0xFF00) >>> 8,
//             r = (num & 0xFF0000) >>> 16,
//             alpha = ( (num & 0xFF000000) >>> 24 ) / 255 ;
//         return { hex: ((1 << 24) + (r << 16) + (g << 8) + b), alpha };
//         // return [r, g, b, a] as vec4;
//     }
//
//     private createElementsBim () {
//         // this.bimData = this.data.map(item => new BimContainerElement({id: item.id,ms:{m: item.m as unknown as ElementMesh[]}, nid: item.nid, nuid: item.nuid,pvs_map: item.pvs_map} as BimContainerElement))
//     }
//
//      async execute () {
// const con = await connect();
// const db = new Db(con);
// const data = await db.getAll();
// this.data = data;
// // this.createMeshes();
// this.createElementsBim();
// this.rollDownMeshes();
//
// const doc = new Document();
// const buffer = doc.createBuffer();
//      const scene = doc.createScene();
//
//
// const elements =this.bimData;
// console.log(elements);
// for (let j = 0; j < elements.length; j++) {
//     const element = elements[j];
//     if (!element.ms?.m) break;
//     for (let i = 0; i < element.ms.m.length; i++) {
//         const sMesh = element.ms.m[i];
//         const node = doc.createNode();
//         // node.setExtras({...element.pvs_map, ...{
//         //         'element_id': element.id
//         // }
//         // });
//
//         const mesh = doc.createMesh();
//         const color = this.toColor(Number.parseInt(sMesh.c));
//         const material = doc.createMaterial('material')
//             .setBaseColorHex(color.hex)
//             .setAlpha(color.alpha)
//             .setAlphaMode("BLEND")
//         const position = doc.createAccessor()
//             .setType('VEC3')
//             .setArray(new Float32Array(
//                 sMesh.vs.flatMap((vs) => [ vs.x, vs.y, vs.z ])
//             ))
//             .setBuffer(buffer);
//
//         const indices = doc.createAccessor()
//             .setType('SCALAR')
//             .setArray(new Uint16Array(
//                 sMesh.ts.flatMap((ts) => [ ts.a, ts.b, ts.c ])
//             ))
//             .setBuffer(buffer);
//
//         const prim = doc.createPrimitive()
//             .setAttribute('POSITION', position)
//             .setMaterial(material)
//             .setIndices(indices);
//
//         mesh.addPrimitive(prim);
//         node.setMesh(mesh);
//         scene.addChild(node);
//     }
//
// }
//
//
//
// const io = new NodeIO()
//     .registerExtensions([DracoMeshCompression])
//     .registerDependencies({
//         'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
//         'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
//     });
// doc.createExtension(DracoMeshCompression)
// //const json = io.writeJSON(doc).json;
// //console.log(json.accessors?.length, json.bufferViews?.length);
// // writeJsonSync('./test.json', io.writeJSON(doc).json, {spaces: 1})
//
// return io.writeBinary(doc);
//     }
// }
