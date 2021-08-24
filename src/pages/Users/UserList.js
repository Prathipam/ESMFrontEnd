import React, { Component } from 'react';
import { Button, Input, Container, Table, Row, Col, InputGroup, InputGroupAddon } from 'reactstrap';
import PaginationComponent from "react-reactstrap-pagination";
import AppNavbar from '../../AppNavbar';
import { Link } from 'react-router-dom';
import config from '../../helpers/config';
import { ToastContainer, toast } from 'react-toastify';

class UserList extends Component {
    initialFilter = {
        filter: '',
        minSalary: 0,
        maxSalary: 4000
    }
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoading: true,
            totalItems: 1,
            limit: 10,
            offset: 0,
            toggleSort: 'ASC',
            sortBy: 'id-ASC',
            filters: this.initialFilter
        };
        this.remove = this.remove.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.getUsers()
    }

    handleSelected(offset) {
        this.setState({ offset: offset - 1 }, () => {
            this.getUsers()
        });
    }

    async getUsers() {
        const { limit, offset, filters, sortBy } = this.state

        let queryParams = '?limit=' + limit + '&offset=' + offset + '&sort=' + sortBy

        for (const filter in filters) {
            queryParams += '&' + filter + '=' + filters[filter]
        }
        try {
            await fetch(config.API_URL + '/api/users' + queryParams, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.SECRET_KEY
                }
            })
                .then(response => response.json())
                .then(data => this.setState({
                    users: data.results,
                    isLoading: false, totalItems:
                        data.totalItems
                }));
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

    handleSearch = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let filters = { ...this.state.filters };
        filters[name] = value;

        this.setState({ filters }, () => {
            this.getUsers();
        });
    }

    async sortDetails(field) {

        const sortBy = field.split('-')[1]
        this.setState({ sortBy: field })
        if (sortBy === 'ASC')
            this.setState({ toggleSort: 'DESC' })
        else
            this.setState({ toggleSort: 'ASC' })
        this.getUsers()
    }

    async remove(id) {
        try {
            await fetch(config.API_URL + `/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.SECRET_KEY
                }
            }).then((result) => {
                result.json().then((data) => {
                    if (result.statusText === 'OK') {
                        this.notify(data.message, "top-right", "info", 2000);
                        this.getUsers()
                    }
                    else
                        this.notify(data.message, "top-right", "error", 2000);
                })
            })
        } catch (err) {
            console.error(err.message)
        }
    }

    render() {
        const { users, isLoading, filters } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const userList = users.map(user => {
            return <tr key={user.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{user.id}</td>
                <td >{user.login}</td>
                <td>{user.name}</td>
                <td>${user.salary}</td>
                <td>{user.startDate}</td>

                <td>
                    <Button size="sm" color="primary" className="mr-5" tag={Link} to={"/users/" + user.id}>Edit</Button>
                    <Button size="sm" color="danger" className="ml-5" onClick={() => this.remove(user.id)}>Delete</Button>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <Row className="mt-20" style={{ padding: "15px" }}>
                        <Col sm="6">
                            <h3>Employees List</h3>
                        </Col>
                        <Col sm="4" className="float-right">
                            <Input type="text" name="filter" id="filter" value={filters.filter}
                                onChange={(e) => this.handleSearch(e)} />
                        </Col>
                        <Col sm="2" className="float-right">
                            <Button color="success" tag={Link} to="/users/new">Add User</Button>
                        </Col>
                    </Row>
                    <p>Filter for Minimum and maximum salary</p>
                    <Row>
                        <Col sm="2" className="float-left">
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                <Input placeholder="Amount" min={0} type="number" name="minSalary"
                                    id="minSalary" value={filters.minSalary}
                                    onChange={(e) => this.handleSearch(e)} />
                                <InputGroupAddon addonType="append">.00</InputGroupAddon>
                            </InputGroup>
                        </Col>

                        <Col sm="2">
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                <Input placeholder="Amount" min={0} type="number" name="maxSalary"
                                    id="maxSalary" value={filters.maxSalary}
                                    onChange={(e) => this.handleSearch(e)} />
                                <InputGroupAddon addonType="append">.00</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row><br />
                    <Row><p style={{ color: "#c91234" }}>Note: Click the header to sort</p></Row>
                    <Table className="m-10" style={{ padding: "10px" }} responsive hover>
                        <thead>
                            <tr>
                                <th width="5%" onClick={() => this.sortDetails('id-' + this.state.toggleSort)}>#</th>
                                <th width="10%" onClick={() => this.sortDetails('login-' + this.state.toggleSort)}>Login</th>
                                <th width="15%" onClick={() => this.sortDetails('name-' + this.state.toggleSort)}>Name</th>
                                <th width="10%" onClick={() => this.sortDetails('salary-' + this.state.toggleSort)}>Salary</th>
                                <th width="10%" onClick={() => this.sortDetails('startDate-' + this.state.toggleSort)}>Start Date</th>
                                <th width="10%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!userList.length ? <td colSpan="6" style={{ textAlign: "center", padding: "20px" }} ><h5>No data available</h5></td> : userList}
                        </tbody>
                    </Table>
                    {userList.length ?
                        <Row className="text-center">
                            <PaginationComponent
                                className="justify-content-center"
                                totalItems={this.state.totalItems}
                                pageSize={this.state.limit}
                                onSelect={this.handleSelected}
                            />
                        </Row> : null}
                    <ToastContainer />
                </Container>
            </div>
        );
    }
}

export default UserList;