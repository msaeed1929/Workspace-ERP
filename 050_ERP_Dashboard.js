/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 50_ERP_Dashboard.gs
 * Version     : 1.0.0
 * Description : ERP Dashboard
 * =============================================================================
 */

'use strict';

class ERPDashboard extends BaseService {

  constructor() {

    super("ERPDashboard");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._widgets = {};
    this._cards = {};
    this._metrics = {};

    return this;

  }

  //=========================================================================
  // Widgets
  //=========================================================================

  registerWidget(name, widget) {

    this._widgets[name] = widget;

    return widget;

  }

  widget(name) {

    return this._widgets[name] || null;

  }

  widgets() {

    return Object.keys(this._widgets);

  }

  widgetCount() {

    return this.widgets().length;

  }

  removeWidget(name) {

    if (!this._widgets[name])
      return false;

    delete this._widgets[name];

    return true;

  }

  //=========================================================================
  // Cards
  //=========================================================================

  registerCard(name, value) {

    this._cards[name] = value;

    return value;

  }

  card(name) {

    return this._cards[name] || null;

  }

  cards() {

    return Object.keys(this._cards);

  }

  cardCount() {

    return this.cards().length;

  }

  removeCard(name) {

    if (!this._cards[name])
      return false;

    delete this._cards[name];

    return true;

  }

  //=========================================================================
  // Metrics
  //=========================================================================

  setMetric(name, value) {

    this._metrics[name] = value;

    return value;

  }

  metric(name) {

    return this._metrics[name] || null;

  }

  metrics() {

    return this._metrics;

  }

  metricCount() {

    return Object.keys(this._metrics).length;

  }

  removeMetric(name) {

    if (!(name in this._metrics))
      return false;

    delete this._metrics[name];

    return true;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clearWidgets() {

    this._widgets = {};

    return true;

  }

  clearCards() {

    this._cards = {};

    return true;

  }

  clearMetrics() {

    this._metrics = {};

    return true;

  }

  clearAll() {

    this.clearWidgets();
    this.clearCards();
    this.clearMetrics();

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      widgets : this.widgetCount(),
      cards : this.cardCount(),
      metrics : this.metricCount()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      widgets : this.widgetCount(),
      cards : this.cardCount(),
      metrics : this.metricCount()

    };

  }

  report() {

    return {

      widgets : this.widgets(),
      cards : this.cards(),
      metrics : this.metrics(),
      statistics : this.statistics(),
      health : this.health()

    };

  }

  info() {

    return {

      service : this.getName(),
      version : this.getVersion(),
      initialized : this.isInitialized(),
      created : this.getCreatedTime(),
      statistics : this.statistics()

    };

  }

}
