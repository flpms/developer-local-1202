var AppConfig = {
    userName: '',
    token: '',
};

var Authentication = {
    createAccount: {
        status: {},
        show: function() {
            $('body').addClass('js-isRegister');

            $('.js-btn-back, .js-btn-createAccount, .form-register').removeClass('hide');

            this.events();
        },
        hide: function() {
            $('body').removeClass('js-isRegister');
            $('.js-btn-createAccount, .form-register, .js-btn-back').removeClass('show');

            $('.js-btn-createAccount, .form-register, .js-btn-back').addClass('hide');
        },
        events:function() {
            $('.js-btn-back').click(function(evt) {

                evt.preventDefault();
                evt.stopPropagation();

                Authentication.createAccount.hide();
                Authentication.login.show();
            });

            $('.form-register input').focusout(Authentication.createAccount.validation);

            $('.js-btn-createAccount').click(Authentication.createAccount.sendData);
        },
        validation: function() {
            var i, valid, input;

            input = this;
            value = input.value

            valid = value !== '' ? true : false;

            var invalidField = function(result) {
                Authentication.createAccount.status.invalidField = input;
                if (!result) {
                    $(input).addClass('error');
                } else {
                    $(input).removeClass('error');
                }
            };

            switch (input.id) {
                case 'username':
                    valid = valid === true && value.length > 3 ? true : false;
                    valid = (valid === true && /[a-z\-]/gi.test(value)) ? true : false;

                    $.getJSON('http://localhost:3000/api/auth/user/' + value).done(function(result) {

                        if (result.name) {
                            invalidField(false);
                        }
                    });

                    break;
                case 'email':
                    valid = valid === true && 
                        /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g.test(value) ?
                        true : false;
                    break;
                case 'confirmationEmail':
                    valid = valid === true && $('#email')[0].value === value ? true : false;
                    break;
                case 'confirmationPassword':
                    valid = valid === true && $('#password')[0].value === value ? true : false;
                    break;
            }

            invalidField(valid);
        },
        sendData: function() {

            var i, jsonToSend, jsonSerialization, result;

            var inputs = $('.form-register input');

            jsonSerialization = function() {
                var i, input, obj = {};

                for (i = 0; i < inputs.length; i++) {
                    input = inputs[i];
                    
                    if (input.value !== '') {
                        obj[input.id] = input.value;
                    } else {
                        $(input).addClass('error');
                        obj = undefined;
                        break;
                    }

                }

                delete obj.confirmationEmail;
                delete obj.confirmationPassword;

                return obj;
            };

            jsonToSend = jsonSerialization();
            
            result = $.ajax({
                type: 'post',
                url: 'http://localhost:3000/api/auth/user/',
                data: JSON.stringify(jsonToSend),
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8'
            });

            result.done(function(result) {

                console.log(result);

                AppConfig.user = result.name;
                AppConfig.token = result.token;

            }).fail(function(result) {
                console.log(result);

                alert('I\'ve a bad feeling about this. \n Sorry, try again.');
            });
        },
        
    },
    login: {
        show: function() {

            $('.login').modal('show');
            $('body').addClass('js-isLogin');
            $('.form-login, .js-createAccount').addClass('show');

            this.events();
        },
        hide: function() {

            $('body').removeClass('js-isLogin');
            $('.js-createAccount, .form-login').removeClass('show');
            $('.js-createAccount, .form-login').addClass('hide');
        },
        events: function() {
            $('.js-createAccount').click(function(evt) {

                evt.preventDefault();
                evt.stopPropagation();

                Authentication.login.hide();
                Authentication.createAccount.show();
            });
        }
    }
}

var App = {
    auth: Authentication,
    init: function() {
        var self = this;

        $(document).ready(function() {
            if (AppConfig.userName === '') {
                self.auth.login.show();
            }
        });
    }
}

App.init();