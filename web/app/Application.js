/*
 * Copyright 2015 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.Application', {
    extend: 'Ext.app.Application',
    name: 'Traccar',

    requires: [
        'Traccar.Style',
        'Traccar.AttributeFormatter'
    ],

    models: [
        'Server',
        'User',
        'Group',
        'Device',
        'Position',
        'Attribute',
        'Command',
        'Event',
        'Geofence',
        'Notification',
        'AttributeAlias',
        'ReportSummary',
        'ReportTrip',
        'Calendar'
    ],

    stores: [
        'Groups',
        'Devices',
        'AllGroups',
        'AllDevices',
        'Positions',
        'LatestPositions',
        'Users',
        'Attributes',
        'MapTypes',
        'DistanceUnits',
        'SpeedUnits',
        'CoordinateFormats',
        'CommandTypes',
        'TimeUnits',
        'Languages',
        'Events',
        'Geofences',
        'AllGeofences',
        'Notifications',
        'AllNotifications',
        'GeofenceTypes',
        'AttributeAliases',
        'ReportRoute',
        'ReportEvents',
        'ReportTrips',
        'ReportSummary',
        'ReportTypes',
        'ReportEventTypes',
        'ReportChartTypes',
        'Statistics',
        'DeviceImages',
        'Calendars',
        'AllCalendars',
        'AllTimezones'
    ],

    controllers: [
        'Root'
    ],

    isMobile: function () {
        return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    },

    getEventString: function (eventType) {
        var key = 'event' + eventType.charAt(0).toUpperCase() + eventType.slice(1);
        return Strings[key] || key;
    },

    showReports: function (show) {
        var rootPanel = Ext.getCmp('rootPanel');
        if (rootPanel) {
            rootPanel.setActiveItem(show ? 1 : 0);
        }
    },

    setUser: function (data) {
        var reader = Ext.create('Ext.data.reader.Json', {
            model: 'Traccar.model.User'
        });
        this.user = reader.readRecords(data).getRecords()[0];
    },

    getUser: function () {
        return this.user;
    },

    setServer: function (data) {
        var reader = Ext.create('Ext.data.reader.Json', {
            model: 'Traccar.model.Server'
        });
        this.server = reader.readRecords(data).getRecords()[0];
    },

    getServer: function () {
        return this.server;
    },

    getPreference: function (key, defaultValue) {
        if (this.getServer().get('forceSettings')) {
            return this.getServer().get(key) || this.getUser().get(key) || defaultValue;
        } else {
            return this.getUser().get(key) || this.getServer().get(key) || defaultValue;
        }
    },

    getAttributePreference: function (key, defaultValue) {
        if (this.getServer().get('forceSettings')) {
            return this.getServer().get('attributes')[key] || this.getUser().get('attributes')[key] || defaultValue;
        } else {
            return this.getUser().get('attributes')[key] || this.getServer().get('attributes')[key] || defaultValue;
        }
    },

    getReportColor: function (deviceId) {
        var index, reportColor, device = Ext.getStore('Devices').getById(deviceId);
        if (device) {
            reportColor = device.get('attributes')['web.reportColor'];
        }
        if (reportColor) {
            return reportColor;
        } else {
            index = 0;
            if (deviceId !== undefined) {
                index = deviceId % Traccar.Style.mapRouteColor.length;
            }
            return Traccar.Style.mapRouteColor[index];
        }
    },

    showError: function (response) {
        if (Ext.isString(response)) {
            Ext.Msg.alert(Strings.errorTitle, response);
        } else if (response.responseText) {
            Ext.Msg.alert(Strings.errorTitle, response.responseText);
        } else if (response.statusText) {
            Ext.Msg.alert(Strings.errorTitle, response.statusText);
        } else {
            Ext.Msg.alert(Strings.errorTitle, Strings.errorConnection);
        }
    }
});
