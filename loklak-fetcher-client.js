/*******************************************************************************
 * loklak-fetcher-client
 * 	by Yago González (C) 2016 - Under MIT license
 * 	Bugs? Questions? Don't know what's the meaning of life?
 * 	Take a look at: github.com/YagoGG/loklak-fetcher-client
 *  Please, keep this header if you want to use this code. Thank you ;)
 ******************************************************************************/

window.loklakFetcher = (function() {
  var script = null;

  var loklakFetcher = {
    /**
     * Fetches tweets from the public loklak API, with the options provided
     * @param  {string}   query    Query string, see loklak.org/api.html
     * @param  {object}   options  Object with allowed GET-attributes, see
     *                             loklak.org/api.html
     * @param  {function} callback Function called after getting the results.
     *                             These are passed as first argument
     */
    getTweets: function(query, options, callback) {
      if(typeof options === 'function') { // A callback has been provided as 2nd
                                          // argument (no options)
        var callback = options;
        options = {};
      } else if(callback === undefined) { // No callback has been provided, even
                                          // as 2nd argument
        throw new Error('[LOKLAK-FETCHER] No callback provided');
      }

      var settings = [ 'count', 'source', 'fields', 'limit', 'tzOffset',
        'minified' ];  // Field names for all the possible parameters
      var defaults = [ 100, 'cache', '', '', 0, true ];  // Default values

      // Check if no options have been provided
      if(typeof options === 'undefined') {
        var options = {}; // Create 'options' to avoid ReferenceErrors later
      }

      // Write unset options as their default
      for(index in settings) {
        if(options[settings[index]] === undefined) {
          options[settings[index]] = defaults[index];
        }
      }

      // Create the URL with all the parameters
      var url = 'http://loklak.org/api/search.json' +
        '?callback=loklakFetcher.handleData' +
        '&q=' + query +
        '&count=' + options.count +
        '&source=' + options.source +
        '&fields=' + options.fields +
        '&limit=' + options.limit +
        '&timezoneOffset=' + options.tzOffset +
        '&minified=' + options.minified;

      // If the script element for JSONP already exists, remove it
      if(script !== null) {
        document.head.removeChild(script);
      }

      /**
       * Invokes the callback function, passing the data from the server as the
       * first and only argument.
       * @param  {object} data JSON coming from loklak's API
       */
      this.handleData = function(data) {
        callback(data);
      };

      // Create the script tag for JSONP
      script = document.createElement("script");
      script.src = url;
      document.head.appendChild(script);
    }
  };

  return loklakFetcher;
}());
