//https://developers.arcgis.com/javascript/jshelp/intro_javascript_classes.html
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/request"
  ],function(
      declare, lang, esriRequest
){
      //all 3 dependencies have been loaded, ready to create class

      //null for superclass, {} as an object
      //anonymous class so that it's not tied to a specific module
      declare([], {
        distance: null,
        lastSearchResult: null,
        perPage: null,
        queryParams: null,
        seatGeekUrl: null,

        //new SeatGeekSearch()
        constructor: function(options){
          // specify class defaults
          this.distance = options.distance || "20mi"; // default seat geek range is 30mi
          this.perPage = options.perPage || 50; // default to 50 results per page
          this.seatGeekUrl = "http://api.seatgeek.com/2/events";

          // returnEvents is called by an external function, esri.request
          // hitch() is used to provide the proper context so that returnEvents
          // will have access to the instance of this class
          this.returnEvents = lang.hitch(this, this.returnEvents);

        },

        //searchByLoc returns a deferred
        //once deferred is resolved
        //pass the results to the callback function
        searchByLoc: function(geopoint){
          var eventsResponse;

          this.queryParams = {
            "lat": geopoint.y,
            "lon": geopoint.x,
            "page": 1,
            "per_page": this.perPage,
            "range": this.distance
          };

          eventsResponse = esriRequest({
            "url": this.seatGeekUrl,
            "callbackParamName": "callback",
            "content": this.queryParams
          });

          return eventsResponse.then(this.returnEvents, this.err);
        },

        getMore: function(){
          var eventsResponse;

          this.queryParams.page++;

          eventsResponse = esri.request({
            "url": this.seatGeekUrl,
            "callbackParamName": "callback",
            "content": this.queryParams
          });
          return eventsResponse.then(this.returnEvents, this.err);
        },

        returnEvents: function(response)
        {
          if(response.meta.total === 0){
            return null;  //zero events
          }

          this.lastSearchResult = response;
          return response;
        },

        err: function(err){
          console.log("SeatGeekSearch: error getting results " , err);
        }
      });
    }
);