// This file defines the structure and parsing logic for metadata extracted from YAML comments.
// It includes an interface for metadata, an enum for metadata types, and functions to parse
// YAML items into structured metadata objects.

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

// Parse a string type into a MetadataType enum value
function parseType(type: string): MetadataType {
    switch (type) {
        case 'integer': return MetadataType.Integer;
        case 'string': return MetadataType.String;
        case 'enum': return MetadataType.Enum;
        case 'date': return MetadataType.Date;
        default: return MetadataType.None;
    }
}

// Parse a YAML item into a Metadata object
export function parseItem(item: any): Metadata | undefined {
    let type: MetadataType = MetadataType.None;
    let args: string[] = []; 
    let parsedArgs: Map<string, string> = new Map<string, string>();

    // Check if the item is a pair and process its key's comment to extract metadata type and arguments
    if (isPair(item)) {
        if (isScalar(item.key) && item.key.commentBefore) {
            const lines = item.key.commentBefore.split('\n');
            const lastLine = (lines.length > 0 ? lines[lines.length - 1] : '').trim();
            const match = lastLine.match(/^\$ (\w+)(?:\s+(.*))?/);
            if (match) {
                console.log(match); // Log the match for debugging
                type = parseType(match[1]);
                args = match[2] ? match[2].split(' ') : [];

                args.forEach(a => {
                    const elems = a.split(':');

                    if (elems.length == 1) {
                        parsedArgs.set(elems[0], '');
                    } else if (elems.length == 2) {
                        parsedArgs.set(elems[0], elems[1]);
                    }
                });

                // Return the parsed Metadata object
                return {
                    fieldName: item.key.value as string,
                    type: type,
                    args: parsedArgs
                };
            }
        }
    }

    // Return undefined if parsing fails
    return undefined;
}
