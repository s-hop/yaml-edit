// This file defines the YamlEditableItem component which handles the rendering and editing of individual YAML items,
// supporting different metadata types such as string, date, integer, and enum.

import { isPair, isScalar } from "yaml";
import { Form } from "react-bootstrap";
import { MetadataType, parseItem } from "../yaml/metadata";

interface YamlEditableItemProps {
    item: any;
    onChange: (newValue: any) => void;
}

export function YamlEditableItem(props: YamlEditableItemProps) {
    const meta = parseItem(props.item);
    console.log(meta);

    // Handle case where metadata is not available or type is None
    if (!meta || meta.type === MetadataType.None) {
        if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
            return (
                <>
                    <Form.Label><strong>{meta?.fieldName}</strong></Form.Label>
                    <Form.Control value={props.item.value.value as string} className='mb-3' />
                </>
            )
        }
    }

    // Check if the item is a pair and both key and value are scalars
    if (isPair(props.item) && isScalar(props.item.key) && isScalar(props.item.value)) {
        switch (meta!.type) {
            case MetadataType.String:
                // Handle string type metadata
                return (
                    <>
                        <Form.Label><strong>{meta?.fieldName}</strong></Form.Label>
                        <Form.Control value={props.item.value.value as string} className='mb-3' onChange={(e: any) => props.onChange(e.target.value)} />
                    </>
                );

            case MetadataType.Date:
                // Handle date type metadata with optional min and max constraints
                const minDate = meta!.args.has('min') ? meta!.args.get('min') : undefined;
                const maxDate = meta!.args.has('max') ? meta!.args.get('max') : undefined;
                return (
                    <>
                        <Form.Label><strong>{meta?.fieldName}</strong></Form.Label>
                        <Form.Control type='date' value={props.item.value.value as string} min={minDate} max={maxDate} onChange={(e: any) => props.onChange(e.target.value)} />
                        <Form.Text>{minDate ? 'min: ' + minDate : ''} &nbsp; {maxDate ? 'max: ' + maxDate : ''}</Form.Text>
                    </>
                );

            case MetadataType.Integer:
                // Handle integer type metadata with optional min, max, and display constraints
                const minInt = meta!.args.has('min') ? meta!.args.get('min') : undefined;
                const maxInt = meta!.args.has('max') ? meta!.args.get('max') : undefined;
                const display = meta!.args.has('display') ? meta!.args.get('display') : 'box';
                const unitInt = meta!.args.has('unit') ? meta!.args.get('unit') : undefined;

                switch (display) {
                    case 'box':
                        // Display integer input as a number box
                        return (
                            <>
                                <Form.Label><strong>{meta?.fieldName}</strong> {unitInt ? '(' + unitInt + ')' : ''}</Form.Label>
                                <Form.Control type='number' value={props.item.value.value as string} min={minInt} max={maxInt} onChange={(e: any) => props.onChange(parseInt(e.target.value))} />
                                <Form.Text>{minInt ? 'min: ' + minInt : ''} &nbsp; {maxInt ? 'max: ' + maxInt : ''}</Form.Text>
                            </>
                        );

                    case 'slider':
                        // Display integer input as a slider
                        return (
                            <>
                                <Form.Label><strong>{meta?.fieldName}</strong> {unitInt ? '(' + unitInt + ')' : ''}</Form.Label>
                                <Form.Control type='range' value={props.item.value.value as string} min={minInt} max={maxInt} onChange={(e: any) => props.onChange(parseInt(e.target.value))} />
                                <Form.Text>{minInt ? 'min: ' + minInt : ''} &nbsp; {maxInt ? 'max: ' + maxInt : ''}</Form.Text>
                            </>
                        );

                    default:
                        break;
                }
                break;

            case MetadataType.Enum:
                // Handle enum type metadata with a dropdown selection
                const elems = meta!.args.has('elems') ? meta!.args.get('elems')!.split(',') : [];
                const unitEnum = meta!.args.has('unit') ? meta!.args.get('unit') : undefined;
                return (
                    <>
                        <Form.Label><strong>{meta?.fieldName}</strong> {unitEnum ? '(' + unitEnum + ')' : ''}</Form.Label>
                        <Form.Select onChange={(e: any) => props.onChange(e.target.value)}>
                            {elems.map(e => <option value={e} selected={props.item.value.value === e}>{e}</option>)}
                        </Form.Select>
                    </>
                );

            default:
                break;
        }
    }

    return (<><p>Wow</p></>);
}