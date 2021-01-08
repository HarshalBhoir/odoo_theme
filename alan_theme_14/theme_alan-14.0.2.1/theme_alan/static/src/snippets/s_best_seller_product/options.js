odoo.define('theme_alan.s_best_seller_product_options',function(require){
'use strict';

var core = require('web.core');
var options = require('web_editor.snippets.options');
var rpc = require('web.rpc');
var wUtils = require('website.utils');
var _t = core._t;

options.registry['best_seller_product_slider_actions'] = options.Class.extend({
    popup_template_id: 'best_seller_product_slider_layout_template',
    popup_title: _t('Select Slider Layout'),
    events:{
        'click':'_changeSlider'
    },
    _changeSlider:function(){
        this.best_seller_product_slider_configure('click');
    },
    best_seller_product_slider_configure: function (previewMode, value) {
        var self = this;
        var def = wUtils.prompt({
            'id': this.popup_template_id,
            'window_title': this.popup_title,
            'select': _t("Slider Layout"),
            'init': function (field, dialog) {
                return rpc.query({
                    model: 'product_slider_common.options',
                    method: 'name_search',
                    args: ['', []],
                    context: self.options.recordInfo.context,
                }).then(function (data) {
                    $(dialog).find('.btn-primary').prop('disabled', !data.length);
                    return data;
                });
            },
        });
        def.then(function (result) {
            var style_id = parseInt(result.val);
            self.$target.attr('data-slider-style-id', style_id);
            rpc.query({
                model: 'product_slider_common.options',
                method: 'read',
                args: [[style_id],['name']],
            }).then(function (data){
                if(data && data[0] && data[0].name){
                    var collection_name = data[0].name;
                    self.$target.attr('data-slider-style-name',collection_name);
                    self.$target.empty().append('<div class="container"><div class="seaction-head"><h2>Product Best Seller Slider: '+ collection_name  +'</h2></div></div>');
                } else {
                    collection_name = 'NO LAYOUT SELECTED';
                }
            });
        })
        return def;
    },
    start: function () {
        var self = this;
        return this._super.apply(this, arguments);
    },
    onBuilt: function(){
        var self = this;
        this._super();
        this.best_seller_product_slider_configure('click').guardedCatch(function () {
            self.getParent()._onRemoveClick($.Event( 'click' ));
        });
    },
    cleanForSave: function () {
        this.$target.empty();
        $('.as_best_seller').empty();
        var model = this.$target.parent().attr('data-oe-model');
        if(model){
            this.$target.parent().addClass('o_editable o_dirty');
        }
    },
});


});
