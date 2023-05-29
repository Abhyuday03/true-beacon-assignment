import React, { useEffect, useState } from "react";
import "./Profile.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [profit, setProfit] = useState(0);

  const [show, setShow] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const submitOrder = async () => {
    console.log(symbol, price, quantity);
    try {
      const { data } = await axios.post(
        "api/v1/order/addOrder",
        { user_id: user.user_id, symbol, price, quantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(data);
      fetchOrders();
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("api/v1/order/getOrder", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHoldings = async () => {
    try {
      const { data } = await axios.get("api/v1/holdings/getHoldings");

      const sum = data.reduce((accumulator, object) => {
        return accumulator + object.pnl;
      }, 0);
      setProfit(sum);
      setHoldings(data);
    } catch (error) {
      console.log(error);
    }
  };
  const history = useNavigate();
  const handleLogout = () => {
    localStorage.setItem("userInfo", "");
    history("/");
  };

  useEffect(() => {
    fetchOrders();
    fetchHoldings();
  }, []);

  return (
    <div className="profile">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div className="profile-information">
          <h3 style={{ fontWeight: "700", fontSize: "24px" }}>
            Profile Information
          </h3>
          <div className="profile-details">
            <p style={{ fontSize: "20px", fontWeight: "600" }}>
              {user.user_name}
            </p>
            <p>{user.email}</p>
            <p>User Type : {user.user_type}</p>
            <p>Broker : {user.broker}</p>

            <button
              style={{
                margin: "5px auto",
                backgroundColor: "pink",
                padding: "5px 7px",
                borderRadius: "7px",
                width: "max-content",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="profile-information">
          <h3 style={{ fontWeight: "700", fontSize: "24px" }}>Profit / Loss</h3>
          <div className="profile-details">
            <p style={{ fontSize: "20px", fontWeight: "600" }}>
              {profit.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 mb-3">
        <h3 style={{ fontWeight: "700", fontSize: "24px" }}>
          Current Holdings
        </h3>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Trading Symbol</th>
              <th>Exchange</th>
              <th>ISIN</th>
              <th>Quantity</th>
              <th>Authorised Date</th>
              <th>Leverage Price</th>
              <th>Last Price</th>
              <th>Close Price</th>
              <th>PNL</th>
              <th>Day Change</th>
              <th>Day Change Percentage</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.holding_id}>
                <td>{holding.tradingsymbol}</td>
                <td>{holding.exchange}</td>
                <td>{holding.isin}</td>
                <td>{holding.quantity}</td>
                <td>{holding.authorised_date.substring(0, 10)}</td>
                <td>{holding.average_price}</td>
                <td>{holding.last_price}</td>
                <td>{holding.close_price}</td>
                <td>{holding.pnl.toFixed(4)}</td>
                <td>{holding.day_change.toFixed(4)}</td>
                <td>{holding.day_change_percentage.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </Table>{" "}
      </div>

      <div className="mt-5 mb-3">
        <h3 style={{ fontWeight: "700", fontSize: "24px" }}>All Orders</h3>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.symbol}</td>
                <td>{order.price}</td>
                <td>{order.quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div>
          <Button variant="primary" onClick={handleShow}>
            Add Order
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Enter Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                className="p-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Symbol</label>
                <input
                  type="text"
                  placeholder="Enter symbol"
                  style={{ width: "60%" }}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                  }}
                />
              </div>
              <div
                className="p-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Price (in ₹)</label>
                <input
                  type="number"
                  placeholder="Enter Price"
                  style={{ width: "60%" }}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div
                className="p-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  style={{ width: "60%" }}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={submitOrder}>
                Add Order
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Profile;
