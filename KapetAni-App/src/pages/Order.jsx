import '../styles/order_confirmation.css';
import rattan_basket from '../assets/images/Rattan_Basket.png';
import bamboo_basket from '../assets/images/Bamboo_Basket.png';
import palm_basket from '../assets/images/Palm_Basket.png';
import Navbar from '../components/layout/Navbar.jsx';
import Newsletter from "../components/layout/Newsletter.jsx"; 
import Footer from '../components/layout/Footer.jsx';


function App() {
  return (
    <div className="App order-page">
      <header className="App-header">
        <>
          <title>Order Confirmation Page</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <div className="container text-center base">
            <div className="row align-items-start COframe">
            <div className="col">
                <h1>Your order has been placed</h1>
                <h5>
                Thanks for shopping with us. A confirmation email should arrive in a
                few minutes.
                </h5>
                <div className="row">
                <a href="index.html" id="homeB">
                    &lt;Home
                </a>
                </div>
                <div className="row parent">
                <div className="col-7 leftside">
                    {/* Customer Info Section */}
                    <div className="row" id="customerInfo">
                    <h5 className="upperSection">Customer Info</h5>
                    <div className="col bottomSection">
                        <div className="row">
                        <div className="col">
                            <div className="row">
                            <h5>Email Address</h5>
                            </div>
                            <div className="row">
                            <h6>fake_email@gmail.com</h6>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                            <h5>Shipping Address</h5>
                            </div>
                            <div className="row">
                            <h6>Fake Name</h6>
                            </div>
                            <div className="row">
                            <h6>398 11th St Floor 2</h6>
                            </div>
                            <div className="row">
                            <h6>San Francisco CA 94103</h6>
                            </div>
                            <div className="row">
                            <h6>USA</h6>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    {/* Items in Order Section */}
                    <div className="row" id="itemsInOrder">
                    <h5 className="upperSection">Items in Order</h5>
                    <div className="col bottomSection">
                        <div className="row items">
                        <div className="col">
                            <div className="row item" id="firstItem">
                            <div className="col itemInfo">
                                <div className="row">
                                <div className="col">
                                    <img src={rattan_basket} alt="" />
                                </div>
                                <div className="col">
                                    <p className="productTitle">Rattan Basket</p>
                                    <p>Quantity:1</p>
                                </div>
                                </div>
                            </div>
                            <div className="col price">
                                <p>$ 99.00 USD</p>
                            </div>
                            </div>
                            <div className="row item" id="secondItem">
                            <div className="col itemInfo">
                                <div className="row">
                                <div className="col">
                                    <img src={bamboo_basket} alt="" />
                                </div>
                                <div className="col">
                                    <p className="productTitle">Bamboo Basket</p>
                                    <p>Quantity:1</p>
                                </div>
                                </div>
                            </div>
                            <div className="col price">
                                <p>$ 39.00 USD</p>
                            </div>
                            </div>
                            <div className="row item" id="thirdItem">
                            <div className="col itemInfo">
                                <div className="row">
                                <div className="col">
                                    <img src={palm_basket} alt="" />
                                </div>
                                <div className="col">
                                    <p className="productTitle">Bamboo Basket</p>
                                    <p>Quantity:1</p>
                                </div>
                                </div>
                            </div>
                            <div className="col price">
                                <p>$ 15.00 USD</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    {/* Shipping Method */}
                    <div className="row" id="shippingMethod">
                    <h5 className="upperSection">Shipping Method</h5>
                    <div className="col">
                        <div className="row shippingOptions">
                        <div className="col">
                            <div className="col" id="selectedSM">
                            <p>FLAT-RATE</p>
                            <p>STANDARD FLAT-RATE FOR ALL SHIPMENTS</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    {/* Payment Info */}
                    <div className="row" id="paymentInfo">
                    <h5 className="upperSection">Payment Info</h5>
                    <div className="col bottomSection">
                        <div className="row">
                        <div className="col">
                            <div className="row">
                            <h5>Payment Info</h5>
                            </div>
                            <div className="row">
                            <h6>Visa 4242 3/2030</h6>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                            <h5>Billing Address</h5>
                            </div>
                            <div className="row">
                            <h6>Fake Name</h6>
                            </div>
                            <div className="row">
                            <h6>398 11th St Floor 2</h6>
                            </div>
                            <div className="row">
                            <h6>San Francisco CA 94103</h6>
                            </div>
                            <div className="row">
                            <h6>USA</h6>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                {/* Order Summary */}
                <div className="col-5 rightside" id="orderSum">
                    <div className="row osTitle">
                    <h5>Order Summary</h5>
                    </div>
                    <div className="row osBody">
                    <div className="col">
                        <div className="row" id="SubTotal">
                        <div className="col">
                            <h6>Subtotal</h6>
                        </div>
                        <div className="col">
                            <h6 id="subtotal">$ 153.00 USD</h6>
                        </div>
                        </div>
                        <div className="row" id="FlatRate">
                        <div className="col">
                            <h6>Flat-Rate</h6>
                        </div>
                        <div className="col">
                            <h6 id="flatrate">$ 18.90 USD</h6>
                        </div>
                        </div>
                        <div className="row" id="Total">
                        <div className="col">
                            <h6 id="totalText">Total</h6>
                        </div>
                        <div className="col">
                            <h6 id="total">$ 171.90 USD</h6>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <button id="continueShopping">Continue Shopping</button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        {/* More Section and Footer */}
        <section id="moreSection">
            <div className="container text-center">
            <h6>
                Don't Miss Out On Our Latest News, Update, Tips, And Special Offers
            </h6>
            <h5>Subscribe to get the Latest News</h5>
            <input type="text" id="subEmail" />
            <button id="subscribe">Subscribe</button>
            </div>
        </section>
        <Footer/>
        {/* End of More Section and Footer */}
        </>
      </header>
    </div>
  );
}

export default App;
