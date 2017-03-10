(function() {
    var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SUN'];

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    Date.prototype.getMonthName = function() {
        return months[this.getMonth()];
    };
    Date.prototype.getDayName = function() {
        return days[this.getDay()];
    };
})();

var new_reservation;
var details_reservation;
var add_reservation;
var Application = function() {
    "use strict";
    new_reservation = $('a#new-reservation');
    details_reservation = $('a#details-reservation');
    add_reservation = $('a#add-reservation');

    var showButton = function(button) {
        button.stop().show().animate({ opacity: 1 }, 200);
    };
    var hideButton = function(button, speed) {
        if (speed === 'undefined')
            speed = 200;
        button.stop().animate({ opacity: 0 }, speed, function() { $(this).hide(); });
    };

    return {
        bindRealTimeClock: function() {
            refreshTime();
            setInterval(refreshTime, 500);
        },




        bindDateSelector: function () {
          //  debugger;
            $('input[type=date]').each(function () {
              //  debugger;
                $(this).after('<span>'+parseDate($(this).val())+'</span>');
                $(this).change(function(){
                    $(this).next('span').text(parseDate($(this).val()));
                });
            });
            $('input[type=datetime-local]').each(function () {
                debugger;
                if ($(this).val())
                    $(this).addClass('selected');
                $(this).after('<span>'+parseDateTime($(this).val())+'</span>');
                $(this).change(function(){
                    var text = parseDateTime($(this).val());
                    $(this).next('span').html(text);
                    $(this).removeClass('selected');
                    if (text.length > 0)
                        $(this).addClass('selected');
                });
            });
        },


        bindOnBlurIvent: function() {
            $('.navigation-bar + form input').blur(function() {
                if ($(this).val().length > 0)
                    $(this).addClass('active');
                else
                    $(this).removeClass('active');
            });
        },

        bindViewPassengerDetails: function() {
            //$('.passenger a').not('.check').each(function() {
            //    $(this).click(function() {
            //        return showModal(fillPassengerInfo, this);
            //    });
            //});
        },

        bindHamburgerButton: function() {
            //$('.hamburger').off('.click').click(function() {
            //    $('#reservation-details-view').addClass('active');
            //    $('body').addClass('inactive');

            //    $('#reservation-details-view .close').off('.click').click(function() {
            //        $('#reservation-details-view').removeClass('active');
            //      $('body').removeClass('inactive');
            //    });
            //});
        },

        bindScrollFunctions: function() {
            if (new_reservation.length > 0) {
                $(document).scroll(function() {

                    if ($(window).scrollTop() > 0) {
                        $('.navigation-bar').addClass('short');
                    } else {
                        $('.navigation-bar').removeClass('short');
                    }
                    if ($(window).scrollTop() > 89) {
                        $('h1').addClass('top');
                        $('h1').css('top', '');
                    } else {
                        $('h1').css('top', 176 - $(window).scrollTop());
                        $('h1').removeClass('top');
                    }
                });
                //$(document).scroll(function () {

                //    if ($(window).scrollTop() > 0) {
                //        $('.navigation-bar').addClass('short');
                //    } else {
                //        $('.navigation-bar').removeClass('short');
                //    }
                //    if ($(window).scrollTop() > 89) {
                //        $('h1').addClass('fixed');
                //    } else {
                //        $('h1').removeClass('fixed');
                //    }
                //});
                $('a#search').off('click').click(function() {
                    $('.navigation-bar + form input[type=search]').first().focus().click();
                    $('body').animate({ scrollTop: 0 }, 200);
                });
            }
        },

        bindFormWizardFlightOptions: function() {
         //   debugger;
            $('.form-wizard form input[type=radio]').off('click').click(function() {
                if ($(this).hasClass('special')) {
                    $('input#alternative-flight').off('keyup').keyup(function() {
                        if ($(this).val().trim().length > 0)
                            $(this).closest('form').find('.buttons').show().find('button').removeAttr('disabled');
                        else
                            $(this).closest('form').find('.buttons').hide();
                    });
                    if ($('input#alternative-flight').val().trim().length === 0)
                        $(this).closest('form').find('.buttons').hide();
                    $(this).closest('form').find('h1').addClass('hidden');

                    if (!$('#animation').hasClass('active')) {
                       // debugger;
                        Application.startFirstAnimation();
                    }

                    $('#animation').addClass('active');

                } else {
                    //$('input#alternative-flight').removeClass('visible');
                    $(this).closest('form').find('.buttons').show().find('button').removeAttr('disabled');
                    $(this).closest('form').find('h1').removeClass('hidden');

                    if ($('#animation').hasClass('active')) {
                       // debugger;
                        Application.startSecondAnimation();
                    }
                    $('#animation').removeClass('active');
                }

                $('.form-wizard form input[type=radio]').removeClass('opacity').not($(this)).addClass('opacity');
            });
        },

        bindFormWizardPreference: function() {
            $('input.hotel').closest('form').find('.buttons').show();
            $('input.hotel, input.home').click(function() {
                $(this).closest('form').submit();
            });
        },

        bindFormWizardAccomodationDropDown: function() {
            $('.select').each(function() {

                $(this).closest('form').find('.buttons').show();

                $(this).next().off('change').change(function() {
                    var val = $(this).val();
                    $(this).prev().addClass('selected').find('span').text(val);
                    $(this).closest('form').find('h1').addClass('hidden');
                    $('a.select-hotel').removeClass('disabled selected').find('span').text('');
                    $('.check-in-out').hide().find('input').val('').change();
                });
            });
        },

        bindFormWizardAccomodation: function () {
            $('.select').each(function() {

                $(this).closest('form').find('.buttons').show();

                $(this).next().off('change').change(function() {
                    var val = $(this).val();
                    $(this).prev().addClass('selected').find('span').text(val);
                    $(this).closest('form').find('h1').addClass('hidden');
                    $('a.select-hotel').removeClass('disabled selected').find('span').text('');
                    $('.check-in-out').hide().find('input').val('').change();
                });
            });

            $('a.select-hotel').off('click').click(function() {
                if ($(this).hasClass('disabled'))
                    return false;

                var selector = $(this);

                var list = $('<div/>', { class: 'select-hotel-list' });
                list.append(preloader);

                var form = $(this).closest('form');
                var form_el = form.children().not('.buttons');
                form_el.hide();
                form.after(list);

                form.find('a.back').off('click').click(function() {
                    form_el.show();
                    list.remove();
                    $(this).off('click');
                    return false;
                });

                form.delay(1).show(0, function() {

                    $.ajax({
                        url: 'api/CRM/GetHotels',
                        method: 'GET', // in production mode it's better to use POST
                        contentType: 'json',
                        cache: false,
                        success: function(data) {
                            var hotel = $('<div/>');
                            var city = $('<span/>');
                            var rooms_title = $('<div/>', { class: 'right', text: 'Rooms Left' });
                            var rooms_left = $('<span/>');
                          //  debugger;
                            $.each(data.model, function(index, item) {
                                var one_hotel =
                                    hotel.clone().text(item.Name).append(
                                        city.clone().text(item.City),
                                        rooms_title.clone().append(
                                            rooms_left.clone().text(item.RoomsLeft)
                                        )
                                    ).data({ 'Id': item.Id, 'Name': item.Name, 'City': item.City });

                                one_hotel.click(function() {
                                    form_el.show();
                                    selector.addClass('selected').find('span').text($(this).data().Name + ', ' + $(this).data().City);
                                    selector.next().val($(this).data().Id);
                                    list.remove();
                                    form.find('a.back').off('click');
                                    $('.check-in-out').show();
                                });

                                list.append(one_hotel);
                            });
                            //data.forEach(function (item) {
                            //    var one_hotel =
                            //        hotel.clone().text(item.Name).append(
                            //            city.clone().text(item.City),
                            //            rooms_title.clone().append(
                            //                RoomsLeft.clone().text(item.RoomsLeft)
                            //            )
                            //        ).data({ 'Id': item.Id, 'Name': item.Name, 'City': item.City });

                            //    one_hotel.click(function () {
                            //        form_el.show();
                            //        selector.addClass('selected').find('span').text($(this).data().Name + ', ' + $(this).data().City);
                            //        selector.next().val($(this).data().Id);
                            //        list.remove();
                            //        form.find('a.back').off('click');
                            //        $('.check-in-out').show();
                            //    });

                            //    list.append(one_hotel);
                            //});
                        },
                        error: function() {
                            showModal(fillErrorPage);
                        }
                    });

                });

            });

            //$('input[type=datetime-local]').change(function() {
            //    var is_next = true;
            //    $('input[type=datetime-local]').each(function() {
            //        if (!$(this).val())
            //            is_next = false;
            //    });
            //    if (is_next)
            //        $(this).closest('form').find('.buttons').show().find('button').removeAttr('disabled');
            //    else
            //        $(this).closest('form').find('.buttons').show().find('button').attr('disabled', '');
            //});
        }
    };

}();


Application.initCalendarsPicker = function () {
    debugger;
    obj = $('body');

    obj.find('input[type=date]').each(function () {
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))) {
            debugger;
            $(this).datetimepicker({
                autoclose: true,
                //startView: startView,
                minView: 'month',
                format: 'yyyy-mm-dd',
                pickerPosition: 'bottom-left',
                todayHighlight: true
            });
        }
    });
    obj.find('input[type=datetime-local]').each(function () {
       // debugger;
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))) {
            $(this).datetimepicker({
                autoclose: true,
                format: 'yyyy-mm-ddThh:ii',
                pickerPosition: 'bottom-left',
                todayHighlight: true
            });
        }
    });
};

//Application.bindDateSelector(); // update Date Selection Input
Application.bindRealTimeClock(); // realtime clock
Application.bindOnBlurIvent(); // onBlur event in the special input
Application.bindViewPassengerDetails(); // view passenger details in modal window
//Application.bindHamburgerButton(); // hamburger button clicked in Flight Options View
Application.bindScrollFunctions(); // scroll functions 

//Application.bindFormWizardFlightOptions();
//Application.bindFormWizardPreference();
//Application.bindFormWizardAccomodation();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////                  FUNCTIONS                //////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function parseDate(str) {
    if (str) {
        var date = Date.parse(str);
        date = new Date(date);

        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear().toString().substring(2);
    }
    return '';
}
/*  UPDATED 08.02.2017  */
function parseDateTime(str) {
    if (str) {
        var date = Date.parse(str);
        var date = new Date(date);

        var pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

        return date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear().toString().substring(2)
			+ '<span>|</span>' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes());

    }
    return '';
}

/**
 * Function to update Realtime clock in the header
 * 
 */
function refreshTime() {

    if (new Date().toISOString().slice(0, 16) === $('body').data('time')) {
        $('body').data('second', !$('body').data('second'));

        if ($('body').data('second')) {
            $('#realtime span').addClass('hidden');
        } else {
            $('#realtime span').removeClass('hidden');
        }

        return;
    }
    $('#realtime').html(time());
}

/**
 * Function to convert DateTime to US format string
 * @returns {String}
 */
function time() {
    var now = new Date();
    if ($('body').data('second') === 'undefined') {
        $('body').data('second', true);
        $('body').data('time', now.toISOString().slice(0, 16));
    }

    var pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    };
    var now = new Date();
    var str = now.getDayName() + ' ' + now.getMonthName() + ' ' + now.getDate() + ', ' + now.getFullYear() + '&nbsp;&nbsp;|&nbsp;&nbsp;';
    var h = now.getHours();

    str += pad(h % 12 || 12) + '<span>:</span>';
    str += pad(now.getMinutes()) + ' ';
    str += (h < 12 ? 'AM' : 'PM');

    $('body').data('time', now.toISOString().slice(0, 16));
    return str;
}

/**
 * Show modal Window function
 * callback - function, that will be called after modal window will be shown
 * param - JQuery or JS Object with wich callback function will be called
 * @param {function} callback
 * @param {$ or Object} param
 * @returns false
 */
function showModal(callback, param) {

    //var modal = $('<div/>', { class: 'modal-window' });
    //var close = $('<a/>', { class: 'close' });
    //close.click(function() {
    //    hideModal();
    //});

    //modal.prepend(close);

    //$('body').addClass('modal-shown').append(modal);
    //bodyBodyScrollON();
    //modal.animate({ opacity: 1 }, 300);

    //try {
    //    callback($(param));
    //} catch (e) {}

    //return false;
}
/**
 * Hide Modal Window Function
 * 
 */
function hideModal() {
    //$('body').removeClass('modal-shown');
    //bodyBodyScrollOFF();
    //$('.modal-window').animate({ opacity: 0 }, 300, function() {
    //    $(this).remove();
    //});
}

/**
 * Function, that fill modal window with error
 * @param {$} obj
 */
function fillErrorPage(obj) {
    var href = obj ? obj.attr('href') : '1_2_Error_or_Failed_Page.html';
    if (!href)
        href = '1_2_Error_or_Failed_Page.html';

    $.ajax({
        method: 'GET', // in production mode it's better to use POST
        url: href,
        success: function(data) {
            $('.modal-window').addClass('error').append(data);
            $('.modal-window a.continue').click(function() {
                hideModal();
            });
        }
    });
}

/**
 * Function, that fill Modal Window with Passenger Information
 * @param {$} obj
 */
function fillPassengerInfo(obj) {
    $.ajax({
        method: 'GET', // in production mode it's better to use POST
        url: obj.attr('href'),
        success: function(data) {
            $('.modal-window').append(data);
        },
        error: function() {
            fillErrorPage(null);
        }
    });
}

/**
 * Unbind Body Scroll on touch devices
 * 
 */
function bodyBodyScrollON() {
    $(document).bind(
        'touchmove',
        function(e) {
            e.preventDefault();
        }
    );
}
/**
 * Bind Body Scroll on touch devices
 * 
 */
function bodyBodyScrollOFF() {
    $(document).unbind(
        'touchmove'
    );
}



var preloader =
    '<div class="preloader">' +
    /*'<svg version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'+
  'viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">'+
 '<path fill="#3c528f" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3'+
  'c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">'+
      '<animateTransform '+
         'attributeName="transform" '+
         'attributeType="XML" '+
         'type="rotate"'+
         'dur="2s" '+
         'from="0 50 50"'+
         'to="360 50 50" '+
         'repeatCount="indefinite" />'+
  '</path>'+
 '<path fill="#00003b" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7'+
  'c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">'+
      '<animateTransform '+
         'attributeName="transform" '+
         'attributeType="XML" '+
         'type="rotate"'+
         'dur="1s" '+
         'from="0 50 50"'+
         'to="-360 50 50" '+
         'repeatCount="indefinite" />'+
  '</path>'+
 '<path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5'+
  'L82,35.7z">'+
      '<animateTransform '+
         'attributeName="transform" '+
         'attributeType="XML" '+
         'type="rotate"'+
         'dur="2s" '+
         'from="0 50 50"'+
         'to="360 50 50" '+
         'repeatCount="indefinite" />'+
  '</path>'+
'</svg>' +*/



    /*'<svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'+
      'viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">'+
    '<circle fill="none" stroke="#fff" stroke-width="4" cx="50" cy="50" r="44" style="opacity:0.5;"/>'+
      '<circle fill="#fff" stroke="#e74c3c" stroke-width="3" cx="8" cy="54" r="6" >'+
        '<animateTransform'+
          'attributeName="transform"'+
          'dur="2s"'+
          'type="rotate"'+
          'from="0 50 48"'+
          'to="360 50 52"'+
          'repeatCount="indefinite" />'+
      '</circle>'+
    '</svg>' +*/

    '<svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">' +
    '<circle fill="none" stroke="#fff" stroke-width="4" cx="50" cy="50" r="44" style="opacity:0.5;"></circle>' +
    '<circle fill="#fff" stroke="#3c528f" stroke-width="3" cx="8" cy="54" r="6" transform="rotate(205.524 50 50.2836)">' +
    '<animateTransform attributeName="transform" dur="2s" type="rotate" from="0 50 48" to="360 50 52" repeatCount="indefinite"></animateTransform>' +
    '</circle>' +
    '</svg>' +

    '</div>';