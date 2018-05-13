$(function(){
  var ekiURL; // TODO
  var ekiKEY; // TODO
  var rosenKEY; // TODO

  var ekiURL = "http://" + ekiURL + "/v1/json/station?key=" + ekiKEY;

  var stationCode = $('#station-code');
  var stationName = $('#station-name');
  var stationYomi = $('#station-yomi');
  var stationType = $('#station-type');

  var stationNameList = $('#station-name-list');
  var stationTypeList = $('#station-type-list');

  var stationInputs = [stationCode, stationName, stationYomi, stationType];
  stationInputs.able = function () {
    this.forEach(function(input){
      input.able();
    });
    return this;
  };
  stationInputs.disable = function () {
    this.forEach(function(input){
      input.disable();
    });
    return this;
  };
  stationInputs.clearLoading = function () {
    this.forEach(function(input){
      input.clearLoading();
    });
    return this;
  };

  var stationMessage = $('#station-message');
  stationMessage.info = function (msg) {
    this.show().removeClass('alert-danger').addClass('alert-info').text(msg);
    return this;
  };
  stationMessage.error = function (msg) {
    this.show().removeClass('alert-info').addClass('alert-danger').text(msg);
    return this;
  };

  ///////////////////////////
  //////// handlers  ////////
  ///////////////////////////
  stationCode.change(function() {
    if (!stationCode.val()) {
      stationCode.clearLoading();
      return false;
    }

    stationMessage.hide();
    stationInputs.disable().clearLoading();
    stationCode.loading();

    var url = ekiURL + '&code=' + stationCode.val();
    $.getJSON(url, function(res) {
      showStation(res.ResultSet.Point);
      stationCode.stopLoading();
    }).fail(function(error){
      stationCode.error();
      stationMessage.error(error.responseJSON.ResultSet.Error.Message);
    }).always(function(){
      stationInputs.able();
    });
  });

  stationName.change(function(){
    searchStationByName();
  });

  stationNameList.on('click', 'a', function(e){
    stationName.val(e.target.text);
    searchStationByName();
  })

  var searchStationByName = function () {
    if (!stationName.val()) {
      stationName.clearLoading();
      return false;
    }
    stationMessage.hide();
    stationInputs.disable().clearLoading();
    stationName.loading();

    var url = ekiURL + '&name=' + encodeURIComponent(stationName.val());
    $.getJSON(url, function(res) {
      showStation(res.ResultSet.Point);
      stationName.stopLoading();
    }).fail(function(error){
      stationName.error();
      stationMessage.text(error.responseJSON.ResultSet.Error.Message);
    }).always(function(){
      stationInputs.able();
    });
  };

  stationYomi.change(function() {
    if (!stationYomi.val()) {
      stationYomi.clearLoading();
      return false;
    }
    stationMessage.hide();
    stationInputs.disable().clearLoading();
    stationYomi.loading();

    var url = ekiURL + '&name=' + encodeURIComponent(stationYomi.val());
    $.getJSON(url, function(res) {
      showStation(res.ResultSet.Point);
      stationYomi.stopLoading();
    }).fail(function(error){
      stationYomi.error();
      stationMessage.text(error.responseJSON.ResultSet.Error.Message);
    }).always(function(){
      stationInputs.able();
    });
  });

  stationType.change(function(){
    searchStationByNameAndType();
  });

  stationTypeList.on('click', 'a', function(e){
    stationType.val(e.target.text);
    searchStationByNameAndType();
  });

  var searchStationByNameAndType = function () {
    if (!(stationName.val() && stationType.val())) {
      stationType.clearLoading();
      return false;
    }
    stationMessage.hide();
    stationInputs.disable().clearLoading();
    stationName.loading();
    stationType.loading();

    var url = ekiURL + '&name=' + encodeURIComponent(stationName.val()) + '&type=' + stationType.val();
    $.getJSON(url, function(res) {
      showStation(res.ResultSet.Point);
      stationName.stopLoading();
      stationType.stopLoading();
    }).fail(function(error){
      stationName.error();
      stationType.error();
      stationMessage.error(error.responseJSON.ResultSet.Error.Message);
    }).always(function(){
      stationInputs.able();
    });
  };

  /////////////////////////////////////
  //////// handlers use method ////////
  /////////////////////////////////////
  var showStation = function (point) {
    if (!point) {
      stationMessage.error('Non Station');
      return false;
    }
    if (point instanceof Array) {
      var station = point[0].Station;
      stationNameList.empty();
      point.forEach(function(point){
        stationNameList.append(
          $('<li>').append(
            $('<a>').text(point.Station.Name)
          )
        );
      });
    } else {
      var station = point.Station;
    }

    rosen.setStationMarker(station.code);
    rosen.setCenterByStationCode(station.code);

    if(station.Type.text && station.Type.detail) {
      station.Type = station.Type.text + '.' + station.Type.detail;
    }
    stationCode.val(station.code);
    stationName.val(station.Name);
    stationYomi.val(station.Yomi);
    stationType.val(station.Type);
  };


  //////////////////////////////////////
  //////// Extend jQuery Object ////////
  //////////////////////////////////////
  $.fn.extend({
    loading: function () {
      var self = this;
      var i = 0;
      var red, green, blue;
      self.loadingAnimation = setInterval(function () {
        if      ((256 * 0) <= i && i < (256 * 1)) { red = 255;         green = 0;           blue = i - 256 * 0; }
        else if ((256 * 1) <= i && i < (256 * 2)) { red = 256 * 2 - i; green = 0;           blue = 255;         }
        else if ((256 * 2) <= i && i < (256 * 3)) { red = 0;           green = i - 256 * 2; blue = 255;         }
        else if ((256 * 3) <= i && i < (256 * 4)) { red = 0;           green = 255;         blue = 256 * 4 - i; }
        else if ((256 * 4) <= i && i < (256 * 5)) { red = i - 256 * 4; green = 255;         blue = 0;           }
        else if ((256 * 5) <= i && i < (256 * 6)) { red = 255;         green = 256 * 6 - i; blue = 0;           }
        self.css('background', 'rgba(' + red + ',' + green  + ',' + blue + ',0.3)');
        i = (i + 1) % (256 * 6);
      });
      return this;
    },
    stopLoading: function () {
      clearInterval(this.loadingAnimation);
      return this;
    },
    clearLoading: function () {
      this.css('background', '#FFF');
      return this;
    },
    error: function () {
      clearInterval(this.loadingAnimation);
      this.css('background', '#F00');
      return this;
    },
    able: function () {
      this.prop('disabled', false);
      return this;
    },
    disable: function () {
      this.prop('disabled', true);
      return this;
    }
  });

  var rosen = new Rosen('station-map', {
    apiKey: rosenKEY,
    logoAttributionControl: false,
    zoomControl: false,
    zoom: 16,
    centerStation: 22671
  });

  rosen.on('selectStation', function(e){
    stationInputs.clearLoading();

    stationCode.val(e.stations[0].code);
    stationName.val(e.stations[0].name);
    stationYomi.val(e.stations[0].yomi);
    stationType.val(stationTypeName[e.stations[0].station_type]);
  });

  var stationTypeName = {
    1: 'train',
    2: 'plain',
    3: 'train plain',
    8: 'ship',
    9: 'train ship'
  };
});
