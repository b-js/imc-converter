import { MeshEntity, NodeEntity } from "./class-to-Db";

import { Accessor } from "@gltf-transform/core";
import { createConnection } from "typeorm";

export const connect = async () => { const connect = await  createConnection({

    type: 'postgres',
    url: 'postgresql://userpg1:123@dp-postgres001:5432/kulakov',
    entities: [NodeEntity, MeshEntity],
    synchronize: true,
    logging: ['error'],
  });
  return connect;
}