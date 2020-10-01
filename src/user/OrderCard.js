import React from "react";
import {
    Link
} from "react-router-dom";
import moment from "moment";

const OrderCard = ({
    order,
    showViewOrderButton = true,
    showStatusUpdate = false
}) => {
    const showViewButton = (showViewOrderButton) => {
        return (
            showViewOrderButton && ( <
                Link to = {
                    {
                        pathname: `/order/${order._id}`,
                        state: {
                            showStatusUpdate
                        }
                    }
                }
                className = "mr-2" >
                <
                button className = "btn btn-sm btn-primary mt-2 mb-2 card-btn-1" > View Order < /button> <
                /Link>
            )
        );
    };

    return ( <
        div className = "card" >
        <
        div className = "card-header"
        style = {
            {
                backgroundColor: "grey",
                color: "white",
                fontSize: "20px",
                borderRadius: "10px",
            }
        } >
        Order # {
            order._id
        } <
        /div> <
        div className = "card-body"
        style = {
            {
                padding: "2px"
            }
        } >
        <
        p > Current Status: {
            order.status
        } < /p> <
        p > Order Amount: {
            order.amount
        } < /p> <
        p > Ordered By: {
            order.user.name
        } < /p> <
        p > Order Placed on: {
            moment(order.createdAt).format("LL")
        } < /p> <
        p > Number of Products: {
            order.products.length
        } < /p> {
            showViewButton(showViewOrderButton)
        } <
        /div> <
        /div>
    );
};

export default OrderCard;