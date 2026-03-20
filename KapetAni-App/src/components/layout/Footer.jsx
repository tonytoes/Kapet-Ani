import '../../styles/footer.css';
import kapetanilogowhite from '../../assets/images/kape\'t_ani_logo_white.png'


function Footer() {
  return (
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
  );
}

export default Footer;
