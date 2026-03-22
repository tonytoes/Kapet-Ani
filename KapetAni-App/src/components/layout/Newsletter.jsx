import "../../styles/newsletter.css";

function Newsletter() {
  return (
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
  );
}

export default Newsletter;
