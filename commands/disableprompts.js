module.exports = (function() {
    'use strict';

    const botUtils = require('../bot_utils');
    const prompts = require('../phil/prompts');

    function _ensurePromptsAreEnabled(arePromptsEnabled) {
        if (arePromptsEnabled !== true) {
            return Promise.reject('Prompt are not currently enabled, so I cannot disable them (because they\'re already disabled).');
        }
    }

    function _sendPromptsDisabledMessage(bot, channelId) {
        botUtils.sendSuccessMessage({
            bot: bot,
            channelId: channelId,
            message: 'Prompts are now disabled until you use `' + process.env.COMMAND_PREFIX + 'enableprompts`.'
        });
    }

    return {
        publicRequiresAdmin: true,
        privateRequiresAdmin: true,
        aliases: [],
        helpDescription: 'Prevents Phil from posting any daily prompts until you instruct him that it\'s okay to do so by using `' + process.env.COMMAND_PREFIX + 'enableprompts`.',

        processPublicMessage: function(bot, user, userId, channelId, commandArgs, db) {
            return prompts.getAreDailyPromptsEnabled(db)
                .then(_ensurePromptsAreEnabled)
                .then(() => prompts.setPromptsEnabled(db, false))
                .then(() => _sendPromptsDisabledMessage(bot, channelId));
        }
    };
})();