Clazz.declarePackage ("J.viewer.binding");
Clazz.load (["J.viewer.binding.JmolBinding"], "J.viewer.binding.DragBinding", null, function () {
c$ = Clazz.declareType (J.viewer.binding, "DragBinding", J.viewer.binding.JmolBinding);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.viewer.binding.DragBinding, ["drag"]);
});
Clazz.overrideMethod (c$, "setSelectBindings", 
function () {
this.bindAction (272, 16);
this.bindAction (273, 18);
this.bindAction (280, 20);
this.bindAction (281, 19);
this.bindAction (1040, 23);
this.bindAction (272, 22);
this.bindAction (272, 33);
});
});
