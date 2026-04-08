
import 'styles/user.css';

function User() {
return (
  <main className="profile-container">
  <aside className="glass-card sidebar">
    <div className="profile-pic">
      <img src="userprofile.jpg" alt="Profile" />
    </div>
    <h3>Welcome Back</h3>
    <ul className="side-links">
      <li>
        <i className="ri-edit-box-line" /> Edit Profile
      </li>
      <li>
        <i className="ri-user-line" /> My Account
      </li>
      <li>
        <i className="ri-shopping-cart-line" /> Order History
      </li>
      <li>
        <i className="ri-logout-box-r-line" /> Logout
      </li>
    </ul>
  </aside>
  <section className="glass-card profile-form">
    <h2>My Profile</h2>
    <p>Manage and protect your account</p>
    <form id="profileForm">
      <div className="input-group">
        <label>First Name</label>
        <input type="text" id="firstName" placeholder="First Name" />
      </div>
      <div className="input-group">
        <label>Last Name</label>
        <input type="text" id="lastName" placeholder="Last Name" />
      </div>
      <div className="input-group">
        <label>Email</label>
        <input type="email" id="email" placeholder="Email" />
      </div>
      <button type="submit" className="save-btn">
        Save changes
      </button>
    </form>
  </section>
</main>

);
}