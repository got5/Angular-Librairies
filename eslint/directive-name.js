module.exports = function(context) {

    "use strict";

    return {

        "CallExpression": function(node) {

            var prefix = "ng"; //Change this value with your own prefix
            var callee = node.callee;
            if (callee.type === "MemberExpression" &&
                callee.property.name === "directive") {
                var name = node.arguments[0].value;

               if(name !== undefined && !(name.indexOf(prefix) == 0)){
                    context.report(node, "The {{directive}} directive should be prefixed by {{prefix}}", {
                        directive: name,
                        prefix: prefix
                    });
                }

                if(node.callee.object.type === 'Identifier'){
                    if(node.callee.object.name !== prefix){
                        context.report(node, "The {{directive}} directive should be linked to the {{prefix}} module", {
                            directive: name,
                            prefix: prefix
                        });
                    }
                }
                else {
                    if(node.callee.object.object.name !== prefix){
                        context.report(node, "The {{directive}} directive should be linked to the {{prefix}} module", {
                            directive: name,
                            prefix: prefix
                        });
                    }

                }

            }
        }
    };

};
