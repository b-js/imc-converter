import { Column, Entity, PrimaryColumn } from "typeorm";

import { v4 } from "uuid";

@Entity('node')
export class NodeEntity {
    @PrimaryColumn('uuid')
    _id:string = v4();
@Column('text')
    nuid!: string;
    @Column('text')
  nid!:string;
  @Column('text')
  id!: string;
  @Column('jsonb', {nullable: true})
  pvs_map!:Record<string, any>;

  @Column('int')
  sort_order!:number;
  constructor(props: {
      _id?:string;
      nuid: string;
      nid:string;
      id:string;
      pvs_map: Record<string, any>;
  }) {
      if(props) {
          this._id = props._id || this._id;
          this.nuid = props.nuid;
          this.nid = props.nid;
          this.id = props.id;
          this.pvs_map = props.pvs_map;
          this.sort_order = Number(this.id);
      }
  }
}
@Entity('mesh')
export class MeshEntity {
    @PrimaryColumn('uuid')
_id = v4();
@Column('text')
    nuid_entity!:string;

        @Column('text')
        c!: string;
        @Column('text', {nullable: true})
        Roll?: string | null;
        constructor(props:{
            nuid_entity: string;
            c:string;
            Roll:string | null
        }) {
            if(props) {
                this.nuid_entity = props.nuid_entity;
              
                this.Roll = props.Roll || undefined;
                this.c = props.c;
            }
        }
}