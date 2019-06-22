/*
    TCGenius Skill - A Pokémon Trading Card companion for Alexa
    Copyright (C) 2019  Ed George

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const fetch = require('node-fetch');
const apl = require('../apl/apl');
const util = require('../other/utils');

// Maximum limit of cards to return to the user
const MAX_CARD_COUNT = 5;

module.exports = {
    canHandle(handlerInput) {
        // Check for CardRequestIntent or user interaction within Home Screen
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CardRequestIntent'
            || handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    },
    async handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;

        // Sanitise input and apply to sessionAttributes.cardType
        if (request.type === 'Alexa.Presentation.APL.UserEvent') {
            sessionAttributes.cardType = request.arguments[0].toLowerCase();
        } else {
            sessionAttributes.cardType = handlerInput.requestEnvelope.request.intent.slots.card_type.value;
        }

        var speechText = '';
        var cards;
        var results = [];

        try {

            // Get cards JSON from API
            const response = await fetch(`https://api.pokemontcg.io/v1/cards?supertype=${sessionAttributes.cardType}`);
            const jsonResponse = await response.json();
            cards = jsonResponse.cards;
            
            const size = cards.length;
            
            // Check if cards were returned
            if (size > 0) {
                // Calculate the max index to show, depending on how many cards returned
                const maxIndex = Math.min(size, MAX_CARD_COUNT);
                var isRandom = false;

                // If we will show MAX_CARD_COUNT, pick them at random from the results 
                if (maxIndex === MAX_CARD_COUNT) {
                    speechText += `Here are ${maxIndex} random ${sessionAttributes.cardType} cards. `;
                    isRandom = true;
                } else {
                    // There were not enough cards to randomise, so just show all that returned
                    speechText += `Here are the top ${maxIndex} ${sessionAttributes.cardType} cards. `;
                }

                // Populate card array with results
                for (var index = 0; index < maxIndex; index++) {
                    // Generate card randomly or from it's index
                    const card = cards[isRandom ? Math.floor(Math.random() * size) : index];
                    results[index] = card;
                    console.log(card);
                    // Speech helpers for multiple cards 
                    if (maxIndex > 1 && index === maxIndex - 1) speechText += " and ";
                    speechText += `${util.sanitise(card.name)} from the ${util.sanitise(card.set)} set`;
                    if (maxIndex > 1 && index < maxIndex - 2) speechText += ", ";
                }

            } else {
                // No cards were returned from response
                speechText += 'I found no results. Sorry about that';
            }

        } catch (e) {
            // An error occurred
            console.log(`Error: ${e}`);
            speechText += 'I found no results. Sorry about that';
        }

        // Create re-prompt text
        const reprompt = 'Can I find another type of card for you?';
        speechText += `. ${reprompt}`;

        // Show results screen with data
        apl.resultsScreen(handlerInput, sessionAttributes.cardType, results);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(reprompt)
            .getResponse();
    }
};