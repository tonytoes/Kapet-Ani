import "../../styles/newsletter.css";

function Newsletter() {
  return (
    <div className="newsLetter">
      <div className="newsWrap d-flex flex-row justify-content-center align-items-center text-center">
        <div className="wrap d-flex flex-column justify-content-center align-items-center text-center">
          <div className="d-flex justify-content-center align-items-center">
            <span className="newsLabel">
              Don’t miss out on our latest news, updates, tips and special
              offers
            </span>
          </div>
          <span className="subscribeLabel">
            Subscribe to get the Latest News
          </span>
          <form className="formBlock">
            <div className="d-flex justify-content-center align-items-center">
              <input className="rounded-0 subscribe-input" type="email" placeholder="kapetpamana@gmail.com"/>
              <button className="d-inline-block justify-content-center rounded-0 subscribe-btn" type="submit">Subscribe</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
