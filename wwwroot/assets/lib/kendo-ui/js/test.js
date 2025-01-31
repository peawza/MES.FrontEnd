var aa = {
    activateTab: function(e) {
        if (this.tabGroup.children("[data-animating]").length) return;
        e = this.tabGroup.find(e);
        var t = this,
            i = t.options.animation,
            n = i.open,
            r = b({}, i.close),
            u = r && "effects" in r,
            a = e.parent().children(),
            o = a.filter("." + w),
            s = a.index(e),
            c = n && "duration" in n && "effects" in n;
        r = b(u ? r : b({ reverse: true }, n), { hide: true });
        if (_.size(n.effects)) {
            o.kendoRemoveClass(w, { duration: r.duration });
            e.kendoRemoveClass(N, { duration: r.duration })
        } else {
            o.removeClass(w);
            e.removeClass(N)
        }
        var f = t.contentAnimators;
        if (t.inRequest) {
            t.xhr.abort();
            t.inRequest = false
        }
        if (f.length === 0) {
            t.tabGroup.find("." + y).removeClass(y);
            e.addClass(y).css("z-index");
            e.addClass(w);
            t._current(e);
            t.trigger("change");
            if (t._scrollableModeActive) t._scrollTabsToItem(e);
            return false
        }
        var l = f.filter("." + w),
            d = t.contentHolder(s),
            h = d.closest(".k-content");
        t.tabsHeight = x(t.tabGroup) + parseInt(t.wrapper.css("border-top-width"), 10) + parseInt(t.wrapper.css("border-bottom-width"), 10);
        if (d.length === 0) { l.removeClass(w).attr("aria-hidden", true).kendoStop(true, true).kendoAnimate(r); return false }
        e.attr("data-animating", true);
        var p = (e.children("." + k).data(z) || t._contentUrls[s] || false) && d.is(A),
            v = function() {
                o.removeAttr("aria-selected");
                e.attr("aria-selected", true);
                t._current(e);
                h.addClass(w).removeAttr("aria-hidden").kendoStop(true, true).attr("aria-expanded", true).kendoAnimate(b({
                    init: function() {
                        t.trigger(S, { item: e[0], contentElement: d[0] });
                        _.resize(d)
                    }
                }, n, {
                    complete: function() {
                        e.removeAttr("data-animating");
                        t.trigger(F, { item: e[0], contentElement: d[0] });
                        _.resize(d);
                        if (c && (_.support.browser.msie || _.support.browser.edge)) d.finish().animate({ opacity: .9 }, "fast", "linear", function() { d.finish().animate({ opacity: 1 }, "fast", "linear") })
                    }
                }))
            },
            m = function() {
                if (!p) {
                    v();
                    t.trigger("change")
                } else {
                    e.removeAttr("data-animating");
                    t.ajaxRequest(e, d, function() {
                        e.attr("data-animating", true);
                        v();
                        t.trigger("change")
                    })
                }
                if (t._scrollableModeActive) t._scrollTabsToItem(e)
            };
        var g = t.element.css("min-height");
        t.element.css("min-height", t.element.outerHeight());
        l.removeClass(w);
        t.tabGroup.find("." + y).removeClass(y);
        e.addClass(y).css("z-index");
        if (_.size(n.effects)) e.kendoAddClass(w, { duration: n.duration });
        else e.addClass(w);
        l.attr("aria-hidden", true);
        l.attr("aria-expanded", false);
        if (l.length) l.kendoStop(true, true).kendoAnimate(b({ complete: m }, r));
        else m();
        t.element.css("min-height", g);
        return true
    },
    ajaxRequest: function(r, a, o, s) {
        r = this.tabGroup.find(r);
        var l = this,
            n = p.ajaxSettings.xhr,
            e = r.find("." + k),
            c = {},
            t = r.width() / 2,
            d = false,
            u = r.find(".k-loading").removeClass("k-complete");
        if (!u[0]) u = p("<span class='k-loading'/>").prependTo(r);
        var f = t * 2 - u.width();
        var h = function() { u.animate({ marginLeft: (parseInt(u.css("marginLeft"), 10) || 0) < t ? f : 0 }, 500, h) };
        if (_.support.browser.msie && _.support.browser.version < 10) setTimeout(h, 40);
        s = s || e.data(z) || l._contentUrls[r.index()] || e.attr(m);
        l.inRequest = true;
        var i = {
            type: "GET",
            cache: false,
            url: s,
            dataType: "html",
            data: c,
            xhr: function() {
                var t = this,
                    e = n(),
                    i = t.progressUpload ? "progressUpload" : t.progress ? "progress" : false;
                if (e) p.each([e, e.upload], function() { if (this.addEventListener) this.addEventListener("progress", function(e) { if (i) t[i](e) }, false) });
                t.noProgress = !(window.XMLHttpRequest && "upload" in new XMLHttpRequest);
                return e
            },
            progress: function(e) {
                if (e.lengthComputable) {
                    var t = parseInt(e.loaded / e.total * 100, 10) + "%";
                    u.stop(true).addClass("k-progress").css({ width: t, marginLeft: 0 })
                }
            },
            error: function(e, t) { if (l.trigger("error", { xhr: e, status: t })) this.complete() },
            stopProgress: function() {
                clearInterval(d);
                u.stop(true).addClass("k-progress")[0].style.cssText = ""
            },
            complete: function(e) {
                l.inRequest = false;
                if (this.noProgress) setTimeout(this.stopProgress, 500);
                else this.stopProgress();
                if (e.statusText == "abort") u.remove()
            },
            success: function(e) {
                u.addClass("k-complete");
                try {
                    var t = this,
                        i = 10;
                    if (t.noProgress) {
                        u.width(i + "%");
                        d = setInterval(function() {
                            t.progress({ lengthComputable: true, loaded: Math.min(i, 100), total: 100 });
                            i += 10
                        }, 40)
                    }
                    l.angular("cleanup", function() { return { elements: a.get() } });
                    _.destroy(a);
                    a.html(e)
                } catch (e) {
                    var n = window.console;
                    if (n && n.error) n.error(e.name + ": " + e.message + " in " + s);
                    this.error(this.xhr, "error")
                }
                if (o) o.call(l, a);
                l.angular("compile", function() { return { elements: a.get() } });
                l.trigger(H, { item: r[0], contentElement: a[0] })
            }
        };
        if (typeof s === "object") { i = p.extend(true, {}, i, s); if (v(i.url)) i.url = i.url() }
        l.xhr = p.ajax(i)
    },
    append: function(e) {
        var i = this,
            n = i._create(e);
        l(n.tabs, function(e) {
            var t = n.contents[e];
            i.tabGroup.append(this);
            if (i.options.tabPosition == "bottom") i.tabWrapper.before(t);
            else i.wrapper.append(t);
            i.angular("compile", function() { return { elements: [t] } })
        });
        K(i.tabGroup);
        i._updateContentElements();
        i.resize(true);
        return i
    },
    contentElement: function(e) {
        if (isNaN(e - 0)) return a;
        var t = this.contentElements && this.contentElements[0] && !_.kineticScrollNeeded ? this.contentElements : this.contentAnimators;
        var i = p(this.tabGroup.children()[e]).attr("aria-controls");
        if (t)
            for (var n = 0, r = t.length; n < r; n++)
                if (t.eq(n).closest(".k-content")[0].id == i) return t[n];
        return a
    },
    contentHolder: function(e) {
        var t = p(this.contentElement(e)),
            i = t.children(".km-scroll-container");
        return _.support.touch && i[0] ? i : t
    }
}