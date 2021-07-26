//side bar
const toggleSideBar=()=>{

    if($(".sidebar").is(":visible")) {
        //true
        //band karna hai
        $(".sidebar").css("display", "none");
        $(".content").css("margin-left", "0%");
    }else{
        //false
        //show karna hai
        $(".sidebar").css("display", "block");
        $(".content").css("margin-left", "20%")
    }
};


//search
const search=()=>{
//   console.log("searching......");
  let query = $("#search-input").val();

  if(query == ""){
     //do nothing
     $(".search-result").hide();
  }else{
      //search
      console.log(query);

      //sending request to server
      let url = `http://localhost:8080/search/${query}`;

      fetch(url).then((Response)=>{
         return Response.json();
      }).then((data)=>{
          //data...
          console.log(data);

          let text = `<div class="list-group">`;

            data.forEach(contact => {
                text += `<a href="/user/${contact.cid}/contact" class="list-group-item list-group-action"> ${contact.name}</a>`
            });

          text += `</div>`;

          $(".search-result").html(text);
          $(".search-result").show();
      });


      $(".search-result").show();
  }
};

//Payment gateway code

//first request to server to create order

const paymentStart=()=>{
  console.log("payment started..");
  let amount = $("#payment_field").val();
  console.log(amount);
  if(amount == '' || amount == null){
    //   alert("amount is required");
      swal("Failed !!", "Amount is required !!", "error");
      return;
  }

  //we will use ajax to send request to server to create order, jquery-ajax

  $.ajax(
      {
          url : '/user/create_order',
          data : JSON.stringify({amount : amount,info:'order_request'}),
          contentType : 'application/json',
          type : 'POST',
          dataType : 'json',
          success : function(response){
              //invoked when success
              console.log(response);
             
               if(response.status == "created"){
	             //open payment form
                
	             var options={
                     "key":"rzp_test_nUbENGJXdFIX45",
                     "amount":"response.amount",
                     "currency":"INR",
                     "name":"Smart Contact Manager",
                     "description":"Donation",
                     "image":"/image/logo2.jpg",
                     "order_id":response.id,                   
                     "handler":function(response){
                         console.log(response.razorpay_payment_id);
                         console.log(response.razorpay_order_id);
                         console.log(response.razorpay_signature);
                         console.log("payment successfull !!");
                        //  alert("Congrats !! Payment Successfull")
                         swal("Good job!", "Congrats Payment Successfull !!", "success");
                     },
                     "prefill":{
                         "name" : "",
                         "email" : "",
                         "contact" : ""
                     },
                     "notes":{
                         "address": "A Ansari"
                     },
                     "theme":{
                         color:"#3399cc"
                     }

	             };

                 let rzp = new Razorpay(options);

                 rzp.on('payment.failed', function (response){
                    console.log(response.error.code);
                    console.log(response.error.description);
                    console.log(response.error.source);
                    console.log(response.error.step);
                    console.log(response.error.reason);
                    console.log(response.error.metadata.order_id);
                    console.log(response.error.metadata.payment_id);
                    // alert("Oops payment failed");
                    swal("Failed!", "Oops payment failed", "error");
                 });
                 rzp.open();
               }
          },
          error : function(error){
              //invoked when error
              alert("something went wrong !!");
          }
      }
  )

};