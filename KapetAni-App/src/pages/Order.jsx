import '../styles/order_confirmation.css';
import rattan_basket from '../assets/images/Rattan_Basket.png';
import bamboo_basket from '../assets/images/Bamboo_Basket.png';
import palm_basket from '../assets/images/Palm_Basket.png';
import kapetanilogowhite from '../assets/images/kape\'t_ani_logo_white.png'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <>
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
        <section id="moreSection">
            <div className="container text-center">
            <h5>
                Don't Miss Out On Our Latest News, Update, Tips, And Special Offers
            </h5>
            <h5>Subscribe to get the Latest News</h5>
            <input type="text" id="subEmail" />
            <button id="subscribe">Subscribe</button>
            </div>
        </section>
        <footer className="footer_section" id="wholeFooter">
            <div className="container">
            <div className="row row-cols-4" id="upperFooter">
                <div className="col" id="logo">
                <img src={kapetanilogowhite} alt="" />
                <h5>Kape't Pamana</h5>
                </div>
                <div className="col">
                <a href="">
                    <h6>MENU</h6>
                </a>
                </div>
                <div className="col">
                <a href="">
                    <h6>FOLLOW US</h6>
                </a>
                </div>
                <div className="col">
                <a href="">
                    <h6>CONTACT US</h6>
                </a>
                </div>
            </div>
            <div className="row rows-cols-4" id="lowerFooter">
                <div className="col">
                <div className="col">
                    <h6>
                    Delivering the best coffee life since 1996. From coffee geeks to
                    the real ones.
                    </h6>
                </div>
                <div className="col" id="trademark">
                    <p>Kape't Pamana @ 2026</p>
                </div>
                </div>
                <div className="col">
                <div className="col">
                    <a href="">
                    <h6>Home</h6>
                    </a>
                </div>
                <div className="col">
                    <a href="">
                    <h6>Our Products</h6>
                    </a>{" "}
                </div>
                <div className="col">
                    <a href="">
                    <h6>About</h6>
                    </a>{" "}
                </div>
                <div className="col">
                    <a href="">
                    <h6>Contact</h6>
                    </a>{" "}
                </div>
                <div className="col">
                    <a href="">
                    <h6>Style Guide</h6>
                    </a>{" "}
                </div>
                </div>
                <div className="col">
                <div className="col">
                    <a href="">
                    <h6>Facebook</h6>
                    </a>{" "}
                </div>
                <div className="col">
                    <a href="">
                    <h6>Instagram</h6>
                    </a>{" "}
                </div>
                <div className="col">
                    <a href="">
                    <h6>Pinterest</h6>
                    </a>{" "}
                </div>
                <div className="col">
                    <a href="">
                    <h6>Twitter</h6>
                    </a>{" "}
                </div>
                </div>
                <div className="col">
                <div className="col">
                    <h6>We're Always Happy to Help</h6>
                </div>
                <div className="col">
                    <h5>kapetpamana@gmail.com</h5>{" "}
                </div>
                </div>
            </div>
            </div>
        </footer>
        </>
      </header>
    </div>
  );
}

export default App;
