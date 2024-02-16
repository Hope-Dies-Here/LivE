$(document).ready(() => {
  
  //create function to role letters
    const roleTexts = id => {
      
        let t, letters, count;
        
        t = jQuery.trim($(id).text());
        //letters = "abcdefghijklmnopqrstuvwxyz ";
        letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
        count = 0;
        
        const interval = setInterval(() => {
          
            let val = t
                .split("")
                .map((letter, index) => {
                  
                    if (index < count) {
                      
                        return t[index];
                        
                    }
                    
                    return letters[Math.floor(Math.random() * 26)];
                    
                })
                .join("");
                
            $(id).text(val);
            
            if (count >= $(id).data("value").length) clearInterval(interval);
            
            count = count + 1 / 2;
            
        }, 35);
        
    };
    
    roleTexts("#page-title");
    
    //forglot password alert
    $(".forglot-pass").click(e => {
      
        e.preventDefault();
        alert("Ask me when we meet in person");
        
    });
    
    //home page logged in scroll words
    if ($("#praise").text() != "") {
      
        setInterval(() => {
          
            roleTexts("#praise");
            
        }, 4000);
        
    }
    
});