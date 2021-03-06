module.exports = (function() {
    'use strict';

    const prompts = require('../phil/prompts');

    function _ensureDailyPromptsAreEnabled(arePromptsEnabled) {
        if (arePromptsEnabled !== true) {
            return Promise.reject('Daily prompts are temporarily disabled! Feel free to ping an admin and ask why and when they\'ll be back online.');
        }
    }

    function _ensureThereIsPromptForToday(prompt) {
        if (prompt === null) {
            return Promise.reject('There\'s no prompt for today. That probably means that I\'m out of them! Why don\'t you suggest more by sending me `' + process.env.COMMAND_PREFIX + 'suggest` and including your prompt?');
        }

        return prompt;
    }
    
    return {
        publicRequiresAdmin: false,
        privateRequiresAdmin: false,
        aliases: [],
        helpDescription: 'Asks Phil to remind you what the prompt of the day is.',

        processPublicMessage: function(bot, user, userId, channelId, commandArgs, db) {
            return prompts.getAreDailyPromptsEnabled(db)
                .then(_ensureDailyPromptsAreEnabled)
                .then(() => prompts.getTodaysPrompt(db))
                .then(_ensureThereIsPromptForToday)
                .then(prompt => prompts.sendPromptToChannel(bot, channelId, prompt));
        }
    };
})();