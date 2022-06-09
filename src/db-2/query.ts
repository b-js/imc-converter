// // import { Connection, Repository } from "typeorm";
// import { MeshEntity, NodeEntity } from "./class-to-Db";
//
// export class Db {
//    private readonly tableNode!:Repository<NodeEntity>;
//    private readonly tableMesh!:Repository<MeshEntity>;
//
//
//     constructor(con: Connection) {
//         this.tableNode = con.getRepository(NodeEntity);
//
//         this.tableMesh = con.getRepository(MeshEntity);
//
//     }
//
//    async save(n: NodeEntity[], mesh: MeshEntity[]): Promise<void> {
// await Promise.all([this.tableNode.save(n), this.tableMesh.save(mesh)])
//     }
//
//     getAll(): Promise<{
//         _id:string,
//         nuid: string;
//         nid: string;
//         id: string;
//         pvs_map: Record<string, any>;
//      m: MeshEntity[],
//     }[]> {
//         return this.tableMesh.query(`SELECT _id, nuid, nid, id, pvs_map,
//         (SELECT ARRAY(SELECT jsonb_build_object('c', me.c, 'Roll', 'me.Roll') from mesh me where me.nuid_entity = n.nuid)) m
//             FROM node n
//             order by n.sort_order ASC
//             `)
//     };
//
// }
