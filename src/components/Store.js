import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import {FirebaseAuth, users, ClientClass} from "./firebase_functions";
import Loading from "./Loading";
import "./Store.css";
import background from "../assets/StorePics/productback.jpg"
import {AiTwotoneShopping} from "react-icons/ai"
import { BsPerson } from "react-icons/bs";
import {AiFillShop} from "react-icons/ai";
import {FaSignOutAlt} from "react-icons/all";

import {
    handleSignIn,
    handleSignOut,
    getProducts,
    UserModal,
    SortByDescending,
    SortByAscending,
    NoFilter
} from "./Store_functions";
import {Container, Dropdown, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Col, Row} from "reactstrap";




export function Store(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(SortByAscending); // 0 = No Sorting.
    const [filterBy, setFilterBy] = useState(NoFilter);
    const [UsermodalShow, setUserModalShow] = React.useState(false);
    const [userdocument, setUserdocument] = React.useState(null);
    const [userName, setuserName] = React.useState('');
    const [client_, setClientClass] = React.useState(null);


    let keyID = 0;
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            if (u) {
                setIsLoading(true);
                setUser(u);
                await handleSignIn(setProduct);

                await users.doc(u.email).get().then((data) => {
                    const pop = data.data();
                    console.log(pop);
                    setuserName(data.data().name);
                    if (client_ === null) {
                        setClientClass(new ClientClass(users.doc(u.email), data.data()));
                    }
                }).catch((e) => {
                    console.log(e.message);
                    handleSignOut(props);
                });
                setUserdocument(users.doc(u.email));
                setIsLoading(false);
            } else {
                props.history.push("/");
            }
        });
    }, [props ,client_, props.history]);


    if (!user) {
        return <div>no user</div>;
    }
    if (isLoading)
        return <div className={'Container'}><Loading/></div>
    return (
        //style={{ backgroundImage: `url(${background})` }}
        <div key={'storekey' + keyID++}  style={{ backgroundImage: `url(${background})` }}>
            <AppBar key={'storekey' + keyID++} position="static" color="default">
                <Toolbar>


                    <Typography
                        key={'storekey' + keyID++}
                        variant="h6"
                        style={{marginLeft: 15, flexGrow: 1}}
                    >
                        Gozzby Store <AiFillShop/>

                    </Typography>


                    <Button
                        key={'storekey' + keyID++}
                        style={{
                            resize: 'horizontal',
                            overflow: 'hidden',
                            height: '100px',
                        width:'200px'}}
                        onClick={() => props.history.push('/client-cart')}
                        >
                        <AiTwotoneShopping size={50} width="100%"/>
                            Go to cart
                    </Button>
                    <Typography style={{marginRight: 30}} onClick={() => {
                        // props.history.push('/client')
                        setUserModalShow(true);
                    }}><BsPerson  size={50}>a</BsPerson>
                        Hi! {userName}
                    </Typography>
                    <Button color="inherit" onClick={() => handleSignOut(props)}>
                        <FaSignOutAlt size={30}/>
                        Sign out
                    </Button>

                    <UserModal
                        show={UsermodalShow}
                        onHide={() => setUserModalShow(false)}
                        clientdocument={userdocument}
                        currentuser={user}
                        onNameSet={(name) => setuserName(name)}
                    />
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>

            {/* ----------- Test Filter and Sort functions --------------*/}

            {AddSortAndFilterButtonsForTest(setSortBy, setFilterBy)}
            {/*--------------------------- END TEST ----------------------*/}

            {products ? getProducts(products, sortBy, filterBy, client_) : ''}

        </div>
    );
}


function AddSortAndFilterButtonsForTest(setSortBy, setFilterBy) {
    return (
        <div >
            <Navbar  variant="light" bg="light" expand="lg">
                <Container fluid>
                    <Row>
                        <Col>
                    <Navbar.Brand>Gozzby brands</Navbar.Brand>
                        </Col>
                        <Col>
                    <Button onClick={() => setFilterBy(NoFilter)} variant="contained">All</Button>{' '}
                        </Col>
                        <Col>
                    <Button onClick={() => setFilterBy('vodka')} variant="contained">Vokda</Button>{' '}
                        </Col>
                        <Col>
                    <Button onClick={() => setFilterBy('beer')} variant="contained">Beers</Button>{' '}
                        </Col>
                        <Col>
                    <Button onClick={() => setFilterBy('whiskey')} variant="contained">Whiskey</Button>{' '}
                        </Col>
                        <Col >
                    <Button onClick={() => setFilterBy('tequila')} variant="contained">Tequila</Button>{' '}
                        </Col>
                        <Col>
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav>

                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="SortBy"
                            >
                                <Dropdown.Item onSelect={() => setSortBy(SortByAscending)}>Low --> High</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy(SortByDescending)}>High --> Low</Dropdown.Item>
                            </NavDropdown>
                        </Nav>

                    </Navbar.Collapse>
                        </Col>
                    </Row>
                </Container>

            </Navbar>


        </div>
    );
}
