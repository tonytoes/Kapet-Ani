document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    
    if(firstName === "" || lastName === "") {
        alert("Please fill in your details!");
    } else {
        alert("Profile updated for " + firstName + " " + lastName);
    }
});