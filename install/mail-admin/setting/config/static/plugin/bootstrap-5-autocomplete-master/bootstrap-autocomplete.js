! function(t) {
    var e = {};

    function s(i) {
        if (e[i]) return e[i].exports;
        var o = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(o.exports, o, o.exports, s), o.l = !0, o.exports
    }
    s.m = t, s.c = e, s.d = function(t, e, i) {
        s.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: i
        })
    }, s.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, s.t = function(t, e) {
        if (1 & e && (t = s(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var i = Object.create(null);
        if (s.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: t
            }), 2 & e && "string" != typeof t)
            for (var o in t) s.d(i, o, function(e) {
                return t[e]
            }.bind(null, o));
        return i
    }, s.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return s.d(e, "a", e), e
    }, s.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, s.p = "", s(s.s = 0)
}([function(t, e, s) {
    "use strict";
    s.r(e), s.d(e, "AutoComplete", (function() {
        return a
    }));
    var i, o = (i = function(t, e) {
            return (i = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(t, e) {
                    t.__proto__ = e
                } || function(t, e) {
                    for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s])
                })(t, e)
        }, function(t, e) {
            function s() {
                this.constructor = t
            }
            i(t, e), t.prototype = null === e ? Object.create(e) : (s.prototype = e.prototype, new s)
        }),
        n = function(t) {
            function e(e) {
                return t.call(this, e) || this
            }
            return o(e, t), e.prototype.getDefaults = function() {
                return {
                    url: "",
                    method: "get",
                    queryKey: "q",
                    extraData: {},
                    timeout: void 0,
                    requestThrottling: 500
                }
            }, e.prototype.search = function(t, e) {
                var s = this;
                null != this.jqXHR && this.jqXHR.abort();
                var i = {};
                i[this._settings.queryKey] = t, $.extend(i, this._settings.extraData), this.requestTID && window.clearTimeout(this.requestTID), this.requestTID = window.setTimeout((function() {
                    s.jqXHR = $.ajax(s._settings.url, {
                        method: s._settings.method,
                        data: i,
                        timeout: s._settings.timeout
                    }), s.jqXHR.done((function(t) {
                        e(t)
                    })), s.jqXHR.fail((function(t) {
                        var e;
                        null === (e = s._settings) || void 0 === e || e.fail(t)
                    })), s.jqXHR.always((function() {
                        s.jqXHR = null
                    }))
                }), this._settings.requestThrottling)
            }, e
        }(function() {
            function t(t) {
                this._settings = $.extend(!0, {}, this.getDefaults(), t)
            }
            return t.prototype.getDefaults = function() {
                return {}
            }, t.prototype.getResults = function(t, e, s) {
                return this.results
            }, t.prototype.search = function(t, e) {
                e(this.getResults())
            }, t
        }()),
        r = function() {
            function t(t, e, s, i) {
                this.initialized = !1, this.shown = !1, this.items = [], this.ddMouseover = !1, this._$el = t, this.formatItem = e, this.autoSelect = s, this.noResultsText = i
            }
            return t.prototype.init = function() {
                var t = this,
                    e = $.extend({}, this._$el.position(), {
                        height: this._$el[0].offsetHeight
                    });
                this._dd = $("<ul />"), this._dd.addClass("bootstrap-autocomplete dropdown-menu"), this._dd.insertAfter(this._$el), this._dd.css({
                    top: e.top + this._$el.outerHeight(),
                    left: e.left,
                    width: this._$el.outerWidth()
                }), this._dd.on("click", "li", (function(e) {
                    var s = $(e.currentTarget).data("item");
                    t.itemSelectedLaunchEvent(s)
                })), this._dd.on("keyup", (function(e) {
                    if (t.shown) {
                        switch (e.which) {
                            case 27:
                                t.hide(), t._$el.focus()
                        }
                        return !1
                    }
                })), this._dd.on("mouseenter", (function(e) {
                    t.ddMouseover = !0
                })), this._dd.on("mouseleave", (function(e) {
                    t.ddMouseover = !1
                })), this._dd.on("mouseenter", "li", (function(e) {
                    t.haveResults && ($(e.currentTarget).closest("ul").find("li.active").removeClass("active"), $(e.currentTarget).addClass("active"), t.mouseover = !0)
                })), this._dd.on("mouseleave", "li", (function(e) {
                    t.mouseover = !1
                })), this.initialized = !0
            }, t.prototype.checkInitialized = function() {
                this.initialized || this.init()
            }, Object.defineProperty(t.prototype, "isMouseOver", {
                get: function() {
                    return this.mouseover
                },
                enumerable: !1,
                configurable: !0
            }), Object.defineProperty(t.prototype, "isDdMouseOver", {
                get: function() {
                    return this.ddMouseover
                },
                enumerable: !1,
                configurable: !0
            }), Object.defineProperty(t.prototype, "haveResults", {
                get: function() {
                    return this.items.length > 0
                },
                enumerable: !1,
                configurable: !0
            }), t.prototype.focusNextItem = function(t) {
                if (this.haveResults) {
                    var e = this._dd.find("li.active"),
                        s = t ? e.prev() : e.next();
                    0 === s.length && (s = t ? this._dd.find("li").last() : this._dd.find("li").first()), e.removeClass("active"), s.addClass("active")
                }
            }, t.prototype.focusPreviousItem = function() {
                this.focusNextItem(!0)
            }, t.prototype.selectFocusItem = function() {
                this._dd.find("li.active").trigger("click")
            }, Object.defineProperty(t.prototype, "isItemFocused", {
                get: function() {
                    return !!(this.isShown() && this._dd.find("li.active").length > 0)
                },
                enumerable: !1,
                configurable: !0
            }), t.prototype.show = function() {
                this.shown || (this._dd.dropdown().show(), this.shown = !0)
            }, t.prototype.isShown = function() {
                return this.shown
            }, t.prototype.hide = function() {
                this.shown && (this._dd.dropdown().hide(), this.shown = !1)
            }, t.prototype.updateItems = function(t, e) {
                this.items = t, this.searchText = e, this.refreshItemList()
            }, t.prototype.showMatchedText = function(t, e) {
                var s = t.toLowerCase().indexOf(e.toLowerCase());
                if (s > -1) {
                    var i = s + e.length;
                    return t.slice(0, s) + "<b>" + t.slice(s, i) + "</b>" + t.slice(i)
                }
                return t
            }, t.prototype.refreshItemList = function() {
                var t = this;
                this.checkInitialized(), this._dd.empty();
                var e = [];
                if (this.items.length > 0) this.items.forEach((function(s) {
                    var i, o, n = t.formatItem(s);
                    "string" == typeof n && (n = {
                        text: n
                    }), i = t.showMatchedText(n.text, t.searchText), o = void 0 !== n.html ? n.html : i;
                    var r = n.disabled,
                        l = $("<li >");
                    l.append($("<a>").attr("href", "#!").html(o)).data("item", s), r && l.addClass("disabled"), e.push(l)
                }));
                else {
                    var s = $("<li >");
                    s.append($("<a>").attr("href", "#!").html(this.noResultsText)).addClass("disabled"), e.push(s)
                }
                this._dd.append(e)
            }, t.prototype.itemSelectedLaunchEvent = function(t) {
                this._$el.trigger("autocomplete.select", t)
            }, t
        }(),
        l = function() {
            function t(t, e, s, i) {
                this.initialized = !1, this.shown = !1, this.items = [], this.ddMouseover = !1, this._$el = t, this.formatItem = e, this.autoSelect = s, this.noResultsText = i
            }
            return t.prototype.getElPos = function() {
                return $.extend({}, this._$el.position(), {
                    height: this._$el[0].offsetHeight
                })
            }, t.prototype.init = function() {
                var t = this,
                    e = this.getElPos();
                this._dd = $("<div />"), this._dd.addClass("bootstrap-autocomplete dropdown-menu"), this._dd.insertAfter(this._$el), this._dd.css({
                    top: e.top + this._$el.outerHeight(),
                    left: e.left,
                    width: this._$el.outerWidth()
                }), this._dd.on("click", ".dropdown-item", (function(e) {
                    var s = $(e.currentTarget).data("item");
                    t.itemSelectedLaunchEvent(s), e.preventDefault()
                })), this._dd.on("keyup", (function(e) {
                    if (t.shown) {
                        switch (e.which) {
                            case 27:
                                t.hide(), t._$el.focus()
                        }
                        return !1
                    }
                })), this._dd.on("mouseenter", (function(e) {
                    t.ddMouseover = !0
                })), this._dd.on("mouseleave", (function(e) {
                    t.ddMouseover = !1
                })), this._dd.on("mouseenter", ".dropdown-item", (function(e) {
                    t.haveResults && ($(e.currentTarget).closest("div").find(".dropdown-item.active").removeClass("active"), $(e.currentTarget).addClass("active"), t.mouseover = !0)
                })), this._dd.on("mouseleave", ".dropdown-item", (function(e) {
                    t.mouseover = !1
                })), this.initialized = !0
            }, t.prototype.checkInitialized = function() {
                this.initialized || this.init()
            }, Object.defineProperty(t.prototype, "isMouseOver", {
                get: function() {
                    return this.mouseover
                },
                enumerable: !1,
                configurable: !0
            }), Object.defineProperty(t.prototype, "isDdMouseOver", {
                get: function() {
                    return this.ddMouseover
                },
                enumerable: !1,
                configurable: !0
            }), Object.defineProperty(t.prototype, "haveResults", {
                get: function() {
                    return this.items.length > 0
                },
                enumerable: !1,
                configurable: !0
            }), t.prototype.focusNextItem = function(t) {
                if (this.haveResults) {
                    var e = this._dd.find(".dropdown-item.active"),
                        s = t ? e.prev() : e.next();
                    0 === s.length && (s = t ? this._dd.find(".dropdown-item").last() : this._dd.find(".dropdown-item").first()), e.removeClass("active"), s.addClass("active")
                }
            }, t.prototype.focusPreviousItem = function() {
                this.focusNextItem(!0)
            }, t.prototype.selectFocusItem = function() {
                this._dd.find(".dropdown-item.active").trigger("click")
            }, Object.defineProperty(t.prototype, "isItemFocused", {
                get: function() {
                    return !!(this._dd && this.isShown() && this._dd.find(".dropdown-item.active").length > 0)
                },
                enumerable: !1,
                configurable: !0
            }), t.prototype.show = function() {
                if (!this.shown) {
                    this.getElPos();
                    this._dd.addClass("show"), this.shown = !0, this._$el.trigger("autocomplete.dd.shown")
                }
            }, t.prototype.isShown = function() {
                return this.shown
            }, t.prototype.hide = function() {
                this.shown && (this._dd.removeClass("show"), this.shown = !1, this._$el.trigger("autocomplete.dd.hidden"))
            }, t.prototype.updateItems = function(t, e) {
                this.items = t, this.searchText = e, this.refreshItemList()
            }, t.prototype.showMatchedText = function(t, e) {
                var s = t.toLowerCase().indexOf(e.toLowerCase());
                if (s > -1) {
                    var i = s + e.length;
                    return t.slice(0, s) + "<b>" + t.slice(s, i) + "</b>" + t.slice(i)
                }
                return t
            }, t.prototype.refreshItemList = function() {
                var t = this;
                this.checkInitialized(), this._dd.empty();
                var e = [];
                if (this.items.length > 0) this.items.forEach((function(s) {
                    var i, o, n = t.formatItem(s);
                    "string" == typeof n && (n = {
                        text: n
                    }), i = t.showMatchedText(n.text, t.searchText), o = void 0 !== n.html ? n.html : i;
                    var r = n.disabled,
                        l = $("<a >");
                    l.addClass("dropdown-item").css({
                        overflow: "hidden",
                        "text-overflow": "ellipsis"
                    }).html(o).data("item", s), r && l.addClass("disabled"), e.push(l)
                })), this._dd.append(e), this.show();
                else if ("" === this.noResultsText) this.hide();
                else {
                    var s = $("<a >");
                    s.addClass("dropdown-item disabled").html(this.noResultsText), e.push(s), this._dd.append(e), this.show()
                }
            }, t.prototype.itemSelectedLaunchEvent = function(t) {
                this._$el.trigger("autocomplete.select", t)
            }, t
        }(),
        a = function() {
            function t(t, e) {
                this._selectedItem = null, this._defaultValue = null, this._defaultText = null, this._isSelectElement = !1, this._settings = {
                    resolver: "ajax",
                    resolverSettings: {},
                    minLength: 3,
                    valueKey: "value",
                    formatResult: this.defaultFormatResult,
                    autoSelect: !0,
                    noResultsText: "No results",
                    bootstrapVersion: "auto",
                    preventEnter: !1,
                    events: {
                        typed: null,
                        searchPre: null,
                        search: null,
                        searchPost: null,
                        select: null,
                        focus: null
                    }
                }, this._el = t, this._$el = $(this._el), this._$el.is("select") && (this._isSelectElement = !0), this.manageInlineDataAttributes(), "object" == typeof e && (this._settings = $.extend(!0, {}, this.getSettings(), e)), this._isSelectElement && this.convertSelectToText(), this.init()
            }
            return t.prototype.manageInlineDataAttributes = function() {
                var t = this.getSettings();
                this._$el.data("url") && (t.resolverSettings.url = this._$el.data("url")), this._$el.data("default-value") && (this._defaultValue = this._$el.data("default-value")), this._$el.data("default-text") && (this._defaultText = this._$el.data("default-text")), void 0 !== this._$el.data("noresults-text") && (t.noResultsText = this._$el.data("noresults-text"))
            }, t.prototype.getSettings = function() {
                return this._settings
            }, t.prototype.getBootstrapVersion = function() {
                var t;
                "auto" === this._settings.bootstrapVersion ? t = $.fn.button.Constructor.VERSION.split(".").map(parseInt) : "4" === this._settings.bootstrapVersion ? t = [4] : "3" === this._settings.bootstrapVersion ? t = [3] : (console.error("INVALID value for 'bootstrapVersion' settings property: " + this._settings.bootstrapVersion + " defaulting to 4"), t = [4]);
                return t
            }, t.prototype.convertSelectToText = function() {
                var e = $("<input>");
                e.attr("type", "hidden"), e.attr("name", this._$el.attr("name")), this._defaultValue && e.val(this._defaultValue), this._selectHiddenField = e, e.insertAfter(this._$el);
                var s = $("<input>");
                s.attr("type", "search"), s.attr("name", this._$el.attr("name") + "_text"), s.attr("id", this._$el.attr("id")), s.attr("disabled", this._$el.attr("disabled")), s.attr("placeholder", this._$el.attr("placeholder")), s.attr("autocomplete", "off"), s.addClass(this._$el.attr("class")), this._defaultText && s.val(this._defaultText);
                var i = this._$el.attr("required");
                i && s.attr("required", i), s.data(t.NAME, this), this._$el.replaceWith(s), this._$el = s, this._el = s.get(0)
            }, t.prototype.init = function() {
                this.bindDefaultEventListeners(), "ajax" === this._settings.resolver && (this.resolver = new n(this._settings.resolverSettings)), 5 === this.getBootstrapVersion()[0] ? this._dd = new l(this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText) : this._dd = new r(this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText)
            }, t.prototype.bindDefaultEventListeners = function() {
                var t = this;
                this._$el.on("keydown", (function(e) {
                    switch (e.which) {
                        case 9:
                            t._dd.isItemFocused ? t._dd.selectFocusItem() : t._selectedItem || "" !== t._$el.val() && t._$el.trigger("autocomplete.freevalue", t._$el.val()), t._dd.hide();
                            break;
                        case 13:
                            t._dd.isItemFocused ? t._dd.selectFocusItem() : t._selectedItem || "" !== t._$el.val() && t._$el.trigger("autocomplete.freevalue", t._$el.val()), t._dd.hide(), t._settings.preventEnter && e.preventDefault();
                            break;
                        case 40:
                            t._dd.focusNextItem();
                            break;
                        case 38:
                            t._dd.focusPreviousItem()
                    }
                })), this._$el.on("keyup", (function(e) {
                    switch (e.which) {
                        case 16:
                        case 17:
                        case 18:
                        case 39:
                        case 37:
                        case 36:
                        case 35:
                            break;
                        case 13:
                        case 27:
                            t._dd.hide();
                            break;
                        case 40:
                        case 38:
                            break;
                        default:
                            t._selectedItem = null;
                            var s = t._$el.val();
                            t.handlerTyped(s)
                    }
                })), this._$el.on("blur", (function(e) {
                    !t._dd.isMouseOver && t._dd.isDdMouseOver && t._dd.isShown() ? (setTimeout((function() {
                        t._$el.focus()
                    })), t._$el.focus()) : t._dd.isMouseOver || (t._isSelectElement ? t._dd.isItemFocused ? t._dd.selectFocusItem() : null !== t._selectedItem && "" !== t._$el.val() ? t._$el.trigger("autocomplete.select", t._selectedItem) : "" !== t._$el.val() && null !== t._defaultValue ? (t._$el.val(t._defaultText), t._selectHiddenField.val(t._defaultValue), t._selectedItem = null, t._$el.trigger("autocomplete.select", t._selectedItem)) : (t._$el.val(""), t._selectHiddenField.val(""), t._selectedItem = null, t._$el.trigger("autocomplete.select", t._selectedItem)) : null === t._selectedItem && t._$el.trigger("autocomplete.freevalue", t._$el.val()), t._dd.hide())
                })), this._$el.on("autocomplete.select", (function(e, s) {
                    t._selectedItem = s, t.itemSelectedDefaultHandler(s)
                })), this._$el.on("paste", (function(e) {
                    setTimeout((function() {
                        t._$el.trigger("keyup", e)
                    }), 0)
                }))
            }, t.prototype.handlerTyped = function(t) {
                (null === this._settings.events.typed || (t = this._settings.events.typed(t, this._$el))) && (t.length >= this._settings.minLength ? (this._searchText = t, this.handlerPreSearch()) : this._dd.hide())
            }, t.prototype.handlerPreSearch = function() {
                if (null !== this._settings.events.searchPre) {
                    var t = this._settings.events.searchPre(this._searchText, this._$el);
                    if (!t) return;
                    this._searchText = t
                }
                this.handlerDoSearch()
            }, t.prototype.handlerDoSearch = function() {
                var t = this;
                null !== this._settings.events.search ? this._settings.events.search(this._searchText, (function(e) {
                    t.postSearchCallback(e)
                }), this._$el) : this.resolver && this.resolver.search(this._searchText, (function(e) {
                    t.postSearchCallback(e)
                }))
            }, t.prototype.postSearchCallback = function(t) {
                this._settings.events.searchPost && "boolean" == typeof(t = this._settings.events.searchPost(t, this._$el)) && !t || this.handlerStartShow(t)
            }, t.prototype.handlerStartShow = function(t) {
                this._dd.updateItems(t, this._searchText)
            }, t.prototype.itemSelectedDefaultHandler = function(t) {
                if (null != t) {
                    var e = this._settings.formatResult(t);
                    "string" == typeof e && (e = {
                        text: e
                    }), this._$el.val(e.text), this._isSelectElement && this._selectHiddenField.val(e.value)
                } else this._$el.val(""), this._isSelectElement && this._selectHiddenField.val("");
                this._selectedItem = t, this._dd.hide()
            }, t.prototype.defaultFormatResult = function(t) {
                return "string" == typeof t ? {
                    text: t
                } : t.text ? t : {
                    text: t.toString()
                }
            }, t.prototype.manageAPI = function(t, e) {
                "set" === t ? this.itemSelectedDefaultHandler(e) : "clear" === t ? this.itemSelectedDefaultHandler(null) : "show" === t ? this._$el.trigger("keyup") : "updateResolver" === t && (this.resolver = new n(e))
            }, t.NAME = "autoComplete", t
        }();
    ! function(t, e, s) {
        t.fn[a.NAME] = function(e, s) {
            return this.each((function() {
                var i;
                (i = t(this).data(a.NAME)) || (i = new a(this, e), t(this).data(a.NAME, i)), i.manageAPI(e, s)
            }))
        }
    }(jQuery, window, document)
}]);