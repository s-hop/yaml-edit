// This file defines the YamlEditor component used in the yaml-edit example demonstration. It parses an initial YAML 
// document and renders editable items based on the parsed content. Edited items are updated and displayed in real-time.

import { Document, isMap, parseDocument, stringify } from "yaml";
import { YamlEditableItem } from "./YamlEditableItem";

interface YamlEditorProps {
    initialYaml: string;
    onChange: (newYaml: string) => void;
}

export function YamlEditor(props: YamlEditorProps) {
    const yamlDoc: Document = parseDocument(props.initialYaml);

    console.log(yamlDoc);

    if (isMap(yamlDoc.contents)) {
        return (
            <>
                {yamlDoc.contents.items.map(i => {
                    return (<>
                        <div className={'mb-2'}>
                            <YamlEditableItem item={i} onChange={(n) => {
                                i.value = n;
                                props.onChange(stringify(yamlDoc));
                            }}/>
                        </div>
                    </>);
                })}
            </>
        )
    }

    return (
        <>
            <p>I can't render an editor for this type of document!</p>
        </>
    )
}