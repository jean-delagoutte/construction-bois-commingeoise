(function ($) {
    $(function () {
        var lang = null, forms = [], baseUrl = "";
        $.initJSNForm = function (formname) {
            var self = this;
            if ($(formname).width() <= 480) {
                $(formname).addClass("jsn-narrow");
            }
            $(".form-captcha").hide();

            function calculateTotal() {
                var number =  0,
                    checkboxes = 0,
                    dropdown = 0,
                    list =  0,
                    choices = 0,
                    moneyPayment = 0;

                var numberElements = $(formname).find("input.number"),
                    numberDecimal =$(formname).find("input.number-decimal");
                numberElements.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            if ($(this).val() == '') {
                                if (numberDecimal) {
                                    number += parseFloat(0 + '.' + numberDecimal.val());
                                }
                                else {
                                    number += 0;
                                }
                            }
                            else {
                                if (numberDecimal) {
                                    number += parseFloat($(this).val() + '.' + numberDecimal.val());
                                }
                                else {
                                    number += parseFloat($(this).val());
                                }
                            }
                        }
                    }
                });

                var currencyElement = $(formname).find("input.input-medium.currency");
                var currency = 0 ;
                currencyElement.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            if ($(this).val() == '') {
                                currency += 0;
                            }
                            else {
                                currency += parseFloat($(this).val());
                            }
                        }
                    }
                });

                var currencyCent = $(formname).find(".currency-cents input.input-mini.currency");
                var cents = 0;
                currencyCent.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            if ($(this).val() == '') {
                                cents += 0;
                            }
                            else {
                                cents += parseFloat($(this).val());
                            }
                        }
                    }
                });
                if(cents >= 100)
                {
                    var hundred = (cents / 100), hundredUnit =  (100 * hundred);
                    cents = parseFloat(hundred + '.' + (cents - hundredUnit));
                }
                else
                {
                    cents = parseFloat(0 + '.' + cents);
                }
                moneyPayment = parseFloat(currency + cents);

                var checkboxesElements = $(formname).find("div.checkboxes");
                checkboxesElements.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            $(this).find("input:checked").each(function () {
                                if ($(this).prop('checked')) {
                                    checkboxes += parseFloat($(this).attr('data-jsnUfPrice') * $(this).attr('data-jsnUfQty'));
                                }
                            });
                        }
                    }
                });
                var dropdownElements = $(formname).find("select.dropdown");
                if ($(".jsn-uf-select2-dropdown").length > 0) {
                    $(".jsn-uf-select2-dropdown").select2();
                }
                dropdownElements.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            if (typeof $(this).find('option:selected').attr('data-jsnUfPrice') != 'undefined') {
                                if ($(this).find('option:selected').attr('data-jsnUfPrice') == '') {
                                    dropdown += 0;
                                }
                                else {
                                    dropdown += parseFloat($(this).find('option:selected').attr('data-jsnUfPrice') * $(this).find('option:selected').attr('data-jsnUfQty'));
                                }
                            }
                        }
                    }
                });
                var choicesElements = $(formname).find("div.choices");
                choicesElements.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            $(this).find('input:checked').each(function () {
                                choices += parseFloat($(this).attr('data-jsnUfPrice') * $(this).attr('data-jsnUfQty'));
                            });
                        }
                        else {
                            choices += 0;
                        }
                    }
                });
                var listElements = $(formname).find("select.list");
                listElements.each(function(){
                    if(! $(this).closest('.control-group').hasClass('hide')) {
                        if ($(this).hasClass('payment-active')) {
                            $(this).find('option:selected').each(function () {
                                list += parseFloat($(this).attr('data-jsnUfPrice') * $(this).attr('data-jsnUfQty'));
                            });
                        }
                    }
                });
                var total = [ number, moneyPayment, choices, checkboxes, dropdown, list  ].reduce(function(previousValue, currentValue, index, array) {
                    return previousValue + currentValue;
                });

                $(formname).find(".form-payments .total-money").text(total.toFixed(2));
                $(formname).find(".form-payments .payment-total-money input#jform_form_payment_money_value").val(total.toFixed(2));
            }

            function formActionField()
            {
                var id =[];
                var fieldId = [];
                $(formname).find('.control-group').each(function(){
                    if($(this).hasClass('hide'))
                    {
                    }
                    else
                    {
                        fieldId  = $(this).attr('data-id');
                        fieldId = parseFloat(fieldId);
                    }
                    if($.isNumeric(fieldId))
                    {
                        id.push(fieldId);
                    }

                });
                var val = $.toJSON(id);
                $(formname).find('input#list_choosen_field').val(val.toString())
            }

            if ($('.jsn-uniform .icon-question-sign').length) {
                $('.jsn-uniform .icon-question-sign').tipsy({
                    gravity:'w',
                    fade:true
                });
            }
            $(formname).find('input,button.btn,textarea,select').focus(function () {
                var form = $(this).parents('form:first');
                $(form).find(".ui-state-highlight").removeClass("ui-state-highlight");
                $(this).parents(".control-group").addClass("ui-state-highlight");
                self.captcha(form);
            }).click(function (e) {
                    var form = $(this).parents('form:first');
                    $(form).find(".ui-state-highlight").removeClass("ui-state-highlight");
                    $(this).parents(".control-group").addClass("ui-state-highlight");
                    e.stopPropagation();
                });
            $(formname).find("input").keypress(function (e) {
                if (e.which == 13 && $(".jsn-modal-overlay").size() < 1) {
                    if ($(formname).find("button.next").hasClass("hide")) {
                        $(formname).find("button.jsn-form-submit").click();
                    } else {
                        $(formname).find("button.next").click();
                    }
                    return false;
                }
            });
            $(formname).find(" .form-actions .jsn-form-submit").click(function () {
				$('.jsn-uniform-others').each(function (){
					$(this).find('.jsn-value-Others').each(function(){
						$(this).removeAttr('disabled');
					})
				})
                $(formname).submit();
                return false;
            });
            $(document).click(function () {
                $(".ui-state-highlight").removeClass("ui-state-highlight");
            });
            var formDefaultCaptcha = $('.form-captcha')[0];
            if ($(formDefaultCaptcha).size()) {
                $($(formDefaultCaptcha).parents('form:first').find("input,textarea,select")[0]).focus();
            }
            var randomizeListGroups = $(formname).find('select.list');
            randomizeListGroups.each(function () {
                if ($(this).hasClass("list-randomize")){
                    self.randomValueItems(this);
                }
            });
            var randomizeDropdownGroups = $(formname).find('select.dropdown');
            randomizeDropdownGroups.each(function () {
                var selfDropdown = this;
                if ($(this).hasClass("dropdown-randomize")) {
                    self.randomValueItems(this);
                    $(this).find("option").each(function () {
                        if ($(this).attr("data-selectdefault") == "true") {
                            $(this).prop("selected", true);
                        }
                    });
                }
                $(this).change(function () {
                    if ($(this).val() == "Others" || $(this).val() == "others") {
                        $(selfDropdown).parent().find("textarea.jsn-dropdown-Others").removeClass("hide");
                    }else{
                        $(selfDropdown).parent().find("textarea.jsn-dropdown-Others").addClass("hide");
                    }
                });
            });
            var randomizeChoiceGroups = $(formname).find('div.choices');
            randomizeChoiceGroups.each(function () {
                var selfChoices = this;
                if ($(this).hasClass("choices-randomize")) {
                    self.randomValueItems(this);
                }
                $(this).find("input[type=radio]").click(function () {
                    if ($(this).val() == "Others" || $(this).val() == "others") {
                        $(selfChoices).find("textarea.jsn-value-Others").removeAttr("disabled");
                    } else {
                        $(selfChoices).find("textarea.jsn-value-Others").attr("disabled", "true");
                    }
                });
            });
            var randomizeCheckboxGroups = $(formname).find('div.checkboxes');
            randomizeCheckboxGroups.each(function () {
                var selfChexbox = this;
                if ($(this).hasClass("checkbox-randomize")) {
                    self.randomValueItems(this);
                }
                $(this).find(".lbl-allowOther input[type=checkbox]").click(function () {
                    if ($(this).is(':checked')) {
                        $(selfChexbox).find("textarea.jsn-value-Others").removeAttr("disabled");
                    } else {
                        $(selfChexbox).find("textarea.jsn-value-Others").attr("disabled", "true");
                    }
                });
            });
            $(formname).find("input.number,input.phone,input.currency").each(function () {
                $(this).keypress(function (e) {
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        return false;
                    }
                });
				$(this).attr('onpaste','return false');
            });

            $(formname).find("input.number").change(calculateTotal);
            $(formname).find("input.currency").change(calculateTotal);
            $(formname).find("select.dropdown").change(calculateTotal);
            $(formname).find("select.list").change(calculateTotal);
            $(formname).find("div.checkboxes").change(calculateTotal);
            $(formname).find("div.choices").change(calculateTotal);

            $(formname).find("input.number").trigger("change");
            $(formname).find("div.choices .jsn-column-item input").change(function () {

                if ($(this).is(':checked')) {
                    var idField = $(this).parents(".jsn-columns-container").attr("id");
                    $(formname).find("div.control-group." + idField).removeAttr("style");
                    self.getActionField(formname, $(this), idField);
                }
                formActionField();
            }).trigger("change");
            $(formname).find("div.checkboxes .jsn-column-item input").change(function () {


                var idField = $(this).parents(".jsn-columns-container").attr("id");
                var litmiChoises = $(this).parents(".jsn-columns-container").attr('data-limit')
                var checkboxesInput = $(formname).find("div.checkboxes#"+idField+ " .jsn-column-item input");
                var countChecked = $(formname).find("div.checkboxes#"+idField+ " .jsn-column-item input:checked");
                if (litmiChoises > 0)
                {
                    if (countChecked.length >= litmiChoises)
                    {
                        $(checkboxesInput).attr("disabled", "disabled");
                        $(countChecked).removeAttr("disabled");
                    }
                    else
                    {
                        $(checkboxesInput).removeAttr("disabled");
                    }
                }
                $(formname).find("div.control-group." + idField).removeAttr("style");
                $(this).parents(".jsn-columns-container").find("input").each(function () {

                    if ($(this).is(':checked')) {
                        self.getActionFieldCheckboxes(formname, $(this), idField);
                    }
                });
                formActionField();
            }).trigger("change");
            $(formname).find("select.dropdown").change(function () {
                var idField = $(this).attr("id");
                $(formname).find("div.control-group." + idField).removeAttr("style");
                self.getActionField(formname, $(this), idField);
                formActionField();
            }).trigger("change");

            $(formname).find("input.limit-required,textarea.limit-required").each( function(){
                var fieldId = $(this).attr('id');
                var settings = $(this).attr('data-limit');
                var limitSettings = $.evalJSON(settings);
                if (limitSettings.limitType == 'Characters')
                {
                    var newClass = 'characters_' + fieldId;
                    $(this).addClass('characters');
                    $(this).after(
                        $("<div/>", {"class": "characters-limit", "id":"characters-limit_"+fieldId}).append(
                            $("<div/>", {"class": "pull-right"}).append(
                                $("<span/>", {"class":newClass, "style":"font-weight:bold; color:#bbb"})
                            )
                        )
                    )
                }
                else
                {
                    var newClass = 'words_' + fieldId;
                    $(this).addClass('words');
                    $(this).after(
                        $("<div/>", {"class": "words-limit", "id":"words-limit_"+fieldId}).append(
                            $("<div/>", {"class": "pull-right"}).append(
                                $("<span/>", {"class":newClass, "style":"font-weight:bold; color:#bbb"})
                            )
                        )
                    )
                }
            });

            $(formname).find("input.limit-required,textarea.limit-required").each(function () {
                var settings = $(this).attr("data-limit");
                var limitSettings = $.evalJSON(settings);
                if (limitSettings) {
                    $(this).keypress(function (e) {
                            if (e.which != 27 && e.which != 13 && e.which != 8) {
                                if (limitSettings.limitType == "Characters") {
                                    var maxLength = parseInt(limitSettings.limitMax, 10);
                                    var lengthValue = $(this).val().length;
                                    var charLeft = maxLength - lengthValue;
                                    if(charLeft >= 0)
                                    {
                                    	var msg = charLeft + ' ' + lang['JSN_UNIFORM_CHARACTERS_LEFT'];
                                        var id = $(this).attr('id');
                                        $('.characters_' + id).text(msg);
                                    }
                                    else
                                    {
                                        return false;
                                    }
                                }
                                if (limitSettings.limitType == "Words") {
                                    var maxLength = parseInt(limitSettings.limitMax, 10);
                                    var lengthValue = $.trim($(this).val() + String.fromCharCode(e.which)).split(/[\s]+/);
                                    var charLeft = maxLength - lengthValue.length;
                                    if(charLeft >= 0)
                                    {
                                    	var msg = charLeft + ' ' +lang['JSN_UNIFORM_WORDS_LEFT'];
                                        var id = $(this).attr('id');
                                        $('.words_' + id).text(msg);
                                    }
                                    else
                                    {
                                        return false;
                                    }
                                }
                            }
                        }
                    );
                }
            });
            $(formname).find("input,textarea").bind('change', function () {
                self.checkValidateForm($(this).parents(".control-group"), "detailInput", $(this), "onchange");
            });
            $(formname).submit(function () {
                if( $(formname).find('.control-group').hasClass('useField') &&  $(formname).find('.control-group').hasClass('hide'))
                {
                    $(formname).find('.control-group').removeClass('hide');
                }
                formActionField();
				var $selectHide = $('.jsn-row-container.row-fluid').find(".control-group");
				$selectHide.each(function () {
					if($(this).css("display") === "none"){
                        var dropdown = $(this).find(".dropdown-required");
                        if(dropdown.length != '1')
                        {
                            $(this).find('select').each(function(){
                                $(this).attr('disabled', 'disabled');
                            })
                        }
					}
				})
                if($(formname).find('input[name$=use_payment_gateway]').val() == '0'){
                    $(".jsn-modal-overlay,.jsn-modal-indicator").remove();
                }
                $(this).find(".help-block").remove();
                var selfsubmit = this;
                if (self.checkValidateForm($(this))) {
                    $("body").append($("<div/>", {
                        "class":"jsn-modal-overlay",
                        "style":"z-index: 1000; display: inline;"
                    })).append($("<div/>", {
                        "class":"jsn-modal-indicator",
                        "style":"display:block"
                    })).addClass("jsn-loading-page");
                    $("#jsn-form-target").remove();
                    $(selfsubmit).find('.message-uniform').html("");
                    var iframe = $('<iframe/>', {
                        name:'jsn-form-target',
                        id:'jsn-form-target'
                    });
                    iframe.appendTo($('body'));
                    iframe.css({
                        display:'none'
                    });
                    var publickey = $(this).find(".form-captcha").attr("data-jnsUfpublickey");
                    iframe.load(function () {
                        var message = iframe.contents().find("input[name$=message]").val();
                        var error = iframe.contents().find("input[name$=error]").val();
                        var redirect = iframe.contents().find("input[name$=redirect]").val();
                        var use_payment_gateway =  $(formname).find('input[name$=use_payment_gateway]').val();
                        if (redirect && use_payment_gateway != '1') {
                            window.location = redirect;
                        } else if (error) {
                            error = $.evalJSON(error);
                            self.callMessageError(formname, error);
                            $(".jsn-modal-overlay,.jsn-modal-indicator").remove();
                        } else if (message && use_payment_gateway != '1') {
                            $.ajax({
                                type:"GET",
                                async:true,
                                encoding:"UTF-8",
                                scriptCharset:"utf-8",
                                cache:false,
                                contentType:"text/plain; charset=UTF-8",
                                url:baseUrl + "/index.php?option=com_uniform&view=form&task=form.getHtmlForm&tmpl=component&form_id=" + $(selfsubmit).find("input[name=form_id]").val(),
                                success:function (htmlForm) {
                                    $(selfsubmit).find(".jsn-row-container").empty();
                                    $(selfsubmit).find(".jsn-row-container").html(htmlForm);
                                    if (message) {
                                        $(selfsubmit).find('.message-uniform').html(
                                            $("<div/>", {
                                                "class":"success-uniform alert alert-success clearfix"
                                            }).append(
                                                $("<button/>", {
                                                    "class":"close",
                                                    "onclick":"return false;",
                                                    "data-dismiss":"alert",
                                                    text:"x"
                                                })).append(message));
                                    }
                                    self.initJSNForm(formname);
                                    var messagesFocus = $(formname).find(".message-uniform")[0];
                                    $(window).scrollTop($(messagesFocus).offset().top - 50);
                                    $(".jsn-modal-overlay,.jsn-modal-indicator").remove();
                                }
                            });

                        } else {
							if (use_payment_gateway != '1')
							{
								$.ajax({
									type:"GET",
									async:true,
									cache:false,
									encoding:"UTF-8",
									scriptCharset:"utf-8",
									contentType:"text/plain; charset=UTF-8",
									url:baseUrl + "/index.php?option=com_uniform&view=form&task=form.getHtmlForm&tmpl=component&form_id=" + $(selfsubmit).find("input[name=form_id]").val(),
									success:function (htmlForm) {
										$(selfsubmit).find(".jsn-row-container").empty();
										$(selfsubmit).find(".jsn-row-container").html(htmlForm);
										self.initJSNForm(formname);
										var messagesFocus = $(formname).find(".message-uniform")[0];
										$(window).scrollTop($(messagesFocus).offset().top - 50);

										if($(formname).find('input[name$=use_payment_gateway]').val() == '0')
										{
											$(".jsn-modal-overlay,.jsn-modal-indicator").remove();
										}
										//$(".jsn-modal-overlay,.jsn-modal-indicator").remove();
									}
								});
							}
                        }
                        var idcaptcha;
                        var idcaptcha2;
                        idcaptcha = $(selfsubmit).find(".form-captcha").attr("id");
                        idcaptcha2 = $(selfsubmit).find(".g-recaptcha").attr("id");
                        if (idcaptcha) {
                            Recaptcha.destroy();
                            Recaptcha.create(publickey, idcaptcha, {
                                theme:'white',
                                tabindex:0,
                                callback:function () {
                                    $(selfsubmit).find(".form-captcha").removeClass("error");
                                    $(selfsubmit).find(".form-captcha #recaptcha_area").addClass("controls");
                                    $(selfsubmit).find("#recaptcha_response_field").keypress(function (e) {
                                        if (e.which == 13) {
                                            if ($(formname).find("button.next").hasClass("hide")) {
                                                $(formname).find("button.jsn-form-submit").click();
                                            } else {
                                                $(formname).find("button.next").click();
                                            }
                                            return false;
                                        }
                                    });
                                    if (error) {

                                        if (error.captcha) {
                                            $(selfsubmit).find(".form-captcha").addClass("error");
                                            $(selfsubmit).find(".form-captcha #recaptcha_area").append(
                                                $("<span/>", {
                                                    "class":"help-block"
                                                }).append(
                                                    $("<span/>", {
                                                        "class":"validation-result label label-important",
                                                        text:error.captcha
                                                    })));
                                            $(selfsubmit).find("#recaptcha_response_field").focus();
                                        }
                                    }
                                }
                            });
                        }
                        if(idcaptcha2)
                        {
                            //grecaptcha.reset()
                            try {
                                if(grecaptcha.getResponse() == ''){
                                    $(selfsubmit).find(".g-recaptcha").addClass("error");
                                    $(selfsubmit).find(".g-recaptcha").append(
                                        $("<span/>", {
                                            "class":"help-block"
                                        }).append(
                                            $("<span/>", {
                                                "class":"validation-result label label-important",
                                                text:error.captcha
                                            })));
                                }
                            }
                            catch(err) {

                            }

                        }
                    });

                    //if($(formname).find('input[name$=use_payment_gateway]').val() != '1'){
                        $(this).attr('target', 'jsn-form-target');
                    //}

                } else {
                    return false;
                }

            });
            $(formname).find("input.jsn-daterangepicker").each(function () {
                var dateSettings = $.evalJSON($(this).attr("data-jsnUf-date-settings"));
                if (dateSettings) {
                    var yearRangeList = [];
                    if (dateSettings.yearRangeMin && dateSettings.yearRangeMax) {
                        yearRangeList.push(dateSettings.yearRangeMin);
                        yearRangeList.push(dateSettings.yearRangeMax);
                    } else if (dateSettings.yearRangeMin) {
                        yearRangeList.push(dateSettings.yearRangeMin);
                        yearRangeList.push((new Date).getFullYear());
                    } else if (dateSettings.yearRangeMax) {
                        yearRangeList.push(dateSettings.yearRangeMax);
                        yearRangeList.push((new Date).getFullYear());
                    }
                    var yearRange = "1930:+0";
                    if (yearRangeList.length) {
                        yearRange = yearRangeList.join(":");
                    }
                    var dateOptionFormat = "";
                    if (dateSettings.dateOptionFormat == "custom") {
                        dateOptionFormat = dateSettings.customFormatDate;
                    } else {
                        dateOptionFormat = dateSettings.dateOptionFormat;
                    }
                    if (dateSettings.dateFormat == "1" && dateSettings.timeFormat == "1") {
                        $(this).datetimepicker({
                            changeMonth:true,
                            changeYear:true,
                            showOn:"button",
                            yearRange:yearRange,
                            dateFormat:dateOptionFormat,
                            timeFormat:dateSettings.timeOptionFormat,
                            timeText:"",
                            hourText:lang['JSN_UNIFORM_DATE_HOUR_TEXT'],
                            minuteText:lang['JSN_UNIFORM_DATE_MINUTE_TEXT'],
                            closeText:lang['JSN_UNIFORM_DATE_CLOSE_TEXT'],
                            prevText:lang['JSN_UNIFORM_DATE_PREV_TEXT'],
                            nextText:lang['JSN_UNIFORM_DATE_NEXT_TEXT'],
                            currentText:lang['JSN_UNIFORM_DATE_CURRENT_TEXT'],
                            monthNames:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER']],
                            monthNamesShort:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER_SHORT']],
                            dayNames:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY']],
                            dayNamesShort:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_SHORT']],
                            dayNamesMin:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_MIN']],
                            weekHeader:lang['JSN_UNIFORM_DATE_DAY_WEEK_HEADER']
                        });
                    } else if (dateSettings.dateFormat == "1") {
                        $(this).datepicker({
                            changeMonth:true,
                            changeYear:true,
                            showOn:"button",
                            yearRange:yearRange,
                            dateFormat:dateOptionFormat,
                            hourText:lang['JSN_UNIFORM_DATE_HOUR_TEXT'],
                            minuteText:lang['JSN_UNIFORM_DATE_MINUTE_TEXT'],
                            closeText:lang['JSN_UNIFORM_DATE_CLOSE_TEXT'],
                            prevText:lang['JSN_UNIFORM_DATE_PREV_TEXT'],
                            nextText:lang['JSN_UNIFORM_DATE_NEXT_TEXT'],
                            currentText:lang['JSN_UNIFORM_DATE_CURRENT_TEXT'],
                            monthNames:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER']],
                            monthNamesShort:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER_SHORT']],
                            dayNames:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY']],
                            dayNamesShort:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_SHORT']],
                            dayNamesMin:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_MIN']],
                            weekHeader:lang['JSN_UNIFORM_DATE_DAY_WEEK_HEADER']
                        });
                    } else if (dateSettings.timeFormat == "1") {
                        $(this).timepicker({
                            showOn:"button",
                            timeText:"",
                            timeFormat:dateSettings.timeOptionFormat,
                            hourText:lang['JSN_UNIFORM_DATE_HOUR_TEXT'],
                            minuteText:lang['JSN_UNIFORM_DATE_MINUTE_TEXT'],
                            closeText:lang['JSN_UNIFORM_DATE_CLOSE_TEXT'],
                            prevText:lang['JSN_UNIFORM_DATE_PREV_TEXT'],
                            nextText:lang['JSN_UNIFORM_DATE_NEXT_TEXT'],
                            currentText:lang['JSN_UNIFORM_DATE_CURRENT_TEXT'],
                            monthNames:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER']],
                            monthNamesShort:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER_SHORT']],
                            dayNames:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY']],
                            dayNamesShort:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_SHORT']],
                            dayNamesMin:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_MIN']],
                            weekHeader:lang['JSN_UNIFORM_DATE_DAY_WEEK_HEADER']
                        });
                    } else {
                        $(this).datepicker({
                            changeMonth:true,
                            changeYear:true,
                            yearRange:yearRange,
                            showOn:"button",
                            hourText:lang['JSN_UNIFORM_DATE_HOUR_TEXT'],
                            minuteText:lang['JSN_UNIFORM_DATE_MINUTE_TEXT'],
                            closeText:lang['JSN_UNIFORM_DATE_CLOSE_TEXT'],
                            prevText:lang['JSN_UNIFORM_DATE_PREV_TEXT'],
                            nextText:lang['JSN_UNIFORM_DATE_NEXT_TEXT'],
                            currentText:lang['JSN_UNIFORM_DATE_CURRENT_TEXT'],
                            monthNames:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER']],
                            monthNamesShort:[lang['JSN_UNIFORM_DATE_MONTH_JANUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_FEBRUARY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MARCH_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_APRIL_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_MAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JUNE_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_JULY_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_AUGUST_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_SEPTEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_OCTOBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_NOVEMBER_SHORT'],
                                lang['JSN_UNIFORM_DATE_MONTH_DECEMBER_SHORT']],
                            dayNames:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY']],
                            dayNamesShort:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_SHORT'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_SHORT']],
                            dayNamesMin:[lang['JSN_UNIFORM_DATE_DAY_SUNDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_MONDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_TUESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_WEDNESDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_THURSDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_FRIDAY_MIN'],
                                lang['JSN_UNIFORM_DATE_DAY_SATURDAY_MIN']],
                            weekHeader:lang['JSN_UNIFORM_DATE_DAY_WEEK_HEADER']
                        });
                    }
                    $("button.ui-datepicker-trigger").addClass("btn btn-icon").html($("<i/>", {
                        "class":"icon-calendar"
                    }));
                }
            });

            $(formname).find(".form-actions .prev").click(function () {
                $(formname).find('div.jsn-form-content').each(function (i) {
                    if (!$(this).is(':hidden')) {
// if (self.checkValidateForm($(this))) {
                        self.prevpaginationPage(formname);
// }
                        return false;
                    }
                });
            });
            $(formname).find(".form-actions .next").click(function () {

                $(formname).find('div.jsn-form-content').each(function (i) {
                    if (!$(this).is(':hidden')) {
                        if (self.checkValidateForm($(this))) {
                            self.nextpaginationPage(formname);
                        }
                        return false;
                    }
                });
            });
            $(formname).find(".form-actions .reset").click(function () {
                $(formname).trigger("reset");
                $(formname).find('.error').removeClass("error").find(".help-block").remove();
                $(formname).find('.jsn-form-content').addClass("hide");
                $(formname).find('.jsn-form-content').each(function (i, _formContent) {
                    if (i == 0) {
                        $(_formContent).removeClass("hide");
                    }
                });
                self.checkPage(formname);
            });
            this.defaultPage(formname);
            $('input, textarea').placeholder();
        };
        $.getActionField = function (formname, selfInput, idField) {
            var dataSettings = $(selfInput).parents(".control-group").attr("data-settings");
            if (dataSettings) {
                dataSettings = $.evalJSON(dataSettings);
            }
            if (dataSettings) {
                var classShowField = [];
                var classHideField = [];
                $.each(dataSettings, function (i, item) {
                    if ($(selfInput).val() == i) {
                        if (item.showField) {
                            $.each(item.showField, function (j, actionField) {
                                if (actionField) {
                                    classShowField.push(".control-group." + actionField);
                                }
                            });
                            $(formname).find(classShowField.join(",")).addClass(idField).show().removeClass('hide');
                        }
                        if (item.hideField) {
                            $.each(item.hideField, function (j, actionField) {
                                if (actionField) {
                                    classHideField.push("div.control-group." + actionField);
                                }
                            });
                            $(formname).find(classHideField.join(",")).addClass(idField).hide().addClass('hide');
                        }
                    }
                    else
                    {
                        if (item.showField) {
                            var classShow = [];
                            $.each(item.showField, function (j, actionField) {
                                if (actionField) {
                                    if( $.inArray(".control-group." + actionField, classShowField) == -1) {
                                        classShow.push(".control-group." + actionField);
                                    }
                                }
                            });
                            $(formname).find(classShow.join(",")).addClass(idField).hide().addClass('hide');
                        }
                        if (item.hideField) {
                            var classHide = [];
                            $.each(item.hideField, function (j, actionField) {
                                if (actionField) {
                                    if( $.inArray("div.control-group." + actionField, classHideField) == -1) {
                                        classHide.push("div.control-group." + actionField);
                                    }
                                }
                            });
                            $(formname).find(classHide.join(",")).addClass(idField).show().removeClass('hide');
                        }
                    }
                });
            }
        };

        $.getActionFieldCheckboxes = function (formname, selfInput, idField) {
            var dataSettings = $(selfInput).parents(".control-group").attr("data-settings");
            if (dataSettings) {
                dataSettings = $.evalJSON(dataSettings);
            }
            if (dataSettings) {
                var  classShowField = [];
                var  classHideField = [];
                $.each(dataSettings, function (i, item) {

                    if ($(selfInput).val() == i) {
                        if (item.showField) {
                            $.each(item.showField, function (j, actionField) {

                                if (actionField) {
                                    classShowField.push(".control-group." + actionField);
                                }
                            });
                            $(formname).find(classShowField.join(",")).addClass(idField).show().addClass('useField');
                        }
                        if (item.hideField) {
                            $.each(item.hideField, function (j, actionField) {
                                if (actionField) {
                                    classHideField.push("div.control-group." + actionField);
                                }
                            });
                            $(formname).find(classHideField.join(",")).addClass(idField).hide().removeClass('useField');
                        }
                    }
                });
            }
        };
        $.randomValueItems = function (_this) {
            var group = $(_this),
                choices = group.find('.jsn-column-item'),
                otherItem = choices.filter(function () {
                    return $('label.lbl-allowOther', this).size() > 0;
                }),
                randomItems = choices.not(otherItem);
            randomItems.detach();
            otherItem.detach();
            while (randomItems.length > 0) {
                var index = Math.floor(Math.random() * choices.length),
                    choice = randomItems[index];

                if (group.find(".lbl-allowOther").size()) {
                    group.find(".lbl-allowOther").before(choice);
                } else {
                    group.append(choice);
                }
                delete(randomItems[index]);
                var newList = [];
                $(randomItems).each(function (index, element) {
                    if (element !== undefined) {
                        newList.push(element);
                    }
                });
                randomItems = newList;
            }
            delete(randomItems[0]);
            if (group.find(".lbl-allowOther").size()) {
                group.find(".lbl-allowOther").before(otherItem);
            } else {
                group.append(otherItem);
            }
            return true;
        };
        $.captcha = function (form) {
            var self = this;
            var idcaptcha = "";
            var idcaptcha = form.find(".form-captcha").attr("id");
            var publickey = form.find(".form-captcha").attr("data-jnsUfpublickey");
            if (form.find(".form-captcha").length > 0 && form.find(".form-captcha").is(':hidden') && idcaptcha) {
                $(".form-captcha").hide();
                form.find(".form-captcha").show();
                Recaptcha.create(publickey, idcaptcha, {
                    theme:'white',
                    tabindex:0,
                    callback:function () {
                        $(form).find(".form-captcha").removeClass("error");
                        $(form).find(".form-captcha #recaptcha_area").addClass("controls");
                        $(form).find("#recaptcha_response_field").keypress(function (e) {
                            if (e.which == 13) {
                                if ($(form).find("button.next").hasClass("hide")) {
                                    $(form).find("button.jsn-form-submit").click();
                                } else {
                                    $(form).find("button.next").click();
                                }
                                return false;
                            }
                        });
                    }
                });
            }
        };
        $.callMessageError = function (formname, messageError) {
            var self = this;
            $.each(messageError, function (key, value) {
                if (key != "captcha") {
                    if (key == "name" || key == "address" || key == "date" || key == "phone" || key == "currency" || key == "password") {
                        $.each(value, function (i, item) {
                            $(formname).find("input[name=password\\[" + i + "\\]\\[\\]], input[name=currency\\[" + i + "\\]\\[value\\]], input[name=phone\\[" + i + "\\]\\[default\\]], input[name=phone\\[" + i + "\\]\\[one\\]], input[name=date\\[" + i + "\\]\\[date\\]],input[name=name\\[" + i + "\\]\\[first\\]],input[name=address\\[" + i + "\\]\\[street\\]]").parents(".control-group").addClass("error").find(".controls").append($("<span/>", {
                                "class":"help-block"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:item
                                })));
                        });
                    } else if (key != "max-upload") {
                        if (key == "captcha_2") {
                            $(formname).find("#jsn-captcha").parents(".control-group").addClass("error").find(".controls").append($("<span/>", {
                                "class":"help-block"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:value
                                })));
                        } else {
                            if ($(formname).find("#" + key).size()) {
                                $(formname).find("#" + key).parents(".control-group").addClass("error").find(".controls").append($("<span/>", {
                                    "class":"help-block"
                                }).append(
                                    $("<span/>", {
                                        "class":"validation-result label label-important",
                                        text:value
                                    })));
                            }
                        }
                    } else if (key == "max-upload") {
                        $(formname).find(".message-uniform").html($("<div/>", {
                            "class":"alert alert-error"
                        }).append(value));
                    }
                }
            });

            setTimeout(function () {
                var formError = $(formname).find('.error')[0];
                if ($(formError).parents('.jsn-form-content').attr("data-value")) {
                    $(formname).find('.jsn-form-content').addClass("hide");
                    $(formError).parents('.jsn-form-content').removeClass("hide");
                    self.checkPage(formname);
                } else {
                    var countPage = $(formname).find('div.jsn-form-content').length;
                    $(formname).find('div.jsn-form-content')[countPage - 1].removeClass("hide");
                    $(formname).find('input, button,textarea').focus();
                }
                if ($(formname).find(".error input,.error textarea,.error select").length) {
                    var fieldFocus = $(formname).find(".error")[0];
                    if ($(fieldFocus).find(".blank-required").size()) {
                        $(fieldFocus).find("input,select,textarea").each(function () {
                            var val = $(this).val();
                            var val2 = val.replace(' ', '');
                            if (val2 == '' || val2 == 0) {
                                $(window).scrollTop($(this).offset().top - 50);
                                $(this).click();
                                return false;
                            }
                        });
                    } else {
                        var fieldFocus = $(formname).find(".error input,.error textarea,.error select")[0];
                        $(window).scrollTop($(fieldFocus).offset().top - 50);
                        fieldFocus.click();
                    }
                }
            }, 800);
        };
        $.defaultPage = function (formname) {
            if (forms.length < 1) {
                this.captcha($(formname));
            }
            $($(formname).find('div.jsn-form-content')[0]).removeClass("hide");
            this.checkPage(formname);
            $(formname).find("#page-loading").addClass("hide");
            forms.push(formname);
        };
        $.checkPage = function (formname) {
            if($(formname).width()>0 && $(formname).size() >0 ){
                $(formname).find('div.jsn-form-content').each(function (i) {
                    if (!$(this).hasClass("hide")) {
                        if ($(this).next().attr("data-value")) {
                           $(formname).find(".form-actions .next").removeClass("hide");
                        } else {
                            $(formname).find(".form-actions .next").addClass("hide");
                        }
                        if ($(this).prev().attr("data-value")) {
                            $(formname).find(".form-actions .prev").removeClass("hide");
                        } else {
                            $(formname).find(".form-actions .prev").addClass("hide");
                        }
                        if (i + 1 == $(formname).find('div.jsn-form-content').length) {
                            $(formname).find(".form-actions .next").addClass("hide");
                            $(formname).find(".form-actions .jsn-form-submit").removeClass("hide");
                            $(formname).find(".form-actions .reset").removeClass("hide");

                        } else {
                            $(formname).find(".form-actions .next").removeClass("hide");
                            $(formname).find(".form-actions .jsn-form-submit").addClass("hide");
                            $(formname).find(".form-actions .reset").addClass("hide");
                        }
                        $(this).find(".content-google-maps").each(function () {
                            $(this).find('.google_maps').width($(this).attr("data-width"));
                            $(this).find('.google_maps').height($(this).attr("data-height"));
                            var dataValue = $(this).attr("data-value");
                            var dataMarker = $(this).attr("data-marker");
                            if (dataValue) {
                                var gmapOptions = $.evalJSON(dataValue);
                                if (dataMarker) {
                                    var gmapMarker = $.evalJSON(dataMarker);
                                }
                                if (!gmapOptions.center.nb && gmapOptions.center.lb) {
                                    gmapOptions.center.nb = gmapOptions.center.lb;
                                }
                                if (!gmapOptions.center.ob && gmapOptions.center.mb) {
                                    gmapOptions.center.ob = gmapOptions.center.mb;
                                }
                                $(this).find('.google_maps').gmap({'zoom':gmapOptions.zoom, 'mapTypeId':gmapOptions.mapTypeId, 'center':gmapOptions.center.nb + ',' + gmapOptions.center.ob, 'disableDefaultUI':false, 'callback':function (map) {
                                    var self = this;
                                    self.set('inforWindow', function (marker, val) {
                                        var descriptions = val.descriptions;
                                        var content = '<div class="thumbnail">';
                                        if (val.images) {
                                            content += '<img src="' + val.images + '">';
                                        }
                                        content += '<div class="caption">';
                                        if (val.title) {
                                            content += '<h4>' + val.title + '</h4>';
                                        }
                                        if (descriptions) {
                                            content += '<p>' + descriptions.replace(new RegExp('\n', 'g'), "<br/>") + '</p>';
                                        }
                                        if (val.link) {
                                            content += '<p><a target="_blank" href="' + val.link + '">more info</a></p>';
                                        }
                                        content += '</div></div>';
                                        self.openInfoWindow({ 'content':content}, marker);
                                    });
                                    self.get('map').setOptions({streetViewControl:false});
                                    if (gmapMarker) {
                                        $.each(gmapMarker, function (i, val) {
                                            var position = $.evalJSON(val.position);

                                            if (position) {
                                                if (!position.nb && position.lb) {
                                                    position.nb = position.lb;
                                                }
                                                if (!position.ob && position.mb) {
                                                    position.ob = position.mb;
                                                }
                                                self.addMarker({'position':position.nb + "," + position.ob, 'draggable':false, 'bounds':false},function (map, marker) {
                                                    if (val.open == "true") {
                                                        self.get('inforWindow')(marker, val);
                                                    }
                                                    if (val.title) {
                                                        marker.setTitle(val.title);
                                                    }
                                                }).xclick(function (event) {
                                                        self.get('inforWindow')(this, val);
                                                    })
                                            }
                                        });
                                    }
                                    setTimeout(function () {

                                        self.get('map').setCenter(self._latLng(gmapOptions.center.nb + ',' + gmapOptions.center.ob));
                                        self.get('map').setZoom(gmapOptions.zoom);
                                        self.get('map').setMapTypeId(gmapOptions.mapTypeId);
                                    }, 1000);
                                }});

                            }
                        });
                    }
                });
            }

        };
		$.actionPage = function(formname){
			var self = this;
			$(formname).find('div.jsn-form-content').each(function() {
				if (!$(this).hasClass("hide")) {
					$('html, body').animate({scrollTop: $(this).offset().top - 0}, 200);
					$(this).find('input').each(function() {
						$(this).first().focus();
						return false;
					});
					self.checkPage(formname);
				}
			});
		},
        $.nextpaginationPage = function (formname) {
            var self = this;
            $(formname).find('div.jsn-form-content').each(function () {
                if (!$(this).hasClass("hide")) {
                    $(this).addClass("hide");
                    $(this).next().removeClass("hide");
					return false;
                }
            });
			self.actionPage(formname);
        };
        $.prevpaginationPage = function (formname) {
            var self = this;
            $(formname).find('div.jsn-form-content').each(function () {
                if (!$(this).hasClass("hide")) {
                    $(this).addClass("hide");
                    $(this).prev().removeClass("hide");
                    return false;
                }
            });
			self.actionPage(formname);
        };
        $.checkValidateForm = function (_this, type, element, onchange) {
            var check = 0;
            var $inputBlank = $(_this).find(".blank-required");
            var self = this;
            $inputBlank.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    var checkBlank = true;
                    $(this).find(".help-blank").remove();
                    $(this).parent().removeClass("error");
                    $(this).find("input,select,textarea").each(function () {
                        var val = $(this).val();
                        var val2 = val.replace(' ', '');
                        if ($(this).attr("type") == "text") {
                            if (val2 == '') {
                                checkBlank = false;
                            }
                        } else {
                            if (val2 == '') {
                                checkBlank = false;
                            }
                        }
                    });
                    if (!checkBlank) {
                        $(this).parent().addClass("error");
                        $(this).append(
                            $("<span/>", {
                                "class":"help-block help-blank"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                })));
                        check++;
                    }
                }else{
                    $(this).removeClass('blank-required');
                    $(this).find("input,select,textarea").each(function () {
                        $(this).prop('disabled', true);
                   });
                }
            });
            var groupBlank = $(_this).find(".group-blank-required");
            groupBlank.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    var checkGroupBlank = false;
                    $(this).find(".help-blank").remove();
                    $(this).parent().removeClass("error");
                    $(this).find("input").each(function () {
                        var val = $(this).val();
                        var val2 = val.replace(' ', '');
                        if (val2 != '') {
                            checkGroupBlank = true;
                        }
                    });
                    if (!checkGroupBlank) {
                        $(this).parents(".control-group").addClass("error");
                        $(this).append(
                            $("<span/>", {
                                "class":"help-block help-blank"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                })));
                        check++;
                    }
                }
            });
            var $dropdown = $(_this).find(".dropdown-required");
            $dropdown.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    $(this).find(".help-dropdown").remove();
                    $(this).parent().removeClass("error");
                    if ($(this).find("select").val() == "") {
                        $(this).parent().addClass("error");
                        $(this).append(
                            $("<span/>", {
                                "class":"help-block help-dropdown"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                })))
                        check++;
                    } else if ($(this).find("select option:selected").hasClass('lbl-allowOther')) {
                        var selfRadio = this;

                        $(this).find(".jsn-dropdown-Others").focusout(function () {
                            var checkRadio = false;
                            var valchoices = $(selfRadio).find(".jsn-dropdown-Others").val();
                            var valchoices2 = valchoices.replace(' ', '');
                            if (valchoices2 == '') {
                                checkRadio = true;
                            }
                            if (checkRadio) {
                                $(selfRadio).find(".help-dropdown").remove();
                                $(selfRadio).parent().addClass("error");
                                $(selfRadio).append(
                                    $("<span/>", {
                                        "class":"help-block help-dropdown"
                                    }).append(
                                        $("<span/>", {
                                            "class":"validation-result label label-important",
                                            text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                        })))
                                check++;
                            }
                        });
                        if (type != "detailInput") {
                            $(this).find(".jsn-dropdown-Others").trigger("focusout");
                        }
                    }
                }
            });
            var $inputEmailNull = $(_this).find("input.email");
            $inputEmailNull.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    var parentEmail = $(this).parents(".control-group");
                    $(parentEmail).find(".help-email").remove();
                    $(parentEmail).removeClass("error");
                    var val = $(this).val();
                    var filter = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,6})$/;
                    if (!filter.test(val) && $(this).hasClass("email-required")) {
                        $(parentEmail).addClass("error");
                        $(this).parents(".controls").append(
                            $("<span/>", {
                                "class":"help-block help-email"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_INVALID']
                                })));
                        check++;
                    } else if (!$(this).hasClass("email-required") && val && !filter.test(val)) {
                        $(parentEmail).addClass("error");
                        $(this).parents(".controls").append(
                            $("<span/>", {
                                "class":"help-block help-email"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_INVALID']
                                })));
                        check++;
                    }
                    if (val && filter.test(val) && $(parentEmail).find(".jsn-email-confirm").hasClass("jsn-email-confirm") && ($(element).hasClass("jsn-email-confirm") || !$(parentEmail).hasClass("ui-state-highlight"))) {
                        if ($(parentEmail).find(".jsn-email-confirm").val() != $(this).val()) {
                            $(parentEmail).addClass("error");
                            $(this).parents(".controls").append(
                                $("<span/>", {
                                    "class":"help-block help-email"
                                }).append(
                                    $("<span/>", {
                                        "class":"validation-result label label-important",
                                        text:lang['JSN_UNIFORM_CONFIRM_FIELD_EMAIL_CONFIRM']
                                    })));
                            check++;
                        }
                    }
                }
            });
            var $inputWebsite = $(_this).find("input.website");
            $inputWebsite.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    $(this).parent().find(".help-website").remove();
                    $(this).parent().parent().removeClass("error");
                    var val = $(this).val();
                    var regexp = /^(https?:\/\/|ftp:\/\/|www([0-9]{0,9})?\.)?(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
                    if ((!regexp.test(val) && $(this).hasClass("website-required")) || (val != "" && val != "http://" && val != "https://" && !$(this).hasClass("website-required") && !regexp.test(val))) {
                        $(this).parent().parent().addClass("error");
                        $(this).after(
                            $("<span/>", {
                                "class":"help-block help-website"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_INVALID']
                                })));
                        check++;
                    }
                }
            });
            var $inputInteger = $(_this).find("input.integer-required");
            $inputInteger.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    $(this).parent().find(".help-integer").remove();
                    $(this).parent().parent().removeClass("error");
                    var val = $(this).val();
                    var regexp = /^[0-9]+$/;
                    if (!regexp.test(val)) {
                        $(this).parent().parent().addClass("error");
                        $(this).parent().append(
                            $("<span/>", {
                                "class":"help-block help-integer"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_INVALID']
                                })));
                        check++;
                    }
                }
            });
            if (onchange != "onchange") {
                var $valueLimitPassword = $(_this).find(".limit-password-required");
                $valueLimitPassword.each(function () {
                    if ($(this).parents(".control-group").css("display") != "none") {
                        var checkval = false;
                        if ($(this).hasClass("group-blank-required")) {
                            $(this).find("input").each(function () {
                                var val = $(this).val();
                                var val2 = val.replace(' ', '');
                                if (val2 == '') {
                                    checkval = true;
                                }
                            });
                        }
                        if (!checkval) {
                            var inputPassword = $(this).find("input");
                            var limitSettings = $.evalJSON($(inputPassword).attr("data-limit"));
                            var checkPassword = false;
                            if ($(this).find("input").length > 1) {
                                $(this).parent().removeClass("error");
                                $(this).find(".help-limit").remove();
                                $(this).find("input").each(function () {
                                    if ($(this).val().length < limitSettings.limitMin) {
                                        checkPassword = true;
                                    } else if ($(this).val().length > limitSettings.limitMax) {
                                        checkPassword = true;
                                    }
                                });
                            } else {
                                if ($(inputPassword).val() != '' || $(inputPassword).val() != 0) {
                                    $(inputPassword).parent().find(".help-limit").remove();
                                    $(inputPassword).parent().parent().removeClass("error");
                                    if ($(inputPassword).val().length < limitSettings.limitMin) {
                                        checkPassword = true;
                                    } else if ($(inputPassword).val().length > limitSettings.limitMax) {
                                        checkPassword = true;
                                    }
                                }
                            }

                            if (checkPassword) {
                                check++;
                                var textLang = lang['JSN_UNIFORM_CONFIRM_FIELD_PASSWORD_MIN_MAX_CHARACTER'];
                                textLang = textLang.replace("%mi%", limitSettings.limitMin);
                                textLang = textLang.replace("%mx%", limitSettings.limitMax);
                                $(this).parent().addClass("error");
                                $(this).append(
                                    $("<span/>", {
                                        "class":"help-block help-limit"
                                    }).append(
                                        $("<span/>", {
                                            "class":"validation-result label label-important",
                                            text:textLang
                                        })));
                            }
                        }
                    }
                });
            }
            var $valueLimit = $(_this).find(".limit-required");
            $valueLimit.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    var limitSettings = $.evalJSON($(this).attr("data-limit"));
                    var checkval = false;
                    if ($(this).parent().hasClass("group-blank-required")) {
                        $(this).find("input").each(function () {
                            var val = $(this).val();
                            var val2 = val.replace(' ', '');
                            if (val2 == '') {
                                checkval = true;
                            }
                        });
                    }
                    if ($(this).parent().hasClass("blank-required")) {
                        var val = $(this).val();
                        var val2 = val.replace(' ', '');
                        if ($(this).attr("type") == "text") {
                            if (val2 == '') {
                                checkval = true;
                            }
                        } else {
                            if (val2 == '' || val2 == 0) {
                                checkval = true;
                            }
                        }
                    }
                    if (!checkval) {
                        $(this).parent().find(".help-limit").remove();
                        $(this).parent().parent().removeClass("error");
                        var id = $(this).attr('id')
                        if (limitSettings.limitType == "Words") {
                            var lengthValue = $.trim($(this).val()).split(/[\s]+/);
                            if (lengthValue.length < limitSettings.limitMin) {
                                check++;
                                $(this).parent().parent().addClass("error");
                                $('#words-limit_'+ id).append(
                                    $("<div />", {"class":"pull-left"}).append(
                                        $("<span/>", {
                                            "class":"help-block help-limit"
                                        }).append(
                                            $("<span/>", {
                                                "class":"validation-result label label-important",
                                                text:lang['JSN_UNIFORM_CONFIRM_FIELD_MIN_LENGTH'] + " " + limitSettings.limitMin + " " + lang['JSN_UNIFORM_WORDS']
                                            }))));
                            } else if (lengthValue.length > limitSettings.limitMax) {
                                check++;
                                $(this).parent().parent().addClass("error");
                                $('#words-limit_'+ id).append(
                                    $("<div />", {"class":"pull-left"}).append(
                                        $("<span/>", {
                                            "class":"help-block help-limit"
                                        }).append(
                                            $("<span/>", {
                                                "class":"validation-result label label-important",
                                                text:lang['JSN_UNIFORM_CONFIRM_FIELD_MAX_LENGTH'] + " " + limitSettings.limitMax + " " + lang['JSN_UNIFORM_WORDS']
                                            }))));
                            }
                        } else {
                            if ($(this).val().length < limitSettings.limitMin) {
                                check++;
                                $(this).parent().parent().addClass("error");
                                $('#characters-limit_' + id).append(
                                    $("<div />", {"class":"pull-left"}).append(
                                        $("<span/>", {
                                            "class":"help-block help-limit"
                                        }).append(
                                            $("<span/>", {
                                                "class":"validation-result label label-important",
                                                text:lang['JSN_UNIFORM_CONFIRM_FIELD_MIN_LENGTH'] + " " + limitSettings.limitMin + " " + lang['JSN_UNIFORM_CHARACTERS']
                                            }))));
                            } else if ($(this).val().length > limitSettings.limitMax) {
                                check++;
                                $(this).parent().parent().addClass("error");
                                $('#characters-limit_' + id).append(
                                    $("<div />", {"class":"pull-left"}).append(
                                        $("<span/>", {
                                            "class":"help-block help-limit"
                                        }).append(
                                            $("<span/>", {
                                                "class":"validation-result label label-important",
                                                text:lang['JSN_UNIFORM_CONFIRM_FIELD_MAX_LENGTH'] + " " + limitSettings.limitMax + " " + lang['JSN_UNIFORM_CHARACTERS']
                                            }))));
                            }
                        }

                    }
                }
            });

            var $valueNumberLimit = $(_this).find(".number-limit-required");
            $valueNumberLimit.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    var checkval = false;
                    if ($(this).hasClass("integer-required")) {
                        var val = $(this).val();
                        var regexp = /^[0-9]+$/;
                        if (!regexp.test(val)) {
                            checkval = true;
                        }
                    }
                    if (!checkval) {
                        var limitNumberSettings = $.evalJSON($(this).attr("data-limit"));
                        $(this).parent().find(".help-limit").remove();
                        $(this).parent().parent().removeClass("error");
                        if ($(this).val() != '' || $(this).val() != 0) {
                            if (parseInt($(this).val(), 10) < limitNumberSettings.limitMin) {
                                check++;
                                $(this).parent().parent().addClass("error");
                                $(this).parent().append(
                                    $("<span/>", {
                                        "class":"help-block help-limit"
                                    }).append(
                                        $("<span/>", {
                                            "class":"validation-result label label-important",
                                            text:lang['JSN_UNIFORM_CONFIRM_FIELD_MIN_NUMBER'] + " " + limitNumberSettings.limitMin
                                        })));
                            } else if (parseInt($(this).val(), 10) > limitNumberSettings.limitMax) {
                                check++;
                                $(this).parent().parent().addClass("error");
                                $(this).parent().append(
                                    $("<span/>", {
                                        "class":"help-block help-limit"
                                    }).append(
                                        $("<span/>", {
                                            "class":"validation-result label label-important",
                                            text:lang['JSN_UNIFORM_CONFIRM_FIELD_MAX_NUMBER'] + " " + limitNumberSettings.limitMax
                                        })));
                            }
                        }

                    }
                }
            });

            var $list = $(_this).find(".list-required");
            $list.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    $(this).parent().find(".help-list").remove();
                    $(this).parent().removeClass("error");
                    if (!$(this).find("select").val()) {
                        $(this).parent().addClass("error");
                        $(this).find("select").after(
                            $("<span/>", {
                                "class":"help-block help-list"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_INVALID']
                                })));
                        check++;
                    }
                }
            });
            var $inputchoices = $(_this).find(".choices-required");
            $inputchoices.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    $(this).find(".help-choices").remove();
                    $(this).parent().removeClass("error");
                    if ($(this).find("input[type=radio]:checked").length < 1) {
                        $(this).parent().addClass("error");
                        $(this).append(
                            $("<span/>", {
                                "class":"help-block help-choices"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                })))
                        check++;
                    } else if ($(this).find("input[type=radio]:checked").hasClass('allowOther') && $(this).find("input[type=radio]:checked").length == 1) {
                        var selfRadio = this;
                        $(this).find(".jsn-value-Others").focusout(function () {
                            var checkRadio = false;
                            var valchoices = $(selfRadio).find(".jsn-value-Others").val();
                            var valchoices2 = valchoices.replace(' ', '');
                            if (valchoices2 == '') {
                                checkRadio = true;
                            }
                            if (checkRadio) {
                                $(selfRadio).find(".help-choices").remove();
                                $(selfRadio).parent().addClass("error");
                                $(selfRadio).append(
                                    $("<span/>", {
                                        "class":"help-block help-choices"
                                    }).append(
                                        $("<span/>", {
                                            "class":"validation-result label label-important",
                                            text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                        })))
                                check++;
                            }
                        });
                        if (type != "detailInput") {
                            $(this).find(".jsn-value-Others").trigger("focusout");
                        }
                    }
                }
            });
            if (onchange != "onchange") {
                var $inputlikert = $(_this).find(".likert-required");
                $inputlikert.each(function () {
                    if ($(this).parents(".control-group").css("display") != "none") {
                        $(this).find(".help-likert").remove();
                        $(this).parents(".control-group").removeClass("error");
                        $(this).find("tbody tr").each(function () {
                            if ($(this).find("input[type=radio]:checked").length < 1) {
                                $(this).parents(".control-group").addClass("error");
                                if (!$(this).parents(".controls").find(".help-likert").size()) {
                                    $(this).parents(".controls").append(
                                        $("<span/>", {
                                            "class":"help-block help-likert"
                                        }).append(
                                            $("<span/>", {
                                                "class":"validation-result label label-important",
                                                text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                            })))
                                }
                                check++;
                            }
                        })

                    }
                });
            }
            var $inputCheckbox = $(_this).find(".checkbox-required");
            $inputCheckbox.each(function () {
                if ($(this).parents(".control-group").css("display") != "none") {
                    $(this).find(".help-checkbox").remove();
                    $(this).parent().parent().removeClass("error");
                    if ($(this).find("input[type=checkbox]:checked").length < 1) {
                        $(this).parent().parent().addClass("error");
                        $(this).append(
                            $("<span/>", {
                                "class":"help-block help-checkbox"
                            }).append(
                                $("<span/>", {
                                    "class":"validation-result label label-important",
                                    text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                })))
                        check++;
                    } else if ($(this).find("input[type=checkbox]:checked").length == 1 && $(this).find("input[type=checkbox]:checked").hasClass('allowOther')) {
                        var selfCheckbox = this;
                        $(this).find(".jsn-value-Others").focusout(function () {
                            var checkCheckbox = false;
                            var valchoices = $(selfCheckbox).find(".jsn-value-Others").val();
                            var valchoices2 = valchoices.replace(' ', '');
                            if (valchoices2 == '') {
                                checkCheckbox = true;
                            }
                            if (checkCheckbox) {
                                $(selfCheckbox).find(".help-checkbox").remove();
                                $(selfCheckbox).parent().parent().addClass("error");
                                $(selfCheckbox).append(
                                    $("<span/>", {
                                        "class":"help-block help-checkbox"
                                    }).append(
                                        $("<span/>", {
                                            "class":"validation-result label label-important",
                                            text:lang['JSN_UNIFORM_CONFIRM_FIELD_CANNOT_EMPTY']
                                        })))
                                check++;
                            }
                        });
                        if (type != "detailInput") {
                            $(this).find(".jsn-value-Others").trigger("focusout");
                        }
                    }
                }
            });
            if (check > 0 && type != "detailInput") {
                var fieldFocus = $(_this).find(".error")[0];
                if ($(fieldFocus).find(".blank-required").size()) {
                    $(fieldFocus).find("input,select,textarea").each(function () {
                        var val = $(this).val();
                        var val2 = val.replace(' ', '');
                        if (val2 == '' || val2 == 0) {
                            $(window).scrollTop($(this).offset().top - 50);
                            $(this).focus();
                            $(this).click();
                            return false;
                        }
                    })
                } else {
                    var fieldFocus = $(_this).find(".error input,.error textarea,.error select")[0];
                    $(window).scrollTop($(fieldFocus).offset().top - 50);
                    $(fieldFocus).focus();
                }
                return false;
            }
            if (check > 0 && type == "detailInput") {
                return false;
            }
            return true;
        };
        $.getBoxStyle = function (element) {

            var style = {
                width:element.width(),
                height:element.height(),
                outerHeight:element.outerHeight(),
                outerWidth:element.outerWidth(),
                offset:element.offset(),
                margin:{
                    left:parseInt(element.css('margin-left')),
                    right:parseInt(element.css('margin-right')),
                    top:parseInt(element.css('margin-top')),
                    bottom:parseInt(element.css('margin-bottom'))
                },
                padding:{
                    left:parseInt(element.css('padding-left')),
                    right:parseInt(element.css('padding-right')),
                    top:parseInt(element.css('padding-top')),
                    bottom:parseInt(element.css('padding-bottom'))
                }
            };
            return style;
        };
        function jsnLoadForm($) {
            $(".jsn-uniform").each(function () {
                if ($(this).attr("data-form-name")) {
                    var getLang = $(this).find("span.jsn-language").attr("data-value");
                    baseUrl = $(this).find("span.jsn-base-url").attr("data-value");
                    if (getLang) {
                        lang = $.evalJSON(getLang);
                    }
                    $.initJSNForm($(this).find("form"));
                }
            });
        }
        jQuery(document).ready(jsnLoadForm($));
    });
})(jQuery);