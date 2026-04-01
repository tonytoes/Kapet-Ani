import "../../styles/newsletter.css";

function Newsletter() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    alert("Thanks for subscribing with: " + input.value);
    input.value = "";
  };
 
  return (
    <>
      {/* Newsletter Banner */}
      <div className="newsletter-banner">
        <svg
          className="nl-icon"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x={6} y={14} width={44} height={30} rx={2}  stroke= "rgb(151, 80, 48)" strokeWidth="2.2" fill="none" />
          <polyline points="6,14 28,32 50,14" stroke= "rgb(151, 80, 48)" strokeWidth="2.2" fill="none" />
          <line x1={6} y1={44} x2={20} y2={30} stroke= "rgb(151, 80, 48)" strokeWidth={2} />
          <line x1={50} y1={44} x2={36} y2={30} stroke= "rgb(151, 80, 48)" strokeWidth={2} />
          <line x1={20} y1={20} x2={36} y2={20} stroke= "rgb(151, 80, 48)" strokeWidth="1.5" />
          <line x1={20} y1={25} x2={36} y2={25} stroke= "rgb(151, 80, 48)" strokeWidth="1.5" />
        </svg>
 
        <div className="nl-headline">
          Join Now And Get 10% Off
          <br />
          Your Next Purchase!
        </div>
 
        <div className="nl-divider" />
 
        <div className="nl-subtext">
          Subscribe to the weekly newsletter for all the latest updates
        </div>
 
        <form className="nl-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter your email..." required />
          <button type="submit">Submit</button>
        </form>
      </div>
 
     
    </>
  );
}
 
export default Newsletter;
 