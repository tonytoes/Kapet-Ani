import "../../styles/footer.css";
import kapetanilogowhite from "../../assets/images/kape't_ani_logo_white.png";

function Footer() {
  return (
    <footer className="footer_section" id="wholeFooter">
      <div className="container">
        <div className="row row-cols-4" id="upperFooter">
          <div className="col" id="logo">
            <img src={kapetanilogowhite} alt="" />
          </div>
          <div className="col" id="logoName">
            <h5>Kape't Pamana</h5>
          </div>
          <div className="col">
            <a href="">MENU</a>
          </div>
          <div className="col">
            <a href="">FOLLOW US</a>
          </div>
          <div className="col">
            <a href="">CONTACT US</a>
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
              <a href="">Kape't Pamana @ 2026</a>
            </div>
          </div>
          <div className="col">
            <div className="col">
              <a href="">Home</a>
            </div>
            <div className="col">
              <a href="">Our Products</a>{" "}
            </div>
            <div className="col">
              <a href="">About</a>{" "}
            </div>
            <div className="col">
              <a href="">Contact</a>{" "}
            </div>
            <div className="col">
              <a href="">Style Guide</a>{" "}
            </div>
          </div>
          <div className="col">
            <div className="col">
              <a href="">Facebook</a>{" "}
            </div>
            <div className="col">
              <a href="">Instagram</a>{" "}
            </div>
            <div className="col">
              <a href="">Pinterest</a>{" "}
            </div>
            <div className="col">
              <a href="">Twitter</a>{" "}
            </div>
          </div>
          <div className="col">
            <div className="col">
              <a href="">We're Always Happy to Help</a>
            </div>
            <div className="col" id="gmailFooter">
              <a href="">kapetpamana@gmail.com</a>{" "}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
