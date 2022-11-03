import joplin from 'api';
import { ContentScriptType } from 'api/types';

import { Config } from './config';
import { Logger } from './logger';
import { Settings } from './settings';

joplin.plugins.register({ onStart: onStartFunc })

async function onStartFunc() {
    const logger = new Logger();

    logger.info('Started.');

    await Settings.register();

    await joplin.contentScripts.register(
        ContentScriptType.CodeMirrorPlugin,
        Config.contentScriptIdForEditor,
        './pseudocode_editor.js'
    );
    await joplin.contentScripts.register(
        ContentScriptType.MarkdownItPlugin,
        Config.contentScriptIdForViewer,
        './pseudocode_viewer.js'
    );

    await joplin.contentScripts.onMessage(
        Config.contentScriptIdForEditor,
        async (message) => {
            const id = Config.contentScriptIdForEditor;
            logger.info(`Content script "${id}" get message "${message.name}".`);
            if (message.name == Config.messageName) {
                return await Settings.fetch();
            }
            logger.warn(`Unknown message "${message.name}" for the content script "${id}".`);
        }
    );

    await joplin.commands.execute('editor.execCommand', { name: Config.refreshEditorCommand });
}
