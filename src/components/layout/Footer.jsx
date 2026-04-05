import "../../styles/footer.css";
import logo from "../../assets/images/logo_brown_transparent.png";

function Footer() {
  return (
    <div className="wrapper">
      <div className="kf-footer">
      <div className="kf-brand">
        <div className="kf-logo">
         <img src={logo} alt="KapetPamana Logo" />
          <span className="kf-logo-text">Kape't Pamana</span>
        </div>

        <p className="kf-desc">
         Brewing heritage in every cup. Digitizing tradition for the modern world.
        </p>

        <div className="kf-contact">
          <p>Address: </p>
          <p>Phone : </p>
          <p>Email: kapetpamana@gmail.com</p>
        </div>

        <div className="kf-socials">
          <a href="#" className="kf-social-btn" aria-label="X">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.852L2.25 2.25h6.988l4.265 5.638 4.741-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="#555"/>
            </svg>
          </a>
          <a href="#" className="kf-social-btn" aria-label="Dribbble">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <circle cx={12} cy={12} r={10} stroke="#555" strokeWidth="1.8"/>
              <path d="M2 12c3-2 6-3 10-2.5S18 14 22 12" stroke="#555" strokeWidth="1.5"/>
              <path d="M6.5 5.5C8 9 9 13 9 18" stroke="#555" strokeWidth="1.5"/>
              <path d="M17.5 5.5C16 9 15 13 15 18" stroke="#555" strokeWidth="1.5"/>
            </svg>
          </a>
          <a href="#" className="kf-social-btn" aria-label="Behance">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <path d="M2 7h5.5C9.4 7 11 8 11 10s-1.5 3-3 3H2V7z" stroke="#555" strokeWidth="1.6"/>
              <path d="M2 13h6c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H2v-6z" stroke="#555" strokeWidth="1.6"/>
              <path d="M15 10h7M15.5 13.5c0-2.5 1.8-4 3.5-4s3.5 1.5 3.5 4H15.5zm0 0c0 2.5 1.8 4 3.5 4a3.5 3.5 0 0 0 3-1.5" stroke="#555" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </a>
          <a href="#" className="kf-social-btn" aria-label="Instagram">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <rect x={2} y={2} width={20} height={20} rx={5} stroke="#555" strokeWidth="1.8"/>
              <circle cx={12} cy={12} r="4.5" stroke="#555" strokeWidth="1.6"/>
              <circle cx="17.5" cy="6.5" r={1} fill="#555"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="kf-col">
        <h4 className="kf-col-title">About Us</h4>
        <ul className="kf-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Your Account</a></li>
          <li><a href="#">Term &amp; Condition</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>

      <div className="kf-col">
        <h4 className="kf-col-title">Categories</h4>
        <ul className="kf-links">
          <li><a href="#">Custom Service</a></li>
          <li><a href="#">F.A.Q.'s</a></li>
          <li><a href="#">Ordering Tracking</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Blogs</a></li>
        </ul>
      </div>

      <div className="kf-col">
        <h4 className="kf-col-title">Let Us Help You</h4>
        <ul className="kf-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Custom Service</a></li>
          <li><a href="#">Term &amp; Condition</a></li>
        </ul>
      </div>
      </div>
    </div>
    
  );
}

export default Footer;