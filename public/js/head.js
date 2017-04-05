"use strict";
$(document).ready(function() {
    var signState;
    var signupModal = new Custombox.modal({
        content: {
            effect: 'fadein',
            target: '#signupModal'
        }
    });
    var signinModal = new Custombox.modal({
        content: {
            effect: 'fadein',
            target: '#signinModal'
        }
    });

    function validateName(ele, isExist) {
        /*
        $.post('/validateName', { name: ele.value }, function(data) {
            if (data.isExist && isExist) {
                ele.parent.append('<p>帳號已存在</p>');
            } else if (!data.isExist && !isExist) {
                ele.parent.append('<p>帳號不存在</p>');
            }
        });
        */
        $.ajax({
            type: 'POST',
            data: JSON.stringify({ name: ele.value }),
            contentType: 'application/json',
            url: '/validateName',
            success: function(data) {
                if (data.isExist && signState === 'signup') {
                    $(ele).addClass('warn');
                    $(ele).after('<p class="warn-info">帳號已存在</p>')
                } else if (!data.isExist && signState === 'signin') {
                    $(ele).addClass('warn');
                    $(ele).after('<p class="warn-info">帳號不存在</p>')
                } else {
                    $('#signName').removeClass('warn');
                    $('.warn-info').remove();
                    $('#submitBtn').prop('disabled', false);
                }
            }
        });
    }
    $('#signupBtn').click(function() {
        signState = 'signup';
        $('#signModal').removeClass('fade');
        $('#mask').show();
        $('#modal-title').text('註冊');
        $('#signForm').attr('action', '/user/signup');
    });
    $('#signinBtn').click(function() {
        signState = 'signin';
        $('#signModal').removeClass('fade');
        $('#mask').show();
        $('#modal-title').html('登入');
        $('#signForm').attr('action', '/user/signin');
    });
    $('#signClose').click(function() {
        $('#signModal').addClass('fade');
        $('#signName').removeClass('warn');
        $('.warn-info').remove();
        $('#mask').hide();
        $('#submitBtn').prop('disabled', true);
    });

    $('#signName').change(function(e) {
        validateName(e.target);
    });


});