'use strict';

/* beautify preserve:start */
import { state } from './state.js';
import { data } from './data.js';
import { router } from './router.js';
/* beautify preserve:end */

// API object
export const api = {
    proxy: 'https://cors-anywhere.herokuapp.com/',
    url: 'https://api.edamam.com/search?',
    entries: {
        app_id: 'c83b21f1',
        app_key: 'f1e2173ac672d053a64913c59ad6932b',
        from: '0',
        to: '20'
    },
    // Create url based on the entries object.
    createURL: function () {
        const URLOptions = Object.entries(this.entries)
            .map(entry => entry.join("="))
            .join("&");
        const url = `${this.url}q=${state.data.searchTerm}&${URLOptions}`;
        return url;
    },
    // Get new recipes from the api.
    get: async function (url = this.createURL()) {
        const response = await fetch(url);

        if (response.status >= 200 && response.status < 400) {
            const responseData = await data.parse(response);
            const extracedData = await data.extract(responseData);
            await data.store(extracedData);
            await data.save()
            await router.overviewPage();
        } else {
            throw new Error('Unable to get the recipes');
        }
    }
};