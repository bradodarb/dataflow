/*
*   NOTE: this has nothing to do with server-side Node.js (so far at least)
*/

( function(Node) {
 
  // Dependencies
  var Input = Dataflow.module("input");
  var Output = Dataflow.module("output");

  Node.Model = Backbone.Model.extend({
    defaults: {
      label: "",
      x: 200,
      y: 100
    },
    initialize: function() {
      this.graph = this.get("graph");
      // Add i/o collections
      this.inputs = new Input.Collection(this.inputs);
      this.inputs.node = this;
      this.inputs.each(function(input){
        input.node = this;
      }, this);
      this.outputs = new Output.Collection(this.outputs);
      this.outputs.node = this;
      this.outputs.each(function(output){
        output.node = this;
      }, this);
    },
    remove: function(){
      // Node removed from graph's nodes collection
      var relatedEdges = [];
      this.graph.edges.each(function(edge){
        // Find connected edges
        if (edge.isConnectedToNode(this)){
          relatedEdges.push(edge);
        }
      }, this);
      for (var i=0; i<relatedEdges.length; i++) {
        // Remove connected edges
        var edge = relatedEdges[i];
        edge.collection.remove(edge);
      }
      this.unload();
    },
    unload: function(){
      // Stop any processes that need to be stopped
    },
    toString: function(){
      return this.id;
    },
    toJSON: function(){
      return {
        id: this.get("id"),
        label: this.get("label"),
        x: this.get("x"),
        y: this.get("y")
      };
    },
    inputs:[
      {
        id: "input"
      }
    ],
    outputs:[
      {
        id:"output"
      }
    ]
  });

  Node.Collection = Backbone.Collection.extend({
    model: Node.Model,
    comparator: function(node) {
      // Sort nodes by x position
      return node.get("x");
    }
  });

}(Dataflow.module("node")) );
