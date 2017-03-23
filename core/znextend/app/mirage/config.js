import mockAuthentication from './config/authentication';
import mockConfiguration from './config/configuration';

// import {versionMismatchResponse} from 'utils';

export default function () {
    // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
    this.namespace = '/ghost/api/v0.1';    // make this `api`, for example, if your API is namespaced
    this.timing = 400;      // delay for each request, automatically set to 0 during testing

    // Mock endpoints here to override real API requests during development, eg...
    // this.put('/posts/:id/', versionMismatchResponse);
    // mockTags(this);
    // this.loadFixtures('settings');

    // keep this line, it allows all other API requests to hit the real server
    this.passthrough();

    // add any external domains to make sure those get passed through too
    this.passthrough('https://count.ghost.org/');
    this.passthrough('http://www.gravatar.com/**');
}

// Mock all endpoints here as there is no real API during testing
export function testConfig() {
    // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
    this.namespace = '/ghost/api/v0.1';    // make this `api`, for example, if your API is namespaced
    // this.timing = 400;      // delay for each request, automatically set to 0 during testing
    // this.logging = true;

    mockAuthentication(this);
    mockConfiguration(this);

    /* Notifications -------------------------------------------------------- */

    this.get('/notifications/', 'notifications');

    /* Apps - Slack Test Notification --------------------------------------------------------- */

    this.post('/slack/test', function () {
        return {};
    });

    /* External sites ------------------------------------------------------- */

    let downloadCount = 0;
    this.get('https://count.ghost.org/', function () {
        downloadCount++;
        return {
            count: downloadCount
        };
    });

    this.get('http://www.gravatar.com/avatar/:md5', function () {
        return '';
    }, 200);
}
