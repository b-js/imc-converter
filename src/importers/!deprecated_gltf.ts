import {Bim} from "../models/Imc";
import * as GLTFUtils from 'gltf-js-utils';

export default class GLTFImporter {
    bimData!: Bim;
    constructor(bimData: Bim) {
        this.bimData = bimData;
    }
    get meshes() {
        return this.bimData.Container.es.e
            .filter((e) => e)
            .flatMap((e) => e.ms.m)
    }
    rollDownMeshes() {
        this.bimData.Container.es.e.forEach((e) => {
            if (e.ms.m) {
                e.ms.m.forEach((m) => {
                    m.RollDown();
                })
            }
        })
    }
    async execute() {
        if (!this.bimData) throw Error('Bim data is undefined');
        const asset = new GLTFUtils.GLTFAsset();
        const scene = new GLTFUtils.Scene();
        asset.addScene(scene);

        this.rollDownMeshes();
        const meshes = [];
        for (let i = 0; i < this.meshes.length; i++) {
            const node = new GLTFUtils.Node();
            scene.addNode(node);
            const sMesh = this.meshes[i];
            const vertices = [];
            for (let i = 0; i < sMesh.vs.length; i++) {
                const sVert = sMesh.vs[i];
                let vertex = new GLTFUtils.Vertex();
                vertex.x = sVert.x;
                vertex.y = sVert.y;
                vertex.z = sVert.z;
                vertices.push(vertex);
            }
            const mesh = new GLTFUtils.Mesh();
            mesh.material = [new GLTFUtils.Material()];
            for (let i = 0; i < sMesh.ts.length; i++) {
                const sTrinity = sMesh.ts[i];
                const v1 = vertices[sTrinity.a];
                const v2 = vertices[sTrinity.b];
                const v3 = vertices[sTrinity.c];
                mesh.addFace(v1, v2, v3, {r: 1, g: 1, b: 1}, 0);
            }
            node.mesh = mesh;
            // const vertices = [];
            // for (let i = 0; i < sMesh.ts.length; i++) {
            //     const sTrinity = sMesh.ts[i];
            //
            //     // const sVert = sMesh.vs[i];
            //     // const sTrinity
            //     let vertex = new GLTFUtils.Vertex();
            //     vertex.x = sMesh.ts[sTrinity.a].a;
            //     // vertex.y = sVert.y;
            //     // vertex.z = sVert.z;
            //     // vertices.push(vertex);
            // }
            // const vertices = [];
            // for (let i = 0; i < sMesh.vs.length; i++) {
            //     const sVert = sMesh.vs[i];
            //     let vertex = new GLTFUtils.Vertex();
            //     vertex.x = sVert.x;
            //     vertex.y = sVert.y;
            //     vertex.z = sVert.z;
            // }
        }
        const object = await GLTFUtils.exportGLTF(asset, {
            bufferOutputType: GLTFUtils.BufferOutputType.GLB.valueOf(),
            imageOutputType: GLTFUtils.BufferOutputType.GLB.valueOf(),
        });
        return object;
        // console.log();
        // const vertices = [];
        // for (let i = 0; i < this.meshes.length; i += 3) {
        //     const sMesh = this.meshes[i]
        //     let vertex = new GLTFUtils.Vertex();
        //         vertex.x = vertices[i];
        //         vertex.y = vertices[i + 1];
        //         vertex.z = vertices[i + 2];
        //         vertices.push(vertex);
        // }
        // for (let i = 0; i < vertices.length; i += 3) {
        //     const vertex = new GLTFUtils.Vertex();
        //     vertex.x = vertices[i];
        //     vertex.y = vertices[i + 1];
        //     vertex.z = vertices[i + 2];
        //     vertices.push(vertex);
        // }
        //
        // const mesh = new GLTFUtils.Mesh();
        // mesh.material = [new GLTFUtils.Material()];
        // for (let i = 0; i < triangles.length; i += 3) {
        //     const v1 = vertices[triangles[i]];
        //     const v2 = vertices[triangles[i + 1]];
        //     const v3 = vertices[triangles[i + 2]];
        //     mesh.addFace(v1, v2, v3, {r: 1, g: 1, b: 1}, 0);
        // }
        // node.mesh = mesh;
        //
    }
}
