import joplin from 'api';
import { SettingItem, SettingItemType, SettingItemSubType } from 'api/types';

import { Config } from './config';
import { Logger } from './logger';

export namespace Settings {
    export const register = _register;
    export const fetch = _fetch;
}

async function _register() {
    const logger = new Logger();

    logger.info(`Settings register section "${Config.sectionName}".`);
    await joplin.settings.registerSection(Config.sectionName, {
        label: Config.sectionName,
        iconName: 'fas fa-code',
        description: 'Typesets pseudocode beautifully in Joplin.',
    });

    let settings: Record<string, SettingItem> = {};

    // For Editor Option
    settings['inMathMode'] = {
        public: true,
        type: SettingItemType.Bool,
        label: 'In Math Mode',
        description: 'Whether to start parsing in math mode. (default: false)',
        value: false,
        section: Config.sectionName,
    };

    // For Viewer Option
    settings['indentSize'] = {
        public: false,
        type: SettingItemType.String,
        label: 'Indent Size',
        description: 'The indent size of inside a control block. The unit \
            is "em". (default: 1.2)',
        value: '1.2',
        section: Config.sectionName,
    };
    settings['commentDelimiter'] = {
        public: false,
        type: SettingItemType.String,
        label: 'Comment Delimiter',
        description: 'The delimiters used to start and end a comment \
            region. Note that only line comments are supported. \
            (default: "//")',
        value: '//',
        section: Config.sectionName,
    };
    settings['lineNumber'] = {
        public: false,
        type: SettingItemType.Bool,
        label: 'Show Line Numbers',
        description: 'Whether line numbering is enabled. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    settings['lineNumberPunc'] = {
        public: false,
        type: SettingItemType.String,
        label: 'Line Number Punctuation',
        description: 'The punctuation that follows line number. (default: ":")',
        value: ':',
        section: Config.sectionName,
    };
    settings['noEnd'] = {
        public: false,
        type: SettingItemType.Bool,
        label: 'No End',
        description: 'Whether block ending are shown. (default: false)',
        value: false,
        section: Config.sectionName,
    };
    // captionCount Int:
    //      Reset the caption counter to this number.
    //      (default: undefined)

    logger.info('Settings register all settings.');
    await joplin.settings.registerSettings(settings);
}

async function _fetch() {
    const logger = new Logger();
    logger.debug('Settings are being fetched.');
    let settings = {};
    const settingNames = [
        'inMathMode',
        'indentSize',
        'commentDelimiter',
        'lineNumber',
        'lineNumberPunc',
        'noEnd',
    ];
    for (const name of settingNames) {
        settings[name] = await joplin.settings.value(name);
    }
    return settings;
}
