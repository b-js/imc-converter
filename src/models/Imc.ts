class Vertex {
    x!: number;
    y!: number;
    z!: number;
    constructor(data: Vertex) {
        Object.assign(this, data);
    }
}class Trinity {
    a!: number;
    b!: number;
    c!: number;
    constructor(data: Trinity) {
        Object.assign(this, data);
    }
}
class ElementParameterValue {
    '#text'!: string;
    c!: string;
    fc?: string;
    constructor(data: ElementParameterValue) {
        Object.assign(this, data);
    }
}
type TElementParameterValueStructure = Record<string, ElementParameterValue>
class ElementParameterValueStructure {
    pv!: ElementParameterValue[];
    constructor(data: ElementParameterValueStructure) {
        this.pv = data.pv.map((pv) => new ElementParameterValue(pv))
    }
}
export class ElementMesh {
    private _rollSeparators = ['#',';'];
    c!: string; // MaterialColor
    vs!: Vertex[]; // Vertexes
    ts!: Trinity[]; // Trinities
    Roll!: string | null;
    constructor(data: ElementMesh) {
        // console.log(data.c);
        Object.assign(this, data);
    }
    // Roll -> Vertex+Trinity Geometry
    public RollDown() {
        // this.vs = [];
        if (!this.Roll) throw new Error('Roll is null');
        if (this.Roll?.length > 0)
        {
            let partPos = this.Roll.indexOf(this._rollSeparators[0]);
            if (partPos > -1)
            {
                this.vs = [];
                this.ts = [];
                    // string[] sVertexes = this.Roll.Substring(0, partPos).Split(new char[] { _rollSaparators[1] });
                    const sVertexes: string[] = this.Roll.substr(0, partPos).split(this._rollSeparators[1]);
                    for (let vIndex = 0; vIndex < sVertexes.length - 1; vIndex += 3) {
                        this.vs.push(new Vertex({
                            x: Number(sVertexes[vIndex].replace(',', '.')),
                            y: Number(sVertexes[vIndex + 1].replace(',', '.')),
                            z: Number(sVertexes[vIndex + 2].replace(',', '.')),
                        }))
                    }
                ++partPos;
                {
                    const asdsads: string = this.Roll.substr(partPos, this.Roll.length - (partPos));
                    const sTrinities = asdsads.split(this._rollSeparators[1]);
                    // sTrinities[0].Remove(0); ???
                    for (let tIndex = 0; tIndex < sTrinities.length - 1; tIndex += 3)
                    {
                        this.ts.push(
                            new Trinity({
                                a: Number(sTrinities[tIndex].replace(',', '.')),
                                b: Number(sTrinities[tIndex + 1].replace(',', '.')),
                                c: Number(sTrinities[tIndex + 2].replace(',', '.')),
                            })
                        );
                    }
                }
                this.Roll = null;
            }
        }
    }
}
export class BimContainerElement {
    nuid!: string; //NativeUniqueId
    nid!: string; //NativeId
    id!: string;
    pvs!: ElementParameterValueStructure;
    pvs_map!: TElementParameterValueStructure;
    ms: { m: ElementMesh[] } = { m: [] };
    constructor(data: BimContainerElement) {
        this.nuid = data.nuid;
        this.nid = data.nid;
        this.id = data.id;
  
        // this.pvs_map = data.pvs.pv.reduce((acc: TElementParameterValueStructure, curr) => {
        //     acc[curr["#text"]] = curr;
        //     return acc;
        // }, {})
        this.pvs_map = data.pvs_map;
        if (data.ms && data.ms.m?.length) {             //@ts-ignore
            this.ms.m = data.ms.m.map((ms) => new ElementMesh({...ms, ts: [], vs: []}));
    
        if (data.ms && data.ms.m?.length) {
            this.ms.m = data.ms.m.map((ms) => new ElementMesh(ms));
        }
    }
}
    get nativeUniqueId() {
        return this.nuid;
    }
    get nativeId() {
        return this.nid;
    }
}
class BimAttributes {
    TimeWrite!: string;
    HostName!: string;
    HostDomain!: string;
    HostUserName!: string;
    HostSystem!: string;
    Application!: string;
    Library!: string;
    Support!: string;
    constructor(data: BimAttributes) {
        Object.assign(this, data);
    }
}
class ParameterDefinition {
    t!: string; // Title parameter
    d!: string; // Description parameter
    c!: string; // Code (Unique text code)
    o!: string; // Data Issuer
    dtnn!: string; // Native DataTypeName
    dstnn!: string; // Native DataStorageTypeName
    uom!: string; // Unit Of Measure
    ut!: string; // Unit Type
    iro!: string; // Flag ReadOnly
    is!: string; // Flag Shared
    ium!: string; // Flag UserModifiable
    in!: string; // Flag Numeric
    rct!: string; // Report Column Type
    l!: string; // Parameter Parent (Export, Adapter)
    constructor(data: ParameterDefinition) {
        Object.assign(this, data);
    }
}
class BimContainer {
    UniqueId!: string;
    pds!: {
        pd: ParameterDefinition[],
    }
    es!: {
        e: BimContainerElement[];
    }
    constructor(data: BimContainer) {
        Object.assign(this, data);
        this.es.e = data.es.e.map((e) => new BimContainerElement(e))
        this.pds.pd = data.pds.pd.map((pd) => new ParameterDefinition(pd))
    }
}
export class Bim {
    Attributes!: BimAttributes
    Container!: BimContainer;
    constructor(data: Bim) {
        this.Container = new BimContainer(data.Container)
        this.Attributes = new BimAttributes(data.Attributes)
    }
}
export interface IImc {
    'CC.Bim.ImcPackage': Bim,
}
