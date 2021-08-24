import React, { Component } from 'react';
import AppNavbar from '../../AppNavbar';
import { Link } from 'react-router-dom';
import config from '../../helpers/config';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Card, Button, CardHeader, Input, Container, CardText, Form, FormGroup, Row, Col, CardBody } from 'reactstrap';

class UserUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new FormData();
        data.append('file', this.state.selectedFile);
        data.append('description', 'ddd');

        try {
            axios.post(config.API_URL + '/api/users/upload', data)
                .then((result) => {
                    this.notify(result.data.message, "top-right", "info", 3000);
                    setTimeout(() => {
                        this.props.history.push('/users')
                    }, 3000)

                }).catch((err) => {
                    let message = err.response.data.message
                    message = Array.isArray(message) ? message.join("\r\n") : message
                    this.notify(message, "top-right", "error", 3000);
                })
            event.target.reset()
        } catch (err) {
            console.error(err)
        }
    }

    notify = (msg, position, type, autoClose, progressBar, closeOnClick, pauseOnHover, draggable) => {
        if (type) {
            toast[type](msg, {
                position: position,
                autoClose: autoClose,
                hideProgressBar: progressBar,
                closeOnClick: closeOnClick,
                pauseOnHover: pauseOnHover,
                draggable: draggable,
            });
        } else {
            toast(msg, {
                position: position,
            });
        }
    };


    handleChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    render() {

        return <div>
            <ToastContainer />
            <AppNavbar />
            <Container><br />
                <Row className="text-center">
                    <Col sm="12">
                        <Card>
                            <CardHeader tag="h4">Upload Employees</CardHeader>
                            <CardBody>
                                <CardText>Please upload file in CSV format</CardText>
                                <Form onSubmit={this.handleSubmit} >
                                    <FormGroup>
                                        <Input
                                            type="file"
                                            name="file"
                                            icon='file text outline'
                                            label='Upload CSV'
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </FormGroup><br />
                                    <FormGroup>
                                        <Button color="primary" type="submit">Submit</Button>{' '}
                                        <Button color="secondary" tag={Link} to="/users"> Back</Button>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    }
}

export default UserUpload