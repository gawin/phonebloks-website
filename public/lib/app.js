var stripeResponseHandler = function(status, response) {
  if (response.error) {

    $('#donation-stripe .stripe-errors').text(response.error.message);
    $('#processDonation').prop('disabled', false);
    if(response.error.message == "This card number looks invalid"){
      $("form[name='stripe'] #number").focus();
    }
    if(response.error.message == "Your card's expiration month is invalid."){
      $("form[name='stripe'] #month").focus();
    }
    if(response.error.message == "Your card's security code is invalid."){
      $("form[name='stripe'] #cvc").focus();
    }

    showDialog("Credit Card Error", response.error.message, "Ok", "#donate");
  } else {
    var token = response.id;
    $('#donation').append($('<input type="hidden" name="token" />').val(token));
    $("#processDonation").prop('disabled', true);

    // Donation post form
    var $form = $('#donation'),
      url = $form.attr("action"),
      posting = $.post(url, $form.serialize());
   
    // Returning result
    posting.done(function(data) {
      if (data.localeCompare("Successfully received your donation.")){
        $('#stripeForm').hide();
        $("form[name='donation'] .result").html(data);
        showDialog("Awesome!", "Successfully received your donation.", "Ok", "#donate");
      } else {
        $("form[name='donation'] .result").html(data);
        
        $("#processDonation").prop('disabled', false);
      }
    });
  }
};

function processStripe(){
  $('#processDonation').prop('disabled', true);
  var $form = $('#donation-stripe');
  Stripe.card.createToken($form, stripeResponseHandler);  
}

function processPaypal(){
  $('#processDonation').prop('disabled', true);

  // Donation post form
  var $form = $('#donation'),
    url = $form.attr("action"),
    posting = $.post(url, $form.serialize());
 
  // Returning result
  posting.done(function(data) {
    if (data.localeCompare("Successfully received your donation.")){
      $('form[name="paypal"]').get(0).submit();
    } else{
      $("form[name='donation'] .result").html(data);  
      $("#processDonation").prop('disabled', false);
    }
  });
}

function processDonation(){
  event.preventDefault();
  if ($("#donationForm input[name='provider']").attr("value") == "paypal"){
    processPaypal();
  } else{
    processStripe();
  }
}

function chooseStripe(){
  location.hash = "#creditcard";
  $('#chooseStripe').addClass("btn-inverted");
  $('#choosePaypal').removeClass("btn-inverted");
  $('#paypalForm').hide();
  $('#stripeForm').show();
  $('#donationForm').show();
  $("#donationForm input[name='provider']").attr("value", "stripe");
  $("#processDonation").prop('disabled', false);
  $("form[name='donation'] .result").empty();
  $("form[name='stripe'] #name").focus();
}

function choosePaypal(){
  location.hash = "#paypal";
  $('#choosePaypal').addClass("btn-inverted");
  $('#chooseStripe').removeClass("btn-inverted");
  $('#stripeForm').hide();
  $('#paypalForm').show();
  $('#donationForm').show();
  $("#donationForm input[name='provider']").attr("value", "paypal");
  $("#processDonation").prop('disabled', false);
  $("form[name='donation'] .result").empty();
  $("form[name='donation'] #no").focus();
}

function showDialog(title, content, buttonText, buttonUrl){
  $('.dialog').empty();
  $('.dialog').append('<h2>'+title+'</h2>');
  $('.dialog').append(content);
  $('.dialog').append('<p class="cta"><a href="'+buttonUrl+'" class="btn btn-inverted" role="button">' + buttonText + '</a></p>');
  $('#overlay').show();
  $('.page').addClass('blur');
  $('.cta').click(function(){
    hideDialog();
  });
  event.preventDefault();
}

function hideDialog(){
  $('.page').removeClass('blur');
  $('#overlay').hide();
  event.preventDefault();
}

function checkNavbarFixed(){
  if (!$('#navbar').hasClass('navbar-fixed-top') && $(window).scrollTop() >= 30 && $(window).width() > 750) {
    addNavbarFixed();
  } else if ($('#navbar').hasClass('navbar-fixed-top') && $(window).scrollTop() < 30 && $(window).width() > 750){
    removeNavbarFixed();
  } else if ($('#navbar').hasClass('navbar-fixed-top') && $(window).width() < 750){
    removeNavbarFixed();
  }
}

function invertedButton(button){
  if(button != "google"){
    $("#google").removeClass("btn-inverted");
    $("#google").addClass("btn-default");
  } else {
    $("#google").removeClass("btn-default");
    $("#google").addClass("btn-inverted");
  }
  if(button != "sennheiser"){
    $("#sennheiser").removeClass("btn-inverted");
    $("#sennheiser").addClass("btn-default");
  } else {
    $("#sennheiser").removeClass("btn-default");
    $("#sennheiser").addClass("btn-inverted");
  }
}

function shakeElement(element) {
   var l = 20;  
   for( var i = 0; i < 10; i++ )   
     $( element ).animate( { 'margin-left': "+=" + ( l = -l ) + 'px' }, 50);
 }

function addNavbarFixed(){
  $('body').addClass('body-fixed-top');
  $('#navbar').addClass('navbar-fixed-top');
  $('#navbar').removeClass('navbar-nofixed-top');
}

function removeNavbarFixed(){
  $('body').removeClass('body-fixed-top');
  $('#navbar').removeClass('navbar-fixed-top');
  $('#navbar').addClass('navbar-nofixed-top');
}

$(window).scroll(function () {
  checkNavbarFixed();
});

$(window).resize(function () {
  checkNavbarFixed();
});

$(document).ready(function() {
  checkNavbarFixed();

  // Video 1 link
  $("#video1").click(function() {
    $("#video-holder").html('<iframe class="video-full" width="100%" height="464" src="//www.youtube.com/embed/oDAw7vW7H0c?modestbranding=1;autohide=1&amp;showinfo=0&amp;controls=1&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
    event.preventDefault();
  });      
  
  // --- Mailing ---
  $("form[name='mailing']").submit(function(event) {
    event.preventDefault();
    $("form[name='mailing'] input[type='submit']").prop('disabled', true);
    $("form[name='mailing'] .result").html("");

    // Mailing validate email
    if(!$("form[name='mailing'] input[name='email']").val()){
      $("form[name='mailing'] .result").html("Please enter your email address.");
      $("form[name='mailing'] input[type='submit']").prop('disabled', false);
      $("form[name='mailing'] .form-group").addClass("has-error");
      shakeElement("#newsletterform");
      return $("form[name='mailing'] input[name='email']").focus();
    }

    // Mailing post form
    var $form = $( this ),
      email = $form.find("input[name='email']").val(),
      url = $form.attr("action"),
      posting = $.post(url, $form.serialize());
   
    // Returning result
    posting.done(function(data) {
      if (data.match("^Success")) {
        $("form[name='mailing'] .form-group").removeClass("has-error");
        $("form[name='mailing'] #inputEmail").val('');
        showDialog("Succes!", data, "Ok", "#");
      } else {
        $("form[name='mailing'] .form-group").addClass("has-error");
        shakeElement("form[name='mailing']");
      }
      $("form[name='mailing'] .result").html(data);
      $("form[name='mailing'] input[type='submit']").prop('disabled', false);
    });
  });

  // Partner page buttons
  $( ".google" ).click(function() {
    if($("#sennheiser-more").css("display") == "block"){ $("#sennheiser-more").slideUp(600, function() {}); }
    if($("#google-more").css("display") == "none"){
      invertedButton("google");
      $("#google-more").slideDown(600, function() {});
    } else {
      invertedButton("");
      $("#google-more").slideUp(600, function() {});
    }
    event.preventDefault();
  });

  $(".sennheiser").click(function() {
    if($("#google-more").css("display") == "block"){ $("#google-more").slideUp(600, function() {}); }  
    if($("#sennheiser-more").css("display") == "none"){
      invertedButton("sennheiser");
      $("#sennheiser-more").slideDown(600, function() {});
    } else {
      invertedButton("");
      $("#sennheiser-more").slideUp(600, function() {});
    }
    event.preventDefault();
  });

  // Donation button listeners
  $('#chooseStripe').click(function(){
    chooseStripe();
  });
  $('#choosePaypal').click(function(){
    choosePaypal();
  });
  $('#donation-stripe').submit(function(event) {
    processDonation();
  });
  $('#processDonation').click(function(event){
    processDonation();
  });

  // Detect location hash
  if (location.hash == "#creditcard"){
    chooseStripe();
  } else if (location.hash == "#paypal"){
    choosePaypal();
  }

  // Shuffle friends
  var parent = $("#friends");
  var divs = parent.children();
  while (divs.length) {
    parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
  }

  // === Stripe === //
  if (window.location.hostname == 'phonebloks.com') {
    // Stripe public key for live
    Stripe.setPublishableKey('pk_live_R4oZ8adFeUL2FK2fxFA5Nist');
  } else {
    // Stripe public key for testing
    Stripe.setPublishableKey('pk_test_D1F0zrW2EZtTZIorJAntaPIz');
    console.log('Stripe in test mode.');
  }

});
