import { renderToString } from 'pseudocode';

import { Config } from './config';
import { Logger } from './logger';

export default function(context) {
    return {
        plugin: plugin(context),
        assets: assets,
    };
}

function plugin(context) {
    return function(markdownIt, _options) {
        const logger = new Logger();

        const pluginId = context.pluginId;

        const defaultRender = markdownIt.renderer.rules.fence ||
                function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options, env, self);
        };

        markdownIt.renderer.rules.fence = function(tokens, idx, opts, env, self) {
            const token = tokens[idx];
            if (token.info !== Config.tokenInfo) {
                return defaultRender(tokens, idx, opts, env, self);
            }
            logger.debug(`Find a pseudocode token "${token.info}".`);

            // TODO How to load pseudocode options from plugin settings?
            //
            // `context.postMessage` doesn't work since: it is not available to renderer content scripts
            // Ref: https://github.com/laurent22/joplin/blob/v2.8.8/packages/lib/services/plugins/utils/loadContentScripts.ts#L18-L20
            //
            // const optionsPromise = context.postMessage({ name: Config.messageName });
            // const options = (async () => await optionsPromise)();
            // const pseudocodeOptions = filter_pseudocode_options(options);
            const pseudocodeOptions = { captionCount: 0, lineNumber: true }
            let result;
            try {
                result = renderToString(token.content, pseudocodeOptions);
            } catch (error) {
                result = `<div class="inline-code">[${Config.pluginId}] ${error}</div>`;
            } finally {
                return result;
            }
        };
    };
}

function assets() {
    return [
        { name: 'pseudocode_viewer.css' }
    ];
}

function filter_pseudocode_options(options) {
    let filteredOptions = { captionCount: 0 };
    const optionNames = [
        'indentSize',
        'commentDelimiter',
        'lineNumber',
        'lineNumberPunc',
        'noEnd',
    ];
    for (const name of optionNames) {
        filteredOptions[name] = options[name];
    }
    return filteredOptions;
}
