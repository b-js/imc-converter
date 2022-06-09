// import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
//
// import {v4} from 'uuid'
//
// @Entity({name: 'nodes'})
// export class NodeEntity {
//     @PrimaryColumn('uuid')
//     _id = v4();
//     @Column('jsonb')
//     extras!: Record<string, any>;
// @Column('int')
//     mesh!: number;
//
//     @Column('text')
//     element_id!: number;
//
//     constructor(props:{
//         _id?: string;
//         extras: any;
//         mesh: number;
//
//     }) {
//         if(props) {
//             this._id = props._id || this._id;
//             this.mesh = props.mesh;
//             this.extras = props.extras;
//             this.mesh = this.extras.element_id
//         }
//     }
// }
//
// interface primitives {
//         attributes: {
//          POSITION: number
//         },
//         mode: number,
//         material: number, //ссылка на таблицу material
//         indices: number, // ссылка на таблицу accessors
//         extensions: {
//          KHR_draco_mesh_compression: {
//           bufferView: number, //ссылка на таблицу bufferView
//           attributes: {
//            POSITION: number
//           }
//          }
//         }
// }
// @Entity({name: 'meshes'})
// export class MeshesEntity {
//     @PrimaryColumn('int')
// index!:number;
//     @Column('jsonb')
//     primitives!:primitives[];
//
//
// @Column('int')
//     material!:number; //ссылка на таблицу material
// @Column('int')
//     indices!:number; // ссылка на таблицу accessors
//     @Column('float')
//     bufferView!: number;  //ссылка на таблицу bufferView
//
//     constructor(props:{
//         index: number;
//         primitives: primitives[];
//     }) {
//         if(props) {
//             this.index = props.index;
//             this.primitives = props.primitives;
//
//             this.indices = this.primitives[0].indices;
//             this.material = this.primitives[0].material;
//             this.bufferView = this.indices/2;
//         }
//     }
// }
// interface pbr {
//     baseColorFactor: number[]
// }
// @Entity({name: 'material'})
// export class MaterialEntity {
//     @PrimaryColumn('int')
//         index!:number;
//         @Column('text')
//         name!: string
//         @Column('text')
//         alphaMode!: string
//         @Column('jsonb')
//         pbrMetallicRoughness!: pbr
//
//         constructor(props:{index: number;
//         name: string;
//          alphaMode:string;
//         pbr: pbr}) {
//     if(props) {
//         this.index = props.index;
//         this.name = props.name;
//         this.alphaMode = props.alphaMode;
//         this.pbrMetallicRoughness = props.pbr;
//     }
// }
//
// }
//
// @Entity({name: 'accessors'})
// export class AccessorsEntity {
//     @PrimaryColumn('int')
//     index!:number;
//     @Column('text')
// type!: string;
// @Column('int')
//     "componentType"!: number;
//     @Column('int')
//     "count"!: number;
//     @Column('int', {array: true})
//     "max"!: number[];
//      @Column('int', {array: true})
//     "min"!: number[]
//     @Column('boolean')
//     "normalized"!: boolean
//
//     constructor(props:{
//         index:number;
//         type: string;
//         componentType:number;
//         count: number;
//         max: number[];
//         min:number[];
//         normalized: boolean;
//     }) {
//         if(props) {
//             this.index = props.index;
//             this.type = props.type;
//             this.componentType = props.componentType;
//             this.count = props.count;
//             this.max = props.max;
//             this.min = props.min;
//             this.normalized = props.normalized;
//         }
//     }
// }
//
//
// @Entity({name: 'bufferView'})
// export class BufferViewEntity {
//     @PrimaryColumn('int')
//     index!:number;
//     @Column('int')
//         buffer!:number;
//         @Column('int')
//         "byteOffset": number;
//         @Column('int')
//         "byteLength": number;
// constructor(props:{
//     index: number;
//     buffer: number;
//     byteOffset:number;
//     byteLength: number;
// }) {
//     if (props) {
//         this.index = props.index;
//         this.buffer = props.buffer;
//         this.byteOffset = props.byteOffset;
//         this.byteLength = props.byteLength;
//     }
// }
//
// }
