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

module.exports = {

    /**
     * Datasource for the Home Screen
     */
    getHome: function (handlerInput) {
        return {};
    },

    /**
     * Datasource for the Results Screen
     */
    getResults: function (handlerInput, type, cards) {
        return {
            "cardData": {
                "type": `${type}`,
                "cards": cards
            }
        };
    }
};