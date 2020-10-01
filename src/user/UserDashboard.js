import React, {
    useState,
    useEffect
} from "react";
import Layout from "../core/Layout";
import {
    isAuthenticated
} from "../auth";
import {
    Link
} from "react-router-dom";
import {
    getPurchaseHistory
} from "./apiUser";
import OrderCard from "./OrderCard";

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const {
        user: {
            _id,
            name,
            email,
            role
        },
    } = isAuthenticated();
    const token = isAuthenticated().token;

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setHistory(data);
            }
        });
    };

    useEffect(() => {
        init(_id, token);
    }, []);

    const userLinks = () => {
        return ( <
            div className = "card" >
            <
            h4 className = "card-header"
            style = {
                {
                    backgroundColor: "#3379FF",
                    color: "white"
                }
            } >
            User Links <
            /h4> <
            ul className = "list-group" >
            <
            li className = "list-group-item" >
            <
            Link className = "nav-link"
            to = "/cart" >
            My Cart <
            /Link> <
            /li> <
            li className = "list-group-item" >
            <
            Link className = "nav-link"
            to = {
                `/profile/${_id}`
            } >
            Update Profile <
            /Link> <
            /li> <
            /ul> <
            /div>
        );
    };

    const userInfo = () => {
        return ( <
            div className = "card mb-4" >
            <
            h3 className = "card-header"
            style = {
                {
                    backgroundColor: "#3379FF",
                    color: "white"
                }
            } >
            User Information <
            /h3> <
            ul className = "list-group" >
            <
            li className = "list-group-item" > {
                name
            } < /li> <
            li className = "list-group-item" > {
                email
            } < /li> <
            li className = "list-group-item" > {
                role === "admin" ? "Admin" : "Registered User"
            } < /li> <
            /ul> <
            /div>
        );
    };

    const purchaseHistory = (history) => {
        return ( <
            >
            <
            h2 className = "mb-4 card"
            style = {
                {
                    backgroundColor: "#3379FF",
                    color: "white"
                }
            } >
            Purchase History <
            /h2> {
                history && history.length > 0 ? ( <
                    div className = "row" > {
                        history.map((order, i) => ( <
                            div key = {
                                i
                            }
                            className = "col-4 mb-3" >
                            <
                            OrderCard order = {
                                order
                            }
                            /> <
                            /div>
                        ))
                    } <
                    /div>
                ) : ( <
                    div className = "alert alert-info" > You have not placed any orders yet. < /div>
                )
            } <
            />
        );
    };

    return ( <
        Layout title = "Dashboard"
        description = {
            `G'day ${name}!`
        }
        className = "container-fluid" >
        <
        div className = "row" >
        <
        div className = "col-3" > {
            userLinks()
        } < /div> <
        div className = "col-9" > {
            userInfo()
        } {
            purchaseHistory(history)
        } <
        /div> <
        /div> <
        /Layout>
    );
};

export default Dashboard;