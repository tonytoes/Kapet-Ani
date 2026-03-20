const stars = document.querySelectorAll(".fa-solid.fa-star");

stars.forEach((star, index1)=>{
    
    star.addEventListener("click",() => {
        console.log(index1);
        
        stars.forEach((star, index2)=>{
            rating.value = index1 + 1;
            index1 >= index2 ? star.classList.add("active") :  
                               star.classList.remove("active");
        });

    });

});