import { Document, isMap, isPair, isScalar, parseDocument, stringify } from "yaml";
import { MetadataType, parseItem } from "../yaml/metadata";
import { Form } from "react-bootstrap";

interface YamlEditorProps {
    initialYaml: string;
    onChange: (newYaml: string) => void;
}

interface YamlEditableItemProps {
    item: any;
    onChange: (newValue: any) => void;
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

function YamlEditableItem(props: YamlEditableItemProps) {
    const meta = parseItem(props.item);
    console.log(meta);

    if (!meta || meta.type === MetadataType.None) {
        if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
            return (
                <>
                    <Form.Label><strong>{props.item.key.value as string}</strong></Form.Label>
                    <Form.Control value={props.item.value.value as string} className='mb-3' />
                </>
            )
        }
    }

    if (meta!.type === MetadataType.String) {
        if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
            return (
                <>
                    <Form.Label><strong>{props.item.key.value as string}</strong></Form.Label>
                    <Form.Control value={props.item.value.value as string} className='mb-3' onChange={(e: any) => props.onChange(e.target.value)} />
                </>
            )
        }
    }

    if (meta!.type === MetadataType.Date) {
        const min = meta!.args.has('min') ? meta!.args.get('min') : undefined;
        const max = meta!.args.has('max') ? meta!.args.get('max') : undefined;

        if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
            return (
                <>
                    <Form.Label><strong>{props.item.key.value as string}</strong></Form.Label>
                    <Form.Control type='date' value={props.item.value.value as string} min={min} max={max} onChange={(e: any) => props.onChange(e.target.value)} />
                    <Form.Text>{min ? 'min: ' + min : ''} &nbsp; {max ? 'max: ' + max : ''}</Form.Text>
                </>
            )
        }
    }

    if (meta!.type === MetadataType.Integer) {
        const min = meta!.args.has('min') ? meta!.args.get('min') : undefined;
        const max = meta!.args.has('max') ? meta!.args.get('max') : undefined;
        const display = meta!.args.has('display') ? meta!.args.get('display') : 'box';

        if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
            if (display === 'box') {
                return (
                    <>
                        <Form.Label><strong>{props.item.key.value as string}</strong></Form.Label>
                        <Form.Control type='number' value={props.item.value.value as string} min={min} max={max} onChange={(e: any) => props.onChange(parseInt(e.target.value))} />
                        <Form.Text>{min ? 'min: ' + min : ''} &nbsp; {max ? 'max: ' + max : ''}</Form.Text>
                    </>
                )
            }

            if (display === 'slider') {
                return (
                    <>
                        <Form.Label><strong>{props.item.key.value as string}</strong></Form.Label>
                        <Form.Control type='range' value={props.item.value.value as string} min={min} max={max} onChange={(e: any) => props.onChange(parseInt(e.target.value))} />
                        <Form.Text>{min ? 'min: ' + min : ''} &nbsp; {max ? 'max: ' + max : ''}</Form.Text>
                    </>
                )
            }
        }
    }

    if (meta!.type === MetadataType.Enum) {
        const elems = meta!.args.has('elems') ? meta!.args.get('elems')!.split(',') : [];

        if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
            return (
                <>
                    <Form.Label><strong>{props.item.key.value as string}</strong></Form.Label>
                    <Form.Select onChange={(e: any) => props.onChange(e.target.value)}>
                        {elems.map(e => <option value={e} selected={props.item.value.value === e}>{e}</option>)}
                    </Form.Select>
                </>
            )
        }
    }

    return (<><p>Wow</p></>)
}
