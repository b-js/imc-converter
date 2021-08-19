import {Bim, IImc} from "../models/Imc";

const parser = require('fast-xml-parser');
const he = require('he');

export default class Parser {
    data = null;
    options = {
        attributeNamePrefix : '',
        // attrNodeName: "attr", //default is 'false'
        // textNodeName : "#text",
        ignoreAttributes : false,
        // ignoreNameSpace : false,
        // allowBooleanAttributes : false,
        // parseNodeValue : true,
        // parseAttributeValue : false,
        // trimValues: true,
        // cdataTagName: "__cdata", //default is 'false'
        // cdataPositionChar: "\\c",
        // parseTrueNumberOnly: false,
        // arrayMode: false, //"strict"
        // attrValueProcessor: (val: string, attrName: string) => val.toLowerCase(),//default is a=>a
        // tagValueProcessor : (val: string, tagName: string) => val.toLowerCase(), //default is a=>a
        // stopNodes: ["parse-me-as-string"]
    };

    run(xmlData: string) {
        if (!this.validate(xmlData)) throw Error('XML file structure is not valid');
        console.log('XML file structure is valid')
        const parsedData = parser.parse(xmlData, this.options) as IImc;
        return new Bim(parsedData["CC.Bim.ImcPackage"]);
    }
    private validate(xmlData: string) {
        return parser.validate(xmlData);
    }
}
