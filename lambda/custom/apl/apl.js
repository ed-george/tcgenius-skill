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

const aplDatasources = require('./apl_datasource');

/**
 * Helper function to test for APL support
 */
function supportsAPL(requestEnvelope) {
    const supportedInterfaces = requestEnvelope.context.System.device.supportedInterfaces
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface !== null && aplInterface !== undefined;
};

/**
 * Add Home Screen APL directive to handlerInput.responseBuilder
 * if APL is available for the device
 */
function homeScreen(handlerInput) {
    if (supportsAPL(handlerInput.requestEnvelope)) {
        // Get Home screen document and datasource
        const document = require('./layout/index.json');
        const datasources = aplDatasources.getHomeData();
        console.log('Showing home APL');

        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: document,
            datasources: datasources
        });
    }
};

/**
 * Add Results Screen APL directive to handlerInput.responseBuilder
 * if APL is available for the device
 */
function resultsScreen(handlerInput, type, cards) {
    if (supportsAPL(handlerInput.requestEnvelope)) {
        // Get Home screen document and datasource
        const document = require('./layout/results.json');
        const datasources = aplDatasources.getResultsData(handlerInput, type, cards);
        console.log(`Showing results APL: ${JSON.stringify(datasources)}`);
        
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: document,
            datasources: datasources
        });
    }
};

module.exports = {
    homeScreen,
    resultsScreen
};