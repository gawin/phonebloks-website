// Stripe public key
Stripe.setPublishableKey('pk_live_R4oZ8adFeUL2FK2fxFA5Nist');

var stripeResponseHandler = function(status, response) {
  if (response.error) {

    $('#donation-stripe .stripe-errors').text(response.error.message);
    $('#processDonation').prop('disabled', false);
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
        // showDialog("Awesome!", "Successfully received your donation.", "Ok", "#donate");
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
  $('#paypalForm').hide();
  $('#stripeForm').show();
  $('#donationForm').show();
  $("#donationForm input[name='provider']").attr("value", "stripe");
  $("#processDonation").prop('disabled', false);
  $("form[name='donation'] .result").empty();
}

function choosePaypal(){
  $('#stripeForm').hide();
  $('#paypalForm').show();
  $('#donationForm').show();
  $("#donationForm input[name='provider']").attr("value", "paypal");
  $("#processDonation").prop('disabled', false);
  $("form[name='donation'] .result").empty();
}

function hideLanguageMenu(){
  $('.language ul').removeClass('show');
  $('.language ul li').hide();
  $('.language ul li.active').show();
  $('.language ul li.active a').click(function(obj) {
    obj.preventDefault();
    showLanguageMenu(this);
    return false;
  });
}

function showLanguageMenu(caller){
  $('.language ul').addClass('show');
  $('.language ul li').show(0, function() {
    window.scrollTo(0,document.body.scrollHeight);
  });
  $('.language ul li a').click(function(obj) {
    obj.preventDefault();
    $(caller).parent().removeClass('active');
    $(obj.target).parent().addClass('active');
    document.location = $(obj.target).attr("href");
  });
  return false;
}

function showDialog(title, content, buttonText, buttonUrl){
  $('.dialog h2').html(title);
  $('.dialog p').html(content);
  $('.dialog a').html(buttonText);
  $('.dialog a').attr('href', buttonUrl);
  $('.overlay').show();
  $('.page').addClass('blur');
  $('.overlay').click(function(){
    hideDialog();
  });
}

function hideDialog(){
  $('.page').removeClass('blur');
  $('.overlay').hide();
}


$(document).ready(function() {

  // Language menu
  hideLanguageMenu();

  $(document).keyup(function(e) {
    // Escape
    if (e.keyCode == 27) {
      hideDialog();
    }
  });

  // --- Mailing ---
  $("form[name='mailing']").submit(function(event) {
    event.preventDefault();
    $("form[name='mailing'] input[type='submit']").prop('disabled', true);
    $("form[name='mailing'] .result").html("");

    // Mailing validate passion 
    if(!$("form[name='mailing'] select[name='passion']").val()){
      $("form[name='mailing'] .result").html("Please select a passion first.");
      $("form[name='mailing'] input[type='submit']").prop('disabled', false);
      return $("form[name='mailing'] select[name='passion']").focus();
    }

    // Mailing validate email
    if(!$("form[name='mailing'] input[name='email']").val()){
      $("form[name='mailing'] .result").html("Please enter your email address.");
      $("form[name='mailing'] input[type='submit']").prop('disabled', false);
      return $("form[name='mailing'] input[name='email']").focus();
    }

    // Mailing post form
    var $form = $( this ),
      passion = $form.find("input[name='passion']").val(),
      email = $form.find("input[name='email']").val(),
      url = $form.attr("action"),
      posting = $.post(url, $form.serialize());
   
    // Returning result
    posting.done(function(data) {
      if (data.match("^Success")) {
        showDialog("Succes!", data, "Ok", "#");
      }
      $("form[name='mailing'] .result").html(data);
      $("form[name='mailing'] input[type='submit']").prop('disabled', false);
    });
  });

  // Set Header to fixed position on scroll
  var $marginStickyTop = 0;
  var $broadcastDiv = $('.broadcast');
  if ( $broadcastDiv.length){
    $broadcastDiv.scrollToFixed();
    $marginStickyTop = $broadcastDiv.height();
    // $('.language').css('margin-top', $broadcastDiv.height() + 'px');
  }
  $('.header').scrollToFixed({marginTop: $marginStickyTop});

  // Donation button listeners
  $('#chooseStripe').click(function(){chooseStripe()});
  $('#choosePaypal').click(function(){choosePaypal()});
  $('#donation-stripe').submit(function(event) {processDonation()});
  $('#processDonation').click(function(event){processDonation()});

});
