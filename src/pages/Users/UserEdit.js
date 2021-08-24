import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, InputGroupAddon, InputGroup } from 'reactstrap';
import AppNavbar from '../../AppNavbar';
import config from '../../helpers/config';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

class UserEdit extends Component {
    emptyUser = {
        id: '',
        login: '',
        name: '',
        salary: '',
        startDate: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyUser,
            method: 'POST'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {

        if (this.props.match.params.id !== 'new') {
            const user = await (await fetch(config.API_URL + `/api/users/${this.props.match.params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.SECRET_KEY
                }
            })).json();
            this.setState({ item: user, method: 'PUT' });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = { ...this.state.item };
        item[name] = value;
        this.setState({ item });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { item, method } = this.state;
        let apiUrl = method === 'POST' ? '/api/users' : '/api/users/' + item.id

        try {
            await fetch(config.API_URL + apiUrl, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.SECRET_KEY
                },
                body: JSON.stringify(item),
            }).then((result) => {
                result.json().then((data) => {
                    if (result.status === 200 || result.status === 201) {
                        this.notify(data.message, "top-right", "info", 3000);
                        setTimeout(() => {
                            this.props.history.push('/users')
                        }, 2000)
                    }
                    else
                        this.notify(data.message, "top-right", "error", 3000);
                })


            })

        } catch (err) {
            console.error(err.message)
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

    render() {
        const { item, method } = this.state;
        const title = <h2>{method === 'PUT' ? 'Edit Employee' : 'Add Employee'}</h2>;

        return <div>
            <ToastContainer />
            <AppNavbar />
            <Container><br />
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="id">Emp Id</Label>
                        <Input type="text" name="id" id="id" value={item.id || ''}
                            onChange={this.handleChange} required />
                    </FormGroup><br />
                    <FormGroup>
                        <Label for="login">Login</Label>
                        <Input type="text" name="login" id="login" value={item.login || ''}
                            onChange={this.handleChange} required />
                    </FormGroup><br />
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                            onChange={this.handleChange} required />
                    </FormGroup><br />
                    <FormGroup>
                        <Label for="salary">Salary</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                            <Input type="number" name="salary"
                                id="salary" value={item.salary || ''}
                                onChange={this.handleChange} required />
                        </InputGroup>
                    </FormGroup><br />
                    <FormGroup>
                        <Label for="address">Start Date</Label>
                        <Input type="text" name="startDate" id="startDate" value={item.startDate || ''}
                            onChange={this.handleChange} placeholder="YYYY-MM-DD" required />
                    </FormGroup><br />
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/users"> Back</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(UserEdit);