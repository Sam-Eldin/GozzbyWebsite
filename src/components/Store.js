import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {auth, users, items} from "./firebase_functions";

class Client {
    constructor(document, document_data) {
        this.doc = document;
        this.name = document_data.name;
        this.cart = document_data.cart;
    }

    async addItem(item_id) {
        if (this.cart == null) {
            console.log('Cannot add item, something wrong with data');
            return;
        }

        // Add new item to the cart with quantity 1 or
        // increase by 1 if already exist
        if (!this.cart.hasOwnProperty(item_id))
            this.cart[item_id] = 0;
        this.cart[item_id]++;

        // Might need to update visually as well!
        await this.doc.update({cart: this.cart}).then(() => {
            console.log('update successfully!');
        }).catch((error) => {
            console.log('error with update! ' + error);
        });
    };

    getCartDataInListForm() {
        // Ayham this is yours
        const handleItem = (itemID) => {
            return <li key={itemID}>id: {itemID}, quantity {this.cart[itemID]}</li>
        }
        return (
            <div>
                <p> User Cart</p>
                <ul>
                    {Object.keys(this.cart).map((item) => handleItem(item))}
                </ul>
            </div>
        );
    };
}

/*

class Products {
    constructor(item, item_data) {
        this.name = item_data.name;
        this.id = item;
        this.imagePath = item_data.imagePath;
    }

    getProduct() {
        return (
            <div>
                <img src={this.imagePath} key={this.id}/>
            </div>
        )
    }
}
*/


export function Store(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);
    const [client, setClient] = useState(null);
    const [products, setProduct] = useState(null);
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        return auth.onAuthStateChanged(async u => {
            if (u) {
                setUser(u);
                await users.doc(u.email).get().then((document) => {
                    console.log(document.data());
                    setClient(new Client(users.doc(u.email), document.data()));
                    console.log('client was loaded successfully from database');
                }).catch(error => console.log('Something went wrong when getting client, ' + error));

                await items.get().then((products) => {
                    let result = new Map();
                    products.docs.forEach((product) => {
                        result.set(product.id, product.data());
                    });
                    setProduct(result);
                }).catch(error => console.log(error));
            } else {
                props.history.push("/");
            }
        });
    }, [props.history]);

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                props.history.push("/");
            })
            .catch(error => {
                alert(error.message);
            });
    };

    const getProducts = () => {

        const handleItem = (key, value) => {
            return (
                <p>{value.name}
                </p>
            );
        };
        return (
            <div>
                <p>to be or not to be</p>
            </div>
        );
    }

    if (!user) {
        return <div/>;
    }

    return (
        <div>
            <AppBar position="static">
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
                        color="inherit"
                        variant="h6"
                        style={{marginLeft: 15, flexGrow: 1}}
                    >
                        My App
                    </Typography>
                    <Typography color="inherit" style={{marginRight: 30}}>
                        Hi! {client && client.name ? client.name : ""}
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>
            <div>
                <img src='products/absolut.jpg' alt="Girl in a jacket" width="500" height="600"/>
            </div>
            {/*THIS BUTTON IS FOR TESTING, CAN BE DELETED OR MODIFIED.*/}
            <Button color="inherit" onClick={() => {
                client.addItem(25).then(r => console.log(r ? r : ' '));
            }}>
                TEST ADD ITEM NUMBER 25 TO THE CURRENT USER
            </Button>
            {/* Check if null*/}
            {client ? client.getCartDataInListForm() : ''}
            {products ? getProducts() : ''}
        </div>
    );
}
