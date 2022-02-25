/**
 * A singleton instance of a popup to display informational text (and optionally, an icon) to the user.
 * @asset(icon/32/status/dialog-information.png)
 */
qx.Class.define("qxl.packagebrowser.Popup", {
  type: "singleton",
  extend: qx.ui.popup.Popup,
  statics: {
    icon: {
      waiting: "qxl/packagebrowser/icon/ajax-loader.gif",
      info: "icon/32/status/dialog-information.png",
    },
  },

  construct() {
    super(new qx.ui.layout.Canvas());
    this.set({
      decorator: "window",
      minWidth: 100,
      minHeight: 30,
      padding: 10,
      backgroundColor: "#f0f0f0",
      autoHide: false,
    });

    this.__atom = new qx.ui.basic.Atom();
    this.__atom.getChildControl("label").set({
      rich: true,
      wrap: true,
    });

    this.add(this.__atom);
    this.addListenerOnce("appear", this.center, this);
  },
  members: {
    __atom: null,

    /**
     * Center the widget
     * @return {qxl.packagebrowser.Popup}
     */
    center() {
      if (!this.isVisible()) {
        this.addListenerOnce("appear", this.center, this);
        return this;
      }
      let bounds = this.getBounds();
      if (!bounds) {
        return this;
      }
      this.set({
        marginTop: Math.round(
          (qx.bom.Document.getHeight() - bounds.height) / 2
        ),

        marginLeft: Math.round((qx.bom.Document.getWidth() - bounds.width) / 2),
      });

      return this;
    },

    /**
     * Displays the given text. Can optionally be placed next to a widget
     * @param text {String|false} The text to display. If false, hide the widget
     * @param widgetToPlaceTo {qx.ui.core.Widget|undefined} If given, place the
     * info panel next to this widget
     * @return {qxl.packagebrowser.Popup}
     * @ignore(widgetToPlaceTo)
     */
    display(text, widgetToPlaceTo = false) {
      if (!text) {
        this.hide();
      }
      this.__atom.setLabel(text);
      this.show();
      if (widgetToPlaceTo) {
        this.set({
          marginTop: 0,
          marginLeft: 0,
        });

        if (widgetToPlaceTo.isVisible()) {
          this.placeToWidget(widgetToPlaceTo, true);
        } else {
          widgetToPlaceTo.addListenerOnce("appear", () => {
            this.placeToWidget(widgetToPlaceTo, true);
          });
        }
      } else {
        qx.event.Timer.once(this.center, this, 100);
      }
      return this;
    },

    /**
     * Return the content of the text label
     * @return {String}
     */
    getDisplayedText() {
      return this.__atom.getLabel();
    },

    /**
     * When displaying the info, show the icon associated with the given alias
     * @param alias
     * @return {qxl.packagebrowser.Popup}
     */
    useIcon(alias) {
      let iconpath = this.self(arguments).icon[alias];
      if (!iconpath) {
        throw new Error(`Icon alias "${alias}" is invalid.`);
      }
      this.__atom.setIcon(iconpath);
      return this;
    },

    /**
     * Show the info pane. Overridden to return instance & allow chaining method calls.
     * @return {qxl.packagebrowser.Popup}
     */
    show() {
      super.show();
      return this;
    },
  },

  /**
   * Destructor
   */
  destruct() {
    this._disposeObjects("__atom");
  },
});
