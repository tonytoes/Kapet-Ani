import '../styles/checkout_page.css';
import rattan_basket from '../assets/images/Rattan_Basket.png';
import bamboo_basket from '../assets/images/Bamboo_Basket.png';
import palm_basket from '../assets/images/Palm_Basket.png';
import kapetanilogowhite from '../assets/images/kape\'t_ani_logo_white.png'
import Newsletter from '../components/layout/Newsletter';
import Footer from '../components/layout/Footer';


function App() {
  return (
    <div className="App checkout-page">
      <header className="App-header">
        <>
          <title>Checkout Page</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <div className="container text-center base">
            <div className="row align-items-start COframe">
              <div className="col" id="#body">
                <form action="submit">
                  <div className="row">
                    <a href="index.html" id="homeB">
                      &lt;Home
                    </a>
                  </div>
                  <div className="row parent">
                    <div className="col-7 leftside">
                      {/* Payment Options */}
                      <div className="row paymentBtn">
                        <button id="paypalB">Paypal</button>
                      </div>
                      <div className="row paymentBtn">
                        <button id="payB">Pay</button>
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
                      {/* Customer Info Section */}
                      <div className="row" id="customerInfo">
                        <h5 className="upperSection">Customer Info</h5>
                        <div className="col bottomSection">
                          <div className="row">
                            <div className="col">
                              <label htmlFor="email">Email</label>
                              <br />
                              <input type="text" id="email" name="email" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Shipping Address */}
                      <div className="row" id="shippingAddress">
                        <h5 className="upperSection">Shipping Address</h5>
                        <div className="col bottomSection">
                          <div className="row">
                            <div className="col">
                              <label htmlFor="fullName">Full Name:</label>
                              <br />
                              <input type="text" id="fullName" name="fullName" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <label htmlFor="strAddress">Street Address:</label>
                              <br />
                              <input type="text" id="strAddress" name="strAddress" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <label htmlFor="city">City:</label>
                              <br />
                              <input type="text" id="city" name="city" />
                            </div>
                            <div className="col">
                              <label htmlFor="state">State/Province:</label>
                              <br />
                              <input type="text" id="state" name="state" />
                            </div>
                            <div className="col">
                              <label htmlFor="postalCode">Postal Code:</label>
                              <br />
                              <input type="text" id="postalCode" name="postalCode" />
                            </div>
                            <div className="col">
                              <label htmlFor="country">Country:</label>
                              <br />
                              <input type="text" id="country" name="country" />
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
                              <div className="row item" id="flatrateOpt">
                                <div className="col">
                                  <div className="row">
                                    <div className="col">
                                      <input
                                        type="radio"
                                        name="shippingOption"
                                        id="flatrateCB"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-9">
                                  <p>FLAT-RATE</p>
                                  <p>STANDARD FLAT-RATE FOR ALL SHIPMENTS</p>
                                </div>
                                <div className="col price">
                                  <p>Price</p>
                                </div>
                              </div>
                              <div className="row item" id="expeditedOpt">
                                <div className="col">
                                  <div className="row">
                                    <div className="col">
                                      <input
                                        type="radio"
                                        name="shippingOption"
                                        id="expeditedCB"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-9">
                                  <p>EXPEDITED SHIPPING</p>
                                  <p>STANDARD TO GET THE SHIPMENTS IN A DAY OR TWO</p>
                                </div>
                                <div className="col price">
                                  <p>Price</p>
                                </div>
                              </div>
                              <div className="row item" id="overnightOpt">
                                <div className="col">
                                  <div className="row">
                                    <div className="col">
                                      <input
                                        type="radio"
                                        name="shippingOption"
                                        id="overnightCB"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-9 smText">
                                  <p>OVERNIGHT SHIPPING</p>
                                  <p>
                                    AN EXPENSIVE OPTION TO GET THE SHIPMENT ON THE NEXT
                                    BUSINESS DAY.
                                  </p>
                                </div>
                                <div className="col price">
                                  <p>Price</p>
                                </div>
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
                              <label htmlFor="cardnumber">Card Number</label>
                              <br />
                              <input type="text" id="cardnumber" name="cardnumber" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <label htmlFor="expdate">Expiration Date:</label>
                              <br />
                              <input type="text" id="expdate" name="expdate" />
                            </div>
                            <div className="col">
                              <label htmlFor="secCode">Security Code:</label>
                              <br />
                              <input type="text" id="secCode" name="secCode" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <input type="checkbox" />
                            </div>
                            <div className="col-11 smText">
                              <p>Billing address same as shipping</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Billing Address */}
                      <div className="row" id="billingAddress">
                        <h5 className="upperSection">Billing Address</h5>
                        <div className="col bottomSection">
                          <div className="row">
                            <div className="col">
                              <label htmlFor="fullName">Full Name:</label>
                              <br />
                              <input type="text" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <label htmlFor="strAddress">Street Address:</label>
                              <br />
                              <input type="text" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <label htmlFor="city">City:</label>
                              <br />
                              <input type="text" />
                            </div>
                            <div className="col">
                              <label htmlFor="state">State/Province:</label>
                              <br />
                              <input type="text" />
                            </div>
                            <div className="col">
                              <label htmlFor="postalCode">Postal Code:</label>
                              <br />
                              <input type="text" />
                            </div>
                            <div className="col">
                              <label htmlFor="country">Country:</label>
                              <br />
                              <input type="text" />
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
                        <button id="submit">Place Order</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* More Section and Footer */}
        {/* End of More Section and Footer */}
        </>

      </header>
      <Newsletter/>
      <Footer/>
    </div>
  );
}

export default App;
