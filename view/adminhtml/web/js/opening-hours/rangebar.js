/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this file to newer
 * versions in the future.
 *
 * @category  Smile
 * @package   Smile\Retailer
 * @author    Romain Ruaud <romain.ruaud@smile.fr>
 * @copyright 2016 Smile
 * @license   Open Software License ("OSL") v. 3.0
 */

/*jshint browser:true jquery:true*/
define([
    'jquery',
    'underscore',
    'elessar',
    'moment',
    'mage/translate'
], function ($, _, RangeBar, moment, translator) {
    'use strict';

    $.widget('smile.openingHours', {
        options: {
            snap: 1000 * 60 * 15,
            minSize: (1000 * 60 * 60) / 4,
            allowDelete: true,
            htmlLabel: true,
            min: moment().startOf("day").format("LLLL"),
            max: moment().endOf("day").format("LLLL"),
            valueFormat: function(ts) {
                return moment(ts).format("HH:mm");
            },
            valueParse: function(date) {
                return moment(date).valueOf();
            },
            indicator:false,
            updateSummary:false,
            summary:null
        },

        /**
         * Initialize the Widget, internal constructor
         *
         * @private
         */
        _create: function ()
        {
            var rangeBarWidget = new RangeBar(this.options);
            this.rangeBar = rangeBarWidget.$el;

            if (this.options.onChange) {
                this.rangeBar.on("change", this.options.onChange);
            }

            if (this.options.onChanging) {
                this.rangeBar.on("changing", this.options.onChanging);
            }

            if (this.options.updateSummary === true && this.options.summary !== null) {
                this.summary = $(this.options.summary);
                this.prepareSummaryListening();
                if (this.options.values.length) {
                    this.updateSummary(rangeBarWidget.val());
                }
            }

            if (this.options.input !== null) {
                this.input = $(this.options.input);
                this.prepareInputBinding();
                if (this.options.values.length) {
                    this.input.val(JSON.stringify(rangeBarWidget.val(),null,2))
                }
            }

            this.element.prepend(this.rangeBar);
        },

        /**
         * Bind data to the input field when the slider is changing.
         */
        prepareInputBinding: function()
        {
            if (this.input) {
                this.rangeBar.on("change", function(ev, ranges) {this.input.val(JSON.stringify(ranges,null,2))}.bind(this));
                this.rangeBar.on("changing", function(ev, ranges) {this.input.val(JSON.stringify(ranges,null,2))}.bind(this));
            }
        },

        /**
         * Bind data to the summary field (if any, and if summarize is activated) when the slider is changing.
         */
        prepareSummaryListening: function()
        {
            this.rangeBar.on("change", function(ev, ranges) { this.updateSummary(ranges) }.bind(this));
            this.rangeBar.on("changing", function(ev, ranges) { this.updateSummary(ranges) }.bind(this));
        },

        /**
         * Update summary field according to content of the slider
         *
         * @param ranges The ranges to display in summary field
         */
        updateSummary: function (ranges)
        {
            var rangeLabels = [];
            ranges.forEach(function (rangeItem) {
                var subRangeLabels = [];
                rangeItem.forEach(function (dateItem) {
                    subRangeLabels.push(dateItem);
                });
                rangeLabels.push(subRangeLabels.join(" - "));
            });
            var label = rangeLabels.join(", ");
            this.summary.text(label)
        }

    });

    return $.smile.openingHours;
});