.DEFAULT_GOAL := dist

PLUGIN_ID := pseudocode-support

NPM := npm
ARCHIVE_FILE := publish/org.yangby.joplin.plugins.${PLUGIN_ID}.jpl

.PHONY: clean
clean:
	rm -rf dist publish

.PHONY: mostlyclean
mostlyclean: clean
	rm -rf node_modules

.PHONY: dist
dist: ${ARCHIVE_FILE}

${ARCHIVE_FILE}:
	${NPM} install
