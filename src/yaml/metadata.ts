import { isPair, isScalar } from "yaml"

export interface Metadata {
    fieldName: string,
    type: MetadataType,
    args: Map<string, string>;
};

export enum MetadataType {
    None = 0,
    String,
    Integer,
    Enum,
    Date
};

function parseType(type: string): MetadataType {
    switch (type) {
        case 'integer': return MetadataType.Integer;
        case 'string': return MetadataType.String;
        case 'enum': return MetadataType.Enum;
        case 'date': return MetadataType.Date;
        default: return MetadataType.None;
    }
}

export function parseItem(item: any): Metadata | undefined {
    let type: MetadataType = MetadataType.None;
    let args: string[] = [];
    let parsedArgs: Map<string, string> = new Map<string, string>();

    if (isPair(item)) {
        if (isScalar(item.key) && item.key.commentBefore) {
            const lines = item.key.commentBefore.split('\n');
            const lastLine = (lines.length > 0 ? lines[lines.length - 1] : '').trim();
            const match = lastLine.match(/^\$ (\w+)(?:\s+(.*))?/);
            if (match) {
                console.log(match);
                type = parseType(match[1]);
                args = match[2] ? match[2].split(' ') : [];

                args.forEach(a => {
                    const elems = a.split(':');

                    if (elems.length == 1) {
                        parsedArgs.set(elems[0], '');
                    } else if (elems.length == 2) {
                        parsedArgs.set(elems[0], elems[1]);
                    }
                })
            }
        }

       return {
            fieldName: isScalar(item.key) ? item.key.value as string : '',
            type,
            args: parsedArgs
        };
    }
}
