import { Config } from './config';
import { Logger } from './logger';

export default function(context) {
    let codeMirrorOptions = {};
    codeMirrorOptions[Config.optionName] = true;
    return {
        plugin: plugin(context),
        codeMirrorOptions: codeMirrorOptions,
    };
}

function plugin(context) {
    return function(CodeMirror) {
        define_option(CodeMirror, context);
        define_mode(CodeMirror, context);
        define_refresh_extension(CodeMirror, context);
    };
}

function define_option(CodeMirror, context) {
    CodeMirror.defineOption(
        Config.optionName,
        false,
        async function(cm, val, old) {
            const logger = new Logger();
            logger.trace('Refresh since the options were changed.');
            await refresh(cm, context, logger);
        }
    );
}

function define_mode(CodeMirror, context) {
    CodeMirror.defineMode(Config.tokenInfo, function (config, modeConfig) {
        const logger = new Logger();
        const inMathMode = modeConfig['inMathMode'];
        logger.trace(`Define mode for "${Config.tokenInfo}" with { "inMathMode": ${inMathMode} }.`);
        return CodeMirror.getMode(config, { name: 'stex', inMathMode: inMathMode });
    });
}

function define_refresh_extension(CodeMirror, context) {
    CodeMirror.defineExtension(Config.refreshEditorCommand, async function () {
        const logger = new Logger();
        logger.trace('Refresh since the command was called.');
        await refresh(this, context, logger);
    });
}

async function refresh(cm, context, logger) {
    const options = await context.postMessage({ name: Config.messageName });
    logger.trace(`Options are ${JSON.stringify(options)}.`);
    const inMathMode = options['inMathMode'];
    logger.trace(`Change "inMathMode" to "${inMathMode}".`);
    cm.setOption('mode', { name: Config.tokenInfo, inMathMode: inMathMode });
    cm.refresh();
}
