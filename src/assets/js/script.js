import {JsonEditorOptions} from "ang-jsoneditor";

var other_alerts=[];

! function (t, e) {
  d3.timeline = e(d3);
  // "object" == typeof exports && "object" == typeof module ? module.exports = d3 : "function" == typeof define && define.amd ? d3 : "object" == typeof exports ? exports.timeline = e(d3) : t.timeline = e(t.d3)
}(this, function (t) {
  return function (t) {
    function e(a) {
      if (n[a]) return n[a].exports;
      var i = n[a] = {
        exports: {},
        id: a,
        loaded: !1
      };
      return t[a].call(i.exports, i, i.exports, e), i.loaded = !0, i.exports
    }
    var n = {};
    return e.m = t, e.c = n, e.p = "", e(0)
  }([function (t, e, n) {
    n(9), t.exports = n(13)
  }, function (e, n) {
    e.exports = t
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }
    var i = n(1),
      r = a(i),
      o = {
        start: new Date(0),
        end: new Date,
        contextStart: null,
        contextEnd: null,
        minScale: 0,
        maxScale: 1 / 0,
        width: null,
        padding: {
          top: 30,
          left: 70,
          bottom: 5,
          right: 40
        },
        lineHeight: 40,
        labelWidth: 140,
        sliderWidth: 30,
        contextHeight: 50,
        locale: null,
        axisFormat: null,
        tickFormat: [
          ["%H:%M:%S", function (t) {
            // [".%L", function (t) {
            // return t.getSeconds()
            // return t.getMilliseconds()
            return t.getMinutes()
          }],
          [":%S", function (t) {
            return t.getSeconds()
          }],
          ["%H:%M:%S", function (t) {
            return t.getMinutes()
          }],
          ["%H %p", function (t) {
            return t.getDate()
          }],
          ["%b %d", function (t) {
            return t.getMonth() && t.getDate()
          }],
          ["%b", function (t) {
            return t.getMonth()
          }],
          ["%Y", function () {
            return !0
          }]
        ],
        eventHover: function (t, e) {
          var text = d3.selectAll("text");

          text.append("title")
            .text(function (t) {

              if (t.eid || !t.events) {
                return t.action;
                // break;
              } else {
                if (t.events) {
                  for (let a = 0; a < t.events.length; a++) {
                    return t.events[0].action;
                  }
                }
              }

            });

        },
        eventZoom: null,
        eventClick: null,
        eventLineColor: function (t, e) {


          let returnValue;
          let event_color_mapping = {
            "DNS": "#007bff",
            "FILE": "#dc3545",
            "PROCESS": "#ffc107",
            "SOCKET": "#28a745",
            "HTTP": "#6c757d",
            "REGISTRY": "#0000FF",
            "SSL": "#20c997",
            "DNS RESPONSE": "#fd7e14",
            "PEFILE": "#6f42c1",
            "IMAGE LOAD": "#7F007F"
          }
          if(event_color_mapping.hasOwnProperty(t.name)){
            return event_color_mapping[t.name]
          }else {
              return "#cc0000";
            }
        },
        eventColor: null,
        eventShape: function (t) {
          if (t.eid || !t.events) {
            if (t.eid && (t.eid === alerted_event.eid)) {
              return ""
            } else {
              return ""
            }
          } else {
            if (t.events) {
              for (let x = 0; x < t.events.length; x++) {
                if (t.events[x].eid === alerted_event.eid) {
                  return ""
                }
                else { return "" }
              }
            }
          }

        },
        eventOpacity: function (t) {
          var e = "";
          var range_opacity = {
            "1": 0.4,
            "2": 0.5,
            "3": 0.55,
            "4": 0.6,
            "5": 0.65,
            "6": 0.7,
            "7": 0.75,
            "8": 0.8,
            "9": 0.85,
            "10": 0.87,

          }
          if (t.hasOwnProperty("events")) { e = t.events.length } else { e = 1 }
          if (e >= 11 && e <= 15) {
            return 0.92;
          } else if (e >= 16) {
            return 1;
          } else {
            return range_opacity[e.toString()];
          }
        },
        eventPopover: function (t) {
          var e = "";
          if (t.hasOwnProperty("events")) e = t.events.length;
          else {
            for (var n in t.details) e = e + n.charAt(0).toUpperCase() + n.slice(1) + ": " + t.details[n] + "<br>";
            e = e + "Date: " + t.date
          }
          return e
        },
        marker: !0,
        context: !0,
        slider: !0,
        eventGrouping: 6e4
      };
    o.dateFormat = o.locale ? o.locale.timeFormat("%a %x %I:%M %p") : d3.time.format.utc("%a %x %I:%M %p"), t.exports = o
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(10),
      r = a(i);
    e["default"] = function (t, e, n, a) {
      a.width = a.width + 269;
      return function (i) {
        var o = function (e, i) {
          // $(window).trigger('resize');
          var o = t.selectAll(".timeline-pf-x-axis." + e).data([{}]);
          o.enter().append("g").classed("timeline-pf-x-axis", !0).classed(e, !0).call(r["default"](i, n)).attr("transform", "translate(0," + ("focus" === e ? a.height : a.height + a.ctxHeight + 40) + ")"), o.call(r["default"](i, n, a.width)), o.exit().remove()
        };
        o("focus", e.x), n.context && o("context", e.ctx)
      }
    }
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }

    function i(t, e, n) {
      var a = {};
      for (var i in t)
        for (var r in t[i].data) {
          var o = Math.floor(t[i].data[r].date / e) * e;
          a[o] = a[o] + 1 || 1
        }
      for (var l in a) {
        var s = new Date;
        s.setTime(+l), n.push({
          date: s,
          count: a[l]
        })
      }
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = n(1),
      o = a(r);
    e["default"] = function (t, e, n, a, r) {
      var l = t.append("g").classed("timeline-pf-context", !0).attr("width", n.width).attr("height", n.ctxHeight).attr("clip-path", "url(#timeline-pf-context-brush-clipper)").attr("transform", "translate(" + (a.padding.left + a.labelWidth) + "," + (a.padding.top + n.height + 40) + ")"),
        s = [],
        d = 36e5,
        u = Math.ceil(d / (e.ctx.domain()[1] - e.ctx.domain()[0]) * n.width);
      i(r, d, s), s.sort(function (t, e) {
        return t.date < e.date ? -1 : t.date > e.date ? 1 : 0
      }), e.cty.domain([0, o["default"].max(s, function (t) {
        return t.count
      })]), l.selectAll(".timeline-pf-bar").data(s).enter().append("rect").attr("class", "timeline-pf-bar").attr("x", function (t) {
        return e.ctx(t.date)
      }).attr("y", function (t) {
        return e.cty(t.count)
      }).attr("width", u).attr("height", function (t) {
        return n.ctxHeight - e.cty(t.count)
      }), l.append("g").attr("class", "timeline-pf-brush")
    }
  }, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e["default"] = function (t, e, n) {
      function checkIfElementHasAlertedEntry(element, entry) {
        if (entry.eid != undefined && entry.eid == alerted_event.eid) {

          element.setAttribute("id", "blink-alert");
          return true;
        } else {
          for (let i = 0; i < other_alerts.length; i++) {
            if (entry.eid == other_alerts[i].eid) {
              element.setAttribute("id", "blink-other-alert");
              return true;
            }
          }
        }

        return false;
      }
      function populateData(a, t, alerted_entry_index, alerted_entry_index_j) {

        a.attr("transform", function (t) {
          return "translate(" + e.x(t.date) + ")"
        });


        var i = a.enter().append("text")


        if (alerted_entry_index >= 0) {



          for (let j = 0; j < i[0].length; j++) {
            var element = i[0][j];
            if (element) {



              if (element.__data__.hasOwnProperty("events")) {
                for (let k = 0; k < element.__data__.events.length; k++) {
                  var alert_exists = checkIfElementHasAlertedEntry(element, element.__data__.events[k]);
                  if (alert_exists) { break; }

                }

              } else {
                checkIfElementHasAlertedEntry(element, element.__data__);
              }
            }
          }
        }
        i.classed("timeline-pf-drop", !0)
          .classed("timeline-pf-drop-22", function (t) {
            if (t.events) { //2,3
              if ((t.events.length > 1)) {
                return t.hasOwnProperty("events") ? !0 : !1;
              }
            }
          });


        i.attr("transform", function (t) {

          return "translate(" + e.x(t.date) + ")"
        }).attr("fill", n.eventColor)
          .attr('fill-opacity', n.eventOpacity)
          .attr("text-anchor", "middle").attr("data-toggle", "modal").attr("data-target", "#modal_Datatable").attr("data-html", "true").attr("data-content", n.eventPopover).attr("dominant-baseline", "central").text(n.eventShape);
        n.eventClick && i.on("click", n.eventClick), n.eventHover && i.on("mouseover", n.eventHover), a.exit().on("click", null).on("mouseover", null), a.exit().remove()


      }

      return function (a) {
        var i = t.selectAll(".timeline-pf-drop-line").data(a);
        i.enter().append("g").classed("timeline-pf-drop-line", !0).attr("transform", function (t, a) {
          return "translate(0, " + (e.y(a) + n.lineHeight / 2) + ")"
        }).attr("fill", n.eventLineColor), i.each(function (t) {
          var alerted_entry_data;
          var alerted_entry_index = 0;
          var alerted_entry_index_j = 0;


          for (var i = 0; i < t.data.length; i++) {
            var data = t.data[i];
            if (data.hasOwnProperty('events')) {
              for (var j = 0; j < data.events.length; j++) {
                var entry = data.events[j]
                if (entry.eid == alerted_event.eid) {
                  alerted_entry_index = i;
                  alerted_entry_index_j = j;
                  alerted_entry_data = JSON.parse(JSON.stringify(data));
                  break;
                }
              }
            } else {
              if (data.eid == alerted_event.eid) {
                alerted_entry_index_j = i;
                alerted_entry_data = data;
                break;
              }
            }
          }
          var a = d3.select(this).selectAll(".timeline-pf-drop").data(t.data);



          if (alerted_entry_index >= 0) {

            populateData(a, t, alerted_entry_index, alerted_entry_index_j);
          } else {
            populateData(a, t, undefined, undefined);

          }

        }), i.exit().remove()
      }
    }
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(1),
      r = (a(i), n(3)),
      o = a(r),
      l = n(5),
      s = a(l),
      d = n(7),
      u = a(d),
      c = n(8),
      f = a(c);
    e["default"] = function (t, e, n, a) { //492 default, need  940, 728
      var i = t.append("defs");
      i.append("clipPath").attr("id", "timeline-pf-drops-container-clipper").append("rect").attr("id", "timeline-pf-drops-container-rect").attr("x", 0).attr("y", 0).attr("width", e.width).attr("height", e.height), a.context && i.append("clipPath").attr("id", "timeline-pf-context-brush-clipper").append("polygon").attr("points", "0,0 " + e.width + ",0 " + (e.width + a.sliderWidth) + "," + e.ctxHeight / 2 + " " + e.width + "," + e.ctxHeight + " 0," + e.ctxHeight + " " + -a.sliderWidth + "," + e.ctxHeight / 2);
      var r = i.append("pattern").attr("class", "timeline-pf-grid-stripes").attr("id", "timeline-pf-grid-stripes").attr("width", e.width).attr("height", 2 * a.lineHeight).attr("patternUnits", "userSpaceOnUse");
      r.append("rect").attr("width", e.width).attr("height", a.lineHeight), r.append("line").attr("x1", 0).attr("x2", e.width).attr("y1", a.lineHeight).attr("y2", a.lineHeight), r.append("line").attr("x1", 0).attr("x2", e.width).attr("y1", "1px").attr("y2", "1px");
      var l = t.append("g").classed("timeline-pf-grid", !0).attr("fill", "url(#timeline-pf-grid-stripes)").attr("transform", "translate(" + (a.padding.left + a.labelWidth) + ", " + a.padding.top + ")"),
        d = t.append("g").classed("timeline-pf-labels", !0).attr("transform", "translate(" + a.padding.left + ", " + a.padding.top + ")"),
        c = t.append("g").classed("timeline-pf-axes", !0).attr("transform", "translate(" + (a.padding.left + a.labelWidth) + ",  " + a.padding.top + ")"),
        p = t.append("g").classed("timeline-pf-drops-container", !0).attr("clip-path", "url(#timeline-pf-drops-container-clipper)").attr("transform", "translate(" + (a.padding.left + a.labelWidth) + ",  " + a.padding.top + ")");
      if (a.marker) {
        var h = t.append("g").classed("timeline-pf-timestamp", !0).attr("height", 30).attr("transform", "translate(" + (a.padding.left + a.labelWidth) + ", " + a.padding.top + ")");
        f["default"](l, h, n, e, a.dateFormat)
      }
      var m = o["default"](c, n, a, e),
        g = u["default"](d, n, a),
        v = s["default"](p, n, a);
      return function (t) {
        v(t), g(t), m(t)
      }
    }
  }, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e["default"] = function (t, e, n) {
      return function (a) {
        var i = t.selectAll(".timeline-pf-label").data(a),
          r = function (t) {
            for (var e = 0, n = 0; n < t.length; n++) t[n].hasOwnProperty("events") ? e += t[n].events.length : e++;
            return e
          },
          o = function (t) {
            var e = r(t.data);
            return void 0 === t.name || "" === t.name ? e + " Events" : t.name + (e >= 0 ? " (" + e + ")" : "")
          };
        i.text(o), i.enter().append("text").classed("timeline-pf-label", !0).attr("transform", function (t, a) {
          return "translate(" + (n.labelWidth - 20) + " " + (e.y(a) + n.lineHeight / 2) + ")"
        }).attr("dominant-baseline", "central").attr("text-anchor", "end").text(o), i.exit().remove()
      }
    }
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(1),
      r = a(i);
    e["default"] = function (t, e, n, a, i) {
      function o() {

        var e = r["default"].mouse(t[0][0])[0];
        l.attr("transform", "translate(" + e + ")"), d.attr("transform", "translate(" + (e - 75) + ", -25)"), u.attr("transform", "translate(" + e + ", -9)").text(i(n.x.invert(e)))
      }
      t.append("rect").attr("width", a.width).attr("height", a.height).on("mouseover", function () {
        l.style("display", null), u.style("display", null), d.style("display", null)
      }).on("mouseout", function () {
        l.style("display", "none"), u.style("display", "none"), d.style("display", "none")
      }).on("mousemove", o);
      var l = t.append("line").classed("timeline-pf-marker", !0).attr("y1", 0).attr("y2", a.height),
        s = n.x.domain(),
        d = e.append("rect").attr("height", "24").attr("width", "150").style("display", "none"),
        u = e.append("text").text(i(s[1])).attr("transform", "translate(" + n.x.range()[1] + ")").attr("text-anchor", "middle")
    }
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      var data= t && t.__esModule ? t : {
        "default": t
      }
      return data;
    }

    function i() {
      function t(t) {
        t.each(function (e) {
          var l = e;
          e = o(e, n.eventGrouping), n.lineHeight = e.length <= 3 ? 80 : 40, n.contextStart = n.contextStart || d["default"].min(r(e)), n.contextEnd = n.contextEnd || n.end, d["default"].select(this).select(".timeline-pf-chart").remove(), d["default"].select(this).selectAll(".timeline-pf-zoom").remove();
          var u = 40,
            c = n.width || t.node().clientWidth,
            f = e.length * n.lineHeight,
            p = {
              width: c - n.padding.right - n.padding.left - n.labelWidth - (n.slider ? n.sliderWidth : 0) + 115,
              height: f,
              ctxHeight: n.contextHeight,
              outer_height: f + n.padding.top + n.padding.bottom + (n.context ? n.contextHeight + u : 0)
            },
            h = {
              x: s(p.width, [n.start, n.end]),
              y: i(e),
              ctx: s(p.width, [n.contextStart, n.contextEnd]),
              cty: d["default"].scale.linear().range([p.ctxHeight, 0])
            },
            g = d["default"].select(this).append("svg").classed("timeline-pf-chart", !0).attr({
              width: c + 70,
              height: p.outer_height
            }),
            x = m["default"](g, p, h, n).bind(t);
          x(e), n.context && v["default"](g, h, p, n, l), a.updateZoom(d["default"].select(this), p, h, n, e, x)
        })
      }
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        n = l({}, p["default"], e),
        a = new b["default"],
        i = function (t) {
          return d["default"].scale.ordinal().domain(t.map(function (t) {
            return t.name
          })).range(t.map(function (t, e) {
            return e * n.lineHeight
          }))
        },
        s = function (t, e) {
          return d["default"].time.scale().range([0, t]).domain(e)
        };
      return c["default"](t, n), t.Zoom = a, t
    }

    function r(t) {
      for (var e = [], n = 0; n < t.length; n++)
        for (var a = 0; a < t[n].data.length; a++) e.push(t[n].data[a].date);
      return e
    }

    function o(t, e) {
      for (var n = void 0, a = {}, i = [], r = 0; r < t.length; r++) {
        i[r] = {}, i[r].name = t[r].name, i[r].data = [];
        for (var o = 0; o < t[r].data.length; o++) n = Math.round(t[r].data[o].date / e) * e, void 0 === a[n] && (a[n] = []), a[n].push(t[r].data[o]);
        for (var l in a)
          if (1 === a[l].length) i[r].data.push(a[l][0]);
          else {
            var s = new Date;
            s.setTime(+l), i[r].data.push({
              date: s,
              events: a[l]
            })
          } a = {}
      }
      return i
    }
    var l = Object.assign || function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a])
        }
        return t
      },
      s = n(1),
      d = a(s),
      u = n(12),
      c = a(u),
      f = n(2),
      p = a(f),
      h = n(6),
      m = a(h),
      g = n(4),
      v = a(g),
      x = n(11),
      b = a(x);
    if (d.hasOwnProperty("default"))
      d["default"].chart = d["default"].chart || {}, d["default"].chart.timeline = i, t.exports = i
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e["default"] = function (t, e, n) {
      var a = e.tickFormat.map(function (t) {
          return t.slice(0)
        }),
        i = e.locale ? e.locale.timeFormat.multi(a) : r["default"].time.format.utc.multi(a),
        o = Math.round(n / 70),
        l = r["default"].svg.axis().scale(t).orient("bottom").ticks(o).tickFormat(i);
      return "function" == typeof e.axisFormat && e.axisFormat(l), l
    };
    var i = n(1),
      r = a(i)
  }, function (t, e, n) {
    "use strict";

    function a(t) {
      return t && t.__esModule ? t : {
        "default": t
      }
    }

    function i(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var a = e[n];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, a.key, a)
          }
        }
        return function (e, n, a) {
          return n && t(e.prototype, n), a && t(e, a), e
        }
      }(),
      o = n(1),
      l = a(o),
      s = function () {
        function t() {
          i(this, t)
        }
        return r(t, [{
          key: "updateZoom",
          value: function (t, e, n, a, i, r) {
            var o = this;
            if (this.ONE_MINUTE = 6e4, this.ONE_HOUR = 60 * this.ONE_MINUTE, this.ONE_DAY = 24 * this.ONE_HOUR, this.ONE_WEEK = 7 * this.ONE_DAY, this.ONE_MONTH = 30 * this.ONE_DAY, this.grid = l["default"].select(".timeline-pf-grid"), this.dimensions = e, this.scales = n, this.configuration = a, this.data = i, this.callback = r, this.sliderScale = l["default"].scale.log().domain([a.minScale, a.maxScale]).range([a.minScale, a.maxScale]).base(2), this.zoom = l["default"].behavior.zoom().size([e.width, e.height]).scaleExtent([a.minScale, a.maxScale]).x(n.x), this.brush = null, a.slider) {
              var s = t.append("button").attr("type", "button").attr("class", "btn btn-default timeline-pf-zoom timeline-pf-zoom-in").attr("id", "timeline-pf-zoom-in").style("top", a.padding.top + "px").on("click", function () {
                o.zoomClick()
              });
              s.style("left", a.padding.left + a.labelWidth + e.width + (a.sliderWidth - s.node().offsetWidth) + "px").append("i").attr("class", "fa fa-search-plus").attr("id", "timeline-pf-zoom-in-icon");
              var d = t.append("button").attr("type", "button").attr("class", "btn btn-default timeline-pf-zoom").attr("id", "timeline-pf-zoom-out").style("top", a.padding.top + e.height - 26 + "px").on("click", function () {
                o.zoomClick()
              });
              d.style("left", a.padding.left + a.labelWidth + e.width + (a.sliderWidth - d.node().offsetWidth) + "px").append("i").attr("class", "fa fa-search-minus").attr("id", "timeline-pf-zoom-out-icon");
              var u = t.append("input").attr("type", "range").attr("class", "timeline-pf-zoom timeline-pf-slider").attr("id", "timeline-pf-slider").style("width", e.height - 2 * s.node().offsetHeight + "px").attr("value", this.sliderScale(this.zoom.scale())).attr("min", a.minScale).attr("max", a.maxScale).attr("step", .1).on("input", function () {
                o.zoomClick()
              }).on("change", function () {
                o.zoomClick()
              });
              u.style("top", a.padding.top + (e.height - 2 * s.node().offsetHeight) / 2 + s.node().offsetHeight - u.node().offsetHeight / 2 + "px").style("left", a.padding.left + a.labelWidth + e.width + a.sliderWidth - (s.node().offsetWidth - u.node().offsetHeight) / 2 - u.node().offsetWidth / 2 + "px")
            }
            return a.context && (this.brush = l["default"].svg.brush().x(n.ctx).extent(n.x.domain()).on("brush", function () {
              o.brushed()
            }), t.select(".timeline-pf-brush").call(this.brush).selectAll("rect").attr("height", e.ctxHeight)), a.eventZoom && this.zoom.on("zoomend", a.eventZoom), this.zoom.on("zoom", function () {
              requestAnimationFrame(function () {
                return r(i)
              }), a.slider && t.select("#timeline-pf-slider").property("value", o.sliderScale(o.zoom.scale())), a.context && (o.brush.extent(o.scales.x.domain()), t.select(".timeline-pf-brush").call(o.brush))
            }), this.grid.call(this.zoom).on("dblclick.zoom", null)
          }
        }, {
          key: "brushed",
          value: function () {
            if (this.brush.empty() !== !0) {
              var t = this.brush.extent();
              this.zoomFilter(t[0], t[1], 0)
            }
          }
        }, {
          key: "zoomClick",
          value: function () {
            var t = .5,
              e = 1,
              n = 0,
              a = this.dimensions.width / 2,
              i = this.zoom.scaleExtent(),
              r = void 0,
              o = void 0,
              s = {
                x: this.zoom.translate()[0],
                k: this.zoom.scale()
              };
            switch (l["default"].event.target.id) {
              case "timeline-pf-zoom-in-icon":
              case "timeline-pf-zoom-in":
                e = this.zoom.scale() * (1 + t), n = 100;
                break;
              case "timeline-pf-zoom-out-icon":
              case "timeline-pf-zoom-out":
                e = this.zoom.scale() * (1 + -1 * t), n = 100;
                break;
              case "timeline-pf-slider":
                e = this.sliderScale.invert(l["default"].event.target.value);
                break;
              default:
                e = this.zoom.scale()
            }
            e < i[0] ? e = i[0] : e > i[1] && (e = i[1]), r = (a - s.x) / s.k, s.k = e, o = r * s.k + s.x, s.x += a - o, this.interpolateZoom([s.x, 0], s.k, n)
          }
        }, {
          key: "interpolateZoom",
          value: function (t, e, n) {
            var a = this;
            return l["default"].transition().duration(n).tween("zoom", function () {
              if (a.zoom) {
                var n = l["default"].interpolate(a.zoom.translate(), t),
                  i = l["default"].interpolate(a.zoom.scale(), e);
                return function (t) {
                  a.zoom.scale(i(t)).translate(n(t)), a.zoom.event(a.grid)
                }
              }
            })
          }
        }, {
          key: "getRange",
          value: function (t) {
            return t[1].getTime() - t[0].getTime()
          }
        }, {
          key: "getScale",
          value: function (t, e) {
            return t / e
          }
        }, {
          key: "zoomFilter",
          value: function (t, e) {
            var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 100,
              a = e - t,
              i = this.dimensions.width,
              r = this.zoom.scaleExtent(),
              o = this.zoom.translate()[0],
              l = this.zoom.scale(),
              s = this.zoom.scale(),
              d = this.getRange(this.scales.x.domain()),
              u = void 0;
            s *= this.getScale(this.getRange(this.scales.x.domain()), a), s < r[0] ? s = r[0] : s > r[1] && (s = r[1]), u = (this.scales.x.domain()[0] - t) * (i / d), o += u, o *= s / l, this.interpolateZoom([o, 0], s, n)
          }
        }]), t
      }();
    e["default"] = s
  }, function (t, e, n) {
    "use strict";

    function a(t, e) {
      function n(n) {
        return function (a) {
          return arguments.length ? (e[n] = a, t) : e[n]
        }
      }
      for (var a in e) t[a] = n(a)
    }
    t.exports = a
  }, function (t, e) { }])
});
//# sourceMappingURL=timeline.js.map





const ONE_MILLISEC = 1,

  ONE_SEC = 1 * 1000,
  ONE_MINUTE = 60 * 1000,

  ONE_HOUR = 60 * 60 * 1000,
  ONE_DAY = 24 * ONE_HOUR,
  ONE_WEEK = 7 * ONE_DAY,
  ONE_MONTH = 30 * ONE_DAY,

  SIX_MONTHS = 6 * ONE_MONTH;
var timeline_data = [];
var element;
var timeline;
var alerted_event;
var alasql
export default function create_timeline(jsonFilteredArray, arg,alasql_) {
  alerted_event = arg;
  alasql=alasql_;

  var jsonObjectOfActions = {
    "FILE_": "target_path",
    "PROC_": "path",
    "HTTP_": "remote_address",
    "SOCKET_": "remote_address",
    "IMAGE_": "image_path",
    "TLS_": "issuer_name",
    "DNS_":"domain_name"
  }

  var jsonOfActionMapping = {
    "target_path": "Target Path",
    "path": "Path",
    "remote_address": "Remote Address",
    "image_path": "Image Path"
  }

  var name='';
  for (var jsonObject in jsonObjectOfActions) {
    if (alerted_event.action!=undefined && alerted_event.action.includes(jsonObject)) {
      name = jsonObjectOfActions[jsonObject];
    }
  }
  // for (let jsonMapping in jsonOfActionMapping) {
  //   if (name === jsonMapping) {
  //     alerted_event.actionKey = jsonOfActionMapping[jsonMapping];
  //     alerted_event.actionValue = alerted_event[name];
  //     break;
  //   }
  // }
  // document.getElementById("actionKey").innerHTML = alerted_event.actionKey + ':';
  // document.getElementById("actionValue").innerHTML = alerted_event.actionValue;



  var start = new Date((alerted_event.time - 30) * 1000),
    today = new Date((alerted_event.time * 1000 + 30000));
  var PageNumber = 1;
  var timeline_event_table = $('#pf-timeline-data').DataTable({
    "pagingType": "full_numbers",
    "order":[],
    drawCallback: function (action) {
      if(action.aLastSort.length  != 0 && eventsdata.events != undefined) {
        var dir = action.aLastSort[0].dir
        if(dir == 'asc'){eventsdata.events.sort(function(a, b){return a.eid.localeCompare(b.eid);});}
        else{eventsdata.events.sort(function(a, b){return a.eid.localeCompare(b.eid)}).reverse();}
      }
      redraw_event_timeline_table(timeline_event_table, eventsdata,1);
      $('.paginate_button').on('click', (e) =>  {
          var info = timeline_event_table.page.info();
          if(e.currentTarget.className == 'paginate_button page-item ' || e.currentTarget.className == 'paginate_button page-item active'){
            PageNumber = e.currentTarget.innerText;
            redraw_event_timeline_table(timeline_event_table, eventsdata,PageNumber);
          }
          else if(e.currentTarget.className == 'paginate_button page-item next'){
            PageNumber ++ ;
            redraw_event_timeline_table(timeline_event_table, eventsdata,PageNumber);
          }
          else if(e.currentTarget.className == 'paginate_button page-item previous'){
            PageNumber -- ;
            redraw_event_timeline_table(timeline_event_table, eventsdata,PageNumber);
          }
          else if(e.currentTarget.className == 'paginate_button page-item first'){
            PageNumber =  1//First record
            redraw_event_timeline_table(timeline_event_table, eventsdata,PageNumber);
          }
          else if(e.currentTarget.className == 'paginate_button page-item last'){
            PageNumber =  info.pages;//last record
            redraw_event_timeline_table(timeline_event_table, eventsdata,PageNumber);
          }
        });
      }

  });

  timeline = d3.chart.timeline()
    .end(today)
    .start(start)
    .minScale(1)
    .maxScale(60).eventGrouping(1000).labelWidth(80)
    .eventClick(function (el) {
      Initialize_Event_Pagination(timeline_event_table, el);
      redraw_event_timeline_table(timeline_event_table, el,1);
    });

  element = d3.select('#pf-timeline').append('div');

  for (var x in jsonFilteredArray) { //json lives in external file for testing
    timeline_data[x] = {};
    timeline_data[x].name = jsonFilteredArray[x].name;
    timeline_data[x].jsonObjectOfEvents = jsonFilteredArray[x].jsonObjectOfEvents;
    timeline_data[x].data = [];
    for (var y in jsonFilteredArray[x].data) {
      timeline_data[x].data.push({});
      for (var key in jsonFilteredArray[x].data[y]) {
        timeline_data[x].data[y][key] = jsonFilteredArray[x].data[y][key];
      }
      timeline_data[x].data[y].date = new Date(jsonFilteredArray[x].data[y].date);  //set the date
    }

    $('#timeline-selectpicker').append('<option>' + timeline_data[x].name + '</option>');
    if (timeline_data[x].jsonObjectOfEvents.show_by_default) {
      timeline_data[x].display = true;
    }
  }

  var default_selected_events = [];
  for (let x = 0; x < jsonFilteredArray.length; x++) {
    if (jsonFilteredArray[x].jsonObjectOfEvents.show_by_default) {
      default_selected_events.push(jsonFilteredArray[x].jsonObjectOfEvents.display_name);
    }
  }



  $('#timeline-selectpicker').selectpicker('val', default_selected_events)

  //On first load
  $('.btn > .filter-option > .filter-option-inner> .filter-option-inner-inner').contents().filter((_, el) => el.nodeType === 3).remove();
  $('.btn > .filter-option > .filter-option-inner> .filter-option-inner-inner').append($('#timeline-selectpicker').find('option:selected')[0].innerHTML,' + ',$("#timeline-selectpicker :selected").length-1)

  $('#timeline-selectpicker').on('changed.bs.select', function (event, clickedIndex, newValue, oldValue) {
    var count = $("#timeline-selectpicker :selected").length;

    //On Change
    if(count>1){
      var selectedOptions = $('#timeline-selectpicker').find('option:selected');
      var selectedOptionFirst = selectedOptions[0].innerHTML
      $('.btn > .filter-option > .filter-option-inner> .filter-option-inner-inner').contents().filter((_, el) => el.nodeType === 3).remove();
      $('.btn > .filter-option > .filter-option-inner> .filter-option-inner-inner').append($('#timeline-selectpicker').find('option:selected')[0].innerHTML,' + ',count-1)
    }

   if(clickedIndex != null){
    timeline_data[clickedIndex].display = !timeline_data[clickedIndex].display;
    redraw_timeline();
   }

  });




  var excelFormatData = [];
  var excelFormatSheetsName = [];
  var file_name;

  setTimeout(() => {
    file_name = 'SELECT * INTO XLSX("alert_' + alerted_event.eid + '.xlsx",?) FROM ?'
    for (let i = 0; i < jsonFilteredArray.length; i++) {
      if (jsonFilteredArray[i].data != undefined) {
        excelFormatData.push(jsonFilteredArray[i].data);
        excelFormatSheetsName.push({sheetid: jsonFilteredArray[i].name, header: true});
      }
    }
  }, 3000);

  window.saveFile = function saveFile() {
    alasql(file_name, [excelFormatSheetsName, excelFormatData]);
  }


  document.getElementById('pf-timeline-data_wrapper').childNodes[1].style.height = "338px";
  document.getElementById('pf-timeline-data_wrapper').childNodes[1].style.overflow = 'auto';
  document.getElementById('pf-timeline-data_wrapper').childNodes[1].style.marginTop = "32px";







  var typingTimer;                //timer identifier
  var doneTypingInterval = 1000;  //time in ms, 5 second for example
  var $input = $('#global-search');

  //on keyup, start the countdown
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping(), doneTypingInterval);
  });

  //on keydown, clear the countdown
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  redraw_timeline();

  $('#collapseOne').on('shown.bs.collapse', function () {
    redraw_timeline();
    // do something…
  })


}

$('#timeline_collapse').on('shown.bs.collapse', function () {
  redraw_timeline();
  // do something…
})

window.redraw_timeline =function redraw_timeline(){
  timeline(element.datum(timeline_data.filter(function (eventGroup) {
    return eventGroup.display === true;
  })));

}




function doneTyping() {
  let filtered_events = [];
  let filtered = [];
  let typing_value = document.getElementById('global-search').value.toUpperCase();

  if (typing_value!=''){
  for (let i = 0; i < timeline_data.length; i++) {
    filtered = timeline_data[i].data.filter(item => {
      for (let obj in item) {
        if (obj !== 'date') {
          if (item[obj].includes(typing_value)) {
            return item;
          }
        }
      }
    });
    filtered_events.push({"name": timeline_data[i].name, "data": filtered,"display":timeline_data[i].display});

  }
  }else {
    filtered_events = timeline_data;
  }
  timeline(element.datum(filtered_events.filter(function (eventGroup) {
    return eventGroup.display === true;
  })));
}


setInterval(() => {
  //adding checkbox to dropdown
  let span_els = document.getElementsByClassName("dropdown-item");
  if (span_els.length > 0) {
    for (let i = 0; i < span_els.length; i++) {
      var dropdown_list = document.getElementsByClassName("dropdown-item")[i];
      if(dropdown_list.lastElementChild){
      if (!(document.getElementsByClassName("dropdown-item")[i].lastElementChild.classList[0] === 'checkbox_add')) {
        let spanElement = document.createElement('span');
        spanElement.classList.add("checkbox_add");
        span_els[i].appendChild(spanElement);
      }
    }
    }
  }
}, 0);

function Initialize_Event_Pagination(timeline_event_table, el) {
  var length = 10;
  timeline_event_table.clear();

  if (el.hasOwnProperty("events")) {
    // length = el.events.length;
    for (let index = 0; index < el.events.length; index++) {
      timeline_event_table.row.add(el.events);
    }
  } else {
    timeline_event_table.row.add([1]);

  }
  timeline_event_table.page.len(length);

  timeline_event_table.draw();
}


var eventsdata = '';
function redraw_event_timeline_table(timeline_event_table, el,pagenumber) {
  var eventsData = document.getElementById('eventsData');
  eventsdata = el;
  var page_number = pagenumber;
  var page_size = 10;
  while (eventsData.firstChild) eventsData.removeChild(eventsData.firstChild);
  if (el.hasOwnProperty('events')) {
  var EventList = el.events.slice((page_number - 1) * page_size,page_number * page_size);
    for (let i = 0; i < EventList.length; i++) {

      var eid=EventList[i].eid;
      if(eid==undefined){
        eid='View';
      }
      var TableRow = '';
      var eid = '';
      if(!EventList[i].eid){
        if(EventList[i].eventid){
          eid = EventList[i].eventid;
        }
        else{
          eid=i+1
        }
      }else{
        eid = EventList[i].eid;
      }
      TableRow += '<tr><td>' +
        '<div class="card" style="margin-bottom: 0.2rem;">' + '<div class="card-header" id="label' + eid + '">' +
        '<h5 class="mb-0" style="">' + '<button class="btn dropdown-toggle" data-toggle="collapse" data-target="#' + eid + '" aria-expanded="true" aria-controls="' + eid + '">'
        + eid
        + '</button>'
        + '</h5>'
        + '</div>'
        + '<div id="' + eid + '" class="collapse" aria-labelledby="label' + eid + '" data-parent="#accordion2">'
        + '<div class="card-body ">'
        + '<div id ="' + eid + 'column_data_for_muliple">'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
      TableRow += '</td></tr>';

      $('#eventsData').append(TableRow);

      var tbl = document.createElement("table");
      tbl.setAttribute("class", "table table-striped- table-bordered table-hover table-checkable");
      tbl.setAttribute("style", "margin-bottom: 0rem;");
      for (let child in EventList[i]) {
        if (child === 'date') {

        } else if (child === 'domain_name' || child === 'md5') {
          var data = EventList[i][child];
          var domain_md5_link
          if (child === 'domain_name') {
            domain_md5_link = "https://www.virustotal.com/#/domain/" + data.substring(1, data.length);
          } else {
            domain_md5_link = "https://www.virustotal.com/#/file/" + data + "/detection";

          }
          var row = document.createElement("tr");
          var cell1 = document.createElement("td");
          var cell2 = document.createElement("td");
          var firstCellText = document.createTextNode(child);
          var secondCellText = document.createTextNode(EventList[i][child]);
          var atag = document.createElement("a");
          atag.target = "_blank";
          atag.style.color = "blue";
          atag.href = domain_md5_link;
          cell1.appendChild(firstCellText);
          cell1.style.fontSize = "11px";
          cell1.style.fontWeight = 600;
          cell1.style.wordBreak = "break-all";
          cell1.style.minWidth = "75px"
          atag.appendChild(secondCellText);
          cell2.appendChild(atag);
          cell2.style.fontWeight = 500;
          cell2.style.fontSize = "10px";
          cell2.style.wordBreak = "break-all";
          row.appendChild(cell1);
          row.appendChild(cell2);
          tbl.appendChild(row);
        } else {
          var row = document.createElement("tr");
          var cell1 = document.createElement("td");
          var cell2 = document.createElement("td");
          var firstCellText = document.createTextNode(child);
          var secondCellText = document.createTextNode(EventList[i][child]);
          cell1.appendChild(firstCellText);
          cell1.style.fontSize = "11px";
          cell1.style.fontWeight = 600;
          cell1.style.wordBreak = "break-all";
          cell1.style.minWidth = "75px"
          cell2.appendChild(secondCellText);
          cell2.style.fontWeight = 500;
          cell2.style.fontSize = "10px";
          cell2.style.wordBreak = "break-all";
          row.appendChild(cell1);
          row.appendChild(cell2);
          tbl.appendChild(row);
        }
      }

      var column_data_for_muliple = document.getElementById(eid + 'column_data_for_muliple');
      if (column_data_for_muliple) {
        column_data_for_muliple.appendChild(tbl);
      }
    }
  } else {


    var TableRow = '';
    var eid=el.eid;
    if(eid==undefined){
      eid='View';
    }
    TableRow += '<tr><td>' +
      '<div class="card" style="margin-bottom: 0.2rem;">' + '<div class="card-header" id="label' + eid + '">' +
      '<h5 class="mb-0">' + '<button class="btn dropdown-toggle" data-toggle="collapse" data-target="#' + eid + '" aria-expanded="true" aria-controls="' + eid + '">'
      + eid
      + '</button>'
      + '</h5>'
      + '</div>'
      + '<div id="' + eid + '" class="collapse" aria-labelledby="label' + eid + '" data-parent="#accordion2">'
      + '<div class="card-body ">'
      + '<div id ="' + eid + 'column_data_for_muliple">'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
    TableRow += '</td></tr>';

    $('#eventsData').append(TableRow);
    var tbl = document.createElement("table");
    tbl.setAttribute("class", "table table-striped- table-bordered table-hover table-checkable");
    tbl.setAttribute("style", "margin-bottom: 0rem;");

    for (let child in el) {
      if (child === 'date') {

      } else if (child === 'domain_name' || child === 'md5') {
        var data = el[child];
        var domain_md5_link
        if (child === 'domain_name') {
          domain_md5_link = "https://www.virustotal.com/#/domain/" + data.substring(1, data.length);
        } else {
          domain_md5_link = "https://www.virustotal.com/#/file/" + data + "/detection";

        }
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var firstCellText = document.createTextNode(child);
        var secondCellText = document.createTextNode(el[child]);
        var atag = document.createElement("a");
        atag.target = "_blank";
        atag.style.color = "blue";
        atag.href = domain_md5_link;
        cell1.appendChild(firstCellText);
        cell1.style.fontSize = "11px";
        cell1.style.fontWeight = 600;
        cell1.style.wordBreak = "break-all";
        cell1.style.minWidth = "75px"
        atag.appendChild(secondCellText);
        cell2.appendChild(atag);
        cell2.style.fontWeight = 500;
        cell2.style.fontSize = "10px";
        cell2.style.wordBreak = "break-all";
        row.appendChild(cell1);
        row.appendChild(cell2);
        tbl.appendChild(row);
      } else {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var firstCellText = document.createTextNode(child);
        var secondCellText = document.createTextNode(el[child]);
        cell1.appendChild(firstCellText);
        cell1.style.fontSize = "11px";
        cell1.style.fontWeight = 600;
        cell1.style.wordBreak = "break-all";
        cell1.style.minWidth = "75px"
        cell2.appendChild(secondCellText);
        cell2.style.fontWeight = 500;
        cell2.style.fontSize = "10px";
        cell2.style.wordBreak = "break-all";
        row.appendChild(cell1);
        row.appendChild(cell2);
        tbl.appendChild(row);
      }
    }

    var column_data_for_muliple = document.getElementById(eid + 'column_data_for_muliple');
    if (column_data_for_muliple) {
      column_data_for_muliple.appendChild(tbl);
    }
  }
  for (let i = 0; i < other_alerts.length; i++) {
    if (document.getElementById("label" + other_alerts[i].eid)) {
      document.getElementById("label" + other_alerts[i].eid).style.background = "#f9bebd";
    }
  }

  if (document.getElementById("label" + alerted_event.eid)) {
    document.getElementById("label" + alerted_event.eid).style.background = "#f86c6b";
  }

}
