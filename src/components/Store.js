import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import 'bootstrap/dist/css/bootstrap.css';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {FirebaseAuth, users, ClientClass} from "./firebase_functions";
import Loading from "./Loading";
import "./Store.css";
import background from "../assets/StorePics/productback.jpg"
import 'bootstrap/dist/css/bootstrap.min.css';
import {AiTwotoneShopping} from "react-icons/ai"
import { BsPerson } from "react-icons/bs";

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
                    setuserName(data.data().name);
                    if (client_ === null) {
                        setClientClass(new ClientClass(users.doc(u.email), data.data()));
                    }
                });
                setUserdocument(users.doc(u.email));
                setIsLoading(false);
            } else {
                props.history.push("/");
            }
        });
    }, [client_, props.history]);


    if (!user) {
        return <div/>;
    }
    if (isLoading)
        return <div className={'Container'}><Loading/></div>
    return (
        //style={{ backgroundImage: `url(${background})` }}
        <div  style={{ backgroundImage: `url(${background})` }}>
            <AppBar position="static" color="red">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            setDrawerOpen(true);
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Typography
                        color="black"
                        variant="h6"
                        style={{marginLeft: 15, flexGrow: 1}}
                    >
                        Gozzby Store

                    </Typography>


                    <Button
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
                    <Typography color="black" style={{marginRight: 30}} onClick={() => {
                        // props.history.push('/client')
                        setUserModalShow(true);
                    }}><BsPerson  size={50}></BsPerson>
                        Hi! {userName}
                    </Typography>
                    <Button color="inherit" onClick={() => handleSignOut(props)}>
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
                    <Navbar.Brand>Gozzby brands</Navbar.Brand>
                    <Button onClick={() => setFilterBy(NoFilter)} variant="secondary">All</Button>{' '}
                    <Button onClick={() => setFilterBy('vodka')} variant="secondary">Vokda</Button>{' '}
                    <Button onClick={() => setFilterBy('beer')} variant="secondary">Beers</Button>{' '}
                    <Button onClick={() => setFilterBy('whiskey')} variant="secondary">Whiskey</Button>{' '}
                    <Button onClick={() => setFilterBy('tequila')} variant="secondary">Tequila</Button>{' '}

                    <Navbar.Toggle aria-controls="navbar-dark-example" />
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav>

                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="SortBy"
                                menuVariant="dark"
                            >
                                <Dropdown.Item onSelect={() => setSortBy(SortByAscending)}>Ascending</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy(SortByDescending)}>descending</Dropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>

                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="Filter by"
                                menuVariant="dark"
                            >
                                <Dropdown.Item onSelect={() => setFilterBy('vodka')}>Vodka</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setFilterBy('beer')}>Beer</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setFilterBy('whiskey')}>Whiskey</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setFilterBy('tequila')}>Tequila</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setFilterBy(NoFilter)}>Remove Filter</Dropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>


        </div>
    );
}
