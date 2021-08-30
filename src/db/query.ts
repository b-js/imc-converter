import { AccessorsEntity, BufferViewEntity, MaterialEntity, MeshesEntity, NodeEntity } from "./class-to-dataBase";

import { Connection } from "typeorm";

export class Db {
   private readonly tableNode!:any;
   private readonly tableMesh!:any;
   private readonly tableAcc!:any;
   private readonly tableMaterial!:any;
   private readonly tableBufferView!:any;
   
    constructor(con: Connection) {
        this.tableNode = con.getRepository(NodeEntity);
        this.tableAcc = con.getRepository(AccessorsEntity);
        this.tableMaterial = con.getRepository(MaterialEntity);
        this.tableMesh = con.getRepository(MeshesEntity);
        this.tableBufferView = con.getRepository(BufferViewEntity);
    }

    save(n: NodeEntity[], mesh: MeshesEntity[], acc: AccessorsEntity, material: MaterialEntity, buffer: BufferViewEntity) {}
}