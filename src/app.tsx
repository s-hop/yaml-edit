import { useState } from 'preact/hooks'
import './app.css'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { YamlEditor } from './components/editor';

export function App() {

  const example = `# This is an example file that demonstrates the capabilities of yaml-edit.

#$ string
receipt_name: Receipt

# Let's pretend dates are only allowed in January 2024!
#$ date min:2024-01-01 max:2024-01-31
receipt_date: 2024-01-23

#$ integer display:slider min:1 max:100
price: 12

#$ enum elems:sale,return,other
type: sale

description: This doesn't have any type annotations attached.`;

    const [yaml, setYaml] = useState(example);

    const onYamlChange = (newYaml: string) => setYaml(newYaml);

    return (
        <>
            <Container className={'mt-3'}>
                <h1>yaml-edit-preact example</h1>

                <p>This is a demonistration of the yaml-edit project (Preact version). It has an example YAML file on the left and the rendered editor on the right. Editing the right hand side causes the left to update automatically.</p>

                <hr />

                <Row>
                    <Col>
                        <h2>Demo file content</h2>

                        <Form.Control as='textarea' rows={30} placeholder={yaml} readOnly />
                    </Col>
                    <Col>
                        <h2>Editor</h2>

                        <YamlEditor initialYaml={yaml} onChange={onYamlChange} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}
