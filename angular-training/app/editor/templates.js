angular.module('templates-directives', ['editor/templates/editor-horizontal.html', 'editor/templates/editor-vertical.html']);

angular.module("editor/templates/editor-horizontal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editor/templates/editor-horizontal.html",
    "<div>\n" +
    "	<div class='preview' ng-show='showPreview'>\n" +
    "        <div compile=\"code\"></div>\n" +
    "    </div>\n" +
    "	<div ng-show='showTabs'>\n" +
    "		<tabset>\n" +
    "			<tab ng-repeat='file in files' active='file.isCurrent' heading='{{file.name}}' select='switchToFile(file)'/>\n" +
    "		</tabset>\n" +
    "	</div>\n" +
    "	<pre id='editor' ng-transclude ng-style=\"{'height': height+'px'}\"/></pre>\n" +
    "</div>");
}]);

angular.module("editor/templates/editor-vertical.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editor/templates/editor-vertical.html",
    "<div>\n" +
    "	<table>\n" +
    "		<tr>\n" +
    "			<td width='30%' ng-show='showPreview'>\n" +
    "				<div class=\"preview preview-vertical\" ng-style=\"{'height': height, 'margin-top': '2.4em' }\">\n" +
    "                    <div compile=\"code\"></div>\n" +
    "				</div>\n" +
    "			</td>\n" +
    "			<td width='2000'>\n" +
    "				<div ng-show='showTabs'>\n" +
    "					<tabset>\n" +
    "						<tab ng-repeat='file in files' active='file.isCurrent' heading='{{file.name}}' select='switchToFile(file)'/>\n" +
    "					</tabset>\n" +
    "				</div>\n" +
    "				<pre id='editor' ng-transclude ng-style=\"{'height': height+'px'}\"/>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "	</table>\n" +
    "</div>");
}]);
